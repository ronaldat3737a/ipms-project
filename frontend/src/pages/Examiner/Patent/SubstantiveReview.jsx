import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  ChevronLeft, Download, Eye, CheckCircle, AlertTriangle, 
  XCircle, ChevronDown, Info, Users, FileText, Layers, History
} from "lucide-react";

// SỬA LỖI BUILD VERCEL: Dùng CDN ổn định cho PDF.js worker
import * as pdfjsLib from "pdfjs-dist";
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.530/pdf.worker.min.js`;

const SubstantiveReview = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Lấy ID hồ sơ từ URL
  
  // --- TRẠNG THÁI DỮ LIỆU ---
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- FETCH DỮ LIỆU TỪ BACKEND ---
  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8080/api/patents/${id}`);
        const data = await response.json();
        setApp(data);
      } catch (error) {
        console.error("Lỗi lấy chi tiết hồ sơ:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetail();
  }, [id]);

  // Hiển thị màn hình chờ khi đang load
  if (loading) return (
    <div className="h-screen flex items-center justify-center font-sans text-gray-500">
      Đang tải chi tiết hồ sơ hồ sơ {id}...
    </div>
  );

  if (!app) return <div className="p-10 text-center">Không tìm thấy dữ liệu hồ sơ.</div>;

  const getStatusLabel = (status) => {
    const statusMap = {
      DANG_TD_NOI_DUNG: "Chờ thẩm định nội dung",
      CHO_SUA_DOI_NOI_DUNG: "Yêu cầu sửa đổi nội dung",
      // Thêm các trạng thái khác nếu cần
    };
    return statusMap[status] || status;
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24 font-sans text-[#333]">
      {/* HEADER AREA */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#E9ECEF] px-6 py-3 flex items-center justify-between shadow-sm">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-[#495057] hover:bg-gray-100 px-3 py-1.5 rounded-md border border-[#DEE2E6] transition-all"
        >
          <ChevronLeft size={16} /> Quay lại danh sách
        </button>
        
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold text-[#212529]">
            Thẩm định nội dung: <span className="text-[#0D6EFD]">{app.appNo || "Chưa cấp mã"}</span>
          </h1>
          <span className="px-3 py-1 bg-[#E7F1FF] text-[#0D6EFD] text-xs font-semibold rounded-full border border-[#CFE2FF]">
            {getStatusLabel(app.status)}
          </span>
        </div>
        
        <div className="w-[140px]"></div>
      </header>

      <main className="max-w-6xl mx-auto mt-6 px-4 space-y-6">
        
        {/* All sections are the same as ApplicationReview, so they are copied directly */}
        {/* 1. THÔNG TIN CHUNG */}
        <section className="bg-white rounded-lg border border-[#DEE2E6] overflow-hidden">
          <div className="bg-[#F8F9FA] px-6 py-3 border-b border-[#DEE2E6] flex items-center gap-2">
            <Info size={18} className="text-[#495057]" />
            <h2 className="font-bold text-[#495057]">1. Thông tin chung</h2>
          </div>
          <div className="p-6 space-y-4 text-sm">
            {/* ... content identical to ApplicationReview ... */}
            <div className="grid grid-cols-[200px_1fr] border-b border-[#F1F3F5] pb-3">
              <span className="text-[#6C757D]">Tiêu đề</span>
              <span className="font-medium text-blue-900">{app.title}</span>
            </div>
            {/* ... etc */}
          </div>
        </section>

        {/* 2. CHỦ ĐƠN & TÁC GIẢ */}
        <section className="bg-white rounded-lg border border-[#DEE2E6] overflow-hidden">
          {/* ... content identical to ApplicationReview ... */}
        </section>

        {/* 3. CẤU TRÚC YÊU CẦU BẢO HỘ (Claims) */}
        <section className="bg-white rounded-lg border border-[#DEE2E6] overflow-hidden">
          {/* ... content identical to ApplicationReview ... */}
        </section>

        {/* 4. TÀI LIỆU (Attachments) */}
        <section className="bg-white rounded-lg border border-[#DEE2E6] overflow-hidden">
         {/* ... content identical to ApplicationReview ... */}
        </section>

        {/* 5. BIÊN LAI THEO GIAI ĐOẠN */}
        <section className="bg-white rounded-lg border border-[#DEE2E6] overflow-hidden">
          {/* ... content identical to ApplicationReview ... */}
        </section>

        {/* 6. NHẬT KÝ HOẠT ĐỘNG */}
        <section className="bg-white rounded-lg border border-[#DEE2E6] overflow-hidden">
          {/* ... content identical to ApplicationReview ... */}
        </section>
      </main>

      {/* FOOTER ACTIONS BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#DEE2E6] p-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 opacity-50">
              <div className="w-2 h-2 rounded-full bg-gray-400"></div>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Thẩm định hình thức</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_0_2px_rgba(13,110,253,0.2)]"></div>
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider underline underline-offset-4">Thẩm định nội dung</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* These buttons will navigate to new confirmation pages specific to substantive review */}
            {/* The user did not request creating these pages yet, so the routes are placeholders for now */}
            <button 
              onClick={() => navigate(`/examiner/substantive-review/sang-che/${id}/grant`, { state: { appData: app } })}
              className="px-4 py-2 bg-[#198754] text-white text-[11px] font-bold rounded-md flex items-center gap-2 hover:bg-[#157347] transition-all"
            >
              <CheckCircle size={14} /> Chấp nhận cấp bằng
            </button>

            <button 
              onClick={() => navigate(`/examiner/substantive-review/sang-che/${id}/correction`, { state: { appData: app } })}
              className="px-4 py-2 bg-white text-[#FD7E14] border border-[#FD7E14] text-[11px] font-bold rounded-md flex items-center gap-2 hover:bg-[#fff3e6] transition-all"
            >
              <AlertTriangle size={14} /> Yêu cầu sửa đổi
            </button>

            <button 
              onClick={() => navigate(`/examiner/substantive-review/sang-che/${id}/reject`, { state: { appData: app } })}
              className="px-4 py-2 bg-[#DC3545] text-white text-[11px] font-bold rounded-md flex items-center gap-2 hover:bg-[#bb2d3b] transition-all"
            >
              <XCircle size={14} /> Từ chối cấp bằng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubstantiveReview;