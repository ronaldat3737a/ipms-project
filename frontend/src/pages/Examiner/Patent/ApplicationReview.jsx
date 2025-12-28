import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  ChevronLeft, 
  Download, 
  Eye, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  ChevronDown,
  Info,
  Users,
  FileText,
  Layers,
  History
} from "lucide-react";

const ApplicationReview = () => {
  const navigate = useNavigate();
  const { id, type } = useParams();
  const [activeStep, setActiveStep] = useState(2); // Bước 2: Thẩm định hình thức

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
            Thẩm định hình thức hồ sơ: <span className="text-[#0D6EFD]">1-2025-00001</span>
          </h1>
          <span className="px-3 py-1 bg-[#E7F1FF] text-[#0D6EFD] text-xs font-semibold rounded-full border border-[#CFE2FF]">
            Đang thẩm định hình thức
          </span>
        </div>
        
        <div className="w-[140px]"></div> {/* Spacer để cân bằng layout */}
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
              <span className="font-medium">Hệ thống quản lý thông tin sở hữu trí tuệ tự động</span>
            </div>
            <div className="grid grid-cols-[200px_1fr] border-b border-[#F1F3F5] pb-3">
              <span className="text-[#6C757D]">Loại đơn</span>
              <span>Đơn sáng chế</span>
            </div>
            <div className="grid grid-cols-[200px_1fr] border-b border-[#F1F3F5] pb-3">
              <span className="text-[#6C757D]">Dạng giải pháp</span>
              <span>Sáng chế</span>
            </div>
            <div className="grid grid-cols-[200px_1fr] border-b border-[#F1F3F5] pb-3">
              <span className="text-[#6C757D]">Lĩnh vực kỹ thuật</span>
              <div className="flex gap-2">
                {["Phần mềm quản lý", "Trí tuệ nhân tạo", "Cơ sở dữ liệu"].map(tag => (
                  <span key={tag} className="px-2 py-0.5 bg-[#F1F3F5] border border-[#DEE2E6] rounded text-[11px] font-medium text-[#495057]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-[200px_1fr] border-b border-[#F1F3F5] pb-3">
              <span className="text-[#6C757D]">Mã IPC</span>
              <div className="flex gap-2 font-mono text-xs">
                <span className="px-2 py-0.5 bg-[#F8F9FA] border border-[#DEE2E6] rounded">G06F 17/30</span>
                <span className="px-2 py-0.5 bg-[#F8F9FA] border border-[#DEE2E6] rounded">G06N 20/00</span>
              </div>
            </div>
            <div className="grid grid-cols-[200px_1fr]">
              <span className="text-[#6C757D]">Tóm tắt</span>
              <div className="space-y-2">
                <p className="text-[#495057] leading-relaxed italic">
                  Sáng chế này đề xuất một hệ thống quản lý thông tin sở hữu trí tuệ tự động sử dụng trí tuệ nhân tạo (AI) và học máy (ML) để tối ưu hóa quy trình nộp đơn, theo dõi và bảo vệ quyền sở hữu trí tuệ. Hệ thống bao gồm các mô-đun chính: mô-đun phân tích tài...
                </p>
                <button className="text-[#0D6EFD] text-xs font-semibold hover:underline">Xem thêm ▾</button>
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
            {/* Thông tin chủ đơn */}
            <div className="p-6 border-r border-[#DEE2E6] space-y-4 text-sm">
              <h3 className="font-bold text-[#212529] mb-4 flex items-center gap-2 underline underline-offset-4 decoration-[#DEE2E6]">
                <FileText size={14} /> Thông tin chủ đơn
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between border-b border-[#F8F9FA] pb-2">
                  <span className="text-[#6C757D]">Tên chủ đơn</span>
                  <span className="font-semibold text-right">Nguyễn Thị Hợi</span>
                </div>
                <div className="flex justify-between border-b border-[#F8F9FA] pb-2">
                  <span className="text-[#6C757D]">Mã số thuế/CCCD</span>
                  <span className="font-medium">0123456789</span>
                </div>
                <div className="flex justify-between border-b border-[#F8F9FA] pb-2">
                  <span className="text-[#6C757D]">Địa chỉ</span>
                  <span className="text-right">Số 10, Đường Phan Chu Trinh, Quận 1, TP. Hồ Chí Minh</span>
                </div>
                <div className="flex justify-between border-b border-[#F8F9FA] pb-2">
                  <span className="text-[#6C757D]">Điện thoại</span>
                  <span className="font-medium">+84 28 3820 0000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6C757D]">Email</span>
                  <span className="text-[#0D6EFD]">contact@globals.vn</span>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-[#DEE2E6] text-xs italic text-[#6C757D]">
                Cơ sở pháp sinh quyền: Tác giả đồng thời là người nộp đơn
              </div>
            </div>

            {/* Danh sách tác giả */}
            <div className="p-6 space-y-4 text-sm">
              <h3 className="font-bold text-[#212529] mb-4 flex items-center gap-2 underline underline-offset-4 decoration-[#DEE2E6]">
                <Users size={14} /> Danh sách tác giả
              </h3>
              <table className="w-full">
                <thead className="text-[11px] text-[#6C757D] uppercase tracking-wider text-left border-b border-[#DEE2E6]">
                  <tr>
                    <th className="pb-3 font-semibold">STT</th>
                    <th className="pb-3 font-semibold">Họ tên</th>
                    <th className="pb-3 font-semibold">Quốc tịch</th>
                    <th className="pb-3 font-semibold">CCCD</th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  <tr className="border-b border-[#F8F9FA]">
                    <td className="py-3">1</td>
                    <td className="py-3 font-medium">Nguyễn Văn A</td>
                    <td className="py-3">Việt Nam</td>
                    <td className="py-3 font-mono">040509785</td>
                  </tr>
                  <tr className="border-b border-[#F8F9FA]">
                    <td className="py-3">2</td>
                    <td className="py-3 font-medium">Lê Thị B</td>
                    <td className="py-3">Việt Nam</td>
                    <td className="py-3 font-mono">040612459</td>
                  </tr>
                  <tr>
                    <td className="py-3">3</td>
                    <td className="py-3 font-medium">Trần C</td>
                    <td className="py-3">Hoa Kỳ</td>
                    <td className="py-3 font-mono">030578415</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 3. CẤU TRÚC YÊU CẦU BẢO HỘ */}
        <section className="bg-white rounded-lg border border-[#DEE2E6] overflow-hidden">
          <div className="bg-[#F8F9FA] px-6 py-3 border-b border-[#DEE2E6] flex items-center gap-2">
            <Layers size={18} className="text-[#495057]" />
            <h2 className="font-bold text-[#495057]">3. Cấu trúc yêu cầu bảo hộ</h2>
          </div>
          <div className="divide-y divide-[#F1F3F5]">
            {[
              "Yêu cầu 1. Độc lập: Một hệ thống quản lý thông tin sở hữu trí...",
              "Yêu cầu 2. Độc lập: Một phương pháp để tự động hóa quy trình theo...",
              "Yêu cầu 3. Độc lập: Một thiết bị xử lý dữ liệu cho hệ thống..."
            ].map((text, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer group">
                <span className="text-sm text-[#495057]">{text}</span>
                <ChevronDown size={16} className="text-[#ADB5BD] group-hover:text-[#495057]" />
              </div>
            ))}
          </div>
        </section>

        {/* 4. TÀI LIỆU & BIÊN LAI */}
        <div className="grid grid-cols-2 gap-6">
          <section className="bg-white rounded-lg border border-[#DEE2E6] overflow-hidden">
            <div className="bg-[#F8F9FA] px-6 py-3 border-b border-[#DEE2E6] flex items-center gap-2">
              <FileText size={18} className="text-[#495057]" />
              <h2 className="font-bold text-[#495057]">4. Tài liệu đính kèm</h2>
            </div>
            <div className="p-4 space-y-4">
               <div className="space-y-2">
                 <p className="text-[11px] font-bold text-[#ADB5BD] uppercase tracking-wider">Tài liệu kỹ thuật</p>
                 {[
                   "Bản mô tả sáng chế",
                   "Hình vẽ kỹ thuật",
                   "Yêu cầu bảo hộ"
                 ].map(doc => (
                   <div key={doc} className="flex items-center justify-between p-2 hover:bg-[#F8F9FA] rounded group">
                     <span className="text-sm flex items-center gap-2"><FileText size={14} className="text-[#ADB5BD]" /> {doc}</span>
                     <button className="text-[#0D6EFD] text-xs font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                       Tải xuống <Download size={12} />
                     </button>
                   </div>
                 ))}
               </div>
               <div className="space-y-2 pt-2">
                 <p className="text-[11px] font-bold text-[#ADB5BD] uppercase tracking-wider">Tài liệu hành chính</p>
                 <div className="flex items-center justify-between p-2 hover:bg-[#F8F9FA] rounded group">
                    <span className="text-sm flex items-center gap-2"><FileText size={14} className="text-[#ADB5BD]" /> Tờ khai đăng ký</span>
                    <button className="text-[#0D6EFD] text-xs font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Tải xuống <Download size={12} />
                    </button>
                 </div>
               </div>
            </div>
          </section>

          <section className="bg-white rounded-lg border border-[#DEE2E6] overflow-hidden flex flex-col">
            <div className="bg-[#F8F9FA] px-6 py-3 border-b border-[#DEE2E6] flex items-center gap-2">
              <FileText size={18} className="text-[#495057]" />
              <h2 className="font-bold text-[#495057]">Biên lai theo giai đoạn</h2>
            </div>
            <div className="p-4 flex-1 divide-y divide-[#F1F3F5]">
              <div className="py-2 flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">📜 Nộp đơn + Thẩm định hình thức</span>
                <span className="text-[11px] text-[#0D6EFD] italic font-medium">01/01/2025 ↓</span>
              </div>
              <div className="py-4 flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">📜 Thẩm định nội dung</span>
                <button className="px-3 py-1 bg-[#6F42C1] text-white text-[10px] font-bold rounded hover:bg-[#59359a]">Chưa đến GĐ</button>
              </div>
              <div className="py-4 flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">📜 Cấp văn bằng</span>
                <button className="px-3 py-1 bg-[#6F42C1] text-white text-[10px] font-bold rounded hover:bg-[#59359a]">Chưa đến GĐ</button>
              </div>
            </div>
          </section>
        </div>

        {/* 5. NHẬT KÝ HOẠT ĐỘNG */}
        <section className="bg-white rounded-lg border border-[#DEE2E6] overflow-hidden">
          <div className="bg-[#F8F9FA] px-6 py-3 border-b border-[#DEE2E6] flex items-center gap-2">
            <History size={18} className="text-[#495057]" />
            <h2 className="font-bold text-[#495057]">5. Nhật ký hoạt động</h2>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-[#F8F9FA] text-[#6C757D] text-[11px] uppercase border-b border-[#DEE2E6] text-left">
              <tr>
                <th className="px-6 py-3 font-semibold">Thời gian</th>
                <th className="px-6 py-3 font-semibold">Hành động</th>
                <th className="px-6 py-3 font-semibold">Mô tả</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-[#F8F9FA]">
              <tr>
                <td className="px-6 py-4 text-[#6C757D] font-medium">14:30 01/01/2025</td>
                <td className="px-6 py-4 font-bold text-[#212529]">Nộp đơn sáng chế</td>
                <td className="px-6 py-4 text-[#495057]">Đơn sáng chế VN/2025/01/00001 đã được nộp thành công.</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-[#6C757D] font-medium">09:00 05/01/2025</td>
                <td className="px-6 py-4 font-bold text-[#212529]">Yêu cầu bổ sung</td>
                <td className="px-6 py-4 text-[#495057]">Cục SHTT yêu cầu bổ sung tài liệu về hình vẽ kỹ thuật.</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-[#6C757D] font-medium">11:00 08/01/2025</td>
                <td className="px-6 py-4 font-bold text-[#212529]">Bổ sung tài liệu</td>
                <td className="px-6 py-4 text-[#495057]">Đã nộp bổ sung hình vẽ kỹ thuật theo yêu cầu.</td>
              </tr>
              <tr className="bg-[#F8F9FA]">
                <td className="px-6 py-4 text-[#6C757D] font-medium">10:00 15/01/2025</td>
                <td className="px-6 py-4 font-bold text-[#212529]">Thẩm định hình thức hoàn tất</td>
                <td className="px-6 py-4 text-[#495057]">Đơn đã qua thẩm định hình thức, chờ công bố.</td>
              </tr>
            </tbody>
          </table>
        </section>
      </main>

      {/* FOOTER ACTIONS BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#DEE2E6] p-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Progress Indicator */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#198754]"></div>
              <span className="text-[10px] font-bold text-[#198754] uppercase tracking-wider">Tiếp nhận</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_0_2px_rgba(13,110,253,0.2)]"></div>
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider underline underline-offset-4">Thẩm định hình thức</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#DEE2E6]"></div>
              <span className="text-[10px] font-bold text-[#ADB5BD] uppercase tracking-wider">Thẩm định nội dung</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full border border-[#ADB5BD]"></div>
              <span className="text-[10px] font-bold text-[#ADB5BD] uppercase tracking-wider">Đang thẩm định</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
          {/* Nút Chấp nhận hình thức */}
            <button 
              onClick={() => navigate(`/examiner/review/${type}/${id}/accept`)}
              className="px-4 py-2 bg-[#198754] text-white text-[11px] font-bold rounded-md flex items-center gap-2 hover:bg-[#157347] transition-all"
            >
            <CheckCircle size={14} /> Chấp nhận hình thức
            </button>

            {/* Nút Yêu cầu sửa đổi */}
            <button 
              onClick={() => navigate(`/examiner/review/${type}/${id}/correction`)}
              className="px-4 py-2 bg-white text-[#FD7E14] border border-[#FD7E14] text-[11px] font-bold rounded-md flex items-center gap-2 hover:bg-[#fff3e6] transition-all"
            >
            <AlertTriangle size={14} /> Yêu cầu sửa đổi
            </button>

            {/* Nút Từ chối đơn */}
            <button 
              onClick={() => navigate(`/examiner/review/${type}/${id}/reject`)}
              className="px-4 py-2 bg-[#DC3545] text-white text-[11px] font-bold rounded-md flex items-center gap-2 hover:bg-[#bb2d3b] transition-all"
            >
                  <XCircle size={14} /> Từ chối đơn
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationReview;