import React from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { CheckCircle, Bell, AlertCircle, CreditCard, ArrowRight } from "lucide-react";

/*
  ⚠️ LƯU Ý KIẾN TRÚC
  - KHÔNG dùng FilingContext
  - Trang này phải chạy độc lập khi VNPay redirect từ bên ngoài
*/

const PaymentResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // --- LOGIC NHẬN KẾT QUẢ VNPAY ---
  const vnpResponseCode = searchParams.get("vnp_ResponseCode");
  const vnpTransactionNo = searchParams.get("vnp_TransactionNo");
  const vnpAmount = searchParams.get("vnp_Amount");
  const vnpTxnRef = searchParams.get("vnp_TxnRef");

  const isFromPayment = vnpResponseCode !== null;
  const isPaymentSuccess = vnpResponseCode === "00";

  // Lấy mã số đơn
  const appNo = isFromPayment
    ? vnpTxnRef
    : location.state?.appNo || "Đang cập nhật...";

  // Xác định giai đoạn thanh toán (GĐ 1 / 2 / 3)
  const paymentStage = vnpTxnRef?.includes("_1_")
    ? "Giai đoạn 1"
    : vnpTxnRef?.includes("_2_")
    ? "Giai đoạn 2"
    : vnpTxnRef?.includes("_3_")
    ? "Giai đoạn 3"
    : "Không xác định";

  // Ngày hiện tại
  const today = new Date().toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const handleReturnDashboard = () => {
    navigate("/applicant-dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">
      {/* --- HEADER GIỮ NGUYÊN --- */}
      <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-end px-8 sticky top-0 z-10">
        <div className="flex items-center gap-6">
          <Bell size={20} className="text-gray-400" />
          <div className="flex items-center gap-3 border-l pl-6 border-gray-100">
            <div className="text-right">
              <p className="text-sm font-bold text-gray-800">Trần Văn An</p>
              <p className="text-xs text-gray-400 font-medium">an.tran@example.com</p>
            </div>
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
              alt="Avatar"
              className="w-9 h-9 rounded-full border"
            />
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-6">
        <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-sm border border-gray-100 p-12 flex flex-col items-center">
          {/* ICON */}
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${
              isFromPayment && !isPaymentSuccess ? "bg-red-50" : "bg-green-50"
            }`}
          >
            {isFromPayment && !isPaymentSuccess ? (
              <AlertCircle size={40} className="text-red-500" />
            ) : (
              <CheckCircle size={40} className="text-green-500" />
            )}
          </div>

          <h1 className="text-3xl font-black mb-4 tracking-tight text-center">
            {isFromPayment
              ? isPaymentSuccess
                ? "Thanh toán thành công!"
                : "Giao dịch thất bại"
              : "Nộp đơn thành công!"}
          </h1>

          <p className="text-gray-500 text-center text-sm font-medium leading-relaxed max-w-md mb-10">
            {isFromPayment && !isPaymentSuccess
              ? "Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng kiểm tra lại số dư hoặc thử lại sau."
              : "Hệ thống đã ghi nhận hồ sơ của bạn và chuyển đến Cục Sở hữu trí tuệ để xử lý."}
          </p>

          {/* --- TÓM TẮT --- */}
          <section className="w-full bg-gray-50/50 rounded-2xl p-8 border border-gray-100 mb-10">
            <h3 className="font-bold text-sm mb-6 uppercase tracking-wider text-gray-700 flex items-center gap-2">
              <CreditCard size={16} /> Tóm tắt đơn & Giao dịch
            </h3>

            <div className="space-y-4">
              <InfoRow label="Mã số đơn:" value={appNo} isHighlight />
              <InfoRow label="Giai đoạn thanh toán:" value={paymentStage} />

              {isFromPayment && (
                <>
                  <InfoRow label="Mã giao dịch VNPay:" value={vnpTransactionNo} />
                  <InfoRow
                    label="Số tiền đã nộp:"
                    value={`${(parseInt(vnpAmount) / 100).toLocaleString()} VND`}
                  />
                </>
              )}

              <InfoRow label="Ngày thực hiện:" value={today} />
              <InfoRow label="Loại đơn:" value="Sáng chế / Giải pháp / Kiểu dáng CN" />
              <InfoRow
                label="Trạng thái hiện tại:"
                value={
                  isFromPayment && !isPaymentSuccess
                    ? "Chờ thanh toán lại"
                    : "Đã tiếp nhận (Đang xử lý)"
                }
                isStatus
                color={isFromPayment && !isPaymentSuccess ? "red" : "green"}
              />
            </div>
          </section>

          {/* BƯỚC TIẾP THEO */}
          {(!isFromPayment || isPaymentSuccess) && (
            <section className="w-full space-y-6 mb-12 px-4 border-l-2 border-blue-500 ml-2">
              <h3 className="font-bold text-lg text-blue-700 pl-4">
                Các bước tiếp theo
              </h3>
              <ul className="space-y-4">
                <StepItem
                  title="Thẩm định hình thức (Dự kiến 01 tháng):"
                  desc={`Cục SHTT sẽ xem xét tính hợp lệ của hồ sơ dựa trên mã số đơn ${appNo}.`}
                  active
                />
                <StepItem
                  title="Thông báo kết quả:"
                  desc="Bạn sẽ nhận được thông báo qua email và hệ thống khi có kết quả."
                />
              </ul>
            </section>
          )}

          {/* NÚT */}
          <div className="flex flex-col w-full items-center gap-4">
            <button
              onClick={handleReturnDashboard}
              className="w-full max-w-xs py-3.5 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition shadow-md shadow-blue-100"
            >
              Quay lại Dashboard
            </button>

            {isFromPayment && !isPaymentSuccess && (
              <button
                onClick={() => navigate(-1)}
                className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1"
              >
                Thử thanh toán lại <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      </main>

      <footer className="h-14 border-t border-gray-100 flex items-center justify-center text-[10px] text-gray-400 font-medium">
        © 2025 IPMS Sáng Chế & Giải Pháp. All rights reserved.
      </footer>
    </div>
  );
};

// Helper Components
const InfoRow = ({ label, value, isStatus, isHighlight, color }) => (
  <div className="flex justify-between items-center text-sm border-b border-gray-100/50 pb-2 last:border-0 last:pb-0">
    <span className="text-gray-500 font-medium">{label}</span>
    <span
      className={`font-bold ${
        isStatus
          ? `text-${color}-600 bg-${color}-50 px-2 py-0.5 rounded text-[11px]`
          : isHighlight
          ? "text-blue-600 font-mono text-base"
          : "text-gray-800"
      }`}
    >
      {value}
    </span>
  </div>
);

const StepItem = ({ title, desc, active }) => (
  <li className="flex gap-4 pl-4 relative">
    <div
      className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
        active ? "bg-blue-500" : "bg-gray-300"
      }`}
    ></div>
    <p className="text-xs text-gray-600 leading-relaxed font-medium">
      <span
        className={`font-bold ${
          active ? "text-gray-800" : "text-gray-500"
        }`}
      >
        {title}
      </span>{" "}
      {desc}
    </p>
  </li>
);

export default PaymentResult;
