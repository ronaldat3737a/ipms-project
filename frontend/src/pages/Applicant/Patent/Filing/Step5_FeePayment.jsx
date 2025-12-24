import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Coins,
  Copy,
  UploadCloud,
  Check,
  FileCheck,
  AlertCircle,
  Info,
} from "lucide-react";
import { useFilingData } from "./FilingContext";

const Step5_FeePayment = () => {
  const navigate = useNavigate();
  // Lấy context an toàn
  const context = useFilingData();
  const formData = context?.formData || {};
  const updateFormData = context?.updateFormData || (() => {});

  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef(null);

  // Lấy user an toàn
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  // --- LOGIC TÍNH TOÁN AN TOÀN (Dùng Optional Chaining ?. để chống trắng trang) ---
  const allClaims = formData?.claims || []; // Nếu claims null thì lấy mảng rỗng
  const totalClaimsCount = allClaims.length;
  const independentClaims = allClaims.filter((c) => c?.type === "Độc lập");
  const numIndependentClaims = independentClaims.length;

  const numPages = parseInt(formData?.totalPages) || 0;

  // Định mức phí
  const FEE_FILING = 150000;
  const FEE_EXAM_PER_CLAIM = 180000;
  const FEE_PAGE_EXCEED = 8000;

  const totalExamFee = numIndependentClaims * FEE_EXAM_PER_CLAIM;
  const totalPageFee = numPages > 6 ? (numPages - 6) * FEE_PAGE_EXCEED : 0;
  const totalAmount = FEE_FILING + totalExamFee + totalPageFee;

  const {clearFormData } = useFilingData();

  useEffect(() => {
    if (updateFormData && totalAmount !== formData?.totalFee) {
      updateFormData({ totalFee: totalAmount });
    }
  }, [totalAmount]);

  const formatVND = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const paymentFile = {
        id: "pay-" + Date.now(),
        fileName: file.name,
        docType: "CHUNG_TU_THANH_TOAN",
        status: "HOAN_TAT",
      };
      const others = (formData?.attachments || []).filter(
        (a) => a?.docType !== "CHUNG_TU_THANH_TOAN"
      );
      updateFormData({ attachments: [...others, paymentFile] });
    }
  };

  // Truy cập attachments an toàn
  const receiptFile = (formData?.attachments || []).find(
    (a) => a?.docType === "CHUNG_TU_THANH_TOAN"
  );

  const currentStep = 5;
  const steps = [
    { id: 1, label: "Thông tin chung" },
    { id: 2, label: "Chủ đơn & Tác giả" },
    { id: 3, label: "Tải lên tài liệu" },
    { id: 4, label: "Yêu cầu bảo hộ" },
    { id: 5, label: "Tính phí & Thanh toán" },
    { id: 6, label: "Nộp đơn" },
  ];

  // Nếu không có context (lỗi bọc Provider), hiện thông báo thay vì trắng trang
  if (!context) {
    return (
      <div className="p-20 text-center font-bold text-red-500">
        Lỗi: Không tìm thấy FilingProvider!
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-gray-800">
      <header className="h-16 border-b border-gray-100 flex items-center justify-between px-8 bg-white sticky top-0 z-10">
        <button 
                  onClick={() => {
                    // Hiện hộp thoại hỏi ý kiến người dùng
                    const isConfirm = window.confirm(
                      "Hệ thống sẽ xóa toàn bộ dữ liệu bạn đã nhập ở tất cả các bước. Bạn có chắc chắn muốn hủy bỏ không?"
                    );
        
                    if (isConfirm) {
                      clearFormData(); // 1. Quét sạch dữ liệu trong bộ nhớ (Context & Session)
                      navigate("/applicant/patent"); // 2. Sau đó mới quay về Dashboard
                    }
                  }}
                  className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition text-sm font-medium"
                >
                  <div className="w-6 h-6 border border-gray-300 rounded-full flex items-center justify-center">
                    <X size={14} />
                  </div>
                  Hủy bỏ
                </button>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs font-bold text-gray-800">
              {currentUser?.fullName || "Người dùng"}
            </p>
            <p className="text-[10px] text-gray-400 font-medium">
              {currentUser?.email || ""}
            </p>
          </div>
          <img
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${
              currentUser?.fullName || "Felix"
            }`}
            alt="Avatar"
            className="w-8 h-8 rounded-full border"
          />
        </div>
      </header>

      <div className="flex flex-grow overflow-hidden">
        <aside className="w-72 border-r border-gray-100 p-8 shrink-0 bg-gray-50/30">
          <h2 className="text-lg font-bold mb-8 text-gray-700">
            Tiến trình nộp đơn
          </h2>
          <div className="space-y-6">
            {steps.map((step) => (
              <div key={step.id} className="flex items-center gap-4 relative">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all z-10 
                  ${
                    currentStep === step.id
                      ? "bg-blue-500 border-blue-500 text-white shadow-md"
                      : currentStep > step.id
                      ? "bg-green-500 border-green-500 text-white"
                      : "bg-white border-gray-200 text-gray-400"
                  }`}
                >
                  {currentStep > step.id ? <CheckCircle2 size={16} /> : step.id}
                </div>
                <span
                  className={`text-sm font-bold ${
                    currentStep === step.id
                      ? "text-blue-600"
                      : currentStep > step.id
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                >
                  {step.label}
                </span>
                {step.id !== 6 && (
                  <div className="absolute left-4 top-8 w-0.5 h-6 bg-gray-100"></div>
                )}
              </div>
            ))}
          </div>
        </aside>

        <main className="flex-grow p-12 overflow-y-auto bg-white">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold italic">
                5. Tính phí & Thanh toán
              </h1>
              {numPages > 0 && (
                <div className="px-4 py-2 bg-green-50 border border-green-100 rounded-xl flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-green-500" />
                  <span className="text-xs font-bold text-green-700">
                    Đã đồng bộ {numPages} trang từ PDF
                  </span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-blue-500">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">
                    Điểm Độc lập
                  </p>
                  <p className="text-lg font-black text-blue-700">
                    {numIndependentClaims} điểm
                  </p>
                </div>
              </div>
              <div className="p-4 bg-purple-50/50 border border-purple-100 rounded-2xl flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-purple-500">
                  <Info size={20} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">
                    Tổng số trang
                  </p>
                  <p className="text-lg font-black text-purple-700">
                    {numPages} trang
                  </p>
                </div>
              </div>
            </div>

            <section className="p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center gap-2 text-gray-800">
                <Coins size={20} className="text-amber-500" />
                <h3 className="font-bold uppercase text-sm tracking-wider">
                  Chi tiết lệ phí thực tế
                </h3>
              </div>
              <div className="space-y-1">
                <FeeRow
                  label="1. Lệ phí nộp đơn"
                  price={formatVND(FEE_FILING)}
                />
                <FeeRow
                  label="2. Phí thẩm định hình thức"
                  price={formatVND(totalExamFee)}
                  note={`Dựa trên ${numIndependentClaims} điểm độc lập`}
                />
                <FeeRow
                  label="3. Phí trang bản mô tả bổ sung"
                  price={formatVND(totalPageFee)}
                  note={
                    numPages > 6
                      ? `Vượt định mức ${numPages - 6} trang`
                      : "Không vượt định mức (Dưới 7 trang)"
                  }
                />
                <div className="pt-6 mt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-xl font-black uppercase tracking-tight">
                    Tổng chi phí
                  </span>
                  <span className="text-3xl font-black text-blue-600 tracking-tighter">
                    {formatVND(totalAmount)}
                  </span>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 rounded-3xl border border-gray-100 bg-gray-50/30 space-y-6">
                <h3 className="font-bold text-gray-700">
                  Thông tin chuyển khoản
                </h3>
                <div className="space-y-4">
                  <DisplayGroup label="Ngân hàng" value="Vietcombank (VCB)" />
                  <DisplayGroup label="Số tài khoản" value="0011 0042 34567" />
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">
                      Nội dung chuyển khoản
                    </label>
                    <div className="flex gap-2">
                      {/* Nội dung chuyển khoản hiển thị trên màn hình */}
                      <div className="flex-grow bg-white border border-gray-200 rounded-xl p-3 text-xs font-bold text-blue-600 truncate">
                        SHTT {currentUser.fullName?.toUpperCase()}{" "}
                        {currentUser.cccdNumber} {numIndependentClaims}D{" "}
                        {numPages}T
                      </div>
                      <button
                        onClick={() =>
                          handleCopy(
                            `SHTT ${currentUser.fullName} ${currentUser.cccdNumber} ${numIndependentClaims}D ${numPages}T`
                          )
                        }
                        className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition"
                      >
                        {copied ? (
                          <Check size={16} className="text-green-500" />
                        ) : (
                          <Copy size={16} className="text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-gray-700">Xác nhận thanh toán</h3>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".jpg,.png,.pdf"
                />
                <div
                  onClick={() => fileInputRef.current.click()}
                  className={`h-full min-h-[200px] border-2 border-dashed rounded-3xl flex flex-col items-center justify-center p-6 transition cursor-pointer ${
                    receiptFile
                      ? "border-green-400 bg-green-50/30"
                      : "border-gray-200 bg-gray-50/50 hover:bg-gray-50"
                  }`}
                >
                  {receiptFile ? (
                    <div className="text-center space-y-2">
                      <FileCheck size={40} className="mx-auto text-green-500" />
                      <p className="text-sm font-bold text-green-700">
                        Đã tải: {receiptFile.fileName}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center space-y-2">
                      <UploadCloud
                        size={40}
                        className="mx-auto text-gray-300"
                      />
                      <p className="text-sm font-bold text-gray-500">
                        Tải ảnh biên lai/chứng từ
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </section>

            <div className="flex justify-end gap-4 pt-10 border-t border-gray-50">
              <button
                onClick={() => navigate("/applicant/patent/step4")}
                className="px-8 py-3 border border-gray-200 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition shadow-sm text-sm"
              >
                Quay lại
              </button>
              <button
                disabled={!receiptFile || numPages === 0}
                onClick={() => navigate("/applicant/patent/step6")}
                className={`flex items-center gap-2 px-10 py-3 rounded-xl font-bold transition shadow-md text-sm ${
                  receiptFile && numPages > 0
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Tiếp theo <ChevronRight size={18} />
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
      {note && (
        <p className="text-[10px] text-gray-400 font-medium italic">{note}</p>
      )}
    </div>
    <span className="text-sm font-black text-gray-800 tracking-tight">
      {price}
    </span>
  </div>
);

const DisplayGroup = ({ label, value }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
      {label}
    </label>
    <div className="bg-white border border-gray-100 rounded-xl p-3 text-xs font-bold text-gray-600">
      {value}
    </div>
  </div>
);

export default Step5_FeePayment;
