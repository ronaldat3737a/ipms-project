import React from "react";
import { useNavigate } from "react-router-dom";
import { X, ChevronDown } from "lucide-react";
import { useFilingData } from "./FilingContext"; // Import "bộ não" dữ liệu

const Step1_GeneralInfo = () => {
  const navigate = useNavigate();
  
  // Lấy dữ liệu và hàm cập nhật từ Context dùng chung
  const { formData, updateFormData } = useFilingData();

  // Cố định bước hiện tại là 1 cho trang này
  const currentStep = 1;

  const steps = [
    { id: 1, label: "Thông tin chung" },
    { id: 2, label: "Chủ đơn & Tác giả" },
    { id: 3, label: "Tải lên tài liệu" },
    { id: 4, label: "Yêu cầu bảo hộ" },
    { id: 5, label: "Tính phí & Thanh toán" },
    { id: 6, label: "Nộp đơn" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Cập nhật vào Context thay vì set state nội bộ
    updateFormData({ [name]: value });
  };

  // Tính số từ cho phần tóm tắt
  const wordCount = formData.summary.trim() ? formData.summary.trim().split(/\s+/).length : 0;

  // Lấy thông tin người dùng từ localStorage đã lưu khi đăng nhập
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

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
                  ${currentStep === step.id ? "bg-blue-500 border-blue-500 text-white" : "bg-white border-gray-200 text-gray-400"}`}>
                  {step.id}
                </div>
                <span className={`text-sm font-bold transition-all ${currentStep === step.id ? "text-blue-600" : "text-gray-400"}`}>
                  {step.label}
                </span>
                {step.id !== 6 && (
                  <div className="absolute left-4 top-8 w-0.5 h-6 bg-gray-100 -z-0"></div>
                )}
              </div>
            ))}
          </div>
        </aside>

        {/* --- NỘI DUNG CHÍNH (STEP 1) --- */}
        <main className="flex-grow p-12 overflow-y-auto bg-white">
          <div className="max-w-4xl">
            <h1 className="text-3xl font-bold mb-10">1. Thông tin chung</h1>

            <div className="space-y-10">
              {/* 1. Loại đơn đăng ký */}
              <section className="bg-gray-50/50 p-8 rounded-2xl border border-gray-100">
                <h3 className="text-lg font-bold mb-2">Loại đơn đăng ký</h3>
                <p className="text-sm text-gray-400 mb-6 font-medium">Chọn loại đơn đăng ký bạn muốn nộp.</p>
                <div className="flex flex-col gap-4">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" name="appType" value="Sáng chế" 
                      checked={formData.appType === "Sáng chế"} 
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-500 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm font-bold text-gray-700">Đơn sáng chế</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" name="appType" value="Giải pháp hữu ích" 
                      checked={formData.appType === "Giải pháp hữu ích"} 
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-500 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm font-bold text-gray-700">Đơn giải pháp hữu ích</span>
                  </label>
                </div>
              </section>

              {/* 2. Tiêu đề sáng chế */}
              <section className="space-y-3">
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Tiêu đề sáng chế/Giải pháp hữu ích</h3>
                <textarea 
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Nhập tiêu đề của của sáng chế hoặc giải pháp hữu ích..."
                  className="w-full border border-gray-200 rounded-xl p-4 min-h-[120px] outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50/50 transition resize-none text-sm font-medium"
                />
              </section>

              {/* 3. Dạng giải pháp kỹ thuật */}
              <section className="space-y-3">
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Dạng giải pháp kỹ thuật</h3>
                <div className="flex gap-3">
                  <input 
                    name="solutionDetail"
                    value={formData.solutionDetail}
                    onChange={handleInputChange}
                    placeholder="VD: Dạng vật thể / Tên thiết bị cụ thể"
                    className="flex-grow border border-gray-200 rounded-xl p-3 outline-none focus:border-blue-400 transition text-sm font-medium shadow-sm"
                  />
                  <div className="relative min-w-[160px]">
                    <select 
                      name="solutionType"
                      value={formData.solutionType}
                      onChange={handleInputChange}
                      className="w-full border border-gray-200 rounded-xl p-3 outline-none appearance-none bg-white text-sm font-bold pr-10 cursor-pointer focus:border-blue-400 shadow-sm"
                    >
                      <option value="">Chọn dạng</option>
                      <option value="Sản phẩm">Sản phẩm</option>
                      <option value="Quy trình">Quy trình</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" size={16} />
                  </div>
                </div>
              </section>

              {/* 4. Lĩnh vực kỹ thuật */}
              <section className="space-y-3">
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Lĩnh vực kỹ thuật</h3>
                <div className="relative">
                  <select 
                    name="technicalField"
                    value={formData.technicalField}
                    onChange={handleInputChange}
                    className="w-full border border-gray-200 rounded-xl p-3 outline-none appearance-none bg-white text-sm font-medium pr-10 text-gray-500"
                  >
                    <option value="">Chọn lĩnh vực kỹ thuật...</option>
                    <option value="Y tế">Y tế</option>
                    <option value="Công nghệ thông tin">Công nghệ thông tin</option>
                    <option value="Cơ khí">Cơ khí</option>
                    <option value="Điện tử">Điện tử</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" size={16} />
                </div>
              </section>

              {/* 5. Mã phân loại IPC */}
              <section className="space-y-3">
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Mã phân loại IPC</h3>
                <div className="flex gap-3">
                  <input 
                    name="ipcCode"
                    value={formData.ipcCode}
                    onChange={handleInputChange}
                    placeholder="Nhập mã IPC..."
                    className="flex-grow border border-gray-200 rounded-xl p-3 outline-none focus:border-blue-400 transition text-sm font-medium"
                  />
                  <button type="button" className="bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-50 transition shadow-sm">
                    Tra cứu IPC
                  </button>
                </div>
              </section>

              {/* 6. Tóm tắt nội dung */}
              <section className="space-y-3">
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Tóm tắt</h3>
                <textarea 
                  name="summary"
                  value={formData.summary}
                  onChange={handleInputChange}
                  placeholder="Nhập tóm tắt sáng chế/giải pháp hữu ích..."
                  className="w-full border border-gray-200 rounded-xl p-4 min-h-[160px] outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50/50 transition resize-none text-sm font-medium"
                />
                <p className={`text-xs font-bold ${wordCount > 150 ? "text-red-500" : "text-gray-400"}`}>
                  {wordCount} từ (Tóm tắt phải có tối đa 150 từ. Hiện tại: {wordCount} từ.)
                </p>
              </section>

              {/* Nút điều hướng */}
              <div className="pt-10 flex justify-end">
                <button 
                  type="button"
                  onClick={() => navigate("/applicant/patent/step2")}
                  className="bg-blue-400 hover:bg-blue-500 text-white px-10 py-3 rounded-xl font-bold transition shadow-md active:scale-95"
                >
                  Tiếp theo
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      <footer className="h-14 border-t border-gray-100 flex items-center justify-center text-[10px] text-gray-400 font-medium">
        © 2025 IPMS Sáng Chế & Giải Pháp. All rights reserved.
      </footer>
    </div>
  );
};

export default Step1_GeneralInfo;