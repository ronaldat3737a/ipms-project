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
    // 1. TẠO LINK THANH TOÁN VNPAY
    // =========================================================
    @GetMapping("/create-payment/{appId}/{stage}")
    public ResponseEntity<?> createPayment(
            @PathVariable String appId,
            @PathVariable int stage,
            @RequestParam Long amount
    ) {
        try {
            String vnp_Version = "2.1.0";
            String vnp_Command = "pay";
            String vnp_OrderType = "250000";
            String vnp_TxnRef = appId + "_" + stage + "_" + System.currentTimeMillis();
            String vnp_OrderInfo = "Thanh toan le phi SHTT giai doan " + stage + " cho don: " + appId;
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
            String vnp_CreateDate = new SimpleDateFormat("yyyyMMddHHmmss").format(cld.getTime());
            vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

            List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
            Collections.sort(fieldNames);

            StringBuilder hashData = new StringBuilder();
            StringBuilder query = new StringBuilder();

            for (Iterator<String> it = fieldNames.iterator(); it.hasNext();) {
                String fieldName = it.next();
                String fieldValue = vnp_Params.get(fieldName);
                if (fieldValue != null && !fieldValue.isEmpty()) {
                    hashData.append(fieldName).append('=')
                            .append(URLEncoder.encode(fieldValue, StandardCharsets.UTF_8));
                    query.append(URLEncoder.encode(fieldName, StandardCharsets.UTF_8))
                            .append('=')
                            .append(URLEncoder.encode(fieldValue, StandardCharsets.UTF_8));
                    if (it.hasNext()) {
                        hashData.append('&');
                        query.append('&');
                    }
                }
            }

            String vnp_SecureHash = VnPayConfig.hmacSHA512(
                    VnPayConfig.vnp_HashSecret,
                    hashData.toString()
            );

            String paymentUrl = VnPayConfig.vnp_PayUrl + "?" + query + "&vnp_SecureHash=" + vnp_SecureHash;

            return ResponseEntity.ok(Map.of("url", paymentUrl));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(Map.of("message", "Không thể tạo link thanh toán"));
        }
    }

    // =========================================================
    // 2. IPN – VNPAY GỌI VỀ XÁC NHẬN GIAO DỊCH
    // =========================================================
    @GetMapping("/vnpay-ipn")
    public ResponseEntity<?> vnpayIPN(HttpServletRequest request) {
        try {
            Map<String, String> vnp_Params = new HashMap<>();
            Enumeration<String> paramNames = request.getParameterNames();

            while (paramNames.hasMoreElements()) {
                String paramName = paramNames.nextElement();
                String paramValue = request.getParameter(paramName);
                if (paramValue != null && !paramValue.isEmpty()) {
                    vnp_Params.put(paramName, paramValue);
                }
            }

            String vnp_SecureHash = vnp_Params.remove("vnp_SecureHash");
            vnp_Params.remove("vnp_SecureHashType");

            List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
            Collections.sort(fieldNames);

            StringBuilder hashData = new StringBuilder();
            for (Iterator<String> it = fieldNames.iterator(); it.hasNext();) {
                String fieldName = it.next();
                String fieldValue = vnp_Params.get(fieldName);
                if (fieldValue != null && !fieldValue.isEmpty()) {
                    hashData.append(fieldName).append('=')
                            .append(URLEncoder.encode(fieldValue, StandardCharsets.UTF_8));
                    if (it.hasNext()) hashData.append('&');
                }
            }

            String checkHash = VnPayConfig.hmacSHA512(
                    VnPayConfig.vnp_HashSecret,
                    hashData.toString()
            );

            if (!checkHash.equalsIgnoreCase(vnp_SecureHash)) {
                return ResponseEntity.badRequest()
                        .body(Map.of("RspCode", "97", "Message", "Invalid Checksum"));
            }

            String vnp_ResponseCode = vnp_Params.get("vnp_ResponseCode");
            String vnp_TxnRef = vnp_Params.get("vnp_TxnRef");
            String vnp_TransactionNo = vnp_Params.get("vnp_TransactionNo");

            String appId = vnp_TxnRef.split("_")[0];

            if ("00".equals(vnp_ResponseCode)) {
                Optional<Application> optionalApp = applicationRepository.findByAppNo(appId);

                if (optionalApp.isPresent()) {
                    Application application = optionalApp.get();

                    if (application.getStatus() == AppStatus.CHO_NOP_PHI_GD1) {
                        application.setStatus(AppStatus.DANG_TD_HINH_THUC);
                        applicationRepository.save(application);

                        ReviewHistory history = new ReviewHistory();
                        history.setApplication(application);
                        history.setReviewDate(OffsetDateTime.now());
                        history.setStatusTo(AppStatus.DANG_TD_HINH_THUC);
                        history.setNote(
                                "Thanh toán VNPay thành công. Mã giao dịch: " + vnp_TransactionNo
                        );

                        reviewHistoryRepository.save(history);
                    }
                }
            }

            return ResponseEntity.ok(Map.of("RspCode", "00", "Message", "Confirm Success"));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(Map.of("RspCode", "99", "Message", "Unknown error"));
        }
    }
}
