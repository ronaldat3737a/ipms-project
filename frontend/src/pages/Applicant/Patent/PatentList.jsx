import React, { useState } from "react";
import {
  Search,
  Bell,
  Plus,
  Eye,
  Edit3,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  FileText,
  Bookmark,
  PenTool,
  FileStack,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const PatentList = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Sáng chế");

  // Dữ liệu mẫu dựa trên ảnh image_c8b3aa.png
  const patentData = [
    {
      id: "VN/2023/000001",
      type: "GPHI",
      name: "Hệ thống quản lý năng lượng thông minh cho tòa nhà",
      date: "15/03/2023",
      status: "Đang TĐ Nội dung",
      color: "bg-blue-50 text-blue-600 border-blue-100",
    },
    {
      id: "VN/2023/000002",
      type: "Sáng chế",
      name: "Phương pháp xử lý nước thải công nghiệp hiệu quả cao",
      date: "01/04/2023",
      status: "Đang TĐ Hình thức",
      color: "bg-blue-50 text-blue-600 border-blue-100",
    },
    {
      id: "VN/2023/000003",
      type: "Sáng chế",
      name: "Thiết bị bay không người lái tự động thu thập dữ liệu nông nghiệp",
      date: "20/05/2023",
      status: "Chờ sửa đổi",
      color: "bg-orange-50 text-orange-600 border-orange-100",
      warning: true,
    },
    {
      id: "VN/2022/000123",
      type: "GPHI",
      name: "Cơ chế bảo mật dữ liệu blockchain mới cho giao dịch tài chính",
      date: "10/11/2022",
      status: "Đã cấp văn bằng",
      color: "bg-green-50 text-green-600 border-green-100",
    },
    {
      id: "VN/2024/000004",
      type: "Sáng chế",
      name: "Ứng dụng di động hỗ trợ học ngoại ngữ cá nhân hóa",
      date: "05/01/2024",
      status: "Chờ nộp lệ phí",
      color: "bg-gray-50 text-gray-600 border-gray-100",
      fee: true,
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <div className="w-3 h-3 border-2 border-white rotate-45"></div>
          </div>
          <span className="text-xl font-bold text-blue-600">IP Hub</span>
        </div>
        <nav className="flex-grow px-4 space-y-2">
          <NavItem
            onClick={() => navigate("/applicant-dashboard")}
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
          />
          <NavItem
            icon={<FileText size={20} />}
            label="Sáng chế/ GPHI"
            active
          />
          <NavItem icon={<Bookmark size={20} />} label="Nhãn hiệu" />
          <NavItem icon={<PenTool size={20} />} label="Kiểu dáng CN" />
          <NavItem icon={<FileStack size={20} />} label="Hồ sơ của tôi" />
        </nav>
        <div className="p-4 border-t border-gray-100">
          <button className="flex items-center gap-3 text-gray-500 hover:text-red-500 w-full px-4 py-3 transition">
            <LogOut size={20} />
            <span className="font-bold text-sm">Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-grow flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <div className="flex items-center gap-4 text-sm font-medium text-gray-500">
            <span>Sáng chế</span>
            <button
              onClick={() => navigate("/applicant/patent/step1")} // Đường dẫn mới khớp với App.jsx
              className="bg-blue-500 text-white px-4 py-1.5 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-600 transition ml-4"
            >
              <Plus size={16} /> Nộp đơn mới
            </button>
          </div>
          <div className="flex items-center gap-6">
            <Bell size={20} className="text-gray-400 cursor-pointer" />
            <div className="flex items-center gap-3 border-l pl-6 border-gray-100">
              <div className="text-right">
                <p className="text-sm font-bold text-gray-800">Trần Văn An</p>
                <p className="text-xs text-gray-400 font-medium">
                  an.tran@example.com
                </p>
              </div>
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                alt="Avatar"
                className="w-9 h-9 rounded-full border"
              />
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-8 space-y-6 overflow-y-auto">
          <h1 className="text-2xl font-bold text-gray-800">
            Đơn Sáng chế/GPHI của tôi
          </h1>

          {/* Filters Area */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-gray-400 w-24 uppercase">
                Loại:
              </span>
              <div className="flex gap-2">
                <FilterButton label="Tất cả" active />
                <FilterButton label="Sáng chế" />
                <FilterButton label="Giải pháp hữu ích" />
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-sm font-bold text-gray-400 w-24 uppercase mt-2">
                Trạng thái:
              </span>
              <div className="flex flex-wrap gap-2 flex-1">
                <FilterButton label="Tất cả" active />
                <FilterButton label="Mới" />
                <FilterButton label="Đang TĐ Hình thức" />
                <FilterButton label="Chờ sửa đổi hình thức" />
                <FilterButton label="Đang TĐ Nội dung" />
                <FilterButton label="Chờ nộp lệ phí" />
                <FilterButton label="Chờ sửa đổi nội dung" />
                <FilterButton label="Đã cấp văn bằng/ từ chối" />
                <FilterButton label="Đã cấp văn bằng" />
                <FilterButton label="Từ chối đơn" />
              </div>
            </div>
          </div>

          {/* Table Area */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-4 w-10">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-6 py-4">Mã đơn</th>
                  <th className="px-6 py-4 text-center">Loại</th>
                  <th className="px-6 py-4">Tên sáng chế</th>
                  <th className="px-6 py-4">Ngày nộp</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {patentData.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition group">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-blue-500 cursor-pointer hover:underline">
                      {item.id}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`text-[10px] font-black ${
                          item.type === "GPHI"
                            ? "text-red-400"
                            : "text-green-400"
                        }`}
                      >
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-700 max-w-xs truncate">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                      {item.date}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1 w-fit ${item.color}`}
                      >
                        {item.warning && (
                          <span className="w-1 h-1 bg-orange-500 rounded-full animate-pulse"></span>
                        )}
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3 text-gray-400">
                        <Eye
                          size={16}
                          className="cursor-pointer hover:text-blue-500"
                        />
                        {item.warning && (
                          <Edit3
                            size={16}
                            className="cursor-pointer hover:text-orange-500"
                          />
                        )}
                        {item.fee && (
                          <CreditCard
                            size={16}
                            className="cursor-pointer hover:text-gray-700"
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="px-6 py-4 bg-white border-t border-gray-100 flex items-center justify-end gap-4">
              <div className="flex items-center gap-1 border rounded-lg p-1">
                <button className="p-1 hover:bg-gray-100 rounded text-gray-400">
                  <ChevronLeft size={18} />
                </button>
                <span className="text-xs font-medium px-4 text-gray-500">
                  Trang 1 của 2
                </span>
                <button className="p-1 hover:bg-gray-100 rounded text-gray-400">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Sub-components
const NavItem = ({ icon, label, active = false, onClick }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${
      active ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:bg-gray-50"
    }`}
  >
    {icon}
    <span className="font-bold text-sm">{label}</span>
  </div>
);

const FilterButton = ({ label, active = false }) => (
  <button
    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all border ${
      active
        ? "bg-blue-500 text-white border-blue-500 shadow-sm"
        : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
    }`}
  >
    {label}
  </button>
);

export default PatentList;
