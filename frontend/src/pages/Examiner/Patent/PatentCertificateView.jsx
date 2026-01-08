import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Printer, Award, ShieldCheck, CheckCircle2 } from "lucide-react";
import QRCode from "qrcode"; // Sử dụng thư viện qrcode thuần để tránh lỗi Hook trên React 19

const PatentCertificateView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qrUrl, setQrUrl] = useState(""); // State lưu ảnh QR Code

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/patents/${id}`);
        const data = await response.json();
        setApp(data);

        // --- LOGIC TẠO QR CODE THỰC TẾ ---
        const qrContent = `
BẰNG ĐỘC QUYỀN ${data.appType === 'SANG_CHE' ? 'SÁNG CHẾ' : 'GIẢI PHÁP HỮU ÍCH'}
Số bằng: ${data.appNo?.replace("SC", "PAT")}
Tên: ${data.title}
Chủ bằng: ${data.applicant?.fullName}
Xác thực: http://ipms.gov.vn/verify/${id}
        `.trim();

        const url = await QRCode.toDataURL(qrContent, {
          width: 200,
          margin: 1,
          color: { dark: "#000000", light: "#ffffff" }
        });
        setQrUrl(url);

      } catch (error) {
        console.error("Lỗi:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handlePrint = () => window.print();

  if (loading) return <div className="text-center p-20 font-sans">Đang tạo văn bằng...</div>;
  if (!app) return <div className="text-center p-20 font-sans">Không tìm thấy dữ liệu.</div>;

  return (
    <div className="min-h-screen bg-gray-200 py-12 font-document">
      {/* Nhúng Font chuẩn từ Google Fonts */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,700;1,400&family=Lora:ital,wght@0,400;0,700;1,400&display=swap');
          
          .font-document { font-family: 'EB Garamond', serif; }
          .font-header { font-family: 'Lora', serif; }

          @media print {
            .no-print { display: none !important; }
            body { background: white; padding: 0; }
            .certificate-container { 
              box-shadow: none !important; 
              border: 4px solid #78350f !important;
              margin: 0 !important;
              width: 100% !important;
            }
          }

          .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-30deg);
            font-size: 8rem;
            color: rgba(153, 27, 27, 0.03);
            pointer-events: none;
            text-transform: uppercase;
            white-space: nowrap;
            font-weight: 900;
          }
        `}
      </style>

      {/* Điều hướng */}
      <div className="max-w-[210mm] mx-auto mb-6 flex justify-between items-center no-print px-6 font-sans">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-black font-bold transition-all">
          <ChevronLeft size={18} /> QUAY LẠI HỒ SƠ
        </button>
        <button onClick={handlePrint} className="flex items-center gap-2 bg-amber-800 text-white px-6 py-2 rounded-full shadow-lg hover:bg-amber-900 transition-all font-bold">
          <Printer size={18} /> IN VĂN BẰNG (A4)
        </button>
      </div>

      {/* GIẤY VĂN BẰNG */}
      <div className="certificate-container relative max-w-[210mm] min-h-[297mm] mx-auto bg-[#fffdf5] shadow-[0_0_50px_rgba(0,0,0,0.2)] p-[20mm] border-[2px] border-[#c4a484] m-4">
        
        {/* Border hoa văn nội bộ */}
        <div className="absolute inset-[10mm] border-[1px] border-[#c4a484] pointer-events-none"></div>
        <div className="watermark">IPMS VIETNAM</div>

        {/* Header Hành Chính */}
        <div className="text-center space-y-1 relative z-10">
          <h3 className="font-bold text-lg font-header uppercase tracking-tighter">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h3>
          <h4 className="font-bold text-md font-header tracking-tight">Độc lập - Tự do - Hạnh phúc</h4>
          <div className="w-40 h-[1.5px] bg-black mx-auto mt-1"></div>
        </div>

        {/* Logo & Danh hiệu */}
        <div className="text-center mt-20 mb-12 relative z-10">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Award size={100} className="text-amber-700/20" />
              <ShieldCheck size={48} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-amber-800" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-amber-900 uppercase tracking-widest mb-2 font-header">BẰNG ĐỘC QUYỀN {app.appType === 'SANG_CHE' ? 'SÁNG CHẾ' : 'GIẢI PHÁP HỮU ÍCH'}</h1>
          <p className="text-xl">Số: <span className="font-bold text-red-800 font-sans tracking-widest">{app.appNo?.replace("SC", "PAT") || "PAT20260001"}</span></p>
        </div>

        {/* Nội dung chi tiết */}
        <div className="space-y-8 px-12 text-[17px] leading-relaxed relative z-10">
          <p className="indent-8 italic">
            Căn cứ Luật Sở hữu trí tuệ; Căn cứ Quyết định số 1234/QĐ-SHTT ngày {new Date().toLocaleDateString('vi-VN')} về việc cấp Bằng độc quyền.
          </p>

          <div className="space-y-6 bg-white/40 p-8 rounded-xl border border-amber-100">
            <div className="grid grid-cols-[180px_1fr]">
              <span className="font-bold">Chủ văn bằng:</span>
              <div className="uppercase font-bold text-gray-900 leading-tight">
                {app.applicant?.fullName}
                <p className="normal-case font-normal text-sm text-gray-600 mt-1 italic tracking-tight">{app.applicant?.address}</p>
              </div>
            </div>

            <div className="grid grid-cols-[180px_1fr]">
              <span className="font-bold">Tác giả:</span>
              <span className="text-gray-800">{app.authors?.map(a => a.fullName).join(", ")}</span>
            </div>

            <div className="grid grid-cols-[180px_1fr]">
              <span className="font-bold italic">Tên Sáng chế:</span>
              <span className="font-bold text-blue-900 leading-snug">"{app.title.toUpperCase()}"</span>
            </div>

            <div className="grid grid-cols-2 pt-4 border-t border-amber-50">
              <p><span className="font-bold">Số đơn:</span> <span className="font-sans text-sm">{app.appNo}</span></p>
              <p><span className="font-bold">Ngày nộp đơn:</span> <span className="font-sans text-sm">{new Date(app.createdAt).toLocaleDateString('vi-VN')}</span></p>
            </div>
          </div>

          <p className="text-justify leading-relaxed">
            Bằng này có hiệu lực từ ngày cấp đến hết 20 năm tính từ ngày nộp đơn, với điều kiện chủ văn bằng phải nộp phí duy trì hiệu lực theo quy định của pháp luật hiện hành.
          </p>
        </div>

        {/* Ký tên & Con dấu điện tử */}
        <div className="mt-20 flex justify-end px-12 relative z-10">
          <div className="text-center relative">
            <div className="mb-24">
              <p className="font-bold font-header">CỤC TRƯỞNG CỤC SỞ HỮU TRÍ TUỆ</p>
              <p className="text-sm italic">(Đã ký điện tử)</p>
            </div>
            
            {/* Giả lập con dấu đỏ điện tử */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-44 h-44 border-4 border-red-600 rounded-full flex items-center justify-center opacity-60 rotate-12 pointer-events-none">
              <div className="border-2 border-red-600 rounded-full w-[92%] h-[92%] flex flex-col items-center justify-center text-red-600 font-bold p-2">
                <p className="text-[10px] uppercase">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
                <div className="w-full h-[1px] bg-red-600 my-1"></div>
                <p className="text-[12px] uppercase">CỤC SỞ HỮU TRÍ TUỆ</p>
                <CheckCircle2 size={24} className="mt-1" />
              </div>
            </div>

            <p className="font-bold text-xl font-header uppercase tracking-tighter">Cục Sở hữu trí tuệ</p>
          </div>
        </div>

        {/* QR Code verify - Đã thay ô vuông đen bằng ảnh QR thật */}
        <div className="absolute bottom-12 left-16 flex items-center gap-4 z-10">
           <div className="w-20 h-20 bg-white border border-gray-200 flex items-center justify-center shadow-sm">
             {qrUrl ? (
                <img src={qrUrl} alt="QR Code" className="w-full h-full p-1" />
             ) : (
                <div className="text-[8px] text-gray-400">Loading QR...</div>
             )}
           </div>
           <p className="text-[10px] w-24 leading-tight italic opacity-60">
             Quét mã để truy xuất và đối chiếu dữ liệu gốc tại hệ thống IPMS Việt Nam.
           </p>
        </div>
      </div>
    </div>
  );
};

export default PatentCertificateView;