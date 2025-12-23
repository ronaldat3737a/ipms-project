import React from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Bell } from "lucide-react";
import { useFilingData } from "./FilingContext";

const SuccessPage = () => {
  const navigate = useNavigate();
  const { formData, clearFormData } = useFilingData();

  // Logic khi quay lại Dashboard
  const handleReturnDashboard = () => {
    clearFormData(); // Xóa dữ liệu tạm thời sau khi đã xem xong kết quả
    navigate("/applicant-dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">
      {/* --- HEADER --- */}
      <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-end px-8 sticky top-0 z-10">
        <div className="flex items-center gap-6">
          <Bell size={20} className="text-gray-400" />
          <div className="flex items-center gap-3 border-l pl-6 border-gray-100">
            <div className="text-right">
              <p className="text-sm font-bold text-gray-800">Trần Văn An</p>
              <p className="text-xs text-gray-400 font-medium">an.tran@example.com</p>
            </div>
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" className="w-9 h-9 rounded-full border" />
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-sm border border-gray-100 p-12 flex flex-col items-center">
          
          {/* Success Icon */}
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-6">
            <CheckCircle size={40} className="text-green-500" />
          </div>

          <h1 className="text-3xl font-black mb-4 tracking-tight">Nộp đơn thành công!</h1>
          <p className="text-gray-500 text-center text-sm font-medium leading-relaxed max-w-md mb-10">
            Hệ thống đã tiếp nhận hồ sơ của bạn và chuyển đến Cục Sở hữu trí tuệ để xử lý.
          </p>

          {/* Tóm tắt đơn đăng ký */}
          <section className="w-full bg-gray-50/50 rounded-2xl p-8 border border-gray-100 mb-10">
            <h3 className="font-bold text-sm mb-6 uppercase tracking-wider text-gray-700">Tóm tắt đơn đăng ký</h3>
            <div className="space-y-4">
              <InfoRow label="Mã số đơn tạm thời:" value="VN/2025/12345" />
              <InfoRow label="Ngày nộp đơn:" value="22/12/2025" />
              <InfoRow label="Loại đơn:" value={formData.appType || "Sáng chế"} />
              <InfoRow label="Trạng thái hiện tại:" value="Đang thẩm định hình thức" isStatus />
            </div>
          </section>

          {/* Các bước tiếp theo */}
          <section className="w-full space-y-6 mb-12 px-4">
            <h3 className="font-bold text-center text-lg">Các bước tiếp theo</h3>
            <ul className="space-y-4">
              <li className="flex gap-4">
                <span className="w-1.5 h-1.5 bg-black rounded-full mt-2 shrink-0"></span>
                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                  <span className="font-bold text-gray-800">Thẩm định hình thức (Dự kiến 01 tháng):</span> Cục Sở hữu trí tuệ sẽ xem xét tính hợp lệ của hồ sơ.
                </p>
              </li>
              <li className="flex gap-4">
                <span className="w-1.5 h-1.5 bg-black rounded-full mt-2 shrink-0"></span>
                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                  <span className="font-bold text-gray-800">Thông báo kết quả:</span> Bạn sẽ nhận được thông báo về kết quả thẩm định hình thức qua email.
                </p>
              </li>
              <li className="flex gap-4">
                <span className="w-1.5 h-1.5 bg-black rounded-full mt-2 shrink-0"></span>
                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                  <span className="font-bold text-gray-800">Chỉnh sửa hồ sơ:</span> Nếu có thiếu sót, bạn sẽ có cơ hội bổ sung hoặc chỉnh sửa hồ sơ trong thời gian quy định.
                </p>
              </li>
            </ul>
          </section>

          {/* Nút điều hướng */}
          <button 
            onClick={handleReturnDashboard}
            className="w-full max-w-xs py-3.5 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition shadow-md shadow-blue-100"
          >
            Quay lại Dashboard
          </button>
        </div>
      </main>

      <footer className="h-14 border-t border-gray-100 flex items-center justify-center text-[10px] text-gray-400 font-medium">
        © 2025 IPMS Sáng Chế & Giải Pháp. All rights reserved.
      </footer>
    </div>
  );
};

// Helper Component
const InfoRow = ({ label, value, isStatus }) => (
  <div className="flex justify-between items-center text-sm">
    <span className="text-gray-500 font-medium">{label}</span>
    <span className={`font-bold ${isStatus ? "text-gray-800" : "text-gray-800"}`}>{value}</span>
  </div>
);

export default SuccessPage;