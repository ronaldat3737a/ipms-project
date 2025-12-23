import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, CheckCircle2, ChevronLeft } from "lucide-react";
import { useFilingData } from "./FilingContext";

const Step6_Submission = () => {
  const navigate = useNavigate();
  // Lấy dữ liệu từ Context
  const { formData } = useFilingData(); 
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentStep = 6;
  const steps = [
    { id: 1, label: "Thông tin chung" },
    { id: 2, label: "Chủ đơn & Tác giả" },
    { id: 3, label: "Tải lên tài liệu" },
    { id: 4, label: "Yêu cầu bảo hộ" },
    { id: 5, label: "Tính phí & Thanh toán" },
    { id: 6, label: "Nộp đơn" },
  ];

  // Logic nộp hồ sơ chính thức
  const handleSubmit = async () => {
    if (!isConfirmed) return;
    
    setIsSubmitting(true);
    
    // Giả lập gọi API nộp đơn trong 2 giây
    setTimeout(() => {
      setIsSubmitting(false);
      // THAY ĐỔI: Điều hướng đến trang thành công
      // Chúng ta không gọi clearFormData ở đây để trang SuccessPage vẫn có thể đọc được dữ liệu hiển thị tóm tắt
      navigate("/applicant/patent/success"); 
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-gray-800">
      {/* --- HEADER --- */}
      <header className="h-16 border-b border-gray-100 flex items-center justify-between px-8 bg-white sticky top-0 z-10">
        <button 
          onClick={() => navigate("/applicant/patent")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition text-sm font-medium"
        >
          <div className="w-6 h-6 border border-gray-300 rounded-full flex items-center justify-center">
            <X size={14} />
          </div>
          Hủy bỏ
        </button>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs font-bold text-gray-800">Trần Văn An</p>
            <p className="text-[10px] text-gray-400 font-medium">an.tran@example.com</p>
          </div>
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" className="w-8 h-8 rounded-full border" />
        </div>
      </header>

      <div className="flex flex-grow overflow-hidden">
        {/* --- SIDEBAR TIẾN TRÌNH --- */}
        <aside className="w-72 border-r border-gray-100 p-8 shrink-0 bg-gray-50/30">
          <h2 className="text-lg font-bold mb-8 text-gray-700">Tiến trình nộp đơn</h2>
          <div className="space-y-6">
            {steps.map((step) => (
              <div key={step.id} className="flex items-center gap-4 relative">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all z-10 
                  ${currentStep === step.id ? "bg-blue-500 border-blue-500 text-white shadow-md" : 
                    currentStep > step.id ? "bg-green-500 border-green-500 text-white" : "bg-white border-gray-200 text-gray-400"}`}>
                  {currentStep > step.id ? <CheckCircle2 size={16} /> : step.id}
                </div>
                <span className={`text-sm font-bold transition-all ${currentStep === step.id ? "text-blue-600" : currentStep > step.id ? "text-green-600" : "text-gray-400"}`}>
                  {step.label}
                </span>
                {step.id !== 6 && (
                  <div className="absolute left-4 top-8 w-0.5 h-6 bg-gray-100 -z-0"></div>
                )}
              </div>
            ))}
          </div>
        </aside>

        {/* --- NỘI DUNG CHÍNH (STEP 6) --- */}
        <main className="flex-grow p-12 flex flex-col items-center bg-white overflow-y-auto">
          <div className="w-full max-w-2xl">
            <h1 className="text-3xl font-bold mb-10">6. Nộp đơn</h1>

            {/* Bảng xác nhận hồ sơ */}
            <div className="border-2 border-black rounded-[32px] p-10 space-y-8 bg-white shadow-sm">
              <h2 className="text-2xl font-black text-center uppercase tracking-tight">Xác nhận hồ sơ</h2>
              
              <p className="text-sm text-center text-gray-600 leading-relaxed px-4">
                Vui lòng kiểm tra kỹ các thông tin đã khai báo. Sau khi nhấn "Nộp đơn", bạn sẽ không thể chỉnh sửa hồ sơ cho đến khi có thông báo từ Cục Sở hữu trí tuệ.
              </p>

              {/* Checkbox cam đoan */}
              <div className="space-y-6 pt-4">
                <label className="flex items-start gap-4 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={isConfirmed}
                    onChange={(e) => setIsConfirmed(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500 transition cursor-pointer"
                  />
                  <div className="space-y-4">
                    <span className="text-sm font-bold text-gray-800">Tôi xin cam đoan:</span>
                    <ul className="space-y-3 list-disc list-outside ml-4 text-xs font-medium text-gray-600 leading-relaxed">
                      <li>Mọi thông tin trong đơn và các tài liệu đính kèm là hoàn toàn trung thực và chính xác.</li>
                      <li>Tôi là người có quyền nộp đơn hoặc được ủy quyền hợp pháp để thực hiện thủ tục này.</li>
                      <li>Tôi hoàn toàn chịu trách nhiệm trước pháp luật về tính xác thực của hồ sơ đã nộp.</li>
                    </ul>
                  </div>
                </label>
              </div>

              {/* Nút thao tác */}
              <div className="flex gap-4 pt-6">
                <button 
                  onClick={() => navigate("/applicant/patent/step5")}
                  className="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-sm text-gray-500 hover:bg-gray-50 transition"
                >
                  Quay lại
                </button>
                <button 
                  disabled={!isConfirmed || isSubmitting}
                  onClick={handleSubmit}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm text-white shadow-md transition flex items-center justify-center gap-2
                    ${isConfirmed && !isSubmitting ? "bg-blue-400 hover:bg-blue-500" : "bg-blue-200 cursor-not-allowed shadow-none"}`}
                >
                  {isSubmitting ? "Đang xử lý..." : "Nộp đơn"}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      <footer className="h-14 border-t border-gray-100 flex items-center justify-center text-[10px] text-gray-400 font-medium shrink-0">
        © 2025 IPMS Sáng Chế & Giải Pháp. All rights reserved.
      </footer>
    </div>
  );
};

export default Step6_Submission;