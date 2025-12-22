import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// 1. Nhóm Trang chung
import Landing from "./pages/Landing";

// 2. Nhóm Auth (Xác thực) - Nằm trong folder Auth
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

// 3. Nhóm Người nộp đơn (Applicant) - Nằm trong folder Applicant
import ApplicantDashboard from "./pages/Applicant/ApplicantDashboard";

// 4. Nhóm Người duyệt đơn (Examiner) - Nằm trong folder Examiner
import ExaminerDashboard from "./pages/Examiner/ExaminerDashboard";

function App() {
  return (
    <Router>
      <Routes>
        {/* --- TRANG CHỦ --- */}
        <Route path="/" element={<Landing />} />

        {/* --- HỆ THỐNG XÁC THỰC --- */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* --- PHÂN HỆ NGƯỜI NỘP ĐƠN (APPLICANT) --- */}
        <Route path="/applicant-dashboard" element={<ApplicantDashboard />} />
        {/* Sau này các đường dẫn con sẽ như: /applicant/patent, /applicant/trademark... */}

        {/* --- PHÂN HỆ NGƯỜI DUYỆT ĐƠN (EXAMINER) --- */}
        <Route path="/examiner-dashboard" element={<ExaminerDashboard />} />
        {/* Sau này các đường dẫn con sẽ như: /examiner/review-patent... */}
      </Routes>
    </Router>
  );
}

export default App;
