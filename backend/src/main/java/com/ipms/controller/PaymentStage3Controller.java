package com.ipms.controller;

import com.ipms.config.VnPayConfig;
import com.ipms.entity.Application;
import com.ipms.entity.ApplicationFee;
import com.ipms.entity.enums.AppStatus;
import com.ipms.repository.ApplicationRepository;
import com.ipms.service.PaymentStage3Service;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@RequestMapping("/api/payment-stage3")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class PaymentStage3Controller {

    private final ApplicationRepository applicationRepository;
    private final PaymentStage3Service paymentStage3Service; // Inject service

    @GetMapping("/create-payment/{appNo}/{stage}")
    public ResponseEntity<?> createPayment(
            @PathVariable String appNo,
            @PathVariable int stage
    ) {
        try {
            // 1. Check for application existence and status
            Application application = applicationRepository.findByAppNo(appNo)
                    .orElseThrow(() -> new RuntimeException("Application not found!"));

            if (application.getStatus() != AppStatus.CHO_NOP_PHI_GD3) {
                return ResponseEntity
                        .badRequest()
                        .body(Map.of("message", "Application is not in the correct state for Stage 3 payment."));
            }

            if (stage != 3) {
                 return ResponseEntity
                        .badRequest()
                        .body(Map.of("message", "This endpoint is only for Stage 3 payments."));
            }

            // 2. Create the Fee record BEFORE generating the payment link
            ApplicationFee fee = paymentStage3Service.createFeeForStage3(application);
            Long feeAmount = fee.getAmount().longValue();

            // 3. Create VNPAY Link using the amount from the database
            String vnp_Version = "2.1.0";
            String vnp_Command = "pay";
            String vnp_OrderType = "250000";

            String vnp_TxnRef = appNo + "_" + stage + "_" + System.currentTimeMillis();
            String vnp_OrderInfo = "Thanh toan le phi SHTT giai doan " + stage + " cho don: " + appNo;
            String vnp_IpAddr = "127.0.0.1";

            Map<String, String> vnp_Params = new HashMap<>();
            vnp_Params.put("vnp_Version", vnp_Version);
            vnp_Params.put("vnp_Command", vnp_Command);
            vnp_Params.put("vnp_TmnCode", VnPayConfig.vnp_TmnCode);
            vnp_Params.put("vnp_Amount", String.valueOf(feeAmount * 100)); // Use amount from server
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

            return ResponseEntity.ok(Map.of(
                "url", paymentUrl, 
                "appNo", appNo,
                "amount", feeAmount
            ));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("message", "Error creating payment link: " + e.getMessage()));
        }
    }
}
