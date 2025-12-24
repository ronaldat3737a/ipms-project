import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, CheckCircle2, ChevronLeft } from "lucide-react";
import { useFilingData } from "./FilingContext";

const Step6_Submission = () => {
  const navigate = useNavigate();
  // Lấy dữ liệu từ Context chứa toàn bộ thông tin từ Bước 1 đến Bước 5
  const { formData, updateFormData, clearFormData } = useFilingData();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const currentStep = 6;
  const steps = [
    { id: 1, label: "Thông tin chung" },
    { id: 2, label: "Chủ đơn & Tác giả" },
    { id: 3, label: "Tải lên tài liệu" },
    { id: 4, label: "Yêu cầu bảo hộ" },
    { id: 5, label: "Tính phí & Thanh toán" },
    { id: 6, label: "Nộp đơn" },
  ];

  /**
   * Logic nộp hồ sơ chính thức kết nối với Backend
   */
  const handleSubmit = async () => {
    if (!isConfirmed) return;
    
    setIsSubmitting(true);
    
    try {
      // Gửi yêu cầu POST tới API Spring Boot
      const response = await fetch("http://localhost:8080/api/patents/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Nếu bạn có token đăng nhập, hãy thêm vào đây
          // "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Nhận kết quả trả về từ Backend (đối tượng Application đã lưu)
        const result = await response.json();
        console.log("Hồ sơ đã lưu thành công:", result);

        // Điều hướng đến trang thành công và truyền appNo (Mã số đơn thật từ Trigger DB)
        // appNo sẽ có định dạng như SC-2025-00001
        navigate("/applicant/patent/success", { 
          state: { appNo: result.appNo } 
        }); 
      } else {
        const errorData = await response.text();
        alert(`Nộp đơn thất bại: ${errorData || "Lỗi máy chủ"}. Vui lòng kiểm tra lại dữ liệu.`);
      }
    } catch (error) {
      console.error("Lỗi kết nối API:", error);
      alert("Không thể kết nối tới Backend. Hãy chắc chắn bạn đã chạy server Spring Boot ở cổng 8080.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-gray-800">
      {/* --- HEADER --- */}
      <header className="h-16 border-b border-gray-100 flex items-center justify-between px-8 bg-white sticky top-0 z-10">
        <button 
                  onClick={() => {
                    // Hiện hộp thoại hỏi ý kiến người dùng
                    const isConfirm = window.confirm(
                      "Hệ thống sẽ xóa toàn bộ dữ liệu bạn đã nhập ở tất cả các bước. Bạn có chắc chắn muốn hủy bỏ không?"
                    );
        
                    if (isConfirm) {
                      clearFormData(); // 1. Quét sạch dữ liệu trong bộ nhớ (Context & Session)
                      navigate("/applicant/patent"); // 2. Sau đó mới quay về Dashboard
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
            {/* Thay tên Trần Văn An bằng biến thực, giữ nguyên class CSS */}
            <p className="text-xs font-bold text-gray-800">
              {currentUser.fullName || "Người dùng"}
            </p>
            {/* Thay email bằng biến thực, giữ nguyên class CSS */}
            <p className="text-[10px] text-gray-400 font-medium">
              {currentUser.email || "Chưa cập nhật email"}
            </p>
          </div>
          {/* Thay đổi seed=Felix thành seed={tên người dùng} để ảnh đại diện đổi theo người đăng nhập */}
          <img 
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.fullName || 'Felix'}`} 
            alt="Avatar" 
            className="w-8 h-8 rounded-full border" 
          />
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
                  {isSubmitting ? "Đang nộp..." : "Nộp đơn"}
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