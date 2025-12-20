import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
// BƯỚC 1: Phải import component Register vào đây
import Register from './pages/Register'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        
        {/* BƯỚC 2: Sửa element từ <div> thành <Register /> */}
        <Route path="/register" element={<Register />} />
        
        <Route path="/login" element={<div className="p-10 text-center">Trang Đăng Nhập (Sẽ làm sau)</div>} />
      </Routes>
    </Router>
  );
}

export default App;