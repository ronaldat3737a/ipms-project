import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  ChevronLeft, Download, Info, Users, FileText, 
  Layers, History, CreditCard, CheckCircle2, Award, 
  Search, XCircle, AlertCircle, Eye, Edit3, Camera
} from "lucide-react";

const DesignDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [data, setData] = useState({ application: null, detail: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8080/api/industrial-designs/${id}`);
        if (!response.ok) throw new Error("Lỗi tải dữ liệu");
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
    <div className="h-screen flex items-center justify-center font-sans text-gray-500 bg-gray-50">
      Đang tải toàn bộ chi tiết hồ sơ {id}...
    </div>
  );

  if (!application || !detail) return <div className="p-10 text-center font-sans">Không tìm thấy dữ liệu hồ sơ.</div>;

  const legalDocs = application.attachments?.filter(att => att.docType === 'TO_KHAI') || [];
  const descriptionDocs = application.attachments?.filter(att => att.docType === 'BAN_MO_TA') || [];
  const productImages = application.attachments?.filter(att => att.docType === 'ANH_CHUP') || [];

  const viewTypeLabels = {
    PHOI_CANH: 'Ảnh phối cảnh',
    MAT_TRUOC: 'Mặt trước',
    MAT_SAU: 'Mặt sau',
    MAT_TRAI: 'Mặt trái',
    MAT_PHAI: 'Mặt phải',
    MAT_TREN: 'Nhìn từ trên',
    MAT_DUOI: 'Nhìn từ dưới',
  };

  const allViewTypes = ['PHOI_CANH', 'MAT_TRUOC', 'MAT_SAU', 'MAT_TRAI', 'MAT_PHAI', 'MAT_TREN', 'MAT_DUOI'];

  const getImageByViewType = (viewType) => {
    return productImages.find(img => img.viewType === viewType);
  };

  const renderSlaMessage = () => {
    switch (application.status) {
      case 'DANG_TD_HINH_THUC':
        return "Thời hạn thẩm định hình thức: 01 tháng tính từ ngày nộp đơn.";
      case 'DANG_TD_NOI_DUNG':
        return "Thời hạn thẩm định nội dung: Tối đa 07 tháng tính từ ngày công bố đơn.";
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24 font-sans text-[#333]">
      {/* --- HEADER --- */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#E9ECEF] px-6 py-3 flex items-center justify-between shadow-sm">
        <button 
          onClick={() => navigate('/applicant/applications/KIEU_DANG_CN')}
          className="flex items-center gap-2 text-sm text-[#495057] hover:bg-gray-100 px-3 py-1.5 rounded-md border border-[#DEE2E6] transition-all"
        >
          <ChevronLeft size={16} /> Quay lại danh sách
        </button>
        
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold text-[#212529]">
            Chi tiết đơn KDCN: <span className="text-[#0D6EFD]">{application.appNo || "Đang cấp mã"}</span>
          </h1>
          <span className="px-4 py-1 bg-blue-50 text-blue-600 text-[11px] font-bold rounded-full border border-blue-100 uppercase tracking-wider">
            {application.status}
          </span>
        </div>
        
        <div className="w-[140px] flex justify-end">
             <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                ND
             </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto mt-6 px-4 space-y-6">
        
        {renderSlaMessage() && (
            <div className="bg-blue-50 border-l-4 border-blue-400 text-blue-800 p-4 rounded-r-lg" role="alert">
                <p className="font-bold">Thông tin SLA</p>
                <p>{renderSlaMessage()}</p>
            </div>
        )}

        {/* 1. THÔNG TIN CHUNG */}
        <section className="bg-white rounded-xl border border-[#DEE2E6] shadow-sm overflow-hidden">
          <div className="bg-[#F8F9FA] px-6 py-4 border-b border-[#DEE2E6] flex items-center gap-2">
            <Info size={18} className="text-blue-600" />
            <h2 className="font-bold text-[#495057] uppercase text-sm tracking-wide">1. Thông tin chung</h2>
          </div>
          <div className="p-6 space-y-4 text-sm">
            <div className="grid grid-cols-[220px_1fr] border-b border-[#F1F3F5] pb-3">
              <span className="text-[#6C757D] font-medium">Tên Kiểu dáng công nghiệp</span>
              <span className="font-bold text-slate-800 text-base">{application.title}</span>
            </div>
            <div className="grid grid-cols-[220px_1fr] border-b border-[#F1F3F5] pb-3">
              <span className="text-[#6C757D] font-medium">Lĩnh vực sử dụng</span>
              <span className="bg-gray-50 px-2 py-1 rounded border border-gray-100 text-xs w-fit">{detail.usageField}</span>
            </div>
            <div className="grid grid-cols-[220px_1fr] border-b border-[#F1F3F5] pb-3">
              <span className="text-[#6C757D] font-medium">Mã phân loại Locarno</span>
              <div className="flex gap-2">
                {detail.locarnoCodes?.map(code => (
                  <span key={code} className="px-2 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-md font-mono text-xs">{code}</span>
                )) || <span className="text-gray-400 italic">Chưa có mã</span>}
              </div>
            </div>
          </div>
        </section>

        {/* 2. BỘ ẢNH CHỤP/BẢN VẼ SẢN PHẨM */}
        <section className="bg-white rounded-xl border border-[#DEE2E6] shadow-sm overflow-hidden">
          <div className="bg-[#F8F9FA] px-6 py-4 border-b border-[#DEE2E6] flex items-center gap-2">
            <Camera size={18} className="text-blue-600" />
            <h2 className="font-bold text-[#495057] uppercase text-sm tracking-wide">2. Bộ ảnh chụp/Bản vẽ sản phẩm</h2>
          </div>
          <div className="p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {allViewTypes.map(viewType => {
              const image = getImageByViewType(viewType);
              return (
                <div key={viewType} className="aspect-w-1 aspect-h-1">
                  <div className="font-bold text-xs text-center text-gray-500 mb-2">{viewTypeLabels[viewType]}</div>
                  {image ? (
                    <a 
                      href={`http://localhost:8080/uploads/${image.fileUrl}`} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="aspect-square block border-2 border-dashed rounded-xl hover:border-blue-400 transition-all group overflow-hidden relative"
                    >
                      <img src={`http://localhost:8080/uploads/${image.fileUrl}`} alt={image.fileName} className="w-full h-full object-cover"/>
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Eye size={32} className="text-white"/>
                      </div>
                    </a>
                  ) : (
                    <div className="aspect-square flex items-center justify-center bg-gray-50 border-2 border-dashed rounded-xl text-gray-400 text-xs italic">
                      Chưa cung cấp
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* 3. TÀI LIỆU ĐÍNH KÈM HỆ THỐNG */}
        <section className="bg-white rounded-xl border border-[#DEE2E6] shadow-sm overflow-hidden">
          <div className="bg-[#F8F9FA] px-6 py-4 border-b border-[#DEE2E6] flex items-center gap-2">
            <FileText size={18} className="text-blue-600" />
            <h2 className="font-bold text-[#495057] uppercase text-sm tracking-wide">3. Tài liệu đính kèm hệ thống</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...legalDocs, ...descriptionDocs].map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-dashed rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white border rounded-lg flex items-center justify-center text-blue-500">
                    <FileText size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700">{doc.docType === 'TO_KHAI' ? 'Tờ khai' : 'Bản mô tả'}</p>
                    <p className="text-[10px] text-slate-400">{doc.fileName}</p>
                  </div>
                </div>
                <a 
                  href={`http://localhost:8080/uploads/${doc.fileUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white text-blue-600 rounded-full border shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-600 hover:text-white"
                >
                  <Download size={16} />
                </a>
              </div>
            ))}
          </div>
        </section>
        
        {/* ... other sections ... */}

      </main>
    </div>
  );
};

export default DesignDetail;