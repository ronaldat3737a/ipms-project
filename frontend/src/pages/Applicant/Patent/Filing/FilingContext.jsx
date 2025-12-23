import React, { createContext, useState, useContext, useEffect } from 'react';

const FilingContext = createContext();

export const FilingProvider = ({ children }) => {
  // Khởi tạo dữ liệu mặc định cho tất cả các bước
  const [formData, setFormData] = useState(() => {
    // Thử khôi phục dữ liệu từ sessionStorage nếu người dùng lỡ refresh trang
    const savedData = sessionStorage.getItem('patentFilingData');
    return savedData ? JSON.parse(savedData) : {
      // Bước 1: Thông tin chung
      appType: "Sáng chế",
      title: "",
      solutionDetail: "",
      solutionType: "",
      technicalField: "",
      ipcCode: "",
      summary: "",

      // Bước 2: Chủ đơn
      ownerType: "Cá nhân",
      ownerName: "",
      ownerDob: "",
      ownerId: "",
      ownerAddress: "",
      ownerPhone: "",
      ownerEmail: "",
      ownerRepCode: "",
      // Bước 5: Phí và thanh toán
      totalFee: 542000,
      paymentReceipt: null, // Lưu thông tin file chuyển khoản
  
      // Bước 2: Tác giả
      authors: [{ id: Date.now(), fullName: "", nationality: "Việt Nam", idNumber: "" }],
      isOwnerSameAsAuthor: false,
  
      // Bước 2: Cơ sở quyền
      filingBasis: "Tác giả đồng thời là người nộp đơn",
      
      // Dự phòng cho các bước sau
      // Bước 3: Tài liệu đính kèm
      attachments: [
        { id: 1, name: "Tờ khai DK sáng chế.pdf", type: "Hành chính", size: "1.2 MB", status: "Hoàn tất" },
        { id: 2, name: "Bien lai nop phi.jpg", type: "Hành chính", size: "350 KB", status: "Hoàn tất" },
        { id: 3, name: "Bản mô tả giải pháp.docx", type: "Kỹ thuật", size: "8.5 MB", status: "Phân tích" },
        { id: 4, name: "Yeu cau bao ho.pdf", type: "Kỹ thuật", size: "1.1 MB", status: "Lỗi" },
        { id: 5, name: "So do nguyen ly.png", type: "Kỹ thuật", size: "2.1 MB", status: "Hoàn tất" },
        { id: 6, name: "Tom tat sang che.pdf", type: "Kỹ thuật", size: "150 KB", status: "Hoàn tất" },
      ],
      // Bước 4: Yêu cầu bảo hộ
      claims: [
        { 
          id: 1, 
          type: "Độc lập", 
          content: "Thiết bị làm mát di động sử dụng công nghệ bay hơi nước, có khả năng điều chỉnh lưu lượng không khí và hướng gió tự động, tích hợp bộ lọc bụi kháng khuẩn, thân thiện với môi trường.",
          status: "Hợp lệ",
          referenceId: null
        },
        { 
          id: 2, 
          type: "Phụ thuộc", 
          content: "Sáng chế theo điểm 1, trong đó thiết bị làm mát di động có tích hợp màn hình cảm ứng hiển thị thông tin về nhiệt độ, độ ẩm và chất lượng không khí.",
          status: "Cần chỉnh sửa",
          referenceId: 1,
          error: "Điểm phụ thuộc phải chứa cụm 'Sáng chế theo điểm [X]'."
        }
      ],


      authors: [],
      attachments: [],
      claims: [],
    };
  });

  // Tự động lưu dữ liệu vào session mỗi khi formData thay đổi
  useEffect(() => {
    sessionStorage.setItem('patentFilingData', JSON.stringify(formData));
  }, [formData]);

  // Hàm cập nhật dữ liệu linh hoạt
  const updateFormData = (newData) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  // Hàm xóa dữ liệu khi hoàn tất hoặc hủy bỏ
  const clearFormData = () => {
    sessionStorage.removeItem('patentFilingData');
    setFormData({
      appType: "Sáng chế",
      title: "",
      solutionDetail: "",
      solutionType: "",
      technicalField: "",
      ipcCode: "",
      summary: "",
      authors: [],
      attachments: [],
      claims: [],
    });
  };

  return (
    <FilingContext.Provider value={{ formData, updateFormData, clearFormData }}>
      {children}
    </FilingContext.Provider>
  );
};

export const useFilingData = () => useContext(FilingContext);