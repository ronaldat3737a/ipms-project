import React, { useState, useEffect } from "react"; // Thêm useEffect vào đây
import { useNavigate, useParams } from "react-router-dom";
import { 
  ChevronLeft, 
  Send, 
  FileEdit, 
  ShieldCheck,
  Bell
} from "lucide-react";

const CorrectionRequest = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Lấy mã hồ sơ từ URL (ví dụ: MA001234)
  const [content, setContent] = useState("");
  const maxLength = 500;

  // Thêm state để lưu thông tin đơn
const [app, setApp] = useState(null);

// Lấy thông tin đơn khi load trang
useEffect(() => {
  fetch(`http://localhost:8080/api/patents/${id}`)
    .then(res => res.json())
    .then(data => setApp(data));
}, [id]);

const handleSend = async () => {
  if (content.trim() === "") {
    alert("Vui lòng nhập nội dung yêu cầu!");
    return;
  }

  // LOGIC QUAN TRỌNG: Xác định trạng thái sửa đổi dựa trên giai đoạn hiện tại
  let targetStatus = "";
  if (app.status === "DANG_TD_HINH_THUC") {
    targetStatus = "CHO_SUA_DOI_HINH_THUC";
  } else if (app.status === "DANG_TD_NOI_DUNG") {
    targetStatus = "CHO_SUA_DOI_NOI_DUNG";
  } else {
    targetStatus = app.status; // Giữ nguyên nếu không thuộc 2 giai đoạn trên
  }

  try {
    const response = await fetch(`http://localhost:8080/api/patents/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: targetStatus,
        note: content // Nội dung bạn nhập trong textarea
      }),
    });

    if (response.ok) {
      alert("Yêu cầu sửa đổi đã được gửi thành công!");
      navigate("/examiner-dashboard"); // Chuyển về dashboard chuyên viên
    } else {
      const errorData = await response.json();
      alert("Lỗi: " + errorData.message);
    }
  } catch (error) {
    console.error("Lỗi kết nối API:", error);
    alert("Không thể kết nối đến máy chủ!");
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
          <h2 className="text-sm font-bold text-[#1E293B]">
            Yêu cầu sửa đổi/Bổ sung - <span className="text-slate-500">{id || "MA001234"}</span>
          </h2>
          <div className="w-px h-6 bg-slate-200 mx-2"></div>
          <button className="relative p-2 text-slate-400 hover:text-slate-600">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex items-center justify-center p-6 bg-[#fcfcfc]">
        <div className="max-w-[900px] w-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-500">
          
          {/* Card Header */}
          <div className="px-8 py-5 border-b border-slate-100 flex items-center gap-3 bg-white">
            <div className="text-[#F59E0B]">
              <FileEdit size={24} strokeWidth={2.5} />
            </div>
            <h1 className="text-lg font-bold text-[#1E293B]">
              Yêu cầu Sửa đổi/Bổ sung
            </h1>
          </div>

          {/* Form Body */}
          <div className="p-8">
            <div className="mb-4">
              <label className="block text-sm font-bold text-[#1E293B] mb-4">
                Nội dung yêu cầu sửa đổi/bổ sung <span className="text-red-500">*</span>
              </label>
              
              <div className="relative">
                <textarea 
                  className="w-full p-6 bg-[#F1F3F5] border-none rounded-xl text-sm min-h-[350px] outline-none focus:ring-2 focus:ring-[#F59E0B]/20 transition-all resize-none text-[#495057] leading-relaxed"
                  placeholder="1. Hình vẽ không rõ nét; 2. Tờ khai thiếu chữ ký; 3. Thông tin địa chỉ chưa đúng; 4. Bổ sung hồ sơ đính kèm."
                  value={content}
                  onChange={(e) => setContent(e.target.value.slice(0, maxLength))}
                />
                
                {/* Character Counter */}
                <div className="absolute bottom-4 right-6 text-[11px] font-medium text-slate-400">
                  {content.length}/{maxLength} ký tự
                </div>
              </div>
            </div>

            {/* Actions & Footer Note */}
            <div className="flex flex-col items-end gap-4 mt-8">
              <div className="flex gap-3">
                <button 
                  className="px-6 py-2.5 border border-slate-200 rounded-lg font-bold text-xs text-slate-500 hover:bg-slate-50 transition-all uppercase tracking-wider"
                  onClick={() => alert("Đã lưu bản nháp!")}
                >
                  Lưu nháp
                </button>
                <button 
                  onClick={handleSend}
                  className="px-8 py-2.5 bg-[#F59E0B] text-white rounded-lg font-bold text-xs flex items-center gap-2 hover:bg-[#D97706] transition-all shadow-md shadow-orange-100 uppercase tracking-wider"
                >
                  Gửi <Send size={14} />
                </button>
              </div>
              
              <p className="text-[11px] text-slate-400 font-medium italic">
                Sau khi gửi, hệ thống sẽ tạo thông báo và lưu vào lịch sử hồ sơ.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* --- FOOTER (Optional but consistent) --- */}
      <footer className="h-12 flex items-center justify-center">
        <p className="text-[10px] text-slate-400 font-medium tracking-tight">
          © 2025 IP Registration Management. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default CorrectionRequest;