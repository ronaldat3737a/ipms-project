import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  X, CheckCircle2, ChevronLeft, ChevronRight, 
  Plus, ChevronDown, AlertCircle
} from "lucide-react";
import { useFilingData } from "./FilingContext";

// 1. Thêm prop isRevision
const Step4_Claims = ({ isRevision = false }) => {
  const navigate = useNavigate();
  const { type } = useParams(); // Get type from URL
  
  const { formData, updateFormData, clearFormData } = useFilingData() || {
    formData: { claims: [] },
    updateFormData: () => {},
    clearFormData: () => {}
  };

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const currentStep = 4;
  const steps = [
    { id: 1, label: "Thông tin chung" },
    { id: 2, label: "Chủ đơn & Tác giả" },
    { id: 3, label: "Tải lên tài liệu" },
    { id: 4, label: "Yêu cầu bảo hộ" },
    { id: 5, label: "Xác nhận đơn" },
    { id: 6, label: "Tính phí & Thanh toán" },
  ];

  const addClaim = () => {
    const claims = formData?.claims || [];
    const newId = claims.length > 0 ? Math.max(...claims.map(c => c.id)) + 1 : 1;
    const newClaim = { 
      id: newId, 
      type: "Độc lập", 
      content: "", 
      status: "Hợp lệ", 
      referenceId: null 
    };
    updateFormData({ claims: [...claims, newClaim] });
  };

  const removeClaim = (id) => {
    const updated = (formData?.claims || []).filter(c => c.id !== id);
    updateFormData({ claims: updated });
  };

  const updateClaim = (id, field, value) => {
    const updated = (formData?.claims || []).map(c => 
      c.id === id ? { ...c, [field]: value } : c
    );
    updateFormData({ claims: updated });
  };

  // ===========================================================================
  // 2. KHỐI NỘI DUNG FORM (FormFields)
  // ===========================================================================
  const FormFields = (
    <div className={`space-y-8 ${isRevision ? "" : "max-w-4xl mx-auto"}`}>
      {/* Chỉ hiện tiêu đề khi nộp đơn mới */}
      {!isRevision && <h1 className="text-3xl font-bold italic text-left">4. Yêu cầu bảo hộ</h1>}

      <div className="flex justify-start">
        <button 
          onClick={addClaim}
          className="px-6 py-2.5 bg-blue-500 text-white rounded-lg font-bold text-sm hover:bg-blue-600 transition shadow-sm mb-4"
        >
          Thêm điểm mới
        </button>
      </div>

      <div className="space-y-6">
        {(formData?.claims || []).map((claim, index) => (
          <div key={claim.id} className={`p-8 border rounded-2xl relative transition text-left ${claim.status === "Cần chỉnh sửa" ? "border-red-100 bg-red-50/5" : "border-gray-100 shadow-sm"}`}>
            <div className="flex items-start gap-10">
              <span className="text-lg font-black text-gray-800">{index + 1}.</span>
              
              <div className="flex-grow space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Loại điểm</label>
                  <div className="relative w-48">
                    <select 
                      value={claim.type}
                      onChange={(e) => updateClaim(claim.id, 'type', e.target.value)}
                      className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-white outline-none appearance-none font-medium"
                    >
                      <option value="Độc lập">Độc lập</option>
                      <option value="Phụ thuộc">Phụ thuộc</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-3 text-gray-400" size={16} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-tight">Nội dung</label>
                  <textarea 
                    value={claim.content}
                    onChange={(e) => updateClaim(claim.id, 'content', e.target.value)}
                    placeholder="Nhập nội dung yêu cầu bảo hộ..."
                    className="w-full border border-gray-200 rounded-xl p-4 min-h-[140px] text-sm font-medium outline-none focus:border-blue-400 transition resize-none"
                  />
                </div>

                {claim.type === "Phụ thuộc" && (
                  <div className="space-y-4">
                    {claim.error && (
                      <p className="text-xs font-bold text-red-500 flex items-center gap-2">
                        <AlertCircle size={14} /> {claim.error}
                      </p>
                    )}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase">Tham chiếu điểm</label>
                      <div className="relative">
                        <select 
                          value={claim.referenceId || ""}
                          onChange={(e) => updateClaim(claim.id, 'referenceId', e.target.value)}
                          className="w-full border border-gray-200 rounded-lg p-3 text-sm bg-white outline-none appearance-none font-medium text-gray-600"
                        >
                          <option value="">Chọn điểm tham chiếu...</option>
                          {(formData?.claims || [])
                            .filter(c => c.id !== claim.id)
                            .map(c => (
                              <option key={c.id} value={c.id}>
                                Điểm {(formData?.claims || []).findIndex(f => f.id === c.id) + 1}: {c.content?.substring(0, 50)}...
                              </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-3.5 text-gray-400" size={16} />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase ${claim.status === "Hợp lệ" ? "bg-green-50 text-green-600 border border-green-100" : "bg-red-50 text-red-600 border border-red-100"}`}>
                    {claim.status}
                  </span>
                  <button 
                    onClick={() => removeClaim(claim.id)}
                    className="text-gray-300 hover:text-red-500 transition p-2"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 font-medium text-left">
        Tổng số điểm: <span className="text-gray-800 font-bold">{formData?.claims?.length || 0}</span>. (Phí sẽ được tính dựa trên số lượng điểm này tại Bước 5.)
      </p>

      {/* Ẩn nút điều hướng khi đang sửa đơn */}
      {!isRevision && (
        <div className="flex justify-end gap-4 pt-10">
          <button onClick={() => navigate(`/applicant/applications/${type}/filing/step3`)} className="flex items-center gap-2 px-8 py-3 border border-gray-200 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition shadow-sm">
            <ChevronLeft size={18} /> Quay lại
          </button>
          <button 
            onClick={() => navigate(`/applicant/applications/${type}/filing/step5`)} 
            className="flex items-center gap-2 px-8 py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition shadow-md"
          >
            Tiếp theo <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );

  // ===========================================================================
  // 3. LOGIC RENDER LINH HOẠT
  // ===========================================================================
  if (isRevision) {
    return (
      <div className="bg-white p-0 animate-in fade-in duration-500">
        <div className="mb-6 border-b pb-4 text-left">
          <h2 className="text-xl font-bold text-slate-800">4. Yêu cầu bảo hộ</h2>
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
            if (window.confirm("Hệ thống sẽ xóa toàn bộ dữ liệu... Bạn có chắc chắn muốn hủy bỏ không?")) {
              clearFormData();
              navigate(`/applicant/applications/${type}`);
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
                {step.id !== 6 && <div className="absolute left-4 top-8 w-0.5 h-6 bg-gray-100"></div>}
              </div>
            ))}
          </div>
        </aside>

        <main className="flex-grow p-12 overflow-y-auto bg-white">
          {FormFields}
        </main>
      </div>
      <footer className="h-14 border-t border-gray-100 flex items-center justify-center text-[10px] text-gray-400 font-medium">
        © 2025 IPMS Sáng Chế & Giải Pháp. All rights reserved.
      </footer>
    </div>
  );
};

export default Step4_Claims;