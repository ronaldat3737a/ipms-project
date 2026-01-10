import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { useFilingData } from "./FilingContext"; 

const Step1_GeneralInfo = ({ isRevision = false }) => {
  const navigate = useNavigate();
  const { formData, updateFormData, clearFormData } = useFilingData();

  useEffect(() => {
    if (!isRevision && formData.appType !== 'KIEU_DANG_CN') {
      updateFormData({ appType: 'KIEU_DANG_CN' });
    }
  }, [isRevision, updateFormData, formData.appType]);

  const currentStep = 1;
  const steps = [
    { id: 1, label: "Thông tin chung" },
    { id: 2, label: "Chủ đơn & Tác giả" },
    { id: 3, label: "Tải lên tài liệu" },
    { id: 4, label: "Mô tả & Yêu cầu" },
    { id: 5, label: "Xác nhận & Nộp đơn" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const FormContent = (
    <div className={`${isRevision ? "" : "max-w-4xl"}`}>
      {!isRevision && <h1 className="text-3xl font-bold mb-10">1. Thông tin chung về KDCN</h1>}

      <div className="space-y-10">
        {/* 1. Loại đơn đăng ký - Cố định */}
        <section className="bg-gray-50/50 p-8 rounded-2xl border border-gray-100">
          <h3 className="text-lg font-bold mb-2 text-left">Loại đơn đăng ký</h3>
          <div className="flex flex-col gap-4 mt-4">
            <label className="flex items-center gap-3 group cursor-not-allowed">
              <input
                type="radio"
                name="appType"
                value="KIEU_DANG_CN"
                checked={true}
                readOnly
                className="w-4 h-4 text-blue-500 border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm font-bold text-gray-700">Đơn đăng ký Kiểu dáng công nghiệp</span>
            </label>
          </div>
        </section>

        {/* 2. Tên Kiểu dáng công nghiệp */}
        <section className="space-y-3 text-left">
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
            Tên Kiểu dáng công nghiệp
          </h3>
          <textarea
            name="title"
            value={formData?.title || ""}
            onChange={handleInputChange}
            placeholder="Ví dụ: Chai đựng nước hoa, Bàn ăn, Giao diện ứng dụng..."
            className="w-full border border-gray-200 rounded-xl p-4 min-h-[100px] outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50/50 transition resize-none text-sm font-medium"
          />
        </section>

        {/* 3. Lĩnh vực sử dụng */}
        <section className="space-y-3 text-left">
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
            Lĩnh vực sử dụng
          </h3>
          <input
              name="usageField"
              value={formData?.usageField || ""}
              onChange={handleInputChange}
              placeholder="VD: Dùng trong ngành mỹ phẩm, nội thất, ứng dụng di động..."
              className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-blue-400 transition text-sm font-medium shadow-sm"
          />
        </section>

        {/* 4. Mã phân loại Locarno */}
        <section className="space-y-3 text-left">
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
            Mã phân loại Locarno
          </h3>
          <div className="flex gap-3">
            <input
              name="locarnoCodes"
              value={formData?.locarnoCodes || ""}
              onChange={handleInputChange}
              placeholder="Nhập các mã, phân tách bằng dấu phẩy. VD: 09-01, 28-03"
              className="flex-grow border border-gray-200 rounded-xl p-3 outline-none focus:border-blue-400 transition text-sm font-medium"
            />
            <button type="button" className="bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-50 transition shadow-sm">
              Tra cứu Locarno
            </button>
          </div>
        </section>

        {/* 5. Kiểu dáng tương tự */}
         <section className="space-y-3 text-left">
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
            Kiểu dáng tương tự gần nhất (nếu có)
          </h3>
          <input
              name="similarDesign"
              value={formData?.similarDesign || ""}
              onChange={handleInputChange}
              placeholder="Nêu rõ một kiểu dáng công nghiệp tương tự gần nhất mà bạn biết..."
              className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-blue-400 transition text-sm font-medium shadow-sm"
          />
        </section>
        
        {!isRevision && (
          <div className="pt-10 flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/applicant/design/filing/step2')}
              className="bg-blue-400 hover:bg-blue-500 text-white px-10 py-3 rounded-xl font-bold transition shadow-md active:scale-95"
            >
              Tiếp theo
            </button>
          </div>
        )}
      </div>
    </div>
  );

  if (isRevision) {
    return <div className="w-full animate-in fade-in duration-500">{FormContent}</div>;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-gray-800">
      <header className="h-16 border-b border-gray-100 flex items-center justify-between px-8 bg-white sticky top-0 z-10">
        <button
          onClick={() => {
            const isConfirm = window.confirm("Hủy và xóa toàn bộ dữ liệu đơn đang soạn?");
            if (isConfirm) {
              clearFormData();
              navigate('/applicant/design/list');
            }
          }}
          className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition text-sm font-medium"
        >
          <div className="w-6 h-6 border border-gray-300 rounded-full flex items-center justify-center"><X size={14} /></div>
          Hủy bỏ
        </button>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs font-bold text-gray-800">{currentUser.fullName || "Người dùng"}</p>
            <p className="text-[10px] text-gray-400 font-medium">{currentUser.email || "Chưa cập nhật email"}</p>
          </div>
          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.fullName || "Felix"}`} alt="Avatar" className="w-8 h-8 rounded-full border" />
        </div>
      </header>

      <div className="flex flex-grow overflow-hidden">
        <aside className="w-72 border-r border-gray-100 p-8 shrink-0 bg-gray-50/30 text-left">
          <h2 className="text-lg font-bold mb-8 text-gray-700">Tiến trình nộp đơn</h2>
          <div className="space-y-6">
            {steps.map((step) => (
              <div key={step.id} className="flex items-center gap-4 relative">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all z-10 ${currentStep === step.id ? "bg-blue-500 border-blue-500 text-white" : "bg-white border-gray-200 text-gray-400"}`}>
                  {step.id}
                </div>
                <span className={`text-sm font-bold transition-all ${currentStep === step.id ? "text-blue-600" : "text-gray-400"}`}>
                  {step.label}
                </span>
                {step.id !== steps.length && <div className="absolute left-4 top-8 w-0.5 h-6 bg-gray-100 -z-0"></div>}
              </div>
            ))}
          </div>
        </aside>

        <main className="flex-grow p-12 overflow-y-auto bg-white">
          {FormContent}
        </main>
      </div>
    </div>
  );
};

export default Step1_GeneralInfo;