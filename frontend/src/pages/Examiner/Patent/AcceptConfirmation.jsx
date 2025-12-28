import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  Check, 
  ChevronLeft, 
  Bell, 
  ShieldCheck 
} from "lucide-react";

const AcceptConfirmation = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Lấy ID đơn từ URL nếu cần

  // Dữ liệu giả lập khớp với ảnh mẫu
  const applicationInfo = {
    type: "Nhãn hiệu",
    owner: "Công ty Cổ phần Sáng Tạo Việt",
    examiner: "Nguyễn Văn A"
  };

  return (
    <div className="min-h-screen bg-[#94a3b8] flex flex-col font-sans">
      {/* --- HEADER --- */}
      <header className="h-16 bg-white px-8 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-6">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-md">
            <ShieldCheck size={24} />
          </div>
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#0D6EFD] font-bold text-sm hover:underline"
          >
            <ChevronLeft size={20} /> Quay lại
          </button>
        </div>
        
        <div className="flex items-center gap-6">
          <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
            <Bell size={22} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200">
            <img 
              src="https://ui-avatars.com/api/?name=Examiner&background=0D8ABC&color=fff" 
              alt="Examiner Avatar" 
            />
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT (MODAL BOX) --- */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-[720px] w-full bg-white rounded-[24px] shadow-2xl p-12 flex flex-col items-center animate-in fade-in zoom-in duration-300">
          
          {/* Icon Checkmark */}
          <div className="w-24 h-24 bg-[#EEF2FF] rounded-full flex items-center justify-center text-[#4F46E5] mb-8">
            <div className="w-16 h-16 rounded-full border-4 border-[#4F46E5] flex items-center justify-center">
              <Check size={40} strokeWidth={3} />
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-[28px] font-black text-[#1E293B] uppercase tracking-tight mb-12">
            XÁC NHẬN HỢP LỆ HÌNH THỨC
          </h1>

          {/* Info List */}
          <div className="w-full max-w-[420px] space-y-6 mb-12">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <span className="text-slate-500 font-medium">Loại đơn</span>
              <span className="text-[#1E293B] font-bold text-right">{applicationInfo.type}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm items-start">
              <span className="text-slate-500 font-medium pt-1">Tên chủ đơn</span>
              <span className="text-[#1E293B] font-bold text-right leading-relaxed">
                {applicationInfo.owner}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <span className="text-slate-500 font-medium">Người thẩm định</span>
              <span className="text-[#1E293B] font-bold text-right">{applicationInfo.examiner}</span>
            </div>
          </div>

          {/* Description Text */}
          <p className="text-center text-slate-500 text-sm leading-relaxed max-w-[500px] mb-12">
            Hệ thống sẽ ghi nhận hồ sơ này đủ điều kiện hình thức và tự động gửi thông báo chấp nhận đến người nộp đơn. Bạn có chắc chắn muốn thực hiện?
          </p>

          {/* Buttons */}
          <div className="flex gap-4 w-full justify-center">
            <button 
              onClick={() => navigate(-1)}
              className="px-10 py-3 border border-slate-300 rounded-lg font-bold text-sm text-slate-600 hover:bg-slate-50 transition-all"
            >
              Quay lại
            </button>
            <button 
              className="px-10 py-3 bg-[#4F46E5] text-white rounded-lg font-bold text-sm hover:bg-[#4338ca] transition-all shadow-lg shadow-indigo-100"
              onClick={() => {
                alert("Đã xác nhận thành công!");
                navigate("/examiner-dashboard");
              }}
            >
              Xác nhận & Chuyển bước
            </button>
          </div>
        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="h-16 flex items-center justify-center border-t border-slate-200/50">
        <p className="text-xs text-slate-500 font-medium tracking-tight">
          © 2025 IP Registration Management. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default AcceptConfirmation;