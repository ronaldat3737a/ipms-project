import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  AlertTriangle, 
  ChevronLeft, 
  Bell, 
  ShieldCheck 
} from "lucide-react";

const RejectConfirmation = ({ phase }) => { // Nhận phase từ App.jsx
  const navigate = useNavigate();
  const { id, type } = useParams();
  const [reason, setReason] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Xác định tiêu đề phụ dựa trên giai đoạn để Examiner không nhầm lẫn
  const isSubstantive = phase === "substantive";
  const phaseText = isSubstantive ? "THẨM ĐỊNH NỘI DUNG" : "THẨM ĐỊNH HÌNH THỨC";

  // Logic kiểm tra tính hợp lệ
  const isReasonEmpty = reason.trim() === "";

  const handleConfirm = async () => {
    setIsSubmitted(true);
    if (isReasonEmpty) return;

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/patents/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          status: "TU_CHOI_DON", // Luôn là TU_CHOI_DON cho cả 2 giai đoạn
          note: `Từ chối tại bước ${phaseText}. Lý do: ${reason}`
        }), 
      });

      if (response.ok) {
        alert("Đã gửi quyết định từ chối hồ sơ thành công!");
        // Sau khi từ chối, quay về danh sách quản lý tương ứng
        navigate(`/examiner/applications/${type}`);
      } else {
        const errorData = await response.json();
        alert("Lỗi: " + (errorData.message || "Không thể cập nhật trạng thái"));
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
      alert("Lỗi kết nối! Vui lòng kiểm tra lại server Backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* --- HEADER --- */}
      <header className="h-16 bg-white px-8 flex items-center justify-between border-b border-slate-100">
        <div className="flex items-center gap-6">
          <div className="w-10 h-10 bg-[#4F46E5] rounded-lg flex items-center justify-center text-white shadow-md">
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
              alt="Avatar" 
            />
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex items-center justify-center p-6 bg-[#fcfcfc]">
        <div className="max-w-[800px] w-full bg-white rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-12 flex flex-col items-center animate-in fade-in zoom-in duration-300">
          
          <div className="text-[#DC3545] mb-6">
            <AlertTriangle size={64} strokeWidth={1.5} />
          </div>

          <h1 className="text-[28px] font-black text-[#DC3545] uppercase tracking-tight mb-2">
            QUYẾT ĐỊNH TỪ CHỐI HỒ SƠ
          </h1>
          <p className="text-[#64748b] font-bold text-sm mb-4">GIAI ĐOẠN: {phaseText}</p>

          <p className="text-center text-slate-400 text-sm italic mb-10">
            Lưu ý: Quyết định từ chối sẽ chấm dứt quá trình thẩm định của hồ sơ này và chuyển trạng thái thành <b>Từ chối đơn</b>.
          </p>

          <div className="w-full space-y-3 mb-10">
            <label className="block text-sm font-bold text-[#1E293B]">
              Căn cứ pháp lý và Lý do từ chối chi tiết
            </label>
            <textarea 
              className={`w-full p-5 bg-white border ${
                isSubmitted && isReasonEmpty ? "border-red-500" : "border-slate-200"
              } rounded-xl text-sm min-h-[180px] outline-none focus:ring-4 focus:ring-red-500/5 focus:border-[#DC3545] transition-all resize-none`}
              placeholder="Nhập căn cứ pháp lý và lý do từ chối chi tiết tại đây..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={loading}
            />
            {isSubmitted && isReasonEmpty && (
              <p className="text-red-500 text-xs font-medium">
                Lý do từ chối là bắt buộc để hoàn tất thủ tục.
              </p>
            )}
          </div>

          <div className="flex gap-4 w-full justify-center">
            <button 
              onClick={() => navigate(-1)}
              className="px-10 py-3 border border-slate-200 rounded-lg font-bold text-sm text-slate-500 hover:bg-slate-50 transition-all"
              disabled={loading}
            >
              Hủy bỏ
            </button>
            <button 
              onClick={handleConfirm}
              disabled={loading}
              className={`px-10 py-3 ${
                isReasonEmpty || loading ? "bg-red-300 cursor-not-allowed" : "bg-[#DC3545] hover:bg-[#bb2d3b]"
              } text-white rounded-lg font-bold text-sm transition-all shadow-lg shadow-red-100 flex items-center gap-2`}
            >
              {loading ? "Đang xử lý..." : "Xác nhận Từ chối chính thức"}
            </button>
          </div>
        </div>
      </main>

      <footer className="h-16 flex items-center justify-center border-t border-slate-50">
        <p className="text-xs text-slate-400 font-medium tracking-tight">
          © 2025 IP Registration Management. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default RejectConfirmation;