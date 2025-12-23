import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, ChevronDown, Plus, Trash2, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { useFilingData } from "./FilingContext";

const Step2_OwnerAuthor = () => {
  const navigate = useNavigate();
  const { formData, updateFormData } = useFilingData();

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const currentStep = 2;
  const steps = [
    { id: 1, label: "Thông tin chung" },
    { id: 2, label: "Chủ đơn & Tác giả" },
    { id: 3, label: "Tải lên tài liệu" },
    { id: 4, label: "Yêu cầu bảo hộ" },
    { id: 5, label: "Tính phí & Thanh toán" },
    { id: 6, label: "Nộp đơn" },
  ];

  // Logic: Sử dụng thông tin tài khoản đang đăng nhập
  const handleSyncAccount = (e) => {
    if (e.target.checked) {
      updateFormData({
        ownerName: "Trần Văn An",
        ownerEmail: "an.tran@example.com",
        ownerPhone: "+84912345678",
        ownerAddress: "Số 1, Đường ABC, Quận XYZ, TP. Hà Nội",
        ownerId: "012345678901",
        ownerDob: "1990-01-01"
      });
    }
  };

  // Logic: Thêm tác giả mới
  const addAuthor = () => {
    const newAuthor = { id: Date.now(), fullName: "", nationality: "Việt Nam", idNumber: "" };
    updateFormData({ authors: [...formData.authors, newAuthor] });
  };

  // Logic: Xóa tác giả
  const removeAuthor = (id) => {
    if (formData.authors.length > 1) {
      updateFormData({ authors: formData.authors.filter(a => a.id !== id) });
    }
  };

  // Cập nhật thông tin tác giả
  const updateAuthor = (id, field, value) => {
    const newAuthors = formData.authors.map(a => 
      a.id === id ? { ...a, [field]: value } : a
    );
    updateFormData({ authors: newAuthors });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-gray-800">
      {/* Header */}
      <header className="h-16 border-b border-gray-100 flex items-center justify-between px-8 bg-white sticky top-0 z-10">
        <button onClick={() => navigate("/applicant/patent")} className="flex items-center gap-2 text-gray-500 text-sm font-medium">
          <div className="w-6 h-6 border border-gray-300 rounded-full flex items-center justify-center"><X size={14} /></div>
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
        {/* Sidebar Tiến trình */}
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
                <span className={`text-sm font-bold ${currentStep === step.id ? "text-blue-600" : currentStep > step.id ? "text-green-600" : "text-gray-400"}`}>
                  {step.label}
                </span>
                {step.id !== 6 && <div className="absolute left-4 top-8 w-0.5 h-6 bg-gray-100"></div>}
              </div>
            ))}
          </div>
        </aside>

        {/* Nội dung chính Step 2 */}
        <main className="flex-grow p-12 overflow-y-auto bg-white">
          <div className="max-w-4xl mx-auto space-y-12">
            <h1 className="text-3xl font-bold">2. Chủ đơn & Tác giả</h1>

            {/* PHẦN 1: THÔNG TIN CHỦ ĐƠN */}
            <section className="p-8 rounded-2xl border border-gray-200 space-y-6 relative">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold">Thông tin Chủ đơn</h3>
                <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
                  <input type="checkbox" onChange={handleSyncAccount} className="rounded border-gray-300 text-blue-500" />
                  Sử dụng thông tin tài khoản đang đăng nhập
                </label>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">Loại chủ đơn <span className="text-red-500">*</span></label>
                  <div className="flex gap-6 mt-2">
                    <label className="flex items-center gap-2 text-sm font-bold"><input type="radio" checked readOnly className="text-blue-500" /> Cá nhân</label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <InputGroup label="Tên đầy đủ" name="ownerName" value={formData.ownerName} placeholder="Ví dụ: Nguyễn Văn A" required onChange={(e) => updateFormData({ownerName: e.target.value})} />
                  <InputGroup label="Ngày sinh" name="ownerDob" type="date" value={formData.ownerDob} required onChange={(e) => updateFormData({ownerDob: e.target.value})} />
                </div>

                <InputGroup label="CCCD" name="ownerId" value={formData.ownerId} placeholder="Ví dụ: 012345678901" required onChange={(e) => updateFormData({ownerId: e.target.value})} />
                
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase">Địa chỉ <span className="text-red-500">*</span></label>
                  <textarea 
                    value={formData.ownerAddress}
                    onChange={(e) => updateFormData({ownerAddress: e.target.value})}
                    placeholder="Ví dụ: Số 1, Đường ABC, Quận XYZ, TP. Hà Nội"
                    className="w-full border border-gray-200 rounded-xl p-3 min-h-[80px] text-sm font-medium outline-none focus:border-blue-400" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <InputGroup label="Điện thoại" name="ownerPhone" value={formData.ownerPhone} placeholder="Ví dụ: +84912345678" required onChange={(e) => updateFormData({ownerPhone: e.target.value})} />
                  <InputGroup label="Email" name="ownerEmail" value={formData.ownerEmail} placeholder="Ví dụ: contact@ipms.vn" required onChange={(e) => updateFormData({ownerEmail: e.target.value})} />
                </div>

                <InputGroup label="Mã số đại diện (Tuỳ chọn)" name="ownerRepCode" value={formData.ownerRepCode} placeholder="Ví dụ: DL001" onChange={(e) => updateFormData({ownerRepCode: e.target.value})} />
              </div>
            </section>

            {/* PHẦN 2: DANH SÁCH TÁC GIẢ */}
            <section className="p-8 rounded-2xl border border-gray-200 space-y-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold">Danh sách Tác giả sáng chế</h3>
                <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-500" />
                  Chủ đơn đồng thời là Tác giả duy nhất
                </label>
              </div>

              <div className="space-y-4">
                {formData.authors.map((author, index) => (
                  <div key={author.id} className="flex items-end gap-3 group">
                    <div className="flex-grow grid grid-cols-3 gap-3 bg-gray-50/50 p-4 rounded-xl border border-dashed border-gray-200">
                      <InputGroup label="Họ và tên" value={author.fullName} placeholder="Ví dụ: Trần Văn Dev" required onChange={(e) => updateAuthor(author.id, 'fullName', e.target.value)} />
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Quốc tịch</label>
                        <div className="relative">
                          <select value={author.nationality} onChange={(e) => updateAuthor(author.id, 'nationality', e.target.value)} className="w-full border border-gray-200 rounded-lg p-2 text-sm bg-white outline-none appearance-none">
                            <option>Việt Nam</option>
                            <option>Hoa Kỳ</option>
                          </select>
                          <ChevronDown className="absolute right-2 top-2.5 text-gray-400" size={14} />
                        </div>
                      </div>
                      <InputGroup label="CCCD" value={author.idNumber} placeholder="Ví dụ: 0123456789" required onChange={(e) => updateAuthor(author.id, 'idNumber', e.target.value)} />
                    </div>
                    {formData.authors.length > 1 && (
                      <button onClick={() => removeAuthor(author.id)} className="p-2 mb-2 text-gray-300 hover:text-red-500 transition"><Trash2 size={18} /></button>
                    )}
                  </div>
                ))}
                
                <button onClick={addAuthor} className="w-full py-3 border-2 border-dashed border-blue-100 rounded-xl text-blue-500 font-bold text-sm hover:bg-blue-50 transition flex items-center justify-center gap-2">
                  <Plus size={16} /> Thêm tác giả
                </button>
              </div>
            </section>

            {/* PHẦN 3: CƠ SỞ PHÁT SINH QUYỀN */}
            <section className="p-8 rounded-2xl border border-gray-200 space-y-6">
              <h3 className="text-lg font-bold">Cơ sở phát sinh quyền nộp đơn</h3>
              <div className="space-y-4">
                {["Tác giả đồng thời là người nộp đơn", "Thụ hưởng do thuê/giao việc (Sáng chế công vụ)", "Thụ hưởng theo Hợp đồng chuyển giao", "Thụ hưởng do Thừa kế"].map((option) => (
                  <label key={option} className="flex items-center gap-3 cursor-pointer p-1">
                    <input 
                      type="radio" 
                      name="filingBasis" 
                      checked={formData.filingBasis === option}
                      onChange={() => updateFormData({ filingBasis: option })}
                      className="w-4 h-4 text-blue-500 border-gray-300" 
                    />
                    <span className="text-sm font-medium text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </section>

            {/* Nút điều hướng cuối trang */}
            <div className="flex justify-end gap-4 pt-8">
              <button onClick={() => navigate("/applicant/patent/step1")} className="flex items-center gap-2 px-8 py-3 border border-gray-200 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition shadow-sm">
                <ChevronLeft size={18} /> Quay lại
              </button>
              <button onClick={() => navigate("/applicant/patent/step3")} className="flex items-center gap-2 px-8 py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition shadow-md">
                Tiếp theo <ChevronRight size={18} />
              </button>
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

// Helper Component
const InputGroup = ({ label, required, ...props }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-bold text-gray-400 uppercase">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input 
      className="w-full border border-gray-200 rounded-lg p-2.5 text-sm font-medium outline-none focus:border-blue-400 transition" 
      {...props} 
    />
  </div>
);

export default Step2_OwnerAuthor;