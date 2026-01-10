import React, { createContext, useState, useContext, useEffect, useCallback } from "react";

const FilingContext = createContext();

// 1. Define default values for the Industrial Design form
const DEFAULT_FORM_DATA = {
  // Step 1: General Info
  appType: "KIEU_DANG_CN",
  title: "",
  usageField: "",
  locarnoCodes: "", // Stored as a comma-separated string in the form
  similarDesign: "",

  // Step 2: Owner & Author
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

  // Step 3: Attachments
  attachments: [],
  
  // Step 4: Description & Claims
  descriptionDetail: "",
  claims: "",

  // Step 5: Fee & Payment
  totalFee: 0,

  // Additional info for revision flow
  id: null,
  appNo: "",
  isRevision: false,
};

export const FilingProvider = ({ children }) => {
  const [formData, setFormData] = useState(() => {
    const savedData = sessionStorage.getItem("designFilingData");
    if (savedData) return JSON.parse(savedData);
    return DEFAULT_FORM_DATA;
  });

  useEffect(() => {
    if (!formData.isRevision) {
      sessionStorage.setItem("designFilingData", JSON.stringify(formData));
    }
  }, [formData]);

  const updateFormData = useCallback((newData) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  }, []);

  const setWholeFormData = useCallback((apiData) => {
    const { application, detail } = apiData;

    const sanitizedData = {
      ...DEFAULT_FORM_DATA, 
      ...application,
      ...detail,
      isRevision: true,

      // Map specific fields
      appType: "KIEU_DANG_CN",
      locarnoCodes: detail?.locarnoCodes ? detail.locarnoCodes.join(", ") : "",
      
      // Flatten applicant data
      ownerName: application.applicant?.fullName || "",
      ownerId: application.applicant?.idNumber || "",
      ownerAddress: application.applicant?.address || "",
      ownerPhone: application.applicant?.phone || "",
      ownerEmail: application.applicant?.email || "",
      ownerRepCode: application.applicant?.repCode || "",
      ownerDob: application.applicant?.dob ? application.applicant.dob.toString().split('T')[0] : "",

      authors: application.authors || [],
      attachments: application.attachments || [],
    };
    
    setFormData(sanitizedData);
  }, []);

  const clearFormData = useCallback(() => {
    sessionStorage.removeItem("designFilingData");
    setFormData(DEFAULT_FORM_DATA);
  }, []);

  return (
    <FilingContext.Provider 
      value={{ 
        formData, 
        updateFormData, 
        clearFormData, 
        setWholeFormData
      }}
    >
      {children}
    </FilingContext.Provider>
  );
};

export const useFilingData = () => {
  const context = useContext(FilingContext);
  
  if (context === undefined) {
    return { 
      formData: DEFAULT_FORM_DATA, 
      updateFormData: () => {}, 
      clearFormData: () => {},
      setWholeFormData: () => {}
    };
  }
  
  return context;
};