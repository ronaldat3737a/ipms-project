import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// 1. Nhóm Trang chung
import Landing from "./pages/Landing";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

// 2. Nhóm Người nộp đơn (Applicant)
import ApplicantDashboard from "./pages/Applicant/ApplicantDashboard";
import PatentList from "./pages/Applicant/Patent/PatentList";

// 3. Nhóm Người duyệt đơn (Examiner)
import ExaminerDashboard from "./pages/Examiner/ExaminerDashboard";
import PatentReviewList from "./pages/Examiner/Patent/PatentReviewList";
import UtilityReviewList from "./pages/Examiner/Patent/UtilityReviewList";
import ApplicationReview from "./pages/Examiner/Patent/ApplicationReview";

// 4. Nhóm Nộp đơn (Filing)
import { FilingProvider } from "./pages/Applicant/Patent/Filing/FilingContext";
import Step1_GeneralInfo from "./pages/Applicant/Patent/Filing/Step1_GeneralInfo";
import Step2_OwnerAuthor from "./pages/Applicant/Patent/Filing/Step2_OwnerAuthor";
import Step3_Attachments from "./pages/Applicant/Patent/Filing/Step3_Attachments";
import Step4_Claims from "./pages/Applicant/Patent/Filing/Step4_Claims";
import Step5_Submission from "./pages/Applicant/Patent/Filing/Step5_Submission";
import Step6_FeePayment from "./pages/Applicant/Patent/Filing/Step6_FeePayment";
import SuccessPage from "./pages/Applicant/Patent/Filing/SuccessPage";

// 5. Nhóm Examiner xử lý (Actions)
import AcceptConfirmation from "./pages/Examiner/Patent/AcceptConfirmation";
import RejectConfirmation from "./pages/Examiner/Patent/RejectConfirmation";
import CorrectionRequest from "./pages/Examiner/Patent/CorrectionRequest";

import PatentDetail from "./pages/Applicant/Patent/PatentDetail";
import Phase2Payment from "./pages/Applicant/Patent/Phase2Payment";
import Phase3Payment from "./pages/Applicant/Patent/Phase3Payment";

function App() {
  return (
    <Router>
      <Routes>
        {/* --- CÁC TRANG CHUNG --- */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* --- QUY TRÌNH NỘP ĐƠN (NESTED ROUTES) --- */}
        <Route path="/applicant/patent/*" element={
            <FilingProvider>
              <Routes>
                <Route path="step1" element={<Step1_GeneralInfo />} />
                <Route path="step2" element={<Step2_OwnerAuthor />} />
                <Route path="step3" element={<Step3_Attachments />} />
                <Route path="step4" element={<Step4_Claims />} />
                <Route path="step5" element={<Step5_Submission />} />
                <Route path="step6" element={<Step6_FeePayment />} />
                {/* Giữ payment-result ở đây nếu bạn muốn điều hướng nội bộ từ bước 6 sang (không qua VNPay) */}
                <Route path="payment-result" element={<SuccessPage />} />
              </Routes>
            </FilingProvider>
        } />

        {/* --- ĐÓN KẾT QUẢ VNPAY (QUAN TRỌNG NHẤT - PHẢI Ở ĐÂY) --- */}
        {/* Link VNPay gọi về là /payment-result nên Route này phải nằm ở cấp cao nhất */}
        <Route path="/payment-result" element={<SuccessPage />} />

        {/* --- DASHBOARD & LISTS (EXAMINER) --- */}
        <Route path="/examiner-dashboard" element={<ExaminerDashboard />} />
        <Route path="/examiner/patents" element={<PatentReviewList />} />
        <Route path="/examiner/utility-solutions" element={<UtilityReviewList />} />
        
        <Route path="/examiner/review/:type/:id" element={<ApplicationReview />} />
        <Route path="/examiner/review/:type/:id/accept" element={<AcceptConfirmation />} />
        <Route path="/examiner/review/:type/:id/reject" element={<RejectConfirmation />} />
        <Route path="/examiner/review/:type/:id/correction" element={<CorrectionRequest />} />

        {/* --- NGƯỜI NỘP ĐƠN --- */}
        <Route path="/applicant-dashboard" element={<ApplicantDashboard />} />
        <Route path="/applicant/patent" element={<PatentList />} />

        <Route path="/applicant/patent/view/:id" element={<PatentDetail />} />
        <Route path="/applicant/payment/phase2/:id" element={<Phase2Payment />} />
        <Route path="/applicant/payment/phase3/:id" element={<Phase3Payment />} />

      </Routes>
    </Router>
  );
}

export default App;