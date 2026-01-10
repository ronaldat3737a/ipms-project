import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate để điều hướng
import {
  LayoutDashboard,
  FileText,
  Bookmark,
  PenTool,
  FileStack,
  LogOut,
  Bell,
  Search,
  Plus,
  CreditCard,
  AlertCircle,
  MoreHorizontal,
} from "lucide-react";

const ApplicantDashboard = () => {
  const navigate = useNavigate(); // Khởi tạo hook navigate

  // Dữ liệu giả lập danh sách hồ sơ
  const recentApplications = [
    {
      id: "PT-2023-1234",
      type: "Sáng chế",
      name: "Hệ thống năng lượng tái tạo thông minh",
      date: "15/11/2023",
      status: "Đang thẩm định nội dung",
      color: "bg-cyan-100 text-cyan-600",
    },
    {
      id: "TM-2024-0012",
      type: "Nhãn hiệu",
      name: 'Logo "EcoLiving"',
      date: "20/01/2024",
      status: "Mới",
      color: "bg-gray-100 text-gray-500",
    },
    {
      id: "DS-2023-0567",
      type: "Kiểu dáng",
      name: "Thiết kế ghế văn phòng ergonomic",
      date: "01/12/2023",
      status: "Chờ sửa đổi",
      color: "bg-orange-100 text-orange-600",
    },
    {
      id: "PT-2022-8901",
      type: "Sáng chế",
      name: "Phương pháp xử lý nước thải tiên tiến",
      date: "10/09/2022",
      status: "Đã cấp văn bằng",
      color: "bg-green-100 text-green-600",
    },
    {
      id: "TM-2023-0345",
      type: "Nhãn hiệu",
      name: 'Tên sản phẩm "FutureTech"',
      date: "22/07/2023",
      status: "Chờ nộp lệ phí",
      color: "bg-purple-100 text-purple-600",
    },
    {
      id: "DS-2024-0005",
      type: "Kiểu dáng",
      name: "Bao bì sản phẩm thân thiện môi trường",
      date: "10/02/2024",
      status: "Đang thẩm định hình thức",
      color: "bg-blue-100 text-blue-600",
    },
    {
      id: "PT-2023-0099",
      type: "Sáng chế",
      name: "Thuật toán tối ưu hóa giao thông",
      date: "05/05/2023",
      status: "Từ chối",
      color: "bg-red-100 text-red-600",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* --- 1. SIDEBAR --- */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <div className="w-3 h-3 border-2 border-white rotate-45"></div>
          </div>
          <span className="text-xl font-bold text-blue-600">IP Hub</span>
        </div>

        <nav className="flex-grow px-4 space-y-2">
          <NavItem
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            active
            onClick={() => navigate("/applicant-dashboard")}
          />
          {/* Gán sự kiện chuyển hướng sang trang Sáng chế/GPHI */}
          <NavItem 
            icon={<FileText size={20} />} 
            label="Sáng chế/ GPHI" 
            onClick={() => navigate("/applicant/applications/sang-che")} 
          />
          <NavItem icon={<Bookmark size={20} />} label="Nhãn hiệu" />
          <NavItem icon={<PenTool size={20} />} label="Kiểu dáng CN" onClick={() => navigate("/applicant/applications/KIEU_DANG_CN")} />
          <NavItem icon={<FileStack size={20} />} label="Hồ sơ của tôi" />
        </nav>

        <div className="p-4 border-t border-gray-100">
          {/* Gán sự kiện quay về trang Landing khi ấn Đăng xuất */}
          <button 
            onClick={() => navigate("/")}
            className="flex items-center gap-3 text-gray-500 hover:text-red-500 w-full px-4 py-3 transition"
          >
            <LogOut size={20} />
            <span className="font-medium">Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-grow flex flex-col overflow-hidden">
        {/* --- 2. HEADER --- */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
          <div className="relative w-96">
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Tìm kiếm hồ sơ..."
              className="w-full bg-gray-100 rounded-xl py-2 pl-10 pr-4 outline-none focus:ring-2 focus:ring-blue-100 transition"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative text-gray-500 hover:text-blue-500 transition">
              <Bell size={22} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 border-l pl-6 border-gray-100">
              <div className="text-right">
                <p className="text-sm font-bold text-gray-800">Trần Văn An</p>
                <p className="text-xs text-gray-400">an.tran@example.com</p>
              </div>
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                alt="Avatar"
                className="w-10 h-10 rounded-full bg-blue-100 border border-gray-200"
              />
            </div>
          </div>
        </header>

        {/* --- 3. DASHBOARD BODY --- */}
        <div className="p-8 space-y-8 overflow-y-auto">
          <section>
            <h2 className="text-xl font-bold mb-6">Thống kê & Lối tắt</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <StatCard
                label="Tổng số đơn"
                value="1,250"
                icon={<FileText className="text-blue-500" />}
              />
              <StatCard
                label="Đang xử lý"
                value="85"
                icon={<AlertCircle className="text-amber-500" />}
              />
              <StatCard
                label="Cần bổ sung/Sửa đổi"
                value="12"
                icon={<PenTool className="text-red-500" />}
              />
              <StatCard
                label="Đã cấp bằng"
                value="780"
                icon={<Bookmark className="text-green-500" />}
              />
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => navigate("/applicant/applications/sang-che/filing/step1")}
                className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition">
                <Plus size={18} /> Sáng chế/GPHI
              </button>
              <button onClick={() => navigate("/applicant/design/filing/step1")} className="bg-blue-500 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-600 transition">
                <Plus size={18} /> Kiểu dáng CN
              </button>
              <button className="bg-blue-400 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-500 transition">
                <Plus size={18} /> Nhãn hiệu
              </button>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-6">Nhắc việc thông minh</h2>
            <div className="space-y-4">
              <ReminderItem
                icon={<CreditCard className="text-pink-500" />}
                title="Phí chưa thanh toán"
                desc='Phí duy trì cho nhãn hiệu "Global Brand" đến hạn.'
                amount="5.000.000 VND"
                btnLabel="Thanh toán"
                btnColor="bg-pink-500 hover:bg-pink-600"
              />
              <ReminderItem
                icon={<AlertCircle className="text-blue-500" />}
                title="Yêu cầu sửa đổi hồ sơ"
                desc="Đơn 2023-005678 cần sửa đổi hình ảnh. Lý do: Hình ảnh không rõ nét."
                btnLabel="Sửa đổi hồ sơ"
                btnColor="bg-blue-500 hover:bg-blue-600"
              />
            </div>
          </section>

          <section className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold">Danh sách hồ sơ gần đây</h2>
              <button className="text-blue-500 font-bold text-sm">
                Xem tất cả
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-bold">Mã đơn</th>
                    <th className="px-6 py-4 font-bold text-center">
                      Đối tượng
                    </th>
                    <th className="px-6 py-4 font-bold">Tên/Nhãn hiệu</th>
                    <th className="px-6 py-4 font-bold">Ngày nộp</th>
                    <th className="px-6 py-4 font-bold">Trạng thái</th>
                    <th className="px-6 py-4 font-bold text-center">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentApplications.map((app, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm font-bold text-blue-500">
                        {app.id}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="p-2 bg-gray-100 rounded-lg inline-block text-gray-500">
                          <FileText size={16} />
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                        {app.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {app.date}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${app.color}`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-gray-400 cursor-pointer hover:text-gray-600">
                        <MoreHorizontal size={20} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-6 bg-gray-50 flex justify-between items-center text-xs text-gray-400">
              <p>Hiển thị 1-7 trên 25 hồ sơ</p>
              <div className="flex gap-2">
                <button className="p-2 border rounded-lg bg-white">
                  Trước
                </button>
                <button className="p-2 border rounded-lg bg-blue-500 text-white px-3">
                  1
                </button>
                <button className="p-2 border rounded-lg bg-white">Sau</button>
              </div>
            </div>
          </section>
        </div>

        <footer className="py-6 text-center text-xs text-gray-400 border-t border-gray-100 shrink-0">
          © 2025 IPMS Sáng Chế & Giải Pháp. All rights reserved.
        </footer>
      </main>
    </div>
  );
};

// --- HELPER COMPONENTS ---

// Cập nhật NavItem để nhận props onClick
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

const StatCard = ({ label, value, icon }) => (
  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start justify-between">
    <div>
      <p className="text-gray-400 text-xs font-bold uppercase mb-1">{label}</p>
      <p className="text-2xl font-black text-gray-800">{value}</p>
    </div>
    <div className="p-3 bg-gray-50 rounded-2xl">{icon}</div>
  </div>
);

const ReminderItem = ({ icon, title, desc, amount, btnLabel, btnColor }) => (
  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
    <div className="flex items-center gap-5">
      <div className="p-4 bg-gray-50 rounded-2xl shrink-0">{icon}</div>
      <div>
        <h4 className="font-bold text-gray-800">{title}</h4>
        <p className="text-sm text-gray-400">{desc}</p>
        {amount && (
          <p className="text-sm font-bold text-gray-800 mt-1">
            Số tiền: {amount}
          </p>
        )}
      </div>
    </div>
    <button
      className={`${btnColor} text-white px-6 py-2.5 rounded-xl font-bold text-sm transition shadow-sm shrink-0 ml-4`}
    >
      {btnLabel}
    </button>
  </div>
);

export default ApplicantDashboard;