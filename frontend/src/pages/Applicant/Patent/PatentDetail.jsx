import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  ChevronLeft, Download, ChevronDown, Info, Users, FileText, 
  Layers, History, CreditCard, CheckCircle2, Award, 
  Search, XCircle, AlertCircle, Calendar, Eye, Edit3  // Đã thêm XCircle và các icon cần thiết
} from "lucide-react";

const PatentDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8080/api/patents/${id}`);
        if (!response.ok) throw new Error("Lỗi tải dữ liệu");
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

  if (loading) return (
    <div className="h-screen flex items-center justify-center font-sans text-gray-500 bg-gray-50">
      Đang tải toàn bộ chi tiết hồ sơ {id}...
    </div>
  );

  if (!app) return <div className="p-10 text-center font-sans">Không tìm thấy dữ liệu hồ sơ.</div>;

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24 font-sans text-[#333]">
      {/* --- HEADER --- */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#E9ECEF] px-6 py-3 flex items-center justify-between shadow-sm">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-[#495057] hover:bg-gray-100 px-3 py-1.5 rounded-md border border-[#DEE2E6] transition-all"
        >
          <ChevronLeft size={16} /> Quay lại danh sách
        </button>
        
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold text-[#212529]">
            Chi tiết đơn đăng ký: <span className="text-[#0D6EFD]">{app.appNo || "Đang cấp mã"}</span>
          </h1>
          <span className="px-4 py-1 bg-blue-50 text-blue-600 text-[11px] font-bold rounded-full border border-blue-100 uppercase tracking-wider">
            {app.status}
          </span>
        </div>
        
        <div className="w-[140px] flex justify-end">
             <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                ND
             </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto mt-6 px-4 space-y-6">
        
        {/* 1. THÔNG TIN CHUNG (Full như Examiner) */}
        <section className="bg-white rounded-xl border border-[#DEE2E6] shadow-sm overflow-hidden">
          <div className="bg-[#F8F9FA] px-6 py-4 border-b border-[#DEE2E6] flex items-center gap-2">
            <Info size={18} className="text-blue-600" />
            <h2 className="font-bold text-[#495057] uppercase text-sm tracking-wide">1. Thông tin chung</h2>
          </div>
          <div className="p-6 space-y-4 text-sm">
            <div className="grid grid-cols-[220px_1fr] border-b border-[#F1F3F5] pb-3">
              <span className="text-[#6C757D] font-medium">Tiêu đề (Tên sáng chế)</span>
              <span className="font-bold text-slate-800 text-base">{app.patentName || app.title}</span>
            </div>
            <div className="grid grid-cols-[220px_1fr] border-b border-[#F1F3F5] pb-3">
              <span className="text-[#6C757D] font-medium">Loại đơn</span>
              <span className="font-semibold text-slate-700">{app.appType}</span>
            </div>
            <div className="grid grid-cols-[220px_1fr] border-b border-[#F1F3F5] pb-3">
              <span className="text-[#6C757D] font-medium">Lĩnh vực kỹ thuật</span>
              <span className="bg-gray-50 px-2 py-1 rounded border border-gray-100 text-xs w-fit">{app.technicalField}</span>
            </div>
            <div className="grid grid-cols-[220px_1fr] border-b border-[#F1F3F5] pb-3">
              <span className="text-[#6C757D] font-medium">Mã phân loại (IPC)</span>
              <div className="flex gap-2">
                {app.ipcCodes?.map(code => (
                  <span key={code} className="px-2 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-md font-mono text-xs">{code}</span>
                )) || <span className="text-gray-400 italic">Chưa có mã IPC</span>}
              </div>
            </div>
            <div className="grid grid-cols-[220px_1fr]">
              <span className="text-[#6C757D] font-medium">Tóm tắt giải pháp</span>
              <p className="text-[#495057] leading-relaxed whitespace-pre-line italic bg-slate-50 p-4 rounded-lg border-l-4 border-slate-200">
                {app.summary}
              </p>
            </div>
          </div>
        </section>

        {/* 2. CHỦ ĐƠN & TÁC GIẢ (Full Profile) */}
        <section className="bg-white rounded-xl border border-[#DEE2E6] shadow-sm overflow-hidden">
          <div className="bg-[#F8F9FA] px-6 py-4 border-b border-[#DEE2E6] flex items-center gap-2">
            <Users size={18} className="text-blue-600" />
            <h2 className="font-bold text-[#495057] uppercase text-sm tracking-wide">2. Chủ đơn & Tác giả</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-6 border-r border-[#DEE2E6] space-y-4">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-tighter border-b pb-2">Thông tin chủ đơn</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Tên đầy đủ</span>
                  <span className="font-bold">{app.applicant?.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">CCCD/MST</span>
                  <span className="font-medium font-mono">{app.applicant?.idNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Email liên hệ</span>
                  <span className="text-blue-600 font-medium">{app.applicant?.email}</span>
                </div>
              </div>
            </div>
            <div className="p-6">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-tighter border-b pb-2 mb-4">Danh sách tác giả</h3>
              <div className="space-y-3">
                {app.authors?.map((author, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                    <div className="w-6 h-6 bg-white border rounded-full flex items-center justify-center text-[10px] font-bold">{idx + 1}</div>
                    <div className="text-xs">
                        <p className="font-bold text-slate-700">{author.fullName}</p>
                        <p className="text-slate-400">{author.nationality}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 3. YÊU CẦU BẢO HỘ (Claims) */}
        <section className="bg-white rounded-xl border border-[#DEE2E6] shadow-sm overflow-hidden">
          <div className="bg-[#F8F9FA] px-6 py-4 border-b border-[#DEE2E6] flex items-center gap-2">
            <Layers size={18} className="text-blue-600" />
            <h2 className="font-bold text-[#495057] uppercase text-sm tracking-wide">3. Yêu cầu bảo hộ (Claims)</h2>
          </div>
          <div className="p-4 space-y-2">
            {app.claims?.map((claim, idx) => (
              <div key={idx} className="p-4 border rounded-lg bg-white hover:border-blue-200 transition-colors flex items-start gap-4">
                <span className="font-black text-blue-500 text-sm">#{claim.orderIndex}</span>
                <p className="text-sm text-slate-600 leading-relaxed">{claim.content}</p>
              </div>
            )) || <p className="p-6 text-center text-gray-400 italic">Không có dữ liệu yêu cầu bảo hộ</p>}
          </div>
        </section>

        {/* 4. TÀI LIỆU ĐÍNH KÈM (Có chức năng tải xuống) */}
        <section className="bg-white rounded-xl border border-[#DEE2E6] shadow-sm overflow-hidden">
          <div className="bg-[#F8F9FA] px-6 py-4 border-b border-[#DEE2E6] flex items-center gap-2">
            <FileText size={18} className="text-blue-600" />
            <h2 className="font-bold text-[#495057] uppercase text-sm tracking-wide">4. Hồ sơ tài liệu đính kèm</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {app.attachments?.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-dashed rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white border rounded-lg flex items-center justify-center text-blue-500">
                    <FileText size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700">{doc.docType}</p>
                    <p className="text-[10px] text-slate-400">{doc.fileName}</p>
                  </div>
                </div>
                <a 
                  href={`http://localhost:8080/api/attachments/${doc.id}/download`}
                  className="p-2 bg-white text-blue-600 rounded-full border shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-600 hover:text-white"
                >
                  <Download size={16} />
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* 5. THEO DÕI BIÊN LAI & LỆ PHÍ (GĐ 2 & GĐ 3) */}
        <section className="bg-white rounded-xl border border-[#DEE2E6] shadow-sm overflow-hidden">
          <div className="bg-[#F8F9FA] px-6 py-4 border-b border-[#DEE2E6] flex items-center gap-2">
            <CreditCard size={18} className="text-blue-600" />
            <h2 className="font-bold text-[#495057] uppercase text-sm tracking-wide">5. Biên lai lệ phí giai đoạn</h2>
          </div>
          <div className="p-6 space-y-4">
             {/* Phase 1 */}
             <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-100">
                <div className="flex items-center gap-3">
                    <CheckCircle2 className="text-green-500" size={20} />
                    <span className="text-sm font-bold text-green-700">📜 Lệ phí Nộp đơn & TĐ Hình thức</span>
                </div>
                <span className="text-xs font-bold text-green-600 px-3 py-1 bg-white rounded-full border border-green-200">ĐÃ HOÀN THÀNH</span>
             </div>

             {/* Giai đoạn 2: Thẩm định nội dung */}
<div className={`flex items-center justify-between p-4 rounded-lg border ${app.status === "CHO_NOP_PHI_GD2" ? "bg-purple-50 border-purple-200 animate-pulse" : "bg-gray-50 border-gray-100 opacity-60"}`}>
   <div className="flex items-center gap-3">
       <CreditCard className={app.status === "CHO_NOP_PHI_GD2" ? "text-purple-600" : "text-gray-400"} size={20} />
       <span className="text-sm font-bold">📜 Lệ phí Thẩm định nội dung</span>
   </div>
   {app.status === "CHO_NOP_PHI_GD2" ? (
       <button 
          onClick={() => navigate(`/applicant/payment/phase2/${app.id}`)} // THÊM DÒNG NÀY
          className="bg-purple-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-purple-700 shadow-sm transition-all"
       >
           THANH TOÁN NGAY
       </button>
   ) : (
       <span className="text-[10px] font-bold text-gray-400 uppercase italic">Chưa đến giai đoạn</span>
   )}
</div>

             {/* Phase 3: Nộp phí để Cấp bằng */}
             <div className={`flex items-center justify-between p-4 rounded-lg border ${["CHO_NOP_PHI_GD3"].includes(app.status) ? "bg-pink-50 border-pink-200" : "bg-gray-50 border-gray-100 opacity-60"}`}>
                <div className="flex items-center gap-3">
                    <CreditCard size={20} className="text-gray-400" />
                    <span className="text-sm font-bold">📜 Lệ phí Cấp văn bằng & Công bố</span>
                </div>
                {app.status === "CHO_NOP_PHI_GD3" ? (
                    <button 
                        onClick={() => navigate(`/applicant/payment/phase3/${app.id}`)}
                        className="bg-pink-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-sm hover:bg-pink-700 transition-all"
                    >
                        THANH TOÁN NGAY
                    </button>
                ) : (
                    <span className="text-[10px] font-bold text-gray-400 uppercase italic">Chưa đến giai đoạn</span>
                )}
             </div>
          </div>
        </section>

        {/* 6. NHẬT KÝ HOẠT ĐỘNG (Activity Log) */}
        <section className="bg-white rounded-xl border border-[#DEE2E6] shadow-sm overflow-hidden mb-12">
          <div className="bg-[#F8F9FA] px-6 py-4 border-b border-[#DEE2E6] flex items-center gap-2">
            <History size={18} className="text-blue-600" />
            <h2 className="font-bold text-[#495057] uppercase text-sm tracking-wide">6. Nhật ký xử lý hồ sơ</h2>
          </div>
          <table className="w-full text-left">
            <thead className="bg-[#F1F3F5] text-[10px] font-bold text-slate-500 uppercase">
              <tr>
                <th className="px-6 py-3">Thời gian</th>
                <th className="px-6 py-3">Hoạt động</th>
                <th className="px-6 py-3">Trạng thái mới</th>
                <th className="px-6 py-3">Ghi chú</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-gray-100">
              <tr>
                <td className="px-6 py-4 font-mono text-slate-500">{new Date(app.createdAt).toLocaleString('vi-VN')}</td>
                <td className="px-6 py-4 font-bold text-slate-700">Người nộp đơn</td>
                <td className="px-6 py-4"><span className="bg-gray-100 px-2 py-0.5 rounded text-gray-500 font-bold">MOI</span></td>
                <td className="px-6 py-4 text-slate-500 italic">Khởi tạo đơn thành công trên hệ thống.</td>
              </tr>
              {/* Nếu có dữ liệu History thực tế từ API, bạn map thêm vào đây */}
            </tbody>
          </table>
        </section>
      </main>
      {/* Thêm đoạn này vào cuối file, trước dấu đóng </div> cuối cùng */}

{app.status === "DA_CAP_VAN_BANG" && (
  <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-green-200 p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] z-50">
    <div className="max-w-6xl mx-auto flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center animate-bounce">
          <Award size={24} />
        </div>
        <div>
          <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">Chúc mừng!</p>
          <p className="text-sm font-bold text-slate-700">Hồ sơ đã được cấp văn bằng bảo hộ chính thức.</p>
        </div>
      </div>
      
      <button 
        onClick={() => navigate(`/applicant/patent/${id}/certificate`)}
        className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-green-700 shadow-lg shadow-green-100 transition-all active:scale-95"
      >
        <Award size={20} /> XEM VĂN BẰNG ĐIỆN TỬ
      </button>
    </div>
  </footer>
)}

{/* --- FOOTER ACTIONS BAR CHO NGƯỜI NỘP ĐƠN --- */}
{app.status === "TU_CHOI_DON" && (
  <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-red-200 p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.08)] z-50">
    <div className="max-w-6xl mx-auto flex items-center justify-between">
      
      {/* Bên trái: Thông báo ngắn */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
          <XCircle size={24} />
        </div>
        <div>
          <p className="text-[10px] font-black text-red-600 uppercase tracking-widest">Thông báo</p>
          <p className="text-sm font-bold text-slate-700">Rất tiếc, hồ sơ của bạn đã bị từ chối cấp văn bằng.</p>
        </div>
      </div>
      
      {/* Bên phải: Nút bấm chuyển hướng giống Examiner */}
      <button 
        onClick={() => navigate(`/applicant/patent/${id}/reject-reason`)}
        className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 shadow-lg"
      >
        <Search size={18} /> XEM LÝ DO TỪ CHỐI
      </button>
    </div>
  </footer>
)}

{/* FOOTER CẢNH BÁO VÀ NÚT SỬA HỒ SƠ */}
{(app.status === "CHO_SUA_DOI_HINH_THUC" || app.status === "CHO_SUA_DOI_NOI_DUNG") && (
  <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-orange-200 p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.08)] z-50">
    <div className="max-w-6xl mx-auto flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center animate-bounce">
          <AlertCircle size={28} />
        </div>
        <div>
          <p className="text-[10px] font-black text-orange-600 uppercase tracking-[0.2em]">Thông báo sửa đổi</p>
          <p className="text-sm font-bold text-slate-700">
            Chuyên viên yêu cầu chỉnh sửa {app.status === "CHO_SUA_DOI_HINH_THUC" ? "Hình thức" : "Nội dung"} hồ sơ.
          </p>
        </div>
      </div>
      
      <button 
        onClick={() => navigate(`/applicant/patent/revision/${id}`)}
        className="px-8 py-4 bg-orange-500 text-white rounded-2xl font-black text-sm flex items-center gap-3 hover:bg-orange-600 shadow-xl shadow-orange-100 transition-all active:scale-95 uppercase tracking-wide"
      >
        <Edit3 size={20} /> Bắt đầu chỉnh sửa hồ sơ
      </button>
    </div>
  </footer>
)}
    </div>
  );
};

export default PatentDetail;