import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  X, CheckCircle2, ChevronLeft, ChevronRight, 
  Upload, FileText, Trash2
} from "lucide-react";
import { useFilingData } from "./FilingContext";
import { PDFDocument } from 'pdf-lib';

// 1. Thêm prop isRevision
const Step3_Attachments = ({ isRevision = false }) => {
  const navigate = useNavigate();
  
  const context = useFilingData();
  const { formData, updateFormData, clearFormData } = context || { 
    formData: { attachments: [], claims: [] }, 
    updateFormData: () => {}, 
    clearFormData: () => {} 
  };

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const currentStep = 3;
  const steps = [
    { id: 1, label: "Thông tin chung" },
    { id: 2, label: "Chủ đơn & Tác giả" },
    { id: 3, label: "Tải lên tài liệu" },
    { id: 4, label: "Yêu cầu bảo hộ" },
    { id: 5, label: "Xác nhận đơn" },
    { id: 6, label: "Tính phí & Thanh toán" },
  ];

  const handleFileChange = async (e, category, docType) => {
    const file = e.target.files[0];
    if (!file) return;
    let pageCount = 0;
    if (docType === "BAN_MO_TA" && file.type === "application/pdf") {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        pageCount = pdfDoc.getPageCount();
      } catch (error) {
        console.error("Không thể đọc số trang PDF:", error);
      }
    }
    const newAttachment = {
      id: crypto.randomUUID(),
      category: category,
      docType: docType,
      fileName: file.name,
      fileSize: file.size,
      extension: file.name.split('.').pop().toLowerCase(),
      file: file, 
      status: "HOAN_TAT"
    };
    const updatedAttachments = (formData?.attachments || []).filter(a => a.docType !== docType);
    const updatePayload = { attachments: [...updatedAttachments, newAttachment] };
    if (pageCount > 0) updatePayload.totalPages = pageCount;
    updateFormData(updatePayload);
  };

  const removeFile = (docType) => {
    const filtered = formData.attachments.filter(a => a.docType !== docType);
    const updatePayload = { attachments: filtered };
    if (docType === "BAN_MO_TA") updatePayload.totalPages = 0;
    updateFormData(updatePayload);
  };

  const getFileByDocType = (docType) => {
    return formData?.attachments?.find(a => a.docType === docType) || null;
  };

  const formatBytes = (bytes, decimals = 2) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  // ===========================================================================
  // 2. TÁCH BIẾN FORM_CONTENT (Giữ nguyên 100% UI của bạn)
  // ===========================================================================
  const FormContent = (
    <div className={`${isRevision ? "" : "max-w-5xl mx-auto"} space-y-10 text-left`}>
      {!isRevision && <h1 className="text-3xl font-bold italic">3. Tải lên tài liệu</h1>}

      <section className="space-y-4">
        <h3 className="text-lg font-bold text-gray-700">Nhóm tài liệu hành chính</h3>
        <FileSlot 
          label="Tờ khai đăng ký sáng chế/GPHU" 
          required 
          category="HO_SO_PHAP_LY" 
          docType="TO_KHAI"
          fileData={getFileByDocType("TO_KHAI")}
          onFileSelect={handleFileChange}
          onRemove={removeFile}
          updateFormData={updateFormData} 
        />
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-bold text-gray-700">Nhóm tài liệu kỹ thuật</h3>
        <div className="grid gap-4">
          <FileSlot 
            label="Bản mô tả (Description)" 
            required 
            category="TAI_LIEU_KY_THUAT" 
            docType="BAN_MO_TA"
            fileData={getFileByDocType("BAN_MO_TA")}
            totalPages={formData.totalPages}
            onFileSelect={handleFileChange}
            onRemove={removeFile}
            updateFormData={updateFormData} 
          />
          <FileSlot label="Yêu cầu bảo hộ (Claims)" required category="TAI_LIEU_KY_THUAT" docType="YEU_CAU_BAO_HO" fileData={getFileByDocType("YEU_CAU_BAO_HO")} onFileSelect={handleFileChange} onRemove={removeFile} updateFormData={updateFormData} />
          <FileSlot label="Hình vẽ/Sơ đồ (Drawings)" optional category="TAI_LIEU_KY_THUAT" docType="HINH_VE" fileData={getFileByDocType("HINH_VE")} onFileSelect={handleFileChange} onRemove={removeFile} updateFormData={updateFormData} />
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-bold text-gray-700">Danh sách tệp đã chọn ({formData.attachments?.length || 0})</h3>
        <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-400 text-[10px] font-bold uppercase">
              <tr>
                <th className="px-6 py-4">Tên tệp</th>
                <th className="px-6 py-4">Loại tài liệu</th>
                <th className="px-6 py-4">Kích thước</th>
                <th className="px-6 py-4">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(!formData.attachments || formData.attachments.length === 0) ? (
                <tr><td colSpan="4" className="px-6 py-10 text-center text-gray-400 italic">Chưa có tệp nào được tải lên</td></tr>
              ) : (
                formData.attachments.map((file) => (
                  <tr key={file.id} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4 flex items-center gap-2 font-medium">
                      <FileText size={16} className="text-blue-500" /> {file.fileName}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">{file.docType}</td>
                    <td className="px-6 py-4 text-gray-500 text-xs">{formatBytes(file.fileSize)}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => removeFile(file.docType)} className="text-red-400 hover:text-red-600 transition"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {!isRevision && (
        <div className="flex justify-end gap-4 pt-10">
          <button onClick={() => navigate("/applicant/patent/step2")} className="flex items-center gap-2 px-8 py-3 border border-gray-200 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition shadow-sm"><ChevronLeft size={18} /> Quay lại</button>
          <button onClick={() => navigate("/applicant/patent/step4")} disabled={(formData.attachments?.length || 0) < 3} className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition shadow-md text-white ${(formData.attachments?.length || 0) >= 3 ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-300 cursor-not-allowed"}`}>Tiếp theo <ChevronRight size={18} /></button>
        </div>
      )}
    </div>
  );

  // ===========================================================================
  // 3. RENDER LOGIC
  // ===========================================================================
  if (isRevision) {
    return (
      <div className="bg-white p-0 animate-in fade-in duration-500">
        <div className="mb-6 border-b pb-4 text-left">
          <h2 className="text-xl font-bold text-slate-800">3. Tải lên tài liệu</h2>
        </div>
        {FormContent}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-gray-800">
      <header className="h-16 border-b border-gray-100 flex items-center justify-between px-8 bg-white sticky top-0 z-10">
        <button onClick={() => { if (window.confirm("Hệ thống sẽ xóa...")) { clearFormData(); navigate("/applicant/patent"); } }} className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition text-sm font-medium">
          <div className="w-6 h-6 border border-gray-300 rounded-full flex items-center justify-center"><X size={14} /></div> Hủy bỏ
        </button>
        {/* ... user info ... */}
      </header>
      <div className="flex flex-grow overflow-hidden">
        <aside className="w-72 border-r border-gray-100 p-8 shrink-0 bg-gray-50/30 text-left">
           <h2 className="text-lg font-bold mb-8 text-gray-700">Tiến trình nộp đơn</h2>
           {/* ... steps mapping ... */}
        </aside>
        <main className="flex-grow p-12 overflow-y-auto bg-white">
          {FormContent}
        </main>
      </div>
    </div>
  );
};

// Component Helper FileSlot (Giữ nguyên)
const FileSlot = ({ label, required, docType, fileData, onFileSelect, onRemove, totalPages, updateFormData, category }) => {
  const inputRef = useRef(null);
  return (
    <div className={`p-6 border rounded-2xl bg-white transition ${fileData ? 'border-green-200 bg-green-50/5' : 'border-gray-100 hover:border-blue-200'}`}>
      <div className="flex items-center justify-between">
        <div className="flex-grow text-left">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm">{label}</span>
            {required && <span className="bg-red-50 text-red-500 text-[10px] px-2 py-0.5 rounded font-bold uppercase">Bắt buộc</span>}
          </div>
          {fileData ? (
            <div className="mt-3 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-green-600">
                <CheckCircle2 size={14} /> <span>Đã tải lên: {fileData.fileName}</span>
              </div>
              {docType === "BAN_MO_TA" && (
                <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-100 rounded-xl max-w-xs">
                  <input type="number" min="1" value={totalPages || ""} onChange={(e) => updateFormData({ totalPages: parseInt(e.target.value) || 0 })} className="w-20 p-1.5 border border-amber-200 rounded-lg text-sm font-black text-blue-600 outline-none" />
                  <span className="text-[10px] text-amber-600 font-medium italic">(Hệ thống đếm: {totalPages || 0} trang)</span>
                </div>
              )}
            </div>
          ) : <p className="text-[11px] text-gray-400 mt-1 italic text-left">Chưa có tệp</p>}
        </div>
        <div className="flex items-center gap-3">
          {fileData && <button onClick={() => onRemove(docType)} className="p-2 text-gray-300 hover:text-red-500"><Trash2 size={18} /></button>}
          <input type="file" ref={inputRef} className="hidden" onChange={(e) => onFileSelect(e, category, docType)} accept=".pdf" />
          <button onClick={() => inputRef.current.click()} className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 ${fileData ? "border text-gray-500" : "bg-blue-50 text-blue-600"}`}><Upload size={14} /> {fileData ? "Thay đổi" : "Chọn tệp PDF"}</button>
        </div>
      </div>
    </div>
  );
};

export default Step3_Attachments;