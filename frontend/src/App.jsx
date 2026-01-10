import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// 1. Nhóm Trang chung
import Landing from "./pages/Landing";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

// 2. Nhóm Người nộp đơn (Applicant)
import ApplicantDashboard from "./pages/Applicant/ApplicantDashboard";
import PatentList from "./pages/Applicant/Patent/PatentList";
import PatentDetail from "./pages/Applicant/Patent/PatentDetail";
import Phase2Payment from "./pages/Applicant/Patent/Phase2Payment";
import Phase3Payment from "./pages/Applicant/Patent/Phase3Payment";
import PatentRevision from "./pages/Applicant/Patent/PatentRevision";
import ApplicantRejectReasonView from "./pages/Applicant/Patent/ApplicantRejectReasonView";

// 3. Nhóm Người duyệt đơn (Examiner)
import ExaminerDashboard from "./pages/Examiner/ExaminerDashboard";
import PatentReviewList from "./pages/Examiner/Patent/PatentReviewList";
import ApplicationReview from "./pages/Examiner/Patent/ApplicationReview";
import SubstantiveReview from "./pages/Examiner/Patent/SubstantiveReview";
import PatentCertificateView from "./pages/Examiner/Patent/PatentCertificateView";

// 4. Nhóm Nộp đơn Sáng chế (Patent Filing)
import { FilingProvider as PatentFilingProvider } from "./pages/Applicant/Patent/Filing/FilingContext";
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
import RejectReasonView from "./pages/Examiner/Patent/RejectReasonView";

// --- CÁC COMPONENT CỦA LUỒNG KIỂU DÁNG CÔNG NGHIỆP (KDCN) ---
// 6. Applicant - Design
import DesignList from "./pages/Applicant/Design/DesignList";
import DesignDetail from "./pages/Applicant/Design/DesignDetail";
import DesignRevision from "./pages/Applicant/Design/DesignRevision";
import DesignPhase2Payment from "./pages/Applicant/Design/DesignPhase2Payment";
import DesignPhase3Payment from "./pages/Applicant/Design/DesignPhase3Payment";
import DesignRejectReasonView from "./pages/Applicant/Design/DesignRejectReasonView";
import { FilingProvider as DesignFilingProvider } from "./pages/Applicant/Design/Filing/FilingContext";
import DesignStep1 from "./pages/Applicant/Design/Filing/Step1_GeneralInfo";
import DesignStep2 from "./pages/Applicant/Design/Filing/Step2_OwnerAuthor";
import DesignStep3 from "./pages/Applicant/Design/Filing/Step3_Attachments";
import DesignStep4 from "./pages/Applicant/Design/Filing/Step4_Claims";
import DesignStep5 from "./pages/Applicant/Design/Filing/Step5_Submission";
import DesignStep6 from "./pages/Applicant/Design/Filing/Step6_FeePayment";
import DesignSuccessPage from "./pages/Applicant/Design/Filing/SuccessPage";

// 7. Examiner - Design
import DesignReviewList from "./pages/Examiner/Design/DesignReviewList";
import DesignReview from "./pages/Examiner/Design/DesignReview";

function App() {
  return (
    <Router>
      <Routes>
        {/* === CÁC TRANG CHUNG === */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* === APPLICANT DASHBOARD === */}
        <Route path="/applicant-dashboard" element={<ApplicantDashboard />} />
        
        {/* === EXAMINER DASHBOARD === */}
        <Route path="/examiner-dashboard" element={<ExaminerDashboard />} />
        
        {/* === LUỒNG NỘP ĐƠN SÁNG CHẾ / GPHI === */}
        <Route path="/applicant/applications/:type/filing/*" element={
            <PatentFilingProvider>
              <Routes>
                <Route path="step1" element={<Step1_GeneralInfo />} />
                <Route path="step2" element={<Step2_OwnerAuthor />} />
                <Route path="step3" element={<Step3_Attachments />} />
                <Route path="step4" element={<Step4_Claims />} />
                <Route path="step5" element={<Step5_Submission />} />
                <Route path="step6" element={<Step6_FeePayment />} />
                <Route path="payment-result" element={<SuccessPage />} />
              </Routes>
            </PatentFilingProvider>
        } />
        
        {/* === LUỒNG NỘP ĐƠN KIỂU DÁNG CÔNG NGHIỆP === */}
        <Route path="/applicant/design/filing/*" element={
            <DesignFilingProvider>
                <Routes>
                    <Route path="step1" element={<DesignStep1 />} />
                    <Route path="step2" element={<DesignStep2 />} />
                    <Route path="step3" element={<DesignStep3 />} />
                    <Route path="step4" element={<DesignStep4 />} />
                    <Route path="step5" element={<DesignStep5 />} />
                    <Route path="step6" element={<DesignStep6 />} />
                    <Route path="payment-result" element={<DesignSuccessPage />} />
                </Routes>
            </DesignFilingProvider>
        } />

        {/* === CÁC LUỒNG XEM VÀ XỬ LÝ ĐƠN KIỂU DÁNG CÔNG NGHIỆP (ƯU TIÊN CAO HƠN) === */}
        <Route path="/applicant/applications/KIEU_DANG_CN" element={<DesignList />} />
        <Route path="/applicant/applications/KIEU_DANG_CN/view/:id" element={<DesignDetail />} />
        <Route path="/applicant/applications/KIEU_DANG_CN/revision/:id" element={<DesignRevision />} />
        <Route path="/applicant/applications/KIEU_DANG_CN/payment/phase2/:id" element={<DesignPhase2Payment />} />
        <Route path="/applicant/applications/KIEU_DANG_CN/payment/phase3/:id" element={<DesignPhase3Payment />} />
        <Route path="/applicant/applications/KIEU_DANG_CN/:id/reject-reason" element={<DesignRejectReasonView />} />
        
        <Route path="/examiner/applications/KIEU_DANG_CN" element={<DesignReviewList />} />
        <Route path="/examiner/review/KIEU_DANG_CN/:id" element={<DesignReview />} />
        <Route path="/examiner/review/KIEU_DANG_CN/:id/accept" element={<AcceptConfirmation />} />
        <Route path="/examiner/review/KIEU_DANG_CN/:id/correction" element={<CorrectionRequest />} />
        <Route path="/examiner/review/KIEU_DANG_CN/:id/reject" element={<RejectConfirmation />} />

        {/* === CÁC LUỒNG XEM VÀ XỬ LÝ ĐƠN SÁNG CHẾ / GPHI === */}
        <Route path="/applicant/applications/:type" element={<PatentList />} />
        <Route path="/applicant/applications/:type/view/:id" element={<PatentDetail />} />
        <Route path="/applicant/applications/:type/revision/:id" element={<PatentRevision />} />
        <Route path="/applicant/applications/:type/payment/phase2/:id" element={<Phase2Payment />} />
        <Route path="/applicant/applications/:type/payment/phase3/:id" element={<Phase3Payment />} />
        <Route path="/applicant/applications/:type/:id/reject-reason" element={<ApplicantRejectReasonView />} />
        <Route path="/applicant/applications/:type/:id/certificate" element={<PatentCertificateView isPublic={false} />} />
        
        <Route path="/examiner/applications/:type" element={<PatentReviewList />} />
        <Route path="/examiner/review/:type/:id" element={<ApplicationReview />} />
        <Route path="/examiner/review/:type/:id/accept" element={<AcceptConfirmation />} />
        <Route path="/examiner/review/:type/:id/reject" element={<RejectConfirmation />} />
        <Route path="/examiner/review/:type/:id/correction" element={<CorrectionRequest />} />
        <Route path="/examiner/review/:type/:id/reject-reason" element={<RejectReasonView />} />
        <Route path="/examiner/substantive-review/:type/:id" element={<SubstantiveReview />} />
        <Route path="/examiner/substantive-review/:type/:id/grant" element={<AcceptConfirmation phase="substantive" />} />
        <Route path="/examiner/substantive-review/:type/:id/reject" element={<RejectConfirmation phase="substantive" />} />
        <Route path="/examiner/substantive-review/:type/:id/correction" element={<CorrectionRequest phase="substantive" />} />
        <Route path="/examiner/applications/:type/:id/certificate" element={<PatentCertificateView />} />
        
      </Routes>
    </Router>
  );
}

export default App;