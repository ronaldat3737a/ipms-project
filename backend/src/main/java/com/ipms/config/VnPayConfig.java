package com.ipms.config;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;

public class VnPayConfig {
    // 1. Mã Website từ email
    public static String vnp_TmnCode = "2GCPX4C9";

    // 2. Chuỗi bí mật từ email
    public static String vnp_HashSecret = "TOKZB6GYQOXXR0T10ET8RVQFVVDJ5OSS";

    // 3. Link thanh toán Sandbox
    public static String vnp_PayUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";

    // 4. Link quay về cho giao diện (Vercel)
    public static String vnp_ReturnUrl = "https://ipms-project.vercel.app/payment-result";

    // 5. Link IPN cho Backend (Ngrok)
    // LƯU Ý: Phải khớp 100% với URL bạn đã dán trên Merchant Admin và Controller trong Java
    public static String vnp_IpnUrl = "https://everett-nonenigmatic-geographically.ngrok-free.dev/api/payment/vnpay-ipn";

    // Phương thức mã hóa chuẩn HMAC SHA512
    public static String hmacSHA512(final String key, final String data) {
        try {
            if (key == null || data == null) throw new NullPointerException();
            final Mac hmac512 = Mac.getInstance("HmacSHA512");
            // SỬA TẠI ĐÂY: Dùng StandardCharsets.UTF_8 cho cả Key để tránh lỗi font/ký tự đặc biệt
            byte[] hmacKeyBytes = key.getBytes(StandardCharsets.UTF_8);
            final SecretKeySpec secretKey = new SecretKeySpec(hmacKeyBytes, "HmacSHA512");
            hmac512.init(secretKey);
            byte[] dataBytes = data.getBytes(StandardCharsets.UTF_8);
            byte[] result = hmac512.doFinal(dataBytes);
            StringBuilder sb = new StringBuilder(2 * result.length);
            for (byte b : result) {
                sb.append(String.format("%02x", b & 0xff));
            }
            return sb.toString();
        } catch (Exception ex) {
            return "";
        }
    }
}