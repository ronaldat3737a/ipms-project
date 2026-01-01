package com.ipms.controller;

import com.ipms.config.VnPayConfig;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "http://localhost:5173") // Fix lỗi CORS cho React
public class PaymentController {

    @GetMapping("/create-payment/{appId}/{stage}")
    public ResponseEntity<?> createPayment(
            @PathVariable String appId, // Dùng String thay vì UUID để nhận được mã "DRAFT-..."
            @PathVariable int stage,
            @RequestParam Long amount // Nhận số tiền gửi từ Frontend
    ) {
        // 1. Chuẩn bị các tham số cơ bản cho VNPay
        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String vnp_OrderInfo = "Thanh toan le phi SHTT giai doan " + stage + " cho don: " + appId;
        String vnp_OrderType = "250000"; // Mã danh mục phí, lệ phí
        String vnp_TxnRef = appId + "_" + stage + "_" + System.currentTimeMillis(); // Mã tham chiếu duy nhất
        String vnp_IpAddr = "127.0.0.1";
        String vnp_TmnCode = VnPayConfig.vnp_TmnCode;

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(amount * 100)); // VNPay yêu cầu nhân 100
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", vnp_OrderInfo);
        vnp_Params.put("vnp_OrderType", vnp_OrderType);
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", VnPayConfig.vnp_ReturnUrl);
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

        // 2. Định dạng ngày tạo (yyyyMMddHHmmss)
        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        // 3. Sắp xếp các tham số theo thứ tự bảng chữ cái (A-Z) - Bắt buộc theo VNPay
        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);

        // 4. Xây dựng chuỗi Query và chuỗi Hash
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                // Build hash data
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                
                // Build query
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII));
                query.append('=');
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                
                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }

        // 5. Tạo chữ ký bảo mật (SecureHash)
        String queryUrl = query.toString();
        String vnp_SecureHash = VnPayConfig.hmacSHA512(VnPayConfig.vnp_HashSecret, hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;

        // 6. Trả về URL thanh toán hoàn chỉnh cho React
        String paymentUrl = VnPayConfig.vnp_PayUrl + "?" + queryUrl;
        
        Map<String, String> result = new HashMap<>();
        result.put("url", paymentUrl);
        
        return ResponseEntity.ok(result);
    }
}