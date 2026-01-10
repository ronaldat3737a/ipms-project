import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  X, CheckCircle2, ChevronLeft, ChevronRight, 
} from "lucide-react";
import { useFilingData } from "./FilingContext";

const Step4_DescriptionAndClaims = ({ isRevision = false }) => {
  const navigate = useNavigate();
  const { formData, updateFormData, clearFormData } = useFilingData();

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const currentStep = 4;
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

  const FormFields = (
    <div className={`space-y-8 ${isRevision ? "" : "max-w-4xl mx-auto"}`}>
      {!isRevision && <h1 className="text-3xl font-bold italic text-left">4. Mô tả & Yêu cầu bảo hộ</h1>}

      <section className="space-y-3 text-left">
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
            Phần mô tả chi tiết kiểu dáng
          </h3>
          <p className="text-xs text-gray-500 italic">Mô tả đầy đủ các đặc điểm tạo dáng của kiểu dáng công nghiệp, nêu rõ các đặc điểm mới, khác biệt so với các kiểu dáng công nghiệp tương tự đã biết.</p>
          <textarea
            name="descriptionDetail"
            value={formData?.descriptionDetail || ""}
            onChange={handleInputChange}
            placeholder="Mô tả chi tiết tại đây..."
            className="w-full border border-gray-200 rounded-xl p-4 min-h-[250px] outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50/50 transition resize-none text-sm font-medium"
          />
        </section>

        <section className="space-y-3 text-left">
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
            Yêu cầu bảo hộ kiểu dáng công nghiệp
          </h3>
           <p className="text-xs text-gray-500 italic">Liệt kê các đặc điểm tạo dáng cần được bảo hộ, phạm vi bảo hộ.</p>
          <textarea
            name="claims"
            value={formData?.claims || ""}
            onChange={handleInputChange}
            placeholder="Yêu cầu bảo hộ toàn bộ kiểu dáng công nghiệp như trong bộ ảnh chụp và bản mô tả..."
            className="w-full border border-gray-200 rounded-xl p-4 min-h-[150px] outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50/50 transition resize-none text-sm font-medium"
          />
        </section>

      {!isRevision && (
        <div className="flex justify-end gap-4 pt-10">
          <button onClick={() => navigate('/applicant/design/filing/step3')} className="flex items-center gap-2 px-8 py-3 border border-gray-200 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition shadow-sm">
            <ChevronLeft size={18} /> Quay lại
          </button>
          <button 
            onClick={() => navigate('/applicant/design/filing/step5')} 
            className="flex items-center gap-2 px-8 py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition shadow-md"
          >
            Tiếp theo <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );

  if (isRevision) {
    return (
      <div className="bg-white p-0 animate-in fade-in duration-500">
        <div className="mb-6 border-b pb-4 text-left">
          <h2 className="text-xl font-bold text-slate-800">4. Mô tả & Yêu cầu bảo hộ</h2>
        </div>
        {FormFields}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-gray-800">
      <header className="h-16 border-b border-gray-100 flex items-center justify-between px-8 bg-white sticky top-0 z-10">
        <button 
          onClick={() => {
            if (window.confirm("Hủy và xóa dữ liệu đang soạn?")) {
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
            <p className="text-[10px] text-gray-400 font-medium">{currentUser.email || ""}</p>
          </div>
          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.fullName || 'Felix'}`} alt="Avatar" className="w-8 h-8 rounded-full border" />
        </div>
      </header>

      <div className="flex flex-grow overflow-hidden">
        <aside className="w-72 border-r border-gray-100 p-8 shrink-0 bg-gray-50/30 text-left">
          <h2 className="text-lg font-bold mb-8 text-gray-700">Tiến trình nộp đơn</h2>
          <div className="space-y-6">
            {steps.map((step) => (
              <div key={step.id} className="flex items-center gap-4 relative">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all z-10 
                  ${currentStep === step.id ? "bg-blue-500 border-blue-500 text-white shadow-md" : 
                    currentStep > step.id ? "bg-green-500 border-green-500 text-white" : "bg-white border-gray-200 text-gray-400"}`}>
                  {currentStep > step.id ? <CheckCircle2 size={16} /> : step.id}
                </div>
                <span className={`text-sm font-bold ${currentStep === step.id ? "text-blue-600" : currentStep > step.id ? "text-green-600" : "text-gray-400"}`}>
                  {step.label}
                </span>
                {step.id !== steps.length && <div className="absolute left-4 top-8 w-0.5 h-6 bg-gray-100"></div>}
              </div>
            ))}
          </div>
        </aside>

        <main className="flex-grow p-12 overflow-y-auto bg-white">
          {FormFields}
        </main>
      </div>
    </div>
  );
};

export default Step4_DescriptionAndClaims;