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
  // (Đã tối ưu cho Sửa đơn)
  const setWholeFormData = (apiData) => {
    // Hàm phụ trợ để map Enum từ Backend sang Tiếng Việt cho UI
    const mapFilingBasisToUI = (val) => {
      const map = {
        'AUTHOR_IS_APPLICANT': "Tác giả đồng thời là người nộp đơn",
        'EMPLOYMENT': "Thụ hưởng do thuê/giao việc (Sáng chế công vụ)",
        'CONTRACT': "Thụ hưởng theo Hợp đồng chuyển giao",
        'INHERITANCE': "Thụ hưởng do Thừa kế",
        'TRUC_TUYEN': "Tác giả đồng thời là người nộp đơn"
      };
      return map[val] || val;
    };

    const sanitizedData = {
      ...DEFAULT_FORM_DATA, 
      ...apiData,
      isRevision: true,

      // 1. Mapping lại loại đơn (Nếu Backend trả về Enum)
      appType: apiData.appType === "SANG_CHE" ? "Sáng chế" : "Giải pháp hữu ích",
      solutionType: apiData.solutionType === "QUY_TRINH" ? "Quy trình" : "Sản phẩm",

      // 2. Xử lý IPC: Biến mảng thành chuỗi để hiện trong ô input Step 1
      ipcCode: apiData.ipcCodes ? apiData.ipcCodes.join(", ") : "",

      // 3. Thông tin chủ đơn (Phẳng hóa dữ liệu từ object applicant)
      ownerName: apiData.applicant?.fullName || "",
      ownerId: apiData.applicant?.idNumber || "",
      ownerAddress: apiData.applicant?.address || "",
      ownerPhone: apiData.applicant?.phone || "",
      ownerEmail: apiData.applicant?.email || "",
      ownerRepCode: apiData.applicant?.repCode || "",

      // 4. XỬ LÝ NGÀY SINH: Đảm bảo định dạng YYYY-MM-DD cho input date
      ownerDob: apiData.applicant?.dob ? apiData.applicant.dob.toString().split('T')[0] : "",

      // 5. XỬ LÝ CƠ SỞ QUYỀN: Map Enum sang Tiếng Việt để ô Radio tự tích
      filingBasis: mapFilingBasisToUI(apiData.filingBasis),

      // 6. Đảm bảo mảng không bị null
      authors: apiData.authors || [],
      attachments: apiData.attachments || [],
      claims: apiData.claims || [],
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