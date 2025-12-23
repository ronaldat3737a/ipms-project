import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// 1. Nhóm Trang chung
import Landing from "./pages/Landing";

// 2. Nhóm Auth (Xác thực)
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

// 3. Nhóm Người nộp đơn (Applicant)
import ApplicantDashboard from "./pages/Applicant/ApplicantDashboard";
import PatentList from "./pages/Applicant/Patent/PatentList";

// 4. Nhóm Người duyệt đơn (Examiner)
import ExaminerDashboard from "./pages/Examiner/ExaminerDashboard";

// 5. Nhóm Nộp đơn Sáng chế (Filing) - Cần dùng chung Provider
import { FilingProvider } from "./pages/Applicant/Patent/Filing/FilingContext";
import Step1_GeneralInfo from "./pages/Applicant/Patent/Filing/Step1_GeneralInfo";
import Step2_OwnerAuthor from "./pages/Applicant/Patent/Filing/Step2_OwnerAuthor";
import Step3_Attachments from "./pages/Applicant/Patent/Filing/Step3_Attachments";
import Step4_Claims from "./pages/Applicant/Patent/Filing/Step4_Claims";
import Step5_FeePayment from "./pages/Applicant/Patent/Filing/Step5_FeePayment";
import Step6_Submission from "./pages/Applicant/Patent/Filing/Step6_Submission";
import SuccessPage from "./pages/Applicant/Patent/Filing/SuccessPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* --- CÁC TRANG CHUNG --- */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* --- DASHBOARD --- */}
        <Route path="/applicant-dashboard" element={<ApplicantDashboard />} />
        <Route path="/examiner-dashboard" element={<ExaminerDashboard />} />
        <Route path="/applicant/patent" element={<PatentList />} />

        {/* --- QUY TRÌNH NỘP ĐƠN SÁNG CHẾ (6 BƯỚC) --- */}
        {/* Bọc toàn bộ các bước vào trong MỘT FilingProvider duy nhất để không mất dữ liệu */}
        <Route
          path="/applicant/patent/*"
          element={
            <FilingProvider>
              <Routes>
                <Route path="step1" element={<Step1_GeneralInfo />} />
                <Route path="step2" element={<Step2_OwnerAuthor />} />
                <Route path="step3" element={<Step3_Attachments />} />
                <Route path="step4" element={<Step4_Claims />} />
                <Route path="step5" element={<Step5_FeePayment />} />
                <Route path="step6" element={<Step6_Submission />} />
                <Route path="success" element={<SuccessPage />} />
                {/* Sau này bạn sẽ thêm step3, step4, step5, step6, success vào đây */}
              </Routes>
            </FilingProvider>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
