import React, { createContext, useState, useContext, useEffect } from "react";

const FilingContext = createContext();

// 1. ĐỊNH NGHĨA GIÁ TRỊ MẶC ĐỊNH (Để dùng chung cho Reset và Khởi tạo)
const DEFAULT_FORM_DATA = {
  // BƯỚC 1: THÔNG TIN CHUNG
  appType: "Sáng chế",
  title: "",
  solutionDetail: "",
  solutionType: "",
  technicalField: "",
  ipcCode: "",
  summary: "",

  // BƯỚC 2: CHỦ ĐƠN
  ownerType: "Cá nhân",
  ownerName: "",
  ownerDob: "",
  ownerId: "",
  ownerAddress: "",
  ownerPhone: "",
  ownerEmail: "",
  ownerRepCode: "",

  // BƯỚC 2: TÁC GIẢ & CƠ SỞ QUYỀN
  authors: [],
  isOwnerSameAsAuthor: false,
  filingBasis: "Tác giả đồng thời là người nộp đơn",

  // BƯỚC 3: TÀI LIỆU ĐÍNH KÈM
  attachments: [],
  totalPages: 0,

  // BƯỚC 4: YÊU CẦU BẢO HỘ
  claims: [],
  claimPoints: 0,

  // BƯỚC 5: PHÍ VÀ THANH TOÁN
  totalFee: 0,
  paymentReceipt: null,

  // THÔNG TIN BỔ SUNG (Dùng cho Sửa đơn - Revision)
  id: null,
  appNo: "",
  isRevision: false, // Cờ đánh dấu đang ở chế độ sửa đơn
};

export const FilingProvider = ({ children }) => {
  // 2. LOGIC KHỞI TẠO DỮ LIỆU
  const [formData, setFormData] = useState(() => {
    // Chỉ khôi phục đơn nháp nếu không phải là luồng sửa đơn (kiểm tra URL hoặc logic tùy chọn)
    const savedData = sessionStorage.getItem("patentFilingData");
    if (savedData) return JSON.parse(savedData);
    return DEFAULT_FORM_DATA;
  });

  // 3. TỰ ĐỘNG LƯU VÀO SESSION (Chỉ lưu nếu KHÔNG PHẢI chế độ sửa đơn)
  useEffect(() => {
    if (!formData.isRevision) {
      sessionStorage.setItem("patentFilingData", JSON.stringify(formData));
    }
  }, [formData]);

  // 4. HÀM CẬP NHẬT TỪNG PHẦN (Dùng cho các Step input)
  const updateFormData = (newData) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  // 5. HÀM NẠP TOÀN BỘ DỮ LIỆU (Dùng cho Sửa đơn - Revision)
  // Hàm này sẽ "làm sạch" dữ liệu từ API để tránh lỗi .trim()
  const setWholeFormData = (apiData) => {
    const sanitizedData = {
      ...DEFAULT_FORM_DATA, // Đảm bảo có đủ các trường mặc định
      ...apiData,
      // Chống lỗi trim(): Nếu giá trị từ API là null/undefined thì gán thành ""
      title: apiData.title || "",
      summary: apiData.summary || "",
      technicalField: apiData.technicalField || "",
      solutionDetail: apiData.solutionDetail || "",
      ownerName: apiData.ownerName || apiData.applicant?.fullName || "",
      ownerId: apiData.ownerId || apiData.applicant?.idNumber || "",
      ownerAddress: apiData.ownerAddress || apiData.applicant?.address || "",
      ownerPhone: apiData.ownerPhone || apiData.applicant?.phone || "",
      ownerEmail: apiData.ownerEmail || apiData.applicant?.email || "",
      isRevision: true, // Đánh dấu đây là luồng sửa đơn
    };
    setFormData(sanitizedData);
  };

  // 6. HÀM XÓA DỮ LIỆU (Reset)
  const clearFormData = () => {
    sessionStorage.removeItem("patentFilingData");
    setFormData(DEFAULT_FORM_DATA);
  };

  return (
    <FilingContext.Provider 
      value={{ 
        formData, 
        updateFormData, 
        clearFormData, 
        setWholeFormData // Cung cấp hàm mới cho PatentRevision
      }}
    >
      {children}
    </FilingContext.Provider>
  );
};

// 7. CUSTOM HOOK
export const useFilingData = () => {
  const context = useContext(FilingContext);
  
  if (context === undefined) {
    // Trả về cấu trúc an toàn để tránh lỗi destructuring khi chưa load xong
    return { 
      formData: DEFAULT_FORM_DATA, 
      updateFormData: () => {}, 
      clearFormData: () => {},
      setWholeFormData: () => {}
    };
  }
  
  return context;
};