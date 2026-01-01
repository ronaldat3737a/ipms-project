import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { useFilingData } from "./FilingContext";

const Step5_Submission = () => {
  const navigate = useNavigate();
  // Lấy dữ liệu từ Context
  const { formData, clearFormData } = useFilingData();
  const [isConfirmed, setIsConfirmed] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  
  // SỬA: currentStep phải là 5
  const currentStep = 5; 

  const steps = [
    { id: 1, label: "Thông tin chung" },
    { id: 2, label: "Chủ đơn & Tác giả" },
    { id: 3, label: "Tải lên tài liệu" },
    { id: 4, label: "Yêu cầu bảo hộ" },
    { id: 5, label: "Xác nhận đơn" },
    { id: 6, label: "Tính phí & Thanh toán" },
  ];

  // Hàm xử lý khi nhấn "Tiếp theo"
  const handleNextStep = () => {
    if (!isConfirmed) {
      alert("Vui lòng xác nhận cam đoan thông tin trước khi chuyển sang bước thanh toán.");
      return;
    }
    // Chuyển sang bước 6 để thực hiện tính phí và gọi VNPay
    navigate("/applicant/patent/step6");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-gray-800">
      {/* --- HEADER --- */}
      <header className="h-16 border-b border-gray-100 flex items-center justify-between px-8 bg-white sticky top-0 z-10">
        <button
          onClick={() => {
            const isConfirm = window.confirm("Hệ thống sẽ xóa toàn bộ dữ liệu. Bạn có chắc chắn muốn hủy bỏ không?");
            if (isConfirm) {
              clearFormData();
              navigate("/applicant/patent");
            }
          }}
          className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition text-sm font-medium"
        >
          <div className="w-6 h-6 border border-gray-300 rounded-full flex items-center justify-center">
            <X size={14} />
          </div>
          Hủy bỏ
        </button>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs font-bold text-gray-800">{currentUser.fullName || "Người dùng"}</p>
            <p className="text-[10px] text-gray-400 font-medium">{currentUser.email || "Chưa cập nhật"}</p>
          </div>
          <img
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.fullName || "Felix"}`}
            alt="Avatar"
            className="w-8 h-8 rounded-full border"
          />
        </div>
      </header>

      <div className="flex flex-grow overflow-hidden">
        {/* --- SIDEBAR --- */}
        <aside className="w-72 border-r border-gray-100 p-8 shrink-0 bg-gray-50/30">
          <h2 className="text-lg font-bold mb-8 text-gray-700">Tiến trình nộp đơn</h2>
          <div className="space-y-6">
            {steps.map((step) => (
              <div key={step.id} className="flex items-center gap-4 relative">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all z-10 
                  ${currentStep === step.id ? "bg-blue-500 border-blue-500 text-white shadow-md" : 
                    currentStep > step.id ? "bg-green-500 border-green-500 text-white" : "bg-white border-gray-200 text-gray-400"}`}
                >
                  {currentStep > step.id ? <CheckCircle2 size={16} /> : step.id}
                </div>
                <span className={`text-sm font-bold ${currentStep === step.id ? "text-blue-600" : currentStep > step.id ? "text-green-600" : "text-gray-400"}`}>
                  {step.label}
                </span>
                {step.id !== 6 && <div className="absolute left-4 top-8 w-0.5 h-6 bg-gray-100"></div>}
              </div>
            ))}
          </div>
        </aside>

        {/* --- NỘI DUNG CHÍNH (XÁC NHẬN) --- */}
        <main className="flex-grow p-12 flex flex-col items-center bg-white overflow-y-auto">
          <div className="w-full max-w-2xl">
            <h1 className="text-3xl font-bold mb-10 italic">5. Xác nhận đơn</h1>

            <div className="border-2 border-black rounded-[32px] p-10 space-y-8 bg-white shadow-sm">
              <h2 className="text-2xl font-black text-center uppercase tracking-tight">Xác nhận hồ sơ</h2>

              <p className="text-sm text-center text-gray-600 leading-relaxed px-4">
                Vui lòng kiểm tra kỹ các thông tin đã khai báo trước khi chuyển sang bước thanh toán phí và lệ phí.
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
                      <li>Thông tin khai báo là hoàn toàn trung thực.</li>
                      <li>Tôi chịu trách nhiệm trước pháp luật về hồ sơ này.</li>
                    </ul>
                  </div>
                </label>
              </div>

              {/* Nút điều hướng */}
              <div className="flex gap-4 pt-6">
                <button
                  onClick={() => navigate("/applicant/patent/step4")}
                  className="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-sm text-gray-500 hover:bg-gray-50 transition"
                >
                  Quay lại
                </button>
                <button
                  onClick={handleNextStep}
                  className="flex-1 py-3 bg-blue-500 text-white rounded-xl font-bold text-sm hover:bg-blue-600 transition shadow-md flex items-center justify-center gap-2"
                >
                  Tiếp theo: Thanh toán <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Step5_Submission;