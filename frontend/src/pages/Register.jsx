import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  CheckCircle2,
  Lightbulb,
  Eye,
  EyeOff,
  Calendar,
  Info,
} from "lucide-react";

const Register = () => {
  const navigate = useNavigate();

  // 1. Quản lý trạng thái giao diện (Ẩn/hiện mật khẩu, Vai trò)
  const [role, setRole] = useState("APPLICANT"); // 'APPLICANT' hoặc 'EXAMINER'
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // 2. Quản lý dữ liệu người dùng nhập vào
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    cccdNumber: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  // Hàm cập nhật dữ liệu khi người dùng gõ phím
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 3. Hàm xử lý khi nhấn nút Đăng ký
  const handleRegister = async () => {
    // Kiểm tra các trường bắt buộc
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.password ||
      !formData.dob
    ) {
      alert("Vui lòng điền đầy đủ các thông tin bắt buộc (*)");
      return;
    }

    // Kiểm tra mật khẩu khớp nhau
    if (formData.password !== formData.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }

    // Đóng gói dữ liệu chuẩn để gửi lên Spring Boot
    const userData = {
      role: role,
      fullName: formData.fullName,
      dob: formData.dob, // Định dạng YYYY-MM-DD từ input type="date"
      cccdNumber: formData.cccdNumber,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      passwordHash: formData.password, // Backend nhận key này để lưu
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/register",
        userData
      );
      alert(response.data); // Hiện thông báo: "Đăng ký thành công..."
      navigate("/login"); // Chuyển hướng về trang đăng nhập
    } catch (error) {
      alert(error.response?.data || "Có lỗi xảy ra khi kết nối tới máy chủ");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4 font-sans text-gray-800">
      {/* Logo */}
      <div className="mb-10">
        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center rotate-45 shadow-lg">
          <div className="w-4 h-4 border-2 border-white rotate-45"></div>
        </div>
      </div>

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
        {/* CỘT TRÁI: FORM ĐĂNG KÝ */}
        <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-center mb-8">
            Tạo tài khoản mới
          </h2>

          {/* Chọn Vai trò (Role Toggle) */}
          <div className="flex bg-gray-100 p-1.5 rounded-xl mb-8">
            <button
              onClick={() => setRole("APPLICANT")}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                role === "APPLICANT"
                  ? "bg-blue-500 text-white shadow-md"
                  : "text-gray-500"
              }`}
            >
              Người nộp đơn
            </button>
            <button
              onClick={() => setRole("EXAMINER")}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                role === "EXAMINER"
                  ? "bg-blue-500 text-white shadow-md"
                  : "text-gray-500"
              }`}
            >
              Người duyệt đơn
            </button>
          </div>

          <div className="space-y-5">
            <InputField
              label="Họ tên"
              name="fullName"
              placeholder="Nguyễn Văn A"
              required
              value={formData.fullName}
              onChange={handleChange}
            />

            <div className="w-full">
              <label className="block text-sm font-semibold mb-1.5">
                Ngày sinh <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl p-3 pr-10 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition"
                />
              </div>
            </div>

            <InputField
              label="Số CCCD"
              name="cccdNumber"
              placeholder="VD: 012345678912"
              required
              value={formData.cccdNumber}
              onChange={handleChange}
              icon={<Info size={16} className="text-gray-400" />}
            />

            <InputField
              label="Email"
              name="email"
              type="email"
              placeholder="john.doe@example.com"
              required
              value={formData.email}
              onChange={handleChange}
            />

            <InputField
              label="Số điện thoại"
              name="phoneNumber"
              placeholder="Số điện thoại"
              required
              value={formData.phoneNumber}
              onChange={handleChange}
              icon={<Info size={16} className="text-gray-400" />}
            />

            <PasswordField
              label="Mật khẩu"
              name="password"
              show={showPass}
              value={formData.password}
              onChange={handleChange}
              toggle={() => setShowPass(!showPass)}
              placeholder="Nhập mật khẩu"
            />

            <PasswordField
              label="Xác nhận mật khẩu"
              name="confirmPassword"
              show={showConfirmPass}
              value={formData.confirmPassword}
              onChange={handleChange}
              toggle={() => setShowConfirmPass(!showConfirmPass)}
              placeholder="Xác nhận mật khẩu"
            />

            <div className="flex items-start gap-3 mt-6">
              <input
                type="checkbox"
                className="mt-1 w-4 h-4 text-blue-500 border-gray-300 rounded"
              />
              <p className="text-xs text-gray-500 leading-relaxed">
                Tôi đồng ý với{" "}
                <span className="text-blue-500 font-semibold cursor-pointer">
                  Điều khoản dịch vụ
                </span>{" "}
                và{" "}
                <span className="text-blue-500 font-semibold cursor-pointer">
                  Chính sách bảo mật
                </span>
                .
              </p>
            </div>

            <button
              onClick={handleRegister}
              className="w-full bg-blue-500 text-white py-4 rounded-xl font-bold mt-6 hover:bg-blue-600 transition shadow-sm"
            >
              Đăng ký tài khoản
            </button>

            <p className="text-center text-sm text-gray-500 mt-4">
              Đã có tài khoản?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-blue-500 font-bold cursor-pointer hover:underline"
              >
                Đăng nhập
              </span>
            </p>
          </div>
        </div>

        {/* CỘT PHẢI: THÔNG TIN BỔ TRỢ */}
        <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-10">
          <div>
            <h3 className="text-lg font-bold mb-8">
              Lợi ích khi đăng ký tài khoản IPMS
            </h3>
            <ul className="space-y-5">
              <BenefitItem text="Quản lý hồ sơ đăng ký sở hữu trí tuệ một cách dễ dàng và hiệu quả." />
              <BenefitItem text="Theo dõi tình trạng hồ sơ và nhận thông báo cập nhật theo thời gian thực." />
              <BenefitItem text="Tiết kiệm thời gian với quy trình nộp đơn trực tuyến đơn giản." />
              <BenefitItem text="Lưu trữ tài liệu an toàn và truy cập bất cứ lúc nào, ở bất cứ đâu." />
            </ul>
          </div>

          <div className="border-t border-gray-100 pt-10">
            <h3 className="text-lg font-bold mb-8">
              Danh sách tài liệu cần chuẩn bị
            </h3>
            <ul className="space-y-6">
              <DocItem text="Đối với cá nhân: Bản sao căn cước công dân/hộ chiếu." />
              <DocItem text="Đối với tổ chức: Bản sao giấy phép kinh doanh, giấy ủy quyền (nếu có)." />
              <DocItem text="Các tài liệu liên quan đến sở hữu trí tuệ (mô tả, hình ảnh, yêu cầu bảo hộ)." />
            </ul>
          </div>
        </div>
      </div>

      <footer className="mt-16 text-sm text-gray-400">
        © 2025 IPMS Sáng Chế & Giải Pháp. All rights reserved.
      </footer>
    </div>
  );
};

// --- CÁC THÀNH PHẦN PHỤ TRỢ (HELPER COMPONENTS) ---

const InputField = ({
  label,
  name,
  type = "text",
  placeholder,
  required,
  icon,
  value,
  onChange,
}) => (
  <div className="w-full">
    <label className="block text-sm font-semibold mb-1.5 flex items-center gap-1">
      {label} {required && <span className="text-red-500">*</span>} {icon}
    </label>
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition"
    />
  </div>
);

const PasswordField = ({
  label,
  name,
  show,
  toggle,
  placeholder,
  value,
  onChange,
}) => (
  <div className="w-full">
    <label className="block text-sm font-semibold mb-1.5">
      {label} <span className="text-red-500">*</span>
    </label>
    <div className="relative">
      <input
        name={name}
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-xl p-3 pr-10 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition"
      />
      <button
        type="button"
        onClick={toggle}
        className="absolute right-3 top-3.5 text-gray-400"
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  </div>
);

const BenefitItem = ({ text }) => (
  <li className="flex gap-4 items-start">
    <CheckCircle2 className="text-blue-500 w-5 h-5 mt-0.5 shrink-0" />
    <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
  </li>
);

const DocItem = ({ text }) => (
  <li className="flex gap-4 items-start">
    <Lightbulb className="text-cyan-400 w-5 h-5 mt-0.5 shrink-0" />
    <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
  </li>
);

export default Register;
