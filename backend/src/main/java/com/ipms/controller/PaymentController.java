package com.ipms.controller;

import com.ipms.config.VnPayConfig;
import com.ipms.dto.ApplicationFeeDTO;
import com.ipms.entity.Application;
import com.ipms.entity.ReviewHistory;
import com.ipms.entity.enums.AppStatus;
import com.ipms.repository.ApplicationRepository;
import com.ipms.repository.ReviewHistoryRepository;
import com.ipms.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.OffsetDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class PaymentController {

    private final ApplicationRepository applicationRepository; // Keep for createPayment, can be refactored later
    private final PaymentService paymentService;

    // =========================================================
    // NEW ENDPOINT TO GET FEES FOR AN APPLICATION
    // =========================================================
    @GetMapping("/fees/{applicationId}")
    public ResponseEntity<List<ApplicationFeeDTO>> getFeesForApplication(@PathVariable UUID applicationId) {
        List<ApplicationFeeDTO> fees = paymentService.getFeesForApplication(applicationId);
        return ResponseEntity.ok(fees);
    }


    // =========================================================
    // 1. TẠO LINK THANH TOÁN VNPAY (Sử dụng AppNo "Xịn")
    // =========================================================
    @GetMapping("/create-payment/{appNo}/{stage}")
    public ResponseEntity<?> createPayment(
            @PathVariable String appNo, // Nhận mã định dạng 1-2026-XXXXX
            @PathVariable int stage,
            @RequestParam Long amount
    ) {
        try {
            // 1. Kiểm tra sự tồn tại và trạng thái của đơn
            Application application = applicationRepository.findByAppNo(appNo)
                    .orElseThrow(() -> new RuntimeException("Mã đơn không hợp lệ hoặc không tồn tại!"));

            // 2. KIỂM TRA TRẠNG THÁI THEO GIAI ĐOẠN
            boolean isStatusValid = switch (stage) {
                case 1 -> application.getStatus() == AppStatus.CHO_NOP_PHI_GD1;
                case 2 -> application.getStatus() == AppStatus.CHO_NOP_PHI_GD2;
                case 3 -> application.getStatus() == AppStatus.CHO_NOP_PHI_GD3;
                default -> false;
            };

            if (!isStatusValid) {
                return ResponseEntity
                        .badRequest()
                        .body(Map.of("message", "Đơn không ở trạng thái hợp lệ để nộp phí giai đoạn " + stage + ". Trạng thái hiện tại: " + application.getStatus().name()));
            }

            String vnp_Version = "2.1.0";
            String vnp_Command = "pay";
            String vnp_OrderType = "250000";
            
            // Cấu trúc TxnRef: [AppNo]_[GiaiĐoạn]_[ThờiGian]
            String vnp_TxnRef = appNo + "_" + stage + "_" + System.currentTimeMillis();
            String vnp_OrderInfo = "Thanh toan le phi SHTT giai doan " + stage + " cho don: " + appNo;
            String vnp_IpAddr = "127.0.0.1";

            Map<String, String> vnp_Params = new HashMap<>();
            vnp_Params.put("vnp_Version", vnp_Version);
            vnp_Params.put("vnp_Command", vnp_Command);
            vnp_Params.put("vnp_TmnCode", VnPayConfig.vnp_TmnCode);
            vnp_Params.put("vnp_Amount", String.valueOf(amount * 100));
            vnp_Params.put("vnp_CurrCode", "VND");
            vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
            vnp_Params.put("vnp_OrderInfo", vnp_OrderInfo);
            vnp_Params.put("vnp_OrderType", vnp_OrderType);
            vnp_Params.put("vnp_Locale", "vn");
            vnp_Params.put("vnp_ReturnUrl", VnPayConfig.vnp_ReturnUrl);
            vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

            Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
            vnp_Params.put("vnp_CreateDate", new SimpleDateFormat("yyyyMMddHHmmss").format(cld.getTime()));

            List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
            Collections.sort(fieldNames);

            StringBuilder hashData = new StringBuilder();
            StringBuilder query = new StringBuilder();

            for (Iterator<String> it = fieldNames.iterator(); it.hasNext();) {
                String fieldName = it.next();
                String fieldValue = vnp_Params.get(fieldName);
                if (fieldValue != null && !fieldValue.isEmpty()) {
                    // ĐỒNG BỘ: Sử dụng UTF_8 để hash không bị sai lệch
                    hashData.append(fieldName).append('=').append(URLEncoder.encode(fieldValue, StandardCharsets.UTF_8));
                    query.append(URLEncoder.encode(fieldName, StandardCharsets.UTF_8)).append('=').append(URLEncoder.encode(fieldValue, StandardCharsets.UTF_8));
                    if (it.hasNext()) {
                        hashData.append('&');
                        query.append('&');
                    }
                }
            }

            String vnp_SecureHash = VnPayConfig.hmacSHA512(VnPayConfig.vnp_HashSecret, hashData.toString());
            String paymentUrl = VnPayConfig.vnp_PayUrl + "?" + query + "&vnp_SecureHash=" + vnp_SecureHash;

            return ResponseEntity.ok(Map.of("url", paymentUrl, "appNo", appNo));

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Lỗi tạo link thanh toán"));
        }
    }

    // =========================================================
    // 2. IPN – VNPAY GỌI VỀ XÁC NHẬN GIAO DỊCH
    // =========================================================
    @RequestMapping(value = "/vnpay-ipn", method = {RequestMethod.GET, RequestMethod.POST})
    public ResponseEntity<?> vnpayIPN(HttpServletRequest request) {
        try {
            Map<String, String> vnp_Params = new HashMap<>();
            request.getParameterMap().forEach((k, v) -> vnp_Params.put(k, v[0]));
            System.out.println("🔥 IPN RECEIVED: " + vnp_Params.get("vnp_TxnRef"));

            String vnp_SecureHash = vnp_Params.remove("vnp_SecureHash");
            vnp_Params.remove("vnp_SecureHashType");

            // Build hash data
            List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
            Collections.sort(fieldNames);
            StringBuilder hashData = new StringBuilder();
            for (Iterator<String> it = fieldNames.iterator(); it.hasNext();) {
                String fieldName = it.next();
                String fieldValue = vnp_Params.get(fieldName);
                if (fieldValue != null && !fieldValue.isEmpty()) {
                    hashData.append(fieldName).append('=').append(URLEncoder.encode(fieldValue, StandardCharsets.UTF_8));
                    if (it.hasNext()) hashData.append('&');
                }
            }
            String checkHash = VnPayConfig.hmacSHA512(VnPayConfig.vnp_HashSecret, hashData.toString());

            // 1. Validate Checksum
            if (!checkHash.equalsIgnoreCase(vnp_SecureHash)) {
                return ResponseEntity.badRequest().body(Map.of("RspCode", "97", "Message", "Invalid Checksum"));
            }

            // 2. Delegate business logic to PaymentService
            Application processedApplication = paymentService.processVnPayIpn(vnp_Params);

            if (processedApplication == null) {
                // This could mean payment failed, was already processed, or data was invalid.
                // The service layer should log the specific reason.
                // We still return a success response to VNPay to prevent retries for business rule failures.
                System.err.println("IPN processing did not result in an update. See service logs for details.");
            }

            // 3. Always return success to VNPay to acknowledge receipt
            return ResponseEntity.ok(Map.of("RspCode", "00", "Message", "Confirm Success"));

        } catch (Exception e) {
            e.printStackTrace();
            // Critical error, return 99 to VNPay if possible
            return ResponseEntity.internalServerError().body(Map.of("RspCode", "99", "Message", "Unknown error"));
        }
    }
}