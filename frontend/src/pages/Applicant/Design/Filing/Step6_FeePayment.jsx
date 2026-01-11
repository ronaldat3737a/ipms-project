import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  X,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Coins,
  CreditCard,
  Info,
  Loader2,
  AlertCircle,
  Image as ImageIcon,
  BookOpen
} from "lucide-react";
import { useFilingData } from "./FilingContext";

const Step6_FeePayment = () => {
  const navigate = useNavigate();
  const { formData, updateFormData, clearFormData } = useFilingData();

  const [loading, setLoading] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const currentStep = 5;
  const steps = [
    { id: 1, label: "Thông tin chung" },
    { id: 2, label: "Chủ đơn & Tác giả" },
    { id: 3, label: "Tải lên tài liệu" },
    { id: 4, label: "Mô tả & Yêu cầu" },
    { id: 5, label: "Xác nhận & Nộp đơn" },
  ];

  // --- NEW FEE CALCULATION LOGIC FOR INDUSTRIAL DESIGN ---
  const locarnoCodeCount = formData?.locarnoCodes?.split(',').filter(c => c.trim() !== '').length || 0;
  const imageCount = formData?.attachments?.filter(a => a.category === 'HINH_ANH').length || 0;

  const FEE_FILING = 150000;
  const FEE_CLASSIFICATION_PER_CODE = 100000;
  const FEE_EXAMINATION = 700000;
  const FEE_SEARCH = 480000;
  const FEE_PUBLICATION_BASE = 120000;
  const FEE_PUBLICATION_PER_EXTRA_IMAGE = 60000;

  const classificationFee = locarnoCodeCount * FEE_CLASSIFICATION_PER_CODE;
  const publicationFee = imageCount > 0 
    ? FEE_PUBLICATION_BASE + (Math.max(0, imageCount - 1) * FEE_PUBLICATION_PER_EXTRA_IMAGE)
    : 0;
  
  const totalAmount = FEE_FILING + classificationFee + FEE_EXAMINATION + FEE_SEARCH + publicationFee;

  useEffect(() => {
    updateFormData({ totalFee: totalAmount });
  }, [totalAmount, updateFormData]);

  const formatVND = (amount) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

  const handleVNPayPayment = async () => {
    setLoading(true);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
    const stage = 1;

    try {
      // Step 1: Create the application draft
      const payload = {
        appType: formData.appType,
        title: formData.title,
        usageField: formData.usageField,
        locarnoCodes: formData.locarnoCodes.split(',').map(c => c.trim()).filter(c => c),
        similarDesign: formData.similarDesign,
        
        ownerType: formData.ownerType,
        ownerName: formData.ownerName,
        ownerDob: formData.ownerDob,
        ownerId: formData.ownerId,
        ownerAddress: formData.ownerAddress,
        ownerPhone: formData.ownerPhone,
        ownerEmail: formData.ownerEmail,
        ownerRepCode: formData.ownerRepCode,
        
        authors: formData.authors,
        
        descriptionDetail: formData.descriptionDetail,
        claims: formData.claims,
        
        totalFee: formData.totalFee,
        id: formData.id,
        appNo: formData.appNo,
        isRevision: formData.isRevision,
      };
      
      const submissionData = new FormData();
      submissionData.append("designData", JSON.stringify(payload));
      
      formData.attachments.forEach(att => {
        if (att.file) {
          submissionData.append("files", att.file);
        }
      });
      
      console.log("Creating Industrial Design application...");
      const createResponse = await axios.post(`${API_BASE_URL}/api/industrial-designs/create`, submissionData, {
          headers: { 'Content-Type': 'multipart/form-data' }
      });
      const currentAppId = createResponse.data.id;
      console.log("=> Created successfully. ID:", currentAppId);

      // Step 2: Submit the application to get the appNo
      console.log("Submitting application with ID:", currentAppId);
      const submitResponse = await axios.post(`${API_BASE_URL}/api/industrial-designs/${currentAppId}/submit`);
      const submittedApplication = submitResponse.data;
      if (!submittedApplication || !submittedApplication.appNo) {
          throw new Error("Không nhận được mã đơn (appNo) sau khi nộp.");
      }
      console.log("=> Submitted successfully. AppNo:", submittedApplication.appNo);

      // Step 3: Create payment link
      console.log("Creating VNPay payment link...");
      const paymentResponse = await axios.get(
          `${API_BASE_URL}/api/payment/create-payment/${submittedApplication.appNo}/${stage}`, {
              params: { amount: totalAmount },
              headers: { "ngrok-skip-browser-warning": "69420" }
          }
      );

      if (paymentResponse.data?.url) {
          console.log("=> Redirecting to VNPay...");
          clearFormData();
          window.location.href = paymentResponse.data.url;
      } else {
          throw new Error("Không nhận được URL thanh toán từ VNPay.");
      }

    } catch (error) {
      console.error("Error during submission process:", error);
      const errorMessage = error.response?.data?.message || error.message || "Đã có lỗi xảy ra.";
      alert(`Lỗi: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-gray-800">
      <header className="h-16 border-b border-gray-100 flex items-center justify-between px-8 bg-white sticky top-0 z-10">
        <button onClick={() => { if(window.confirm("Hủy và xóa dữ liệu đang soạn?")) { clearFormData(); navigate('/applicant/applications/KIEU_DANG_CN'); }}} className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition text-sm font-medium">
          <div className="w-6 h-6 border border-gray-300 rounded-full flex items-center justify-center"><X size={14} /></div> Hủy bỏ
        </button>
        {/* User Info */}
      </header>

      <div className="flex flex-grow overflow-hidden">
        <aside className="w-72 border-r border-gray-100 p-8 shrink-0 bg-gray-50/30">
          <h2 className="text-lg font-bold mb-8 text-gray-700">Tiến trình nộp đơn</h2>
          <div className="space-y-6">
            {steps.map((step) => (
              <div key={step.id} className="flex items-center gap-4 relative">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 z-10 ${currentStep === step.id ? "bg-blue-500 border-blue-500 text-white" : "bg-white border-gray-200 text-gray-400"}`}>
                  {step.id}
                </div>
                <span className={`text-sm font-bold ${currentStep === step.id ? "text-blue-600" : "text-gray-400"}`}>{step.label}</span>
                {step.id !== steps.length && <div className="absolute left-4 top-8 w-0.5 h-6 bg-gray-100"></div>}
              </div>
            ))}
          </div>
        </aside>

        <main className="flex-grow p-12 overflow-y-auto bg-white">
          <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold italic">5. Tính phí & Thanh toán</h1>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-blue-500"><BookOpen size={20} /></div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Mã Locarno</p>
                  <p className="text-lg font-black text-blue-700">{locarnoCodeCount} mã</p>
                </div>
              </div>
              <div className="p-4 bg-purple-50/50 border border-purple-100 rounded-2xl flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-purple-500"><ImageIcon size={20} /></div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Bộ ảnh/bản vẽ</p>
                  <p className="text-lg font-black text-purple-700">{imageCount} tệp</p>
                </div>
              </div>
            </div>

            <section className="p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center gap-2 text-gray-800">
                <Coins size={20} className="text-amber-500" />
                <h3 className="font-bold uppercase text-sm tracking-wider">Chi tiết lệ phí GĐ 1</h3>
              </div>
              <div className="space-y-1">
                <FeeRow label="1. Lệ phí nộp đơn" price={formatVND(FEE_FILING)} />
                <FeeRow label="2. Phí phân loại" price={formatVND(classificationFee)} note={`${locarnoCodeCount} mã Locarno`} />
                <FeeRow label="3. Phí thẩm định đơn" price={formatVND(FEE_EXAMINATION)} note="1 đối tượng" />
                <FeeRow label="4. Phí tra cứu" price={formatVND(FEE_SEARCH)} note="1 đối tượng" />
                <FeeRow label="5. Phí công bố" price={formatVND(publicationFee)} note={`${imageCount} hình ảnh/bản vẽ`} />
                <div className="pt-6 mt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-xl font-black uppercase tracking-tight">Tổng chi phí</span>
                  <span className="text-3xl font-black text-blue-600 tracking-tighter">{formatVND(totalAmount)}</span>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 rounded-3xl border-2 border-blue-100 bg-blue-50/20 space-y-4">
                 <h3 className="font-bold text-gray-700">Thanh toán trực tuyến</h3>
                 <p className="text-xs text-gray-500 leading-relaxed">Sử dụng cổng thanh toán <b>VNPay Sandbox</b>. Hồ sơ sẽ được tự động cập nhật sau khi thanh toán thành công.</p>
                <button onClick={handleVNPayPayment} disabled={loading} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black flex items-center justify-center gap-3 transition-all shadow-lg active:scale-95 disabled:opacity-50">
                  {loading ? <Loader2 className="animate-spin" /> : "THANH TOÁN QUA VNPAY"}
                </button>
              </div>

              <div className="p-8 rounded-3xl border border-amber-100 bg-amber-50/30 space-y-3">
                 <h3 className="text-xs font-bold uppercase">Thông tin thẻ Test (Sandbox)</h3>
                <div className="space-y-2 text-[11px] font-medium text-amber-800">
                  <div className="flex justify-between border-b border-amber-100 pb-1"><span>Ngân hàng:</span> <b>NCB</b></div>
                  <div className="flex justify-between border-b border-amber-100 pb-1"><span>Số thẻ:</span> <b>9704198526191432198</b></div>
                  <div className="flex justify-between border-b border-amber-100 pb-1"><span>Chủ thẻ:</span> <b>NGUYEN VAN A</b></div>
                  <div className="flex justify-between border-b border-amber-100 pb-1"><span>OTP:</span> <b>123456</b></div>
                </div>
              </div>
            </section>

            <div className="flex justify-end gap-4 pt-10 border-t border-gray-50">
              <button onClick={() => navigate('/applicant/design/filing/step4')} className="px-8 py-3 border border-gray-200 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition text-sm">
                Quay lại
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const FeeRow = ({ label, price, note }) => (
  <div className="flex justify-between items-start py-4 border-b border-gray-50 last:border-0">
    <div className="space-y-1">
      <p className="text-sm font-bold text-gray-700">{label}</p>
      {note && <p className="text-[10px] text-gray-400 font-medium italic">{note}</p>}
    </div>
    <span className="text-sm font-black text-gray-800 tracking-tight">{price}</span>
  </div>
);

export default Step6_FeePayment;