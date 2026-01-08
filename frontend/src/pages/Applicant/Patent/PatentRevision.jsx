import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Send, AlertCircle, Info, History, MessageSquare } from "lucide-react";

// Import Provider và Hook
import { FilingProvider, useFilingData } from "./Filing/FilingContext";

// Import các Step cũ
import Step1_GeneralInfo from "./Filing/Step1_GeneralInfo";
import Step2_OwnerAuthor from "./Filing/Step2_OwnerAuthor";
import Step3_Attachments from "./Filing/Step3_Attachments";
import Step4_Claims from "./Filing/Step4_Claims";

const RevisionContent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { formData, setWholeFormData, updateFormData } = useFilingData(); // Lấy từ Context
  const [correction, setCorrection] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [appRes, noteRes] = await Promise.all([
          fetch(`http://localhost:8080/api/patents/${id}`),
          fetch(`http://localhost:8080/api/patents/${id}/correction-detail`)
        ]);
        const appData = await appRes.json();
        const noteData = await noteRes.json();

        // NẠP DỮ LIỆU VÀO CONTEXT
        setWholeFormData({
          ...appData,
          summary: appData.summary || "",
          title: appData.title || "",
          ownerName: appData.applicant?.fullName || "",
          ownerId: appData.applicant?.idNumber || "",
          ownerAddress: appData.applicant?.address || "",
          ownerPhone: appData.applicant?.phone || "",
          ownerEmail: appData.applicant?.email || "",
          ownerType: appData.applicant?.type === "CA_NHAN" ? "Cá nhân" : "Tổ chức",
          authors: appData.authors || [],
          claims: appData.claims || [],
          attachments: appData.attachments || []
        });
        setCorrection(noteData);
      } catch (error) { console.error(error); }
      finally { setLoading(false); }
    };
    fetchAll();
  }, [id]);

  const handleResubmit = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/patents/${id}/resubmit`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData), // Gửi formData từ Context
      });
      if (res.ok) {
        alert("Nộp lại thành công!");
        navigate("/applicant/patent");
      }
    } catch (e) { alert("Lỗi nộp đơn!"); }
  };

  if (loading) return <div className="h-screen flex items-center justify-center">Đang nạp dữ liệu...</div>;

  return (
    <div className="flex h-screen bg-[#F8F9FA] overflow-hidden">
      {/* BÊN TRÁI (3/4) - CUỘN ĐƯỢC */}
      <div className="w-3/4 overflow-y-auto p-8 border-r bg-white">
        <div className="max-w-4xl mx-auto space-y-12 pb-24">
          <header className="flex justify-between items-center border-b pb-4">
            <h1 className="text-xl font-black uppercase text-slate-800">Sửa đổi hồ sơ: {formData?.appNo}</h1>
            <button onClick={() => navigate(-1)} className="text-sm flex items-center gap-1 text-gray-500 hover:text-blue-600">
              <ChevronLeft size={16}/> Quay lại
            </button>
          </header>

          <div className="bg-blue-50 p-4 rounded-xl text-blue-700 text-sm flex gap-2">
            <Info size={20}/> Vui lòng sửa các mục bị lỗi dựa theo ghi chú bên phải.
          </div>

          {/* Render các Step nhưng truyền thêm Prop để chúng biết đang ở chế độ Revision */}
          <Step1_GeneralInfo isRevision={true} />
          <Step2_OwnerAuthor isRevision={true} />
          <Step3_Attachments isRevision={true} />
          <Step4_Claims isRevision={true} />
        </div>

        {/* NÚT SUBMIT CỐ ĐỊNH Ở 3/4 */}
        <div className="fixed bottom-0 left-0 w-3/4 bg-white border-t p-4 flex justify-end pr-12 shadow-md">
           <button onClick={handleResubmit} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100">
             NỘP LẠI HỒ SƠ CHỈNH SỬA
           </button>
        </div>
      </div>

      {/* BÊN PHẢI (1/4) - CỐ ĐỊNH */}
      <aside className="w-1/4 bg-slate-50 p-6 shadow-inner overflow-y-auto">
        <div className="bg-orange-500 text-white p-5 rounded-2xl shadow-lg mb-6">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare size={18} />
            <span className="font-bold text-xs uppercase">Lời nhắn chuyên viên</span>
          </div>
          <p className="text-sm italic leading-relaxed">"{correction?.note || "Kiểm tra lại hồ sơ."}"</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 space-y-4">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Thống kê lần sửa</h3>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Giai đoạn:</span>
            <span className="font-bold text-orange-600">{correction?.status}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Số lần sửa:</span>
            <span className="font-bold">{(formData?.formalRevisionCount || 0) + (formData?.substantiveRevisionCount || 0)}</span>
          </div>
        </div>
      </aside>
    </div>
  );
};

// Component bao ngoài cùng để cung cấp Context
const PatentRevision = () => (
  <FilingProvider>
    <RevisionContent />
  </FilingProvider>
);

export default PatentRevision;