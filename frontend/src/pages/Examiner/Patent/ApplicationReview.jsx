import React, { useState, useEffect } from "react"; // Thêm useEffect
import { useNavigate, useParams } from "react-router-dom";
import { 
  ChevronLeft, Download, Eye, CheckCircle, AlertTriangle, 
  XCircle, ChevronDown, Info, Users, FileText, Layers, History,
  Award, Search, Calendar
} from "lucide-react";

// SỬA LỖI BUILD VERCEL: Dùng CDN ổn định cho PDF.js worker
import * as pdfjsLib from "pdfjs-dist";
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.530/pdf.worker.min.js`;

// Thêm vào sau dòng 20
const calculateDaysElapsed = (dateString) => {
  if (!dateString) return 0;
  const start = new Date(dateString);
  const today = new Date();
  const diffTime = Math.abs(today - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const ApplicationReview = () => {
  const navigate = useNavigate();
  const { id, type } = useParams(); // Lấy ID hồ sơ từ URL
  
  // --- TRẠNG THÁI DỮ LIỆU ---
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);

  // DI CHUYỂN HÀM getHeaderInfo VÀO TRONG COMPONENT
  const getHeaderInfo = () => {
    switch (app?.status) {
      case "DANG_TD_NOI_DUNG": return { title: "Thẩm định Nội dung", color: "text-purple-600" };
      case "CHO_NOP_PHI_GD2": return { title: "Đợi nộp phí GĐ2", color: "text-amber-600" };
      case "CAP_VAN_BANG": return { title: "Cấp văn bằng", color: "text-green-600" };
      case "TU_CHOI_DON": return { title: "Đơn đã bị từ chối", color: "text-red-600" };
      default: return { title: "Thẩm định Hình thức", color: "text-blue-600" };
    }
  };

  // --- FETCH DỮ LIỆU TỪ BACKEND ---
  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        // Gọi API lấy chi tiết 1 đơn theo ID
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
            {getHeaderInfo().title}: <span className={getHeaderInfo().color}>{app.appNo || "Chưa cấp mã"}</span>
          </h1>
          <span className="px-3 py-1 bg-white text-slate-500 text-[10px] font-bold rounded-full border border-slate-200 shadow-sm">
            {app.status}
          </span>
        </div>
        
        <div className="w-[140px]"></div>
      </header>

      <main className="max-w-6xl mx-auto mt-6 px-4 space-y-6">
        
        {/* 1. THÔNG TIN CHUNG */}
        <section className="bg-white rounded-lg border border-[#DEE2E6] overflow-hidden">
          <div className="bg-[#F8F9FA] px-6 py-3 border-b border-[#DEE2E6] flex items-center gap-2">
            <Info size={18} className="text-[#495057]" />
            <h2 className="font-bold text-[#495057]">1. Thông tin chung</h2>
          </div>
          <div className="p-6 space-y-4 text-sm">
            <div className="grid grid-cols-[200px_1fr] border-b border-[#F1F3F5] pb-3">
              <span className="text-[#6C757D]">Tiêu đề</span>
              <span className="font-medium text-blue-900">{app.title}</span>
            </div>
            <div className="grid grid-cols-[200px_1fr] border-b border-[#F1F3F5] pb-3">
              <span className="text-[#6C757D]">Loại đơn</span>
              <span className="font-bold text-slate-700">{app.appType}</span>
            </div>
            <div className="grid grid-cols-[200px_1fr] border-b border-[#F1F3F5] pb-3">
              <span className="text-[#6C757D]">Dạng giải pháp</span>
              <span>{app.solutionType} ({app.solutionDetail})</span>
            </div>
            <div className="grid grid-cols-[200px_1fr] border-b border-[#F1F3F5] pb-3">
              <span className="text-[#6C757D]">Lĩnh vực kỹ thuật</span>
              <div className="flex gap-2">
                  <span className="px-2 py-0.5 bg-[#F1F3F5] border border-[#DEE2E6] rounded text-[11px] font-medium text-[#495057]">
                    {app.technicalField}
                  </span>
              </div>
            </div>
            <div className="grid grid-cols-[200px_1fr] border-b border-[#F1F3F5] pb-3">
              <span className="text-[#6C757D]">Mã IPC</span>
              <div className="flex gap-2 font-mono text-xs">
                {app.ipcCodes?.map(code => (
                  <span key={code} className="px-2 py-0.5 bg-[#F8F9FA] border border-[#DEE2E6] rounded">{code}</span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-[200px_1fr]">
              <span className="text-[#6C757D]">Tóm tắt</span>
              <div className="space-y-2">
                <p className="text-[#495057] leading-relaxed italic whitespace-pre-line">
                  {app.summary}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 2. CHỦ ĐƠN & TÁC GIẢ */}
        <section className="bg-white rounded-lg border border-[#DEE2E6] overflow-hidden">
          <div className="bg-[#F8F9FA] px-6 py-3 border-b border-[#DEE2E6] flex items-center gap-2">
            <Users size={18} className="text-[#495057]" />
            <h2 className="font-bold text-[#495057]">2. Chủ đơn & Tác giả</h2>
          </div>
          <div className="grid grid-cols-2">
            {/* Thông tin chủ đơn (Applicant) */}
            <div className="p-6 border-r border-[#DEE2E6] space-y-4 text-sm">
              <h3 className="font-bold text-[#212529] mb-4 flex items-center gap-2 underline underline-offset-4 decoration-[#DEE2E6]">
                <FileText size={14} /> Thông tin chủ đơn
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between border-b border-[#F8F9FA] pb-2">
                  <span className="text-[#6C757D]">Tên chủ đơn</span>
                  <span className="font-semibold text-right">{app.applicant?.fullName || "N/A"}</span>
                </div>
                <div className="flex justify-between border-b border-[#F8F9FA] pb-2">
                  <span className="text-[#6C757D]">Mã số thuế/CCCD</span>
                  <span className="font-medium">{app.applicant?.idNumber}</span>
                </div>
                <div className="flex justify-between border-b border-[#F8F9FA] pb-2">
                  <span className="text-[#6C757D]">Địa chỉ</span>
                  <span className="text-right max-w-[200px]">{app.applicant?.address}</span>
                </div>
                <div className="flex justify-between border-b border-[#F8F9FA] pb-2">
                  <span className="text-[#6C757D]">Điện thoại</span>
                  <span className="font-medium">{app.applicant?.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6C757D]">Email</span>
                  <span className="text-[#0D6EFD]">{app.applicant?.email}</span>
                </div>
              </div>
            </div>

      {/* Danh sách tác giả (Authors) */}
<div className="p-6 space-y-4 text-sm">
  <h3 className="font-bold text-[#212529] mb-4 flex items-center gap-2 underline underline-offset-4 decoration-[#DEE2E6]">
    <Users size={14} /> Danh sách tác giả
  </h3>
  <table className="w-full">
    <thead className="text-[11px] text-[#6C757D] uppercase tracking-wider text-left border-b border-[#DEE2E6]">
      <tr>
        <th className="pb-3 font-semibold w-12">STT</th>
        <th className="pb-3 font-semibold">Họ tên</th>
        <th className="pb-3 font-semibold">Quốc tịch</th>
        <th className="pb-3 font-semibold">CCCD</th>
      </tr>
    </thead>
    <tbody className="text-xs">
      {app.authors && app.authors.length > 0 ? (
        app.authors.map((author, index) => (
          <tr key={index} className="border-b border-[#F8F9FA] hover:bg-gray-50/50 transition-colors">
            <td className="py-3 text-[#6C757D]">{index + 1}</td>
            <td className="py-3 font-medium text-[#212529]">{author.fullName}</td>
            <td className="py-3 text-[#495057]">{author.nationality}</td>
            <td className="py-3 font-mono text-[#495057]">{author.idNumber || "N/A"}</td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="4" className="py-8 text-center text-[#ADB5BD] italic">
            Không có dữ liệu tác giả cho hồ sơ này
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>

          </div>
        </section>


        {/* 3. CẤU TRÚC YÊU CẦU BẢO HỘ (Claims) */}
        <section className="bg-white rounded-lg border border-[#DEE2E6] overflow-hidden">
          <div className="bg-[#F8F9FA] px-6 py-3 border-b border-[#DEE2E6] flex items-center gap-2">
            <Layers size={18} className="text-[#495057]" />
            <h2 className="font-bold text-[#495057]">3. Cấu trúc yêu cầu bảo hộ</h2>
          </div>
          <div className="divide-y divide-[#F1F3F5]">
            {app.claims?.map((claim, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer group">
                <span className="text-sm text-[#495057]">
                  Điểm {claim.orderIndex}. {claim.content}
                </span>
                <ChevronDown size={16} className="text-[#ADB5BD] group-hover:text-[#495057]" />
              </div>
            ))}
          </div>
        </section>
{/* 4. TÀI LIỆU (Attachments) */}
<section className="bg-white rounded-lg border border-[#DEE2E6] overflow-hidden">
  <div className="bg-[#F8F9FA] px-6 py-3 border-b border-[#DEE2E6] flex items-center gap-2">
    <FileText size={18} className="text-[#495057]" />
    <h2 className="font-bold text-[#495057]">4. Tài liệu đính kèm</h2>
  </div>
  <div className="p-4 space-y-4">
    <div className="grid grid-cols-2 gap-4">
      {app.attachments && app.attachments.length > 0 ? (
        app.attachments.map((doc, index) => (
          <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-[#F8F9FA] group">
            <div className="flex flex-col">
              <span className="text-sm font-bold flex items-center gap-2">
                <FileText size={14} className="text-blue-400" /> {doc.docType}
              </span>
              {/* Hiển thị tên file để kiểm tra mã UUID */}
              <span className="text-[10px] text-gray-400 italic">{doc.fileName}</span>
            </div>
            {/* SỬA LỖI DOWNLOAD: Dùng thẻ <a> với href trỏ thẳng vào API mới */}
            <a 
              href={`http://localhost:8080/api/attachments/${doc.id}/download`}
              download={doc.fileName}
              target="_blank" // Mở trong tab mới để không làm gián đoạn trang hiện tại
              rel="noopener noreferrer"
              className="text-[#0D6EFD] text-xs font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:underline"
            >
              Tải xuống <Download size={12} />
            </a>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-400 italic px-2">Hồ sơ không có tài liệu đính kèm.</p>
      )}
    </div>
  </div>
</section>

        {/* 5. BIÊN LAI THEO GIAI ĐOẠN - NẰM DƯỚI PHẦN TÀI LIỆU */}
        <section className="bg-white rounded-lg border border-[#DEE2E6] overflow-hidden">
          <div className="bg-[#F8F9FA] px-6 py-3 border-b border-[#DEE2E6] flex items-center gap-2">
            <FileText size={18} className="text-[#495057]" />
            <h2 className="font-bold text-[#495057]">5. Biên lai theo giai đoạn</h2>
          </div>
          <div className="p-4 space-y-2 divide-y divide-[#F1F3F5]">
            
            {/* Giai đoạn 1: Nộp đơn - Mặc định hiển thị ngày nộp từ Database */}
            <div className="py-3 flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 font-medium">📜 Nộp đơn + Thẩm định hình thức</span>
              <span className="text-[11px] text-[#0D6EFD] italic font-bold bg-blue-50 px-3 py-1 rounded">
                {app.createdAt ? new Date(app.createdAt).toLocaleDateString('vi-VN') : "01/01/2025"} ↓
              </span>
            </div>

            {/* Giai đoạn 2: Thẩm định nội dung - Kiểm tra trạng thái đơn */}
            <div className="py-4 flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 font-medium">📜 Thẩm định nội dung</span>
              {["DANG_TD_NOI_DUNG", "CHO_SUA_DOI_NOI_DUNG", "DA_CAP_VAN_BANG"].includes(app.status) ? (
                <span className="text-[11px] text-[#198754] italic font-bold bg-green-50 px-3 py-1 rounded">
                  Đã nộp phí ↓
                </span>
              ) : (
                <button className="px-3 py-1 bg-[#6F42C1] text-white text-[10px] font-bold rounded shadow-sm">
                  Chưa đến GĐ
                </button>
              )}
            </div>

            {/* Giai đoạn 3: Cấp văn bằng - Chỉ hiện khi đã hoàn tất */}
            <div className="py-4 flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 font-medium">📜 Cấp văn bằng</span>
              {app.status === "DA_CAP_VAN_BANG" ? (
                <span className="text-[11px] text-[#198754] italic font-bold bg-green-50 px-3 py-1 rounded">
                  Đã nộp phí ↓
                </span>
              ) : (
                <button className="px-3 py-1 bg-[#6F42C1] text-white text-[10px] font-bold rounded shadow-sm">
                  Chưa đến GĐ
                </button>
              )}
            </div>
          </div>
        </section>

        {/* 5. NHẬT KÝ HOẠT ĐỘNG (Lấy từ createdAt) */}
        <section className="bg-white rounded-lg border border-[#DEE2E6] overflow-hidden">
          <div className="bg-[#F8F9FA] px-6 py-3 border-b border-[#DEE2E6] flex items-center gap-2">
            <History size={18} className="text-[#495057]" />
            <h2 className="font-bold text-[#495057]">6. Nhật ký hoạt động</h2>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-[#F8F9FA] text-[#6C757D] text-[11px] uppercase border-b border-[#DEE2E6] text-left">
              <tr>
                <th className="px-6 py-3 font-semibold">Thời gian</th>
                <th className="px-6 py-3 font-semibold">Hành động</th>
                <th className="px-6 py-3 font-semibold">Mô tả</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              <tr>
                <td className="px-6 py-4 text-[#6C757D] font-medium">
                   {new Date(app.createdAt).toLocaleString('vi-VN')}
                </td>
                <td className="px-6 py-4 font-bold text-[#212529]">Nộp đơn trực tuyến</td>
                <td className="px-6 py-4 text-[#495057]">Hệ thống đã tiếp nhận đơn từ cổng dịch vụ công.</td>
              </tr>
            </tbody>
          </table>
        </section>
      </main>

{/* FOOTER ACTIONS BAR - THAY THẾ TỪ DÒNG 230 */}
<div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#DEE2E6] p-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-50">
  <div className="max-w-6xl mx-auto flex items-center justify-between">
    
    {/* TRÁI: THÔNG TIN BỔ SUNG */}
    <div className="flex items-center gap-6">
      {app.status === "CHO_NOP_PHI_GD2" ? (
        <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-100 rounded-lg animate-pulse">
          <Calendar size={16} className="text-red-600" />
          <span className="text-xs font-black text-red-600 uppercase">
            Số ngày chờ phí: {calculateDaysElapsed(app.updatedAt)} ngày
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${app.status === 'TU_CHOI_DON' ? 'bg-slate-300' : 'bg-green-500'}`}></div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tiếp nhận</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${['MOI', 'DANG_TD_HINH_THUC'].includes(app.status) ? 'bg-blue-500 shadow-[0_0_0_2px_rgba(59,130,246,0.2)]' : 'bg-slate-300'}`}></div>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${['MOI', 'DANG_TD_HINH_THUC'].includes(app.status) ? 'text-blue-600 underline' : 'text-slate-400'}`}>Hình thức</span>
          </div>
          {app.status === 'DANG_TD_NOI_DUNG' && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_0_2px_rgba(168,85,247,0.2)]"></div>
              <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider underline">Nội dung</span>
            </div>
          )}
        </div>
      )}
    </div>

    {/* PHẢI: NHÓM NÚT BẤM THEO GIAI ĐOẠN */}
    <div className="flex items-center gap-3">
      {/* 1. GIAI ĐOẠN HÌNH THỨC */}
      {(app.status === "MOI" || app.status === "DANG_TD_HINH_THUC") && (
        <>
          <button onClick={() => navigate(`/examiner/review/${type}/${id}/accept`, { state: { appData: app } })} className="px-4 py-2 bg-[#198754] text-white text-[11px] font-bold rounded-md flex items-center gap-2 hover:bg-[#157347]">
            <CheckCircle size={14} /> Chấp nhận hình thức
          </button>
          <button onClick={() => navigate(`/examiner/review/${type}/${id}/correction`, { state: { appData: app } })} className="px-4 py-2 bg-white text-[#FD7E14] border border-[#FD7E14] text-[11px] font-bold rounded-md flex items-center gap-2 hover:bg-[#fff3e6]">
            <AlertTriangle size={14} /> Yêu cầu sửa đổi
          </button>
        </>
      )}

      {/* 2. GIAI ĐOẠN CHỜ PHÍ */}
      {app.status === "CHO_NOP_PHI_GD2" && (
        <div className="flex items-center gap-2 italic text-slate-400 text-[11px] mr-4">
          <Info size={14} /> Đang đợi hệ thống ghi nhận thanh toán từ người dùng...
        </div>
      )}

      {/* 3. GIAI ĐOẠN NỘI DUNG */}
      {app.status === "DANG_TD_NOI_DUNG" && (
        <>
          <button onClick={() => navigate(`/examiner/substantive-review/${type}/${id}/grant`, { state: { appData: app } })} className="px-4 py-2 bg-[#0D6EFD] text-white text-[11px] font-bold rounded-md flex items-center gap-2 hover:bg-[#0b5ed7]">
            <Award size={14} /> Chấp nhận cấp bằng
          </button>
          <button onClick={() => navigate(`/examiner/substantive-review/${type}/${id}/correction`, { state: { appData: app } })} className="px-4 py-2 bg-white text-[#FD7E14] border border-[#FD7E14] text-[11px] font-bold rounded-md flex items-center gap-2 hover:bg-[#fff3e6]">
            <AlertTriangle size={14} /> Sửa đổi nội dung
          </button>
        </>
      )}

      {/* 1. GIAI ĐOẠN ĐÃ CẤP VĂN BẰNG (Trạng thái của bạn hiện tại) */}
  {app.status === "DA_CAP_VAN_BANG" && (
    <button 
      onClick={() => navigate(`/examiner/applications/${type}/${id}/certificate`)} 
      className="px-6 py-2.5 bg-[#198754] text-white text-[11px] font-bold rounded-md flex items-center gap-2 shadow-lg shadow-green-100 hover:bg-[#157347] transition-all"
    >
      <Award size={16} /> XEM VĂN BẰNG ĐIỆN TỬ
    </button>
  )}

      {/* Thay đổi nút ở dòng 363 (trong file cũ của bạn) */}
{app.status === "TU_CHOI_DON" && (
  <button 
    onClick={() => navigate(`/examiner/review/${type}/${id}/reject-reason`, { state: { appData: app } })} 
    className="px-4 py-2 bg-slate-900 text-white text-[11px] font-bold rounded-md flex items-center gap-2"
  >
    <Search size={14} /> Xem lý do từ chối
  </button>
)}

      {/* NÚT TỪ CHỐI CHUNG (Dùng cho Hình thức, Chờ phí, Nội dung) */}
      {["MOI", "DANG_TD_HINH_THUC", "CHO_NOP_PHI_GD2", "DANG_TD_NOI_DUNG"].includes(app.status) && (
        <button 
          onClick={() => navigate(`/examiner/review/${type}/${id}/reject`, { state: { appData: app } })}
          className="px-4 py-2 bg-[#DC3545] text-white text-[11px] font-bold rounded-md flex items-center gap-2 hover:bg-[#bb2d3b]"
        >
          <XCircle size={14} /> Từ chối đơn
        </button>
      )}
    </div>
    
  </div>
</div>
       </div>
      
  );
};

export default ApplicationReview;