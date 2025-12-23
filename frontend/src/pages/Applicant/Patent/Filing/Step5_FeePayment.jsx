import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  X, CheckCircle2, ChevronLeft, ChevronRight, 
  Coins, Copy, UploadCloud, FileText, Check
} from "lucide-react";
import { useFilingData } from "./FilingContext";

const Step5_FeePayment = () => {
  const navigate = useNavigate();
  const { formData, updateFormData } = useFilingData();
  const [copied, setCopied] = useState(false);

  const currentStep = 5;
  const steps = [
    { id: 1, label: "Thông tin chung" },
    { id: 2, label: "Chủ đơn & Tác giả" },
    { id: 3, label: "Tải lên tài liệu" },
    { id: 4, label: "Yêu cầu bảo hộ" },
    { id: 5, label: "Tính phí & Thanh toán" },
    { id: 6, label: "Nộp đơn" },
  ];

  // Logic sao chép nội dung chuyển khoản
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            <p className="text-xs font-bold text-gray-800">Trần Văn An</p>
            <p className="text-[10px] text-gray-400 font-medium">an.tran@example.com</p>
          </div>
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" className="w-8 h-8 rounded-full border" />
        </div>
      </header>

      <div className="flex flex-grow overflow-hidden">
        {/* Sidebar Tiến trình - Các bước 1-4 đã xong (Xanh lá) */}
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

        {/* Nội dung chính Step 5 */}
        <main className="flex-grow p-12 overflow-y-auto bg-white">
          <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold">5. Tính phí & Thanh toán</h1>

            {/* PHẦN 1: BẢNG KÊ CHI TIẾT PHÍ */}
            <section className="p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center gap-2 text-blue-600">
                <Coins size={20} />
                <h3 className="font-bold uppercase text-sm tracking-wider">Bảng kê chi tiết phí và lệ phí</h3>
              </div>

              <div className="space-y-4">
                <FeeItem label="Lệ phí nộp đơn" price="150.000 đ" />
                <FeeItem 
                  label="Phí thẩm định hình thức" 
                  price="360.000 đ" 
                  note="Phí thẩm định hình thức: 180.000 đ (cho mỗi điểm độc lập). Hiện tại: 2 điểm độc lập." 
                />
                <FeeItem 
                  label="Phí trang bản mô tả bổ sung: 10 trang" 
                  price="32.000 đ" 
                  note="Số trang tính phí bổ sung: 4 trang (từ trang 7 trở đi, 8.000 đ/trang)" 
                />
                
                <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-lg font-black uppercase tracking-tight">Tổng chi phí cần nộp</span>
                  <span className="text-xl font-black text-blue-600 tracking-tighter">542.000 đ</span>
                </div>
              </div>
            </section>

            {/* PHẦN 2: HƯỚNG DẪN THANH TOÁN */}
            <section className="p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
              <h3 className="text-lg font-bold">Tổng cộng và Hướng dẫn thanh toán</h3>
              <div className="space-y-2">
                <p className="text-sm text-gray-500 font-medium">Tổng chi phí cần nộp là:</p>
                <p className="text-4xl font-black text-blue-600 tracking-tighter">542.000 đ</p>
              </div>

              <div className="space-y-6">
                <h4 className="font-bold text-sm text-gray-700 uppercase tracking-widest">Thông tin chuyển khoản</h4>
                <div className="grid grid-cols-2 gap-6">
                  <DisplayGroup label="Ngân hàng" value="Vietcombank" />
                  <DisplayGroup label="Tên tài khoản" value="Cục Sở hữu trí tuệ" />
                </div>
                <DisplayGroup label="Số tài khoản" value="1234 5678 9012 3456" />
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Nội dung chuyển khoản</label>
                  <div className="flex gap-2">
                    <div className="flex-grow bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-bold text-gray-700">
                      SHTT BC12345 Nguyễn Văn An
                    </div>
                    <button 
                      onClick={() => handleCopy("SHTT BC12345 Nguyễn Văn An")}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold hover:bg-gray-50 transition"
                    >
                      {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                      {copied ? "Đã chép" : "Sao chép nội dung"}
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-400 flex items-center gap-1 italic">
                    <span className="text-blue-500 font-bold">!</span> Vui lòng đảm bảo nội dung chuyển khoản chính xác để giao dịch được xử lý nhanh chóng.
                  </p>
                </div>
              </div>
            </section>

            {/* PHẦN 3: XÁC NHẬN THANH TOÁN */}
            <section className="p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
              <h3 className="text-lg font-bold">Xác nhận thanh toán (Tải lên chứng từ)</h3>
              
              <div className="border-2 border-dashed border-gray-200 rounded-3xl p-12 flex flex-col items-center justify-center space-y-4 bg-gray-50/30 hover:bg-gray-50 transition cursor-pointer">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                  <UploadCloud size={32} className="text-gray-400" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-gray-700">Kéo & thả tệp hoặc bấm vào đây</p>
                  <p className="text-xs text-gray-400 font-medium mt-1">Chấp nhận .jpg, .png, .pdf</p>
                </div>
              </div>

              <p className="text-xs text-gray-400 font-medium">Chỉ được phép nộp hồ sơ sau khi chứng từ thanh toán đã được tải lên thành công.</p>
              
              <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                <p className="text-[10px] text-blue-600 font-medium leading-relaxed">
                  <span className="font-bold">Lưu ý:</span> Hệ thống sẽ tự động <span className="font-bold">Lưu tổng tiền vào Applications</span>; <span className="font-bold">Lưu đường dẫn file vào Attachments với type=PAYMENT_RECEIPT</span> sau khi bạn nộp hồ sơ.
                </p>
              </div>
            </section>

            {/* Điều hướng */}
            <div className="flex justify-end gap-4 pt-10">
              <button onClick={() => navigate("/applicant/patent/step4")} className="flex items-center gap-2 px-8 py-3 border border-gray-200 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition shadow-sm text-sm">
                <ChevronLeft size={18} /> Quay lại
              </button>
              <button onClick={() => navigate("/applicant/patent/step6")} className="flex items-center gap-2 px-8 py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition shadow-md text-sm">
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
const FeeItem = ({ label, price, note }) => (
  <div className="flex justify-between items-start py-2">
    <div className="space-y-1">
      <p className="text-sm font-bold text-gray-700 tracking-tight">{label}</p>
      {note && <p className="text-[10px] text-gray-400 font-medium italic">{note}</p>}
    </div>
    <span className="text-sm font-black tracking-tight">{price}</span>
  </div>
);

const DisplayGroup = ({ label, value }) => (
  <div className="space-y-1">
    <label className="text-xs font-bold text-gray-400 uppercase">{label}</label>
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-medium text-gray-700">
      {value}
    </div>
  </div>
);

export default Step5_FeePayment;