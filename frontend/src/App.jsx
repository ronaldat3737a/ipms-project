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
import SubstantiveReview from "./pages/Examiner/Patent/SubstantiveReview";

import RejectReasonView from "./pages/Examiner/Patent/RejectReasonView";

import PatentDetail from "./pages/Applicant/Patent/PatentDetail";
import Phase2Payment from "./pages/Applicant/Patent/Phase2Payment";
import Phase3Payment from "./pages/Applicant/Patent/Phase3Payment";
import PatentRevision from "./pages/Applicant/Patent/PatentRevision";
import ApplicantRejectReasonView from "./pages/Applicant/Patent/ApplicantRejectReasonView";

import PatentCertificateView from "./pages/Examiner/Patent/PatentCertificateView";

function App() {
  return (
    <Router>
      <Routes>
        {/* --- CÁC TRANG CHUNG --- */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* --- REFACTORED: QUY TRÌNH NỘP ĐƠN (sử dụng :type) --- */}
        <Route path="/applicant/applications/:type/filing/*" element={
            <FilingProvider>
              <Routes>
                <Route path="step1" element={<Step1_GeneralInfo />} />
                <Route path="step2" element={<Step2_OwnerAuthor />} />
                <Route path="step3" element={<Step3_Attachments />} />
                <Route path="step4" element={<Step4_Claims />} />
                <Route path="step5" element={<Step5_Submission />} />
                <Route path="step6" element={<Step6_FeePayment />} />
                <Route path="payment-result" element={<SuccessPage />} />
              </Routes>
            </FilingProvider>
        } />

        {/* --- ĐÓN KẾT QUẢ VNPAY (Vẫn giữ ở cấp cao nhất) --- */}
        <Route path="/payment-result" element={<SuccessPage />} />

        {/* --- EXAMINER --- */}
        <Route path="/examiner-dashboard" element={<ExaminerDashboard />} />
        
        {/* REFACTORED: Danh sách đơn chung cho Examiner */}
        <Route path="/examiner/applications/:type" element={<PatentReviewList />} />
        
        {/* REFACTORED: Các route review chung */}
        <Route path="/examiner/review/:type/:id" element={<ApplicationReview />} />
        <Route path="/examiner/review/:type/:id/accept" element={<AcceptConfirmation />} />
        <Route path="/examiner/review/:type/:id/reject" element={<RejectConfirmation />} />
        <Route path="/examiner/review/:type/:id/correction" element={<CorrectionRequest />} />
        <Route path="/examiner/review/:type/:id/reject-reason" element={<RejectReasonView />} />
        
        {/* REFACTORED: Thẩm định nội dung chung */}
        <Route path="/examiner/substantive-review/:type/:id" element={<SubstantiveReview />} />
        <Route path="/examiner/substantive-review/:type/:id/grant" element={<AcceptConfirmation phase="substantive" />} />
        <Route path="/examiner/substantive-review/:type/:id/reject" element={<RejectConfirmation phase="substantive" />} />
        <Route path="/examiner/substantive-review/:type/:id/correction" element={<CorrectionRequest phase="substantive" />} />
        
        {/* REFACTORED: Xem chứng chỉ */}
        <Route path="/examiner/applications/:type/:id/certificate" element={<PatentCertificateView />} />

        {/* --- APPLICANT --- */}
        <Route path="/applicant-dashboard" element={<ApplicantDashboard />} />
        
        {/* REFACTORED: Các route chung cho Applicant */}
        <Route path="/applicant/applications/:type" element={<PatentList />} />
        <Route path="/applicant/applications/:type/view/:id" element={<PatentDetail />} />
        <Route path="/applicant/applications/:type/revision/:id" element={<PatentRevision />} />
        <Route path="/applicant/applications/:type/payment/phase2/:id" element={<Phase2Payment />} />
        <Route path="/applicant/applications/:type/payment/phase3/:id" element={<Phase3Payment />} />
        <Route path="/applicant/applications/:type/:id/reject-reason" element={<ApplicantRejectReasonView />} />
        <Route path="/applicant/applications/:type/:id/certificate" element={<PatentCertificateView isPublic={false} />} />
        
      </Routes>
    </Router>
  );
}

export default App;