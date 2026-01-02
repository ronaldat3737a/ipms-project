import React, { createContext, useState, useContext, useEffect } from "react";

const FilingContext = createContext();

export const FilingProvider = ({ children }) => {
  // 1. Logic khởi tạo dữ liệu (Khôi phục từ sessionStorage nếu có)
  const [formData, setFormData] = useState(() => {
    const savedData = sessionStorage.getItem("patentFilingData");
    if (savedData) return JSON.parse(savedData);

    return {
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
      totalPages: 0, // Lưu số trang đếm từ file PDF

      // BƯỚC 4: YÊU CẦU BẢO HỘ
      claims: [], 
      claimPoints: 0, 

      // BƯỚC 5: PHÍ VÀ THANH TOÁN
      totalFee: 0, 
      paymentReceipt: null,
    };
  });

  // 2. Tự động lưu vào session mỗi khi formData thay đổi để tránh mất dữ liệu khi F5
  useEffect(() => {
    sessionStorage.setItem("patentFilingData", JSON.stringify(formData));
  }, [formData]);

  // 3. Hàm cập nhật dữ liệu linh hoạt (Dùng cho tất cả các bước)
  const updateFormData = (newData) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  // 4. Hàm xóa dữ liệu (Reset hoàn toàn) - Sẽ gọi khi ấn "Hủy bỏ" hoặc "Nộp đơn mới"
  const clearFormData = () => {
    // Xóa sạch bộ nhớ vật lý
    sessionStorage.removeItem("patentFilingData");
    
    // Reset toàn bộ State về mặc định ban đầu
    setFormData({
      appType: "Sáng chế",
      title: "",
      solutionDetail: "",
      solutionType: "",
      technicalField: "",
      ipcCode: "",
      summary: "",
      ownerType: "Cá nhân",
      ownerName: "",
      ownerDob: "",
      ownerId: "",
      ownerAddress: "",
      ownerPhone: "",
      ownerEmail: "",
      ownerRepCode: "",
      authors: [],
      isOwnerSameAsAuthor: false,
      filingBasis: "Tác giả đồng thời là người nộp đơn",
      attachments: [],
      totalPages: 0,
      claims: [],
      claimPoints: 0,
      totalFee: 0,
      paymentReceipt: null,
    });
  };

  return (
    <FilingContext.Provider value={{ formData, updateFormData, clearFormData }}>
      {children}
    </FilingContext.Provider>
  );
};

export const useFilingData = () => {
  const context = useContext(FilingContext);
  
  // Nếu context bị undefined (do nằm ngoài Provider), trả về object mặc định 
  // để phép destructure { formData, ... } không bị ném lỗi
  if (context === undefined) {
    return { 
      formData: {}, 
      updateFormData: () => {}, 
      clearFormData: () => {} 
    };
  }
  
  return context;
};