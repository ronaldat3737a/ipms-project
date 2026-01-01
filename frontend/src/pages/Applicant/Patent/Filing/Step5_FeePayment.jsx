import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  X,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Coins,
  CreditCard,
  Info,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useFilingData } from "./FilingContext";

const Step5_FeePayment = () => {
  const navigate = useNavigate();
  const context = useFilingData();
  const formData = context?.formData || {};
  const updateFormData = context?.updateFormData || (() => {});
  const { clearFormData } = useFilingData();

  const [loading, setLoading] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  // --- LOGIC TÍNH TOÁN LỆ PHÍ ---
  const allClaims = formData?.claims || [];
  const numIndependentClaims = allClaims.filter((c) => c?.type === "Độc lập").length;
  const numPages = parseInt(formData?.totalPages) || 0;

  const FEE_FILING = 150000;
  const FEE_EXAM_PER_CLAIM = 180000;
  const FEE_PAGE_EXCEED = 8000;

  const totalExamFee = numIndependentClaims * FEE_EXAM_PER_CLAIM;
  const totalPageFee = numPages > 6 ? (numPages - 6) * FEE_PAGE_EXCEED : 0;
  const totalAmount = FEE_FILING + totalExamFee + totalPageFee;

  useEffect(() => {
    if (updateFormData && totalAmount !== formData?.totalFee) {
      updateFormData({ totalFee: totalAmount });
    }
  }, [totalAmount]);

  const formatVND = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // --- XỬ LÝ GỌI API VNPAY ---
  const handleVNPayPayment = async () => {
    setLoading(true);
    try {
      // Lưu ý: Ở bước 5 này, đơn có thể chưa có ID chính thức nếu chưa bấm lưu ở bước 6.
      // Bạn có thể truyền ID tạm hoặc gửi dữ liệu để Backend lưu nháp trước khi thanh toán.
      const appId = formData?.id || "DRAFT-" + Date.now(); 
      const stage = 1; // Giai đoạn 1: Nộp đơn & TĐ Hình thức

      const response = await axios.get(
        `http://localhost:8080/api/payment/create-payment/${appId}/${stage}`,
        { params: { amount: totalAmount } }
      );

      if (response.data && response.data.url) {
        // Chuyển hướng sang cổng thanh toán VNPay
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error("Lỗi thanh toán:", error);
      alert("Không thể kết nối với cổng thanh toán. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 1, label: "Thông tin chung" },
    { id: 2, label: "Chủ đơn & Tác giả" },
    { id: 3, label: "Tải lên tài liệu" },
    { id: 4, label: "Yêu cầu bảo hộ" },
    { id: 5, label: "Tính phí & Thanh toán" },
    { id: 6, label: "Nộp đơn" },
  ];

  if (!context) return <div className="p-20 text-center font-bold text-red-500">Lỗi: Không tìm thấy FilingProvider!</div>;

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-gray-800">
      {/* HEADER GIỮ NGUYÊN */}
      <header className="h-16 border-b border-gray-100 flex items-center justify-between px-8 bg-white sticky top-0 z-10">
        <button 
          onClick={() => window.confirm("Hủy bỏ nộp đơn?") && (clearFormData(), navigate("/applicant/patent"))}
          className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition text-sm font-medium"
        >
          <div className="w-6 h-6 border border-gray-300 rounded-full flex items-center justify-center"><X size={14} /></div>
          Hủy bỏ
        </button>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs font-bold text-gray-800">{currentUser?.fullName || "Người dùng"}</p>
            <p className="text-[10px] text-gray-400 font-medium">{currentUser?.email || ""}</p>
          </div>
          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.fullName}`} alt="Avatar" className="w-8 h-8 rounded-full border" />
        </div>
      </header>

      <div className="flex flex-grow overflow-hidden">
        {/* SIDEBAR GIỮ NGUYÊN */}
        <aside className="w-72 border-r border-gray-100 p-8 shrink-0 bg-gray-50/30">
          <h2 className="text-lg font-bold mb-8 text-gray-700">Tiến trình nộp đơn</h2>
          <div className="space-y-6">
            {steps.map((step) => (
              <div key={step.id} className="flex items-center gap-4 relative">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all z-10 ${5 === step.id ? "bg-blue-500 border-blue-500 text-white shadow-md" : 5 > step.id ? "bg-green-500 border-green-500 text-white" : "bg-white border-gray-200 text-gray-400"}`}>
                  {5 > step.id ? <CheckCircle2 size={16} /> : step.id}
                </div>
                <span className={`text-sm font-bold ${5 === step.id ? "text-blue-600" : 5 > step.id ? "text-green-600" : "text-gray-400"}`}>{step.label}</span>
                {step.id !== 6 && <div className="absolute left-4 top-8 w-0.5 h-6 bg-gray-100"></div>}
              </div>
            ))}
          </div>
        </aside>

        <main className="flex-grow p-12 overflow-y-auto bg-white">
          <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold italic">5. Tính phí & Thanh toán</h1>

            {/* THẺ TÓM TẮT DỮ LIỆU */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-blue-500"><CheckCircle2 size={20} /></div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Điểm Độc lập</p>
                  <p className="text-lg font-black text-blue-700">{numIndependentClaims} điểm</p>
                </div>
              </div>
              <div className="p-4 bg-purple-50/50 border border-purple-100 rounded-2xl flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-purple-500"><Info size={20} /></div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Tổng số trang</p>
                  <p className="text-lg font-black text-purple-700">{numPages} trang</p>
                </div>
              </div>
            </div>

            {/* CHI TIẾT LỆ PHÍ */}
            <section className="p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center gap-2 text-gray-800">
                <Coins size={20} className="text-amber-500" />
                <h3 className="font-bold uppercase text-sm tracking-wider">Chi tiết lệ phí GĐ 1</h3>
              </div>
              <div className="space-y-1">
                <FeeRow label="1. Lệ phí nộp đơn" price={formatVND(FEE_FILING)} />
                <FeeRow label="2. Phí thẩm định hình thức" price={formatVND(totalExamFee)} note={`Dựa trên ${numIndependentClaims} điểm độc lập`} />
                <FeeRow label="3. Phí trang bản mô tả bổ sung" price={formatVND(totalPageFee)} note={numPages > 6 ? `Vượt ${numPages - 6} trang` : "Trong định mức"} />
                <div className="pt-6 mt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-xl font-black uppercase tracking-tight">Tổng chi phí</span>
                  <span className="text-3xl font-black text-blue-600 tracking-tighter">{formatVND(totalAmount)}</span>
                </div>
              </div>
            </section>

            {/* PHẦN THANH TOÁN VNPAY (THAY THẾ CHUYỂN KHOẢN) */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 rounded-3xl border-2 border-blue-100 bg-blue-50/20 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="text-blue-500" size={20} />
                  <h3 className="font-bold text-gray-700">Thanh toán trực tuyến</h3>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Sử dụng cổng thanh toán <b>VNPay Sandbox</b> để thực hiện giao dịch thử nghiệm. 
                  Hệ thống sẽ tự động xác nhận hồ sơ sau khi thanh toán thành công.
                </p>
                <button
                  onClick={handleVNPayPayment}
                  disabled={loading}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black flex items-center justify-center gap-3 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" /> : "THANH TOÁN QUA VNPAY"}
                </button>
              </div>

              {/* HƯỚNG DẪN THẺ TEST */}
              <div className="p-8 rounded-3xl border border-amber-100 bg-amber-50/30 space-y-3">
                <div className="flex items-center gap-2 text-amber-600">
                  <AlertCircle size={18} />
                  <h3 className="text-xs font-bold uppercase">Thông tin thẻ Test (Sandbox)</h3>
                </div>
                <div className="space-y-2 text-[11px] font-medium text-amber-800">
                  <div className="flex justify-between border-b border-amber-100 pb-1"><span>Ngân hàng:</span> <b>NCB</b></div>
                  <div className="flex justify-between border-b border-amber-100 pb-1"><span>Số thẻ:</span> <b>9704198526191432198</b></div>
                  <div className="flex justify-between border-b border-amber-100 pb-1"><span>Tên chủ thẻ:</span> <b>NGUYEN VAN A</b></div>
                  <div className="flex justify-between border-b border-amber-100 pb-1"><span>Ngày phát hành:</span> <b>07/15</b></div>
                  <div className="flex justify-between"><span>Mật khẩu OTP:</span> <b>123456</b></div>
                </div>
              </div>
            </section>

            {/* ĐIỀU HƯỚNG */}
            <div className="flex justify-end gap-4 pt-10 border-t border-gray-50">
              <button onClick={() => navigate("/applicant/patent/step4")} className="px-8 py-3 border border-gray-200 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition text-sm">Quay lại</button>
              <button 
                onClick={() => navigate("/applicant/patent/step6")} 
                className="flex items-center gap-2 px-10 py-3 bg-gray-100 text-gray-400 rounded-xl font-bold transition text-sm hover:bg-gray-200 hover:text-gray-600"
              >
                Bỏ qua thanh toán (Dành cho Demo) <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// Component con giữ nguyên UI
const FeeRow = ({ label, price, note }) => (
  <div className="flex justify-between items-start py-4 border-b border-gray-50 last:border-0">
    <div className="space-y-1">
      <p className="text-sm font-bold text-gray-700">{label}</p>
      {note && <p className="text-[10px] text-gray-400 font-medium italic">{note}</p>}
    </div>
    <span className="text-sm font-black text-gray-800 tracking-tight">{price}</span>
  </div>
);

export default Step5_FeePayment;