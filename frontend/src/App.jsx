import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Login from "./pages/Login";

// THÊM MỚI: Import 2 trang Dashboard vừa tạo
import ApplicantDashboard from "./pages/ApplicantDashboard";
import ExaminerDashboard from "./pages/ExaminerDashboard";

function App() {
  return (
    <Router>
      <Routes>
        {/* 1. Trang chủ (Landing Page) */}
        <Route path="/" element={<Landing />} />

        {/* 2. Trang Đăng ký */}
        <Route path="/register" element={<Register />} />

        {/* 3. Trang Đăng nhập */}
        <Route path="/login" element={<Login />} />

        {/* 4. Trang Dashboard cho Người nộp đơn (Applicant) */}
        <Route path="/applicant-dashboard" element={<ApplicantDashboard />} />

        {/* 5. Trang Dashboard cho Người duyệt đơn (Examiner) */}
        <Route path="/examiner-dashboard" element={<ExaminerDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
