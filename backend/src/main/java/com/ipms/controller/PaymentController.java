package com.ipms.controller;

import com.ipms.config.VnPayConfig;
import com.ipms.entity.Application;
import com.ipms.entity.ReviewHistory;
import com.ipms.entity.enums.AppStatus;
import com.ipms.repository.ApplicationRepository;
import com.ipms.repository.ReviewHistoryRepository;
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

    private final ApplicationRepository applicationRepository;
    private final ReviewHistoryRepository reviewHistoryRepository;

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
            // Kiểm tra sự tồn tại của đơn trước khi tạo giao dịch
            Optional<Application> appOpt = applicationRepository.findByAppNo(appNo);
            if (appOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Mã đơn không hợp lệ hoặc không tồn tại!"));
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

            // 1. Kiểm tra chữ ký bảo mật
            if (!checkHash.equalsIgnoreCase(vnp_SecureHash)) {
                return ResponseEntity.badRequest().body(Map.of("RspCode", "97", "Message", "Invalid Checksum"));
            }

            String vnp_ResponseCode = vnp_Params.get("vnp_ResponseCode");
            String vnp_TxnRef = vnp_Params.get("vnp_TxnRef");
            String vnp_TransactionNo = vnp_Params.get("vnp_TransactionNo");

            // 2. Xử lý Logic nghiệp vụ khi thanh toán thành công
            if ("00".equals(vnp_ResponseCode)) {
                
                // 🔥 Tách mã đơn chuyên ngành (Ví dụ: 1-2026-00001)
                String appNoOnly = vnp_TxnRef.split("_")[0];
                System.out.println("🔍 Tra cứu AppNo từ DB: " + appNoOnly);

                Optional<Application> optionalApp = applicationRepository.findByAppNo(appNoOnly);

                if (optionalApp.isPresent()) {
                    Application application = optionalApp.get();

                    // CHỈ CẬP NHẬT NẾU ĐƠN ĐANG CHỜ NỘP PHÍ GD1 (Idempotency)
                    if (AppStatus.CHO_NOP_PHI_GD1.equals(application.getStatus())) {
                        
                        // --- CẬP NHẬT APPLICATION ---
                        application.setStatus(AppStatus.DANG_TD_HINH_THUC);
                        application.setUpdatedAt(OffsetDateTime.now());
                        applicationRepository.save(application);

                        // --- LƯU REVIEW HISTORY ---
                        ReviewHistory history = new ReviewHistory();
                        history.setApplication(application);
                        history.setReviewDate(OffsetDateTime.now());
                        history.setStatusTo(AppStatus.DANG_TD_HINH_THUC);
                        history.setNote("Hệ thống: Xác nhận nộp phí GD1 qua VNPay. Mã giao dịch: " + vnp_TransactionNo);

                        reviewHistoryRepository.save(history);
                        
                        System.out.println("✅ Cập nhật DB thành công cho đơn: " + appNoOnly);
                    }
                } else {
                    System.err.println("❌ Không tìm thấy mã đơn trong DB: " + appNoOnly);
                }
            }

            return ResponseEntity.ok(Map.of("RspCode", "00", "Message", "Confirm Success"));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("RspCode", "99", "Message", "Unknown error"));
        }
    }
}