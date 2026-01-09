import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios"; // Dùng axios để gửi FormData dễ hơn
import { ChevronLeft, Send, AlertCircle, Info, History, MessageSquare, Loader2 } from "lucide-react";

// Import Provider và Hook
import { FilingProvider, useFilingData } from "./Filing/FilingContext";

// Import các Step cũ
import Step1_GeneralInfo from "./Filing/Step1_GeneralInfo";
import Step2_OwnerAuthor from "./Filing/Step2_OwnerAuthor";
import Step3_Attachments from "./Filing/Step3_Attachments";
import Step4_Claims from "./Filing/Step4_Claims";

const RevisionContent = () => {
  const { id, type } = useParams();
  const navigate = useNavigate();
  const { formData, setWholeFormData } = useFilingData(); 
  const [correction, setCorrection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false); // Trạng thái khi đang nộp

  const [hasLoaded, setHasLoaded] = useState(false);

useEffect(() => {
  if (hasLoaded) return;
  const fetchAll = async () => {
    try {
      const [appRes, noteRes] = await Promise.all([
        fetch(`http://localhost:8080/api/patents/${id}`),
        fetch(`http://localhost:8080/api/patents/${id}/correction-detail`)
      ]);
      const appData = await appRes.json();
      const noteData = await noteRes.json();

      // Chỉ cần gọi hàm này, Context sẽ lo hết phần mapping định dạng!
      setWholeFormData(appData); 
      setCorrection(noteData);
      setHasLoaded(true);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };
  fetchAll();
}, [id, hasLoaded, setWholeFormData]);

  const handleResubmit = async () => {
  setSubmitting(true);
  const API_BASE_URL = "http://localhost:8080";

  try {
    const submissionData = new FormData();
    const { ipcCode, appType, solutionType, filingBasis, attachments, ...restOfData } = formData;

    const reverseMapFilingBasis = (val) => {
      const map = {
        "Tác giả đồng thời là người nộp đơn": 'AUTHOR_IS_APPLICANT',
        "Thụ hưởng do thuê/giao việc (Sáng chế công vụ)": 'EMPLOYMENT',
        "Thụ hưởng theo Hợp đồng chuyển giao": 'CONTRACT',
        "Thụ hưởng do Thừa kế": 'INHERITANCE'
      };
      return map[val] || val; 
    };

    const finalPayload = {
      ...restOfData,
      appType: appType === "Sáng chế" ? "SANG_CHE" : "GIAI_PHAP_HUU_ICH",
      solutionType: solutionType === "Quy trình" ? "QUY_TRINH" : "SAN_PHAM",
      filingBasis: reverseMapFilingBasis(filingBasis),
      ipcCodes: ipcCode ? ipcCode.split(",").map(item => item.trim()).filter(item => item !== "") : []
    };

    submissionData.append("patentData", JSON.stringify(finalPayload));

    if (attachments && attachments.length > 0) {
      attachments.forEach((att) => {
        if (att.file) {
          submissionData.append("files", att.file);
        }
      });
    }

    const res = await axios.put(
      `${API_BASE_URL}/api/patents/${id}/resubmit`,
      submissionData,
      {
        headers: {
          "ngrok-skip-browser-warning": "69420"
        }
      }
    );

    if (res.status === 200 || res.status === 204) {
      alert("✅ Chúc mừng! Hồ sơ đã được cập nhật và gửi lại thành công.");
      navigate(`/applicant/applications/${type}`);
    }

  } catch (error) {
    console.error("Lỗi chi tiết khi Resubmit:", error.response?.data);
    const serverMsg = error.response?.data?.message || "Lỗi hệ thống khi xử lý dữ liệu.";
    alert(`❌ Không thể nộp đơn: ${serverMsg}`);
  } finally {
    setSubmitting(false);
  }
};

const handleResubmitFallback = async () => {
    const submissionData = new FormData();
    const { attachments, ...restOfData } = formData;
    submissionData.append("patentData", JSON.stringify(restOfData));
    attachments.forEach(att => att.file && submissionData.append("files", att.file));

    const response = await fetch(`http://localhost:8080/api/patents/${id}/resubmit`, {
        method: "PUT",
        body: submissionData,
    });
    
    if (response.ok) {
        alert("✅ Nộp lại thành công (via Fallback)!");
        navigate(`/applicant/applications/${type}`);
    } else {
        alert("❌ Vẫn lỗi kiểu dữ liệu. Hãy kiểm tra lại API Backend.");
    }
};

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-blue-500" size={40} />
      <p className="text-gray-500 font-medium">Đang nạp dữ liệu hồ sơ...</p>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#F8F9FA] overflow-hidden">
      <div className="w-3/4 overflow-y-auto p-8 border-r bg-white">
        <div className="max-w-4xl mx-auto space-y-12 pb-24">
          <header className="flex justify-between items-center border-b pb-4">
            <h1 className="text-xl font-black uppercase text-slate-800">
              Sửa đổi hồ sơ: {formData?.appNo || "Chưa có số đơn"}
            </h1>
            <button onClick={() => navigate(-1)} className="text-sm flex items-center gap-1 text-gray-500 hover:text-blue-600">
              <ChevronLeft size={16}/> Quay lại
            </button>
          </header>

          <div className="bg-blue-50 p-4 rounded-xl text-blue-700 text-sm flex gap-2">
            <Info size={20}/> Vui lòng sửa các mục bị lỗi dựa theo ghi chú bên phải.
          </div>

          <Step1_GeneralInfo isRevision={true} />
          <Step2_OwnerAuthor isRevision={true} />
          <Step3_Attachments isRevision={true} />
          <Step4_Claims isRevision={true} />
        </div>

        <div className="fixed bottom-0 left-0 w-3/4 bg-white border-t p-4 flex justify-end pr-12 shadow-md z-20">
           <button 
             onClick={handleResubmit} 
             disabled={submitting}
             className={`bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg flex items-center gap-2
               ${submitting ? "opacity-70 cursor-not-allowed" : ""}`}
           >
             {submitting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
             NỘP LẠI HỒ SƠ CHỈNH SỬA
           </button>
        </div>
      </div>

      <aside className="w-1/4 bg-slate-50 p-6 shadow-inner overflow-y-auto">
        <div className="bg-orange-500 text-white p-5 rounded-2xl shadow-lg mb-6">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare size={18} />
            <span className="font-bold text-xs uppercase">Lời nhắn chuyên viên</span>
          </div>
          <p className="text-sm italic leading-relaxed">"{correction?.note || "Kiểm tra lại các thông tin đã khai báo."}"</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 space-y-4">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Thống kê lần sửa</h3>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Giai đoạn:</span>
            <span className="font-bold text-orange-600">{correction?.status || "Đang soát xét"}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Số lần sửa:</span>
            <span className="font-bold">
              {(formData?.formalRevisionCount || 0) + (formData?.substantiveRevisionCount || 0)}
            </span>
          </div>
        </div>
      </aside>
    </div>
  );
};

// Component bao ngoài cùng
const PatentRevision = () => (
  <FilingProvider>
    <RevisionContent />
  </FilingProvider>
);

export default PatentRevision;