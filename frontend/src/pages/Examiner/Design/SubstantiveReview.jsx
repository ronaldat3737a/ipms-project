import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  ChevronLeft, Download, Eye, CheckCircle, AlertTriangle, 
  XCircle, ChevronDown, Info, Users, FileText, Layers, History,
  Award, Calendar, Search, MapPin, Mail, Phone, Briefcase, User // Thêm 'User' ở đây
} from "lucide-react";

// PDF.js Worker Configuration
import * as pdfjsLib from "pdfjs-dist";
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.530/pdf.worker.min.js`;

const SubstantiveReview = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8080/api/patents/${id}`);
        if (response.ok) {
          const data = await response.json();
          setApp(data);
        }
      } catch (error) {
        console.error("Lỗi lấy chi tiết hồ sơ:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetail();
  }, [id]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-gray-50 font-sans text-gray-500 italic">
      Đang tải dữ liệu thẩm định nội dung cho hồ sơ {id}...
    </div>
  );

  if (!app) return (
    <div className="p-20 text-center font-sans">
      <AlertTriangle className="mx-auto text-amber-500 mb-4" size={48} />
      <p className="text-gray-600">Không tìm thấy dữ liệu hồ sơ hoặc có lỗi xảy ra.</p>
      <button onClick={() => navigate(-1)} className="mt-4 text-blue-600 underline">Quay lại</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F4F7F9] pb-32 font-sans text-[#334155]">
      {/* --- HEADER --- */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
            title="Quay lại"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Award className="text-purple-600" size={24} />
              THẨM ĐỊNH NỘI DUNG
            </h1>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
              Mã hồ sơ: <span className="text-purple-600">{app.appNo || "ĐANG CẬP NHẬT"}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right mr-4">
            <p className="text-[10px] text-slate-400 font-bold uppercase">Trạng thái hiện tại</p>
            <p className="text-xs font-bold text-purple-700">{app.status}</p>
          </div>
          <span className="h-10 w-[1px] bg-slate-200 mx-2"></span>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-lg hover:bg-black transition-all">
            <Eye size={16} /> Xem đơn gốc
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto mt-8 px-4 space-y-8">
        
        {/* --- 1. THÔNG TIN KỸ THUẬT --- */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <Info size={20} className="text-blue-600" />
            </div>
            <h2 className="font-bold text-slate-800 uppercase text-sm tracking-tight">1. Thông tin kỹ thuật & Tóm tắt</h2>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="group">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Tên sáng chế / Giải pháp</label>
                <p className="text-base font-bold text-slate-900 mt-1 leading-snug">{app.title}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Loại hình</label>
                  <p className="font-semibold text-slate-700 text-sm mt-1">{app.appType}</p>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Lĩnh vực</label>
                  <p className="font-semibold text-slate-700 text-sm mt-1">{app.technicalField}</p>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Phân loại IPC</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {app.ipcCodes?.map(code => (
                    <span key={code} className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded text-xs font-mono font-bold">
                      {code}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <FileText size={14} /> Bản tóm tắt nội dung
              </label>
              <p className="text-sm text-slate-600 mt-4 leading-relaxed italic italic-font italic">
                "{app.summary}"
              </p>
            </div>
          </div>
        </section>

        {/* --- 2. CHỦ ĐƠN & TÁC GIẢ --- */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg shadow-sm text-amber-600"><Users size={20} /></div>
            <h2 className="font-bold text-slate-800 uppercase text-sm tracking-tight">2. Chủ đơn & Danh sách tác giả</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3">
            {/* Applicant */}
            <div className="p-8 border-r border-slate-100 bg-slate-50/30">
              <h3 className="text-xs font-black text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-widest">
                <Briefcase size={16} className="text-slate-400" /> Thông tin chủ đơn
              </h3>
              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <User size={18} className="text-slate-400 mt-1" />
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold">Tên chủ sở hữu</p>
                    <p className="text-sm font-bold text-slate-800">{app.applicant?.fullName}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-slate-400 mt-1" />
                  <p className="text-sm text-slate-600 leading-snug">{app.applicant?.address}</p>
                </div>
                <div className="grid grid-cols-1 gap-4 pt-2">
                  <div className="flex items-center gap-2 text-xs text-slate-600"><Mail size={14} /> {app.applicant?.email}</div>
                  <div className="flex items-center gap-2 text-xs text-slate-600"><Phone size={14} /> {app.applicant?.phone}</div>
                </div>
              </div>
            </div>
            {/* Authors */}
            <div className="lg:col-span-2 p-8">
              <h3 className="text-xs font-black text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-widest text-slate-400">
                Nhóm tác giả ({app.authors?.length || 0})
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="text-[10px] text-slate-400 uppercase border-b border-slate-100">
                    <tr>
                      <th className="pb-4 text-left font-bold">STT</th>
                      <th className="pb-4 text-left font-bold">Họ tên tác giả</th>
                      <th className="pb-4 text-left font-bold">Quốc tịch</th>
                      <th className="pb-4 text-right font-bold">Số định danh</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-slate-50">
                    {app.authors?.map((author, index) => (
                      <tr key={index} className="hover:bg-slate-50 transition-colors">
                        <td className="py-4 text-slate-400">{index + 1}</td>
                        <td className="py-4 font-bold text-slate-800">{author.fullName}</td>
                        <td className="py-4 text-slate-600">{author.nationality}</td>
                        <td className="py-4 text-right font-mono text-slate-500">{author.idNumber}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* --- 3. YÊU CẦU BẢO HỘ (PHẦN QUAN TRỌNG NHẤT TĐ NỘI DUNG) --- */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm text-purple-600"><Layers size={20} /></div>
              <h2 className="font-bold text-slate-800 uppercase text-sm tracking-tight">3. Cấu trúc các điểm yêu cầu bảo hộ (Claims)</h2>
            </div>
            <span className="px-3 py-1 bg-purple-100 text-purple-700 text-[10px] font-black rounded-full">
              {app.claims?.length || 0} ĐIỂM BẢO HỘ
            </span>
          </div>
          <div className="divide-y divide-slate-100">
            {app.claims?.map((claim, idx) => (
              <div key={idx} className="p-6 flex items-start justify-between hover:bg-slate-50/80 transition-all cursor-pointer group">
                <div className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    {claim.orderIndex}
                  </span>
                  <div className="space-y-1">
                    <p className="text-sm text-slate-700 leading-relaxed font-medium">{claim.content}</p>
                    <span className="text-[10px] text-slate-400 italic">Tính mới: Chưa thẩm định | Khả năng áp dụng: Cao</span>
                  </div>
                </div>
                <ChevronDown size={18} className="text-slate-300 group-hover:text-purple-600 transition-colors" />
              </div>
            ))}
          </div>
        </section>

        {/* --- 4. TÀI LIỆU ĐÍNH KÈM --- */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg shadow-sm text-red-600"><FileText size={20} /></div>
            <h2 className="font-bold text-slate-800 uppercase text-sm tracking-tight">4. Hồ sơ pháp lý & Kỹ thuật</h2>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {app.attachments?.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:shadow-md hover:border-blue-300 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-50 text-red-500 rounded-lg group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    <FileText size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 tracking-tight">{doc.docType}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[150px]">{doc.fileName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors" title="Xem trước">
                    <Eye size={18} />
                  </button>
                  <a 
                    href={`http://localhost:8080/api/attachments/${doc.id}/download`}
                    className="p-2 text-slate-400 hover:text-green-600 transition-colors" 
                    title="Tải về"
                  >
                    <Download size={18} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- 5. LỊCH SỬ THẨM ĐỊNH --- */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg shadow-sm text-slate-600"><History size={20} /></div>
            <h2 className="font-bold text-slate-800 uppercase text-sm tracking-tight">5. Nhật ký hoạt động hồ sơ</h2>
          </div>
          <div className="p-0 overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50/50 text-slate-400 uppercase font-black">
                <tr>
                  <th className="px-8 py-4">Thời gian</th>
                  <th className="px-8 py-4">Người thực hiện</th>
                  <th className="px-8 py-4">Hành động</th>
                  <th className="px-8 py-4">Ghi chú / Kết quả</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="px-8 py-5 text-slate-500">{new Date(app.createdAt).toLocaleString('vi-VN')}</td>
                  <td className="px-8 py-5 font-bold text-slate-700 italic underline underline-offset-4 decoration-slate-200 uppercase">Hệ thống</td>
                  <td className="px-8 py-5 font-bold text-slate-900">Tiếp nhận đơn</td>
                  <td className="px-8 py-5 text-slate-500">Đơn đã vượt qua vòng thẩm định hình thức. Chuyển sang TĐ nội dung.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

      </main>

      {/* --- FOOTER ACTION BAR --- */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 p-5 shadow-[0_-10px_40px_rgba(0,0,0,0.04)] z-[100]">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          
          {/* Progress Indicator */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                <CheckCircle size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Giai đoạn 1</span>
                <span className="text-xs font-bold text-slate-500">Thẩm định Hình thức</span>
              </div>
            </div>
            <div className="w-12 h-[2px] bg-slate-100"></div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center animate-pulse">
                <Award size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Giai đoạn 2</span>
                <span className="text-xs font-bold text-purple-700">Thẩm định Nội dung</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button 
              onClick={() => navigate(`/examiner/substantive-review/sang-che/${id}/grant`, { state: { appData: app } })}
              className="flex-1 md:flex-none px-8 py-3 bg-[#0D6EFD] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-100 transition-all active:scale-95"
            >
              <CheckCircle size={18} /> Chấp nhận cấp bằng
            </button>

            <button 
              onClick={() => navigate(`/examiner/substantive-review/sang-che/${id}/correction`, { state: { appData: app } })}
              className="flex-1 md:flex-none px-8 py-3 bg-white text-amber-600 border border-amber-200 text-xs font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-amber-50 hover:border-amber-300 transition-all active:scale-95"
            >
              <AlertTriangle size={18} /> Yêu cầu sửa đổi
            </button>

            <button 
              onClick={() => navigate(`/examiner/substantive-review/sang-che/${id}/reject`, { state: { appData: app } })}
              className="flex-1 md:flex-none px-8 py-3 bg-red-50 text-red-600 border border-red-100 text-xs font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-red-600 hover:text-white transition-all active:scale-95"
            >
              <XCircle size={18} /> Từ chối đơn
            </button>
          </div>
          
        </div>
      </footer>
    </div>
  );
};

export default SubstantiveReview;