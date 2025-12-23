import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();

  // 1. Trạng thái giao diện
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // 2. Dữ liệu Form
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 3. Logic xử lý Đăng nhập (Đã cập nhật logic lưu trữ)
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      alert("Vui lòng nhập đầy đủ Email và Mật khẩu");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/api/auth/login", {
        email: formData.email,
        password: formData.password
      });

      // Dữ liệu người dùng thực tế từ Database (id, fullName, role, email, cccdNumber...)
      const userData = response.data; 
      
      // QUAN TRỌNG: Lưu toàn bộ thông tin user vào localStorage để xóa bỏ dữ liệu giả
      localStorage.setItem("user", JSON.stringify(userData));
      
      alert("Đăng nhập thành công! Xin chào " + userData.fullName);

      // Chuyển hướng dựa trên vai trò thật từ DB
      if (userData.role === "APPLICANT") {
        navigate("/applicant-dashboard");
      } else if (userData.role === "EXAMINER") {
        navigate("/examiner-dashboard");
      }
      
    } catch (error) {
      const errorMsg = error.response?.data || "Email hoặc mật khẩu không chính xác";
      alert("Lỗi đăng nhập: " + (typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 font-sans text-gray-800">
      
      {/* Khối Card Đăng nhập */}
      <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center">
        
        {/* Logo */}
        <div className="mb-6">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center rotate-45 shadow-lg">
            <div className="w-4 h-4 border-2 border-white rotate-45"></div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-2">Đăng nhập</h2>
        <p className="text-gray-500 text-sm mb-10">Đăng nhập bằng tài khoản IPMS</p>

        <form className="w-full space-y-6" onSubmit={handleLogin}>
          
          {/* Trường Email */}
          <div className="w-full">
            <label className="block text-sm font-semibold mb-2">Email</label>
            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder="Nhập email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition"
              />
            </div>
          </div>

          {/* Trường Mật khẩu */}
          <div className="w-full">
            <label className="block text-sm font-semibold mb-2">Mật khẩu</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Nhập mật khẩu của bạn"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl p-3 pr-10 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Ghi nhớ & Quên mật khẩu */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
              />
              <span className="text-gray-600 group-hover:text-gray-800 transition">Ghi nhớ đăng nhập</span>
            </label>
            <span className="text-blue-500 font-semibold cursor-pointer hover:underline">
              Quên mật khẩu?
            </span>
          </div>

          {/* Nút Đăng nhập chính */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3.5 rounded-xl font-bold hover:bg-blue-600 transition shadow-md active:scale-[0.98]"
          >
            Đăng nhập
          </button>

          {/* Divider "Hoặc" */}
          <div className="relative flex items-center justify-center my-8">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="mx-4 text-gray-400 text-xs uppercase tracking-widest">Hoặc</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          <button
            type="button"
            className="w-full bg-white border border-gray-200 text-gray-700 py-3.5 rounded-xl font-semibold hover:bg-gray-50 transition shadow-sm active:scale-[0.98]"
          >
            Đăng nhập bằng Cổng định danh
          </button>

          <p className="text-center text-sm text-gray-500 mt-6">
            Chưa có tài khoản?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-blue-500 font-bold cursor-pointer hover:underline"
            >
              Đăng ký
            </span>
          </p>
        </form>
      </div>

      <footer className="mt-16 text-xs text-gray-400">
        © 2025 IPMS Sáng Chế & Giải Pháp. All rights reserved.
      </footer>
    </div>
  );
};

export default Login;