import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  X, CheckCircle2, ChevronLeft, ChevronRight, 
  Upload, FileText, Trash2, AlertCircle, Eye, Download, Search 
} from "lucide-react";
import { useFilingData } from "./FilingContext";

const Step3_Attachments = () => {
  const navigate = useNavigate();
  const { formData, updateFormData } = useFilingData();

  const currentStep = 3;
  const steps = [
    { id: 1, label: "Thông tin chung" },
    { id: 2, label: "Chủ đơn & Tác giả" },
    { id: 3, label: "Tải lên tài liệu" },
    { id: 4, label: "Yêu cầu bảo hộ" },
    { id: 5, label: "Tính phí & Thanh toán" },
    { id: 6, label: "Nộp đơn" },
  ];

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
            <p className="text-xs font-bold text-gray-800">Trần Văn An</p>
            <p className="text-[10px] text-gray-400 font-medium">an.tran@example.com</p>
          </div>
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" className="w-8 h-8 rounded-full border" />
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

        {/* Nội dung chính Step 3 */}
        <main className="flex-grow p-12 overflow-y-auto bg-white">
          <div className="max-w-5xl mx-auto space-y-10">
            <h1 className="text-3xl font-bold italic">3. Tải lên tài liệu</h1>

            {/* PHẦN 1: TÀI LIỆU HÀNH CHÍNH */}
            <section className="space-y-4">
              <h3 className="text-lg font-bold text-gray-700">Nhóm tài liệu hành chính</h3>
              <div className="p-6 border border-gray-100 rounded-2xl bg-white shadow-sm flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm">Tờ khai đăng ký sáng chế/GPHU</span>
                    <span className="bg-red-50 text-red-500 text-[10px] px-2 py-0.5 rounded font-bold uppercase">Bắt buộc</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Mẫu số 01 - Nghị định 65/2023/NĐ-CP</p>
                  <p className="text-xs text-gray-400">Chấp nhận: .doc, .docx, .pdf</p>
                </div>
                <button className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold hover:bg-gray-50 transition">Chọn tệp</button>
              </div>
            </section>

            {/* PHẦN 2: TÀI LIỆU KỸ THUẬT */}
            <section className="space-y-4">
              <h3 className="text-lg font-bold text-gray-700">Nhóm tài liệu kỹ thuật</h3>
              <div className="grid gap-4">
                {/* File Bản mô tả - Trạng thái Phân tích */}
                <FileSlot 
                  label="Bản mô tả (Description)" required fileName="Bản mô tả giải pháp.docx"
                  tags={["Tên sáng chế: Máy pha cà phê thông minh", "Điểm yêu cầu bảo hộ: 7", "Tóm tắt (từ): 210"]}
                />

                {/* File Yêu cầu bảo hộ - Trạng thái Lỗi */}
                <div className="space-y-2">
                  <FileSlot 
                    label="Yêu cầu bảo hộ (Claims)" required fileName="Yeu cau bao ho.pdf"
                    error="Có lỗi xảy ra khi phân tích tệp. Vui lòng thử lại hoặc tải tệp khác."
                  />
                </div>

                <FileSlot label="Hình vẽ/Sơ đồ (Images/Drawings)" optional fileName="So do nguyen ly.png" />
                <FileSlot 
                  label="Bản tóm tắt (Summary)" optional fileName="Tom tat sang che.pdf"
                  tags={["Tên sáng chế: Hệ thống điều khiển gia đình", "Điểm yêu cầu bảo hộ: 0", "Tóm tắt (từ): 120"]}
                />
              </div>
            </section>

            {/* PHẦN 3: DANH SÁCH TỔNG HỢP */}
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-700">Danh sách tệp đã tải lên</h3>
                <div className="flex gap-3">
                  <select className="border border-gray-200 rounded-lg p-2 text-xs font-medium outline-none">
                    <option>Tất cả loại</option>
                  </select>
                  <select className="border border-gray-200 rounded-lg p-2 text-xs font-medium outline-none">
                    <option>Tất cả trạng thái</option>
                  </select>
                </div>
              </div>
              
              <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100 text-gray-400 text-[10px] font-bold uppercase">
                    <tr>
                      <th className="px-6 py-4">Tên tệp</th>
                      <th className="px-6 py-4">Loại</th>
                      <th className="px-6 py-4">Kích thước</th>
                      <th className="px-6 py-4">Trạng thái</th>
                      <th className="px-6 py-4 text-center">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {formData.attachments.map((file) => (
                      <tr key={file.id} className="hover:bg-gray-50/50 transition">
                        <td className="px-6 py-4 flex items-center gap-2 font-medium">
                          <FileText size={16} className="text-gray-400" /> {file.name}
                        </td>
                        <td className="px-6 py-4 text-gray-500 text-xs">{file.type}</td>
                        <td className="px-6 py-4 text-gray-500 text-xs">{file.size}</td>
                        <td className="px-6 py-4">
                          <StatusBadge status={file.status} />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center gap-3 text-gray-400">
                            <Eye size={16} className="cursor-pointer hover:text-blue-500" />
                            <Download size={16} className="cursor-pointer hover:text-green-500" />
                            <Trash2 size={16} className="cursor-pointer hover:text-red-500" />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Điều hướng */}
            <div className="flex justify-end gap-4 pt-10">
              <button onClick={() => navigate("/applicant/patent/step2")} className="flex items-center gap-2 px-8 py-3 border border-gray-200 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition shadow-sm">
                <ChevronLeft size={18} /> Quay lại
              </button>
              <button onClick={() => navigate("/applicant/patent/step4")} className="flex items-center gap-2 px-8 py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition shadow-md">
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

// Helper Components
const FileSlot = ({ label, required, optional, fileName, tags, error }) => (
  <div className={`p-6 border rounded-2xl bg-white transition ${error ? 'border-red-200 bg-red-50/10' : 'border-gray-100'}`}>
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <span className="font-bold text-sm">{label}</span>
        {required && <span className="bg-red-50 text-red-500 text-[10px] px-2 py-0.5 rounded font-bold uppercase">Bắt buộc</span>}
        {optional && <span className="bg-gray-100 text-gray-500 text-[10px] px-2 py-0.5 rounded font-bold uppercase">Tùy chọn</span>}
      </div>
      <Trash2 size={18} className="text-gray-300 cursor-pointer hover:text-red-500" />
    </div>
    
    <div className="space-y-3">
      <p className="text-xs font-medium text-gray-600 flex items-center gap-2">
        Tệp đã tải lên: <span className="text-gray-800">{fileName}</span>
      </p>
      
      {tags && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <span key={i} className="px-3 py-1 bg-blue-50 text-blue-500 rounded-full text-[10px] font-bold border border-blue-100">{tag}</span>
          ))}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-3 bg-white border border-red-100 rounded-xl text-red-500 text-xs font-medium">
          <AlertCircle size={14} /> {error}
        </div>
      )}
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    "Hoàn tất": "bg-green-100 text-green-600",
    "Phân tích": "bg-blue-100 text-blue-600",
    "Lỗi": "bg-red-100 text-red-600",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${styles[status]}`}>
      {status}
    </span>
  );
};

export default Step3_Attachments;