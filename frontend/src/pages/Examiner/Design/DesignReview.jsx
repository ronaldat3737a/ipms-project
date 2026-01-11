import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ChevronLeft, CheckCircle, AlertTriangle, XCircle, Info, FileText,
  Camera, CheckSquare, Sparkles, Factory, Eye, File, User, Users,
  ImageOff, DownloadCloud, Clock
} from "lucide-react";

/* ==========================================================================
   CONSTANTS & MAPPINGS
   ========================================================================== */
const VIEW_TYPE_LABELS = {
  PHOI_CANH: "Ảnh phối cảnh",
  MAT_TRUOC: "Mặt trước",
  MAT_SAU: "Mặt sau",
  MAT_TRAI: "Mặt bên trái",
  MAT_PHAI: "Mặt bên phải",
  MAT_TREN: "Mặt từ trên xuống",
  MAT_DUOI: "Mặt từ dưới lên",
};

const DOC_TYPE_LABELS = {
  TO_KHAI: "Tờ khai đăng ký (Mẫu 07)",
  BAN_MO_TA: "Bản mô tả kiểu dáng",
};

const VIEW_ORDER = ["PHOI_CANH", "MAT_TRUOC", "MAT_SAU", "MAT_TRAI", "MAT_PHAI", "MAT_TREN", "MAT_DUOI"];
const BASE_URL = "http://localhost:8080";

const DesignReview = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState({ application: null, detail: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/industrial-designs/${id}`);
        if (!res.ok) throw new Error("Không thể tải dữ liệu");
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error("Error fetching detail:", e);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetail();
  }, [id]);

  const { application, detail } = data;

  // Xử lý logic phân loại tài liệu
  const { productImages, systemDocs } = useMemo(() => {
    const attachments = application?.attachments || [];
    
    // 1. Lọc bộ ảnh sản phẩm
    const imagesByView = {};
    attachments.filter(a => a.docType === 'ANH_CHUP').forEach(img => {
      imagesByView[img.viewType] = img;
    });

    const productImages = VIEW_ORDER.map(view => ({
      viewType: view,
      label: VIEW_TYPE_LABELS[view],
      file: imagesByView[view] || null
    }));

    // 2. Lọc tài liệu pháp lý & mô tả
    const systemDocs = attachments.filter(a => ["TO_KHAI", "BAN_MO_TA"].includes(a.docType));

    return { productImages, systemDocs };
  }, [application]);

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
      <p className="text-slate-500 font-medium">Đang truy xuất hồ sơ KDCN...</p>
    </div>
  );

  if (!application || !detail) return <div className="p-20 text-center text-red-500">Hồ sơ không tồn tại hoặc đã bị xóa.</div>;

  return (
    <div className="min-h-screen bg-[#F3F4F6] pb-32 font-sans text-slate-800">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/examiner/applications/KIEU_DANG_CN')}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-extrabold flex items-center gap-3">
              Thẩm định: <span className="text-blue-600">{application.appNo || "CHỜ CẤP MÃ"}</span>
              <span className={`text-[10px] uppercase px-3 py-1 rounded-full border ${
                application.status.includes('DANG_TD') ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-slate-100 text-slate-500'
              }`}>
                {application.status.replace(/_/g, ' ')}
              </span>
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto mt-8 px-6 space-y-8">
        {/* SLA INFO */}
        <div className="bg-blue-600 rounded-2xl p-4 text-white flex items-center gap-4 shadow-blue-200 shadow-lg">
          <div className="bg-white/20 p-3 rounded-xl"><Clock size={24}/></div>
          <div>
            <p className="text-xs text-blue-100 font-bold uppercase tracking-wider">Thông tin thời hạn (SLA)</p>
            <p className="text-lg font-medium">
              {application.status === 'DANG_TD_HINH_THUC' 
                ? "Giai đoạn: Thẩm định hình thức - Còn lại 28 ngày (Thời hạn 01 tháng)" 
                : "Giai đoạn: Thẩm định nội dung - Thời hạn tối đa 07 tháng"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* CỘT TRÁI: THÔNG TIN CHI TIẾT */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 1. THÔNG TIN CHUNG */}
            <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <h2 className="text-lg font-black mb-6 flex items-center gap-3 border-b pb-4">
                <Info size={20} className="text-blue-600"/> 1. CHI TIẾT KIỂU DÁNG
              </h2>
              <div className="grid grid-cols-1 gap-6 text-sm">
                <div className="space-y-1">
                  <p className="text-slate-400 font-bold uppercase text-[10px]">Tên kiểu dáng công nghiệp</p>
                  <p className="text-lg font-bold text-slate-800">{application.title}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-slate-400 font-bold uppercase text-[10px]">Lĩnh vực sử dụng</p>
                    <p className="font-semibold">{detail.usageField}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-slate-400 font-bold uppercase text-[10px]">Mã Locarno (Phân loại)</p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {detail.locarnoCodes?.map(code => (
                        <span key={code} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg font-mono text-xs font-bold border border-slate-200">
                          {code}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                  <p className="text-amber-600 font-bold uppercase text-[10px] mb-1">Kiểu dáng tương tự / Đối chứng</p>
                  <p className="text-slate-700 italic">{detail.similarDesign || "Chủ đơn cam kết tính mới tuyệt đối, không có đối chứng."}</p>
                </div>
              </div>
            </section>

            {/* 2. BỘ ẢNH 360 ĐỘ */}
            <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <h2 className="text-lg font-black mb-6 flex items-center gap-3 border-b pb-4 text-purple-700">
                <Camera size={20}/> 2. BỘ ẢNH CHỤP SẢN PHẨM (07 HƯỚNG NHÌN)
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {productImages.map(({ viewType, label, file }) => (
                  <div key={viewType} className="group relative">
                    <div className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all flex flex-col items-center justify-center ${
                      file ? 'border-slate-100 hover:border-purple-500 shadow-sm' : 'border-dashed border-slate-200 bg-slate-50'
                    }`}>
                      {file ? (
                        <>
                          <img 
                            src={`${BASE_URL}/uploads/${file.fileUrl}`} 
                            alt={label} 
                            className="w-full h-full object-cover"
                          />
                          <a 
                            href={`${BASE_URL}/uploads/${file.fileUrl}`} 
                            target="_blank" rel="noreferrer"
                            className="absolute inset-0 bg-purple-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-2 text-xs font-bold"
                          >
                            <Eye size={18}/> XEM ẢNH GỐC
                          </a>
                        </>
                      ) : (
                        <div className="text-center p-4">
                          <ImageOff size={24} className="mx-auto text-slate-300 mb-2"/>
                          <p className="text-[10px] text-slate-400 font-bold">CHƯA CÓ</p>
                        </div>
                      )}
                    </div>
                    <p className="mt-3 text-center text-[11px] font-black uppercase text-slate-500 tracking-tighter">{label}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 3. MÔ TẢ & YÊU CẦU */}
            <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <h2 className="text-lg font-black mb-6 flex items-center gap-3 border-b pb-4 text-emerald-700">
                <FileText size={20}/> 3. NỘI DUNG MÔ TẢ & BẢO HỘ
              </h2>
              <div className="space-y-6">
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">Phần mô tả chi tiết</h3>
                  <div className="text-sm leading-relaxed text-slate-700 whitespace-pre-line">{detail.descriptionDetail}</div>
                </div>
                <div className="p-5 bg-emerald-50/30 rounded-2xl border border-emerald-100">
                  <h3 className="text-[10px] font-black text-emerald-600 uppercase mb-3 tracking-widest">Phạm vi/Yêu cầu bảo hộ</h3>
                  <div className="text-sm font-bold leading-relaxed text-emerald-900 whitespace-pre-line">{detail.claims}</div>
                </div>
              </div>
            </section>
          </div>

          {/* CỘT PHẢI: CHỦ ĐƠN, TÁC GIẢ & TÀI LIỆU HỆ THỐNG */}
          <div className="space-y-8">
            {/* CHỦ ĐƠN & TÁC GIẢ */}
            <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                <h3 className="font-black text-slate-400 text-[10px] uppercase mb-4 flex items-center gap-2"><Users size={14}/> Nhân sự liên quan</h3>
                
                <div className="space-y-6">
                  {/* Chủ đơn */}
                  {application.applicants?.map(app => (
                    <div key={app.id} className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                      <p className="text-[9px] font-black text-blue-400 uppercase mb-2">Chủ đơn hồ sơ</p>
                      <p className="font-bold text-blue-900">{app.fullName}</p>
                      <p className="text-xs text-blue-700/70">{app.address}</p>
                    </div>
                  ))}

                  {/* Tác giả */}
                  <div className="space-y-3">
                    <p className="text-[9px] font-black text-slate-400 uppercase px-2">Danh sách tác giả ({application.authors?.length})</p>
                    {application.authors?.map((author, idx) => (
                      <div key={author.id} className="flex items-center gap-3 px-2">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                          {idx + 1}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-700">{author.fullName}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{author.idNumber}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
            </section>

            {/* TÀI LIỆU HỆ THỐNG */}
            <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <h3 className="font-black text-slate-400 text-[10px] uppercase mb-4 flex items-center gap-2"><File size={14}/> Tài liệu pháp lý (PDF)</h3>
              <div className="space-y-3">
                {systemDocs.length > 0 ? systemDocs.map(doc => (
                  <div key={doc.id} className="group p-4 border border-slate-100 rounded-2xl hover:bg-red-50 hover:border-red-100 transition-all">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-red-100 text-red-600 rounded-xl group-hover:scale-110 transition-transform">
                        <FileText size={20}/>
                      </div>
                      <div className="flex-grow overflow-hidden">
                        <p className="text-xs font-black text-slate-700 truncate">{DOC_TYPE_LABELS[doc.docType] || "Tài liệu đính kèm"}</p>
                        <p className="text-[10px] text-slate-400 truncate font-mono">{doc.fileName}</p>
                        <div className="flex gap-3 mt-3">
                          <a 
                            href={`${BASE_URL}/uploads/${doc.fileUrl}`} 
                            target="_blank" rel="noreferrer"
                            className="text-[10px] font-bold text-red-600 underline flex items-center gap-1"
                          >
                            <Eye size={12}/> XEM PDF
                          </a>
                          <a 
                            href={`${BASE_URL}/uploads/${doc.fileUrl}`} 
                            download 
                            className="text-[10px] font-bold text-slate-500 underline flex items-center gap-1"
                          >
                            <DownloadCloud size={12}/> TẢI VỀ
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                )) : (
                  <p className="text-xs text-slate-400 italic p-4 text-center border-2 border-dashed rounded-2xl">Không tìm thấy tài liệu PDF đi kèm</p>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* FOOTER ĐIỀU KHIỂN THẨM ĐỊNH */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-200 p-5 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] z-[60]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mr-2">Tiêu chí xét duyệt:</p>
            <div className="flex gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-full text-[10px] font-black text-slate-600 border border-slate-200 shadow-sm">
                <CheckSquare size={14} className="text-green-500"/> TÍNH MỚI
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-full text-[10px] font-black text-slate-600 border border-slate-200 shadow-sm">
                <Sparkles size={14} className="text-amber-500"/> SÁNG TẠO
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-full text-[10px] font-black text-slate-600 border border-slate-200 shadow-sm">
                <Factory size={14} className="text-blue-500"/> KHẢ NĂNG ÁP DỤNG
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate(`/examiner/review/KIEU_DANG_CN/${id}/accept`)}
              className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white text-xs font-black rounded-xl flex items-center gap-2 shadow-lg shadow-green-200 transition-all active:scale-95"
            >
              <CheckCircle size={16} /> CHẤP NHẬN ĐƠN
            </button>
            <button 
              onClick={() => navigate(`/examiner/review/KIEU_DANG_CN/${id}/correction`)}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-black rounded-xl flex items-center gap-2 shadow-lg shadow-amber-100 transition-all active:scale-95"
            >
              <AlertTriangle size={16} /> YÊU CẦU SỬA ĐỔI
            </button>
            <button 
              onClick={() => navigate(`/examiner/review/KIEU_DANG_CN/${id}/reject`)}
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-black rounded-xl flex items-center gap-2 shadow-lg shadow-red-100 transition-all active:scale-95"
            >
              <XCircle size={16} /> TỪ CHỐI ĐƠN
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DesignReview;