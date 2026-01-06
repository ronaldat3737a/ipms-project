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
            HttpServletRequest request,
            @PathVariable String appNo,
            @PathVariable int stage
    ) {
        try {
            String paymentUrl = paymentService.createPaymentUrl(appNo, stage, request);
            return ResponseEntity.ok(Map.of("url", paymentUrl));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
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