import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  ChevronLeft, Download, Eye, CheckCircle, AlertTriangle, 
  XCircle, Info, Users, FileText, Layers, History,
  Award, Search, Camera, CheckSquare, Sparkles, Factory
} from "lucide-react";

const DesignReview = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [data, setData] = useState({ application: null, detail: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8080/api/industrial-designs/${id}`);
        const fetchedData = await response.json();
        setData(fetchedData);
      } catch (error) {
        console.error("Lỗi lấy chi tiết hồ sơ:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetail();
  }, [id]);
  
  const { application, detail } = data;

  if (loading) return (
    <div className="h-screen flex items-center justify-center font-sans text-gray-500">
      Đang tải chi tiết hồ sơ KDCN {id}...
    </div>
  );

  if (!application || !detail) return <div className="p-10 text-center">Không tìm thấy dữ liệu hồ sơ.</div>;
  
  const imageAttachments = application.attachments?.filter(att => att.category === 'HINH_ANH') || [];

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24 font-sans text-[#333]">
      <header className="sticky top-0 z-50 bg-white border-b border-[#E9ECEF] px-6 py-3 flex items-center justify-between shadow-sm">
        <button 
          onClick={() => navigate('/examiner/applications/KIEU_DANG_CN')}
          className="flex items-center gap-2 text-sm text-[#495057] hover:bg-gray-100 px-3 py-1.5 rounded-md border border-[#DEE2E6]"
        >
          <ChevronLeft size={16} /> Quay lại danh sách
        </button>
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold text-[#212529]">
            Thẩm định đơn KDCN: <span className="text-blue-600">{application.appNo || "Chưa cấp mã"}</span>
          </h1>
          <span className="px-3 py-1 bg-white text-slate-500 text-[10px] font-bold rounded-full border border-slate-200 shadow-sm">
            {application.status}
          </span>
        </div>
        <div className="w-[140px]"></div>
      </header>

      <main className="max-w-6xl mx-auto mt-6 px-4 space-y-6">
        
        {/* THÔNG TIN CHUNG */}
        <section className="bg-white rounded-lg border border-[#DEE2E6] overflow-hidden">
          <div className="bg-[#F8F9FA] px-6 py-3 border-b border-[#DEE2E6] flex items-center gap-2">
            <Info size={18} />
            <h2 className="font-bold text-[#495057]">1. Thông tin chung KDCN</h2>
          </div>
          <div className="p-6 space-y-4 text-sm">
            <div className="grid grid-cols-[200px_1fr] border-b pb-3">
              <span className="text-[#6C757D]">Tên KDCN</span>
              <span className="font-medium text-blue-900">{application.title}</span>
            </div>
            <div className="grid grid-cols-[200px_1fr] border-b pb-3">
              <span className="text-[#6C757D]">Lĩnh vực sử dụng</span>
              <span className="font-bold text-slate-700">{detail.usageField}</span>
            </div>
            <div className="grid grid-cols-[200px_1fr] border-b pb-3">
              <span className="text-[#6C757D]">Mã Locarno</span>
              <div className="flex gap-2 font-mono text-xs">
                {detail.locarnoCodes?.map(code => (
                  <span key={code} className="px-2 py-0.5 bg-[#F8F9FA] border rounded">{code}</span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-[200px_1fr]">
              <span className="text-[#6C757D]">Kiểu dáng tương tự</span>
              <p className="text-[#495057] italic">{detail.similarDesign || "Không có"}</p>
            </div>
          </div>
        </section>

        {/* BỘ ẢNH CHỤP */}
        <section className="bg-white rounded-lg border border-[#DEE2E6] overflow-hidden">
            <div className="bg-[#F8F9FA] px-6 py-3 border-b flex items-center gap-2">
                <Camera size={18} />
                <h2 className="font-bold text-[#495057]">2. Bộ ảnh chụp/bản vẽ sản phẩm</h2>
            </div>
            <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {imageAttachments.map(doc => (
                    <a key={doc.id} href={`http://localhost:8080/uploads/${doc.fileUrl}`} target="_blank" rel="noopener noreferrer" className="aspect-w-1 aspect-h-1 group block">
                        <img src={`http://localhost:8080/uploads/${doc.fileUrl}`} alt={doc.fileName} className="w-full h-full object-cover rounded-lg border-2 border-transparent group-hover:border-blue-500 transition"/>
                    </a>
                ))}
            </div>
        </section>
        
        {/* MÔ TẢ & YÊU CẦU */}
        <section className="bg-white rounded-lg border border-[#DEE2E6] overflow-hidden">
            <div className="bg-[#F8F9FA] px-6 py-3 border-b flex items-center gap-2">
                <FileText size={18} />
                <h2 className="font-bold text-[#495057]">3. Mô tả chi tiết & Yêu cầu bảo hộ</h2>
            </div>
            <div className="p-6 space-y-6">
                <div>
                    <h3 className="text-xs font-bold uppercase text-gray-500 mb-2">Phần mô tả chi tiết</h3>
                    <p className="text-sm bg-gray-50 p-4 rounded-md border">{detail.descriptionDetail}</p>
                </div>
                 <div>
                    <h3 className="text-xs font-bold uppercase text-gray-500 mb-2">Yêu cầu bảo hộ</h3>
                    <p className="text-sm bg-gray-50 p-4 rounded-md border">{detail.claims}</p>
                </div>
            </div>
        </section>

      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
                <p className="text-sm font-bold">Tiêu chí thẩm định:</p>
                <span className="flex items-center gap-2 text-xs font-semibold bg-gray-100 px-3 py-1 rounded-full"><CheckSquare size={14} className="text-green-500"/>Tính mới</span>
                <span className="flex items-center gap-2 text-xs font-semibold bg-gray-100 px-3 py-1 rounded-full"><Sparkles size={14} className="text-yellow-500"/>Tính sáng tạo</span>
                <span className="flex items-center gap-2 text-xs font-semibold bg-gray-100 px-3 py-1 rounded-full"><Factory size={14} className="text-blue-500"/>Khả năng áp dụng công nghiệp</span>
            </div>
            <div className="flex items-center gap-3">
                <button onClick={() => navigate(`/examiner/review/KIEU_DANG_CN/${id}/accept`)} className="px-4 py-2 bg-green-600 text-white text-xs font-bold rounded-md flex items-center gap-2 hover:bg-green-700">
                    <CheckCircle size={14} /> Chấp nhận
                </button>
                <button onClick={() => navigate(`/examiner/review/KIEU_DANG_CN/${id}/correction`)} className="px-4 py-2 bg-amber-500 text-white text-xs font-bold rounded-md flex items-center gap-2 hover:bg-amber-600">
                    <AlertTriangle size={14} /> Yêu cầu sửa đổi
                </button>
                <button onClick={() => navigate(`/examiner/review/KIEU_DANG_CN/${id}/reject`)} className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-md flex items-center gap-2 hover:bg-red-700">
                    <XCircle size={14} /> Từ chối
                </button>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default DesignReview;