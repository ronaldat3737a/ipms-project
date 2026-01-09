import React from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  LayoutDashboard,
  UserCheck,
  FileText,
  Lightbulb,
  Package,
  CreditCard,
  Settings,
  Bell,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  RefreshCw,
  ShieldCheck,
  LogOut,
} from "lucide-react";

// --- DỮ LIỆU GIẢ LẬP ---
const EXAMINER_STATS = [
  { name: "Sáng chế", count: 120, color: "#3b82f6" },
  { name: "Giải pháp hữu ích", count: 85, color: "#10b981" },
  { name: "Kiểu dáng CN", count: 45, color: "#94a3b8" },
];

const STATUS_DATA = [
  { name: "Hợp lệ", value: 40, color: "#10b981" },
  { name: "Chờ sửa đổi", value: 25, color: "#f59e0b" },
  { name: "Mới nộp", value: 35, color: "#3b82f6" },
];

const MOCK_APPLICATIONS = [
  {
    id: "1-2025-00001",
    title: "Hệ thống lọc khí Nano",
    type: "Sáng chế",
    owner: "Nguyễn Văn A",
    status: "MOI",
    date: "2025-12-25",
  },
  {
    id: "2-2025-00012",
    title: "Quy trình tái chế nhựa",
    type: "GPHU",
    owner: "Công ty ABC",
    status: "DANG_CHO_DUYET_LAI",
    date: "2025-12-24",
  },
  {
    id: "1-2025-00005",
    title: "Drone tự hành QR",
    type: "Sáng chế",
    owner: "Trần Thị C",
    status: "YEU_CAU_SUA_HT",
    date: "2025-12-23",
  },
];

const ExaminerDashboard = () => {
  const navigate = useNavigate();

  // LOGIC: Điều hướng đến trang chi tiết (Review) khi nhấn nút "Duyệt hồ sơ" trong bảng
  const handleGoToReview = (type, id) => {
    const typeSlug = type === "Sáng chế" ? "sang-che" : "giai-phap-huu-ich";
    navigate(`/examiner/review/${typeSlug}/${id}`);
  };

  const renderStatusBadge = (status) => {
    const config = {
      MOI: { label: "Mới nộp", style: "bg-blue-100 text-blue-700 border-blue-200" },
      YEU_CAU_SUA_HT: { label: "Yêu cầu sửa HT", style: "bg-orange-100 text-orange-700 border-orange-200" },
      DANG_CHO_DUYET_LAI: { label: "Đã sửa - Chờ duyệt lại", style: "bg-indigo-100 text-indigo-700 border-indigo-200" },
      DANG_TĐ_NOI_DUNG: { label: "Đang thẩm định ND", style: "bg-purple-100 text-purple-700 border-purple-200" },
      CAP_VAN_BANG: { label: "Đã cấp bằng", style: "bg-green-100 text-green-700 border-green-200" },
    };
    const { label, style } = config[status] || { label: status, style: "bg-gray-100 text-gray-700" };
    return (
      <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${style}`}>
        {label}
      </span>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans text-slate-900">
      {/* SIDEBAR */}
      <aside className="w-72 bg-slate-900 text-white flex flex-col shadow-2xl shrink-0">
        <div className="p-8 border-b border-slate-800 text-center">
            <span className="text-xl font-black tracking-tight uppercase italic">
              IPMS <span className="text-blue-400">Examiner</span>
            </span>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          <SidebarItem
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            active
            onClick={() => navigate("/examiner-dashboard")}
          />
          
          <SidebarItem
            icon={<FileText size={18} />}
            label="TĐ Sáng chế"
            onClick={() => navigate("/examiner/applications/sang-che")}
          />
          
          <SidebarItem
            icon={<Lightbulb size={18} />}
            label="TĐ Giải pháp hữu ích"
            onClick={() => navigate("/examiner/applications/giai-phap-huu-ich")}
          />

          <SidebarItem icon={<Package size={18} />} label="TĐ Kiểu dáng công nghiệp" />
          <SidebarItem icon={<ShieldCheck size={18} />} label="TĐ Nhãn hiệu" />

          <div className="mt-8 mb-2 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-left">
            Hệ thống
          </div>
          <SidebarItem icon={<CreditCard size={18} />} label="Theo dõi Lệ phí" />
          <SidebarItem icon={<Settings size={18} />} label="Cấu hình Quy trình" />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 text-slate-400 hover:text-red-400 w-full px-4 py-3 transition"
          >
            <LogOut size={20} />
            <span className="font-medium">Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-20 bg-white border-b flex items-center justify-between px-10 shadow-sm z-10 shrink-0">
          <h1 className="text-xl font-bold text-slate-800 uppercase tracking-tighter italic">
            Bảng điều khiển Thẩm định viên (Examiner)
          </h1>
          <div className="flex items-center space-x-6">
            <div className="relative cursor-pointer">
              <Bell className="text-slate-400 hover:text-blue-500" size={22} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                3
              </span>
            </div>
            <div className="flex items-center space-x-3 border-l pl-6 text-right">
              <div>
                <p className="text-sm font-bold">Trần Văn Thẩm Định</p>
                <p className="text-xs text-blue-500 font-medium italic">Examiner cấp cao</p>
              </div>
              <div className="w-10 h-10 bg-slate-200 rounded-xl overflow-hidden shadow-sm border border-slate-100">
                <img
                  src="https://ui-avatars.com/api/?name=Examiner&background=0D8ABC&color=fff"
                  alt="avatar"
                />
              </div>
            </div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-8 space-y-8 bg-gray-50/50">
          {/* STATS SUMMARY */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatBox label="Đơn mới nhận" value="18" icon={<FileText color="#3b82f6" />} trend="+12% tuần này" />
            <StatBox label="Chờ duyệt lại" value="05" icon={<RefreshCw color="#6366f1" />} trend="Cần xử lý gấp" highlight />
            <StatBox label="Quá hạn thẩm định" value="02" icon={<AlertCircle color="#ef4444" />} trend="Yêu cầu giải thích" />
            <StatBox label="Đã hoàn thành" value="142" icon={<CheckCircle color="#10b981" />} trend="Tỉ lệ: 94%" />
          </div>

          {/* BIỂU ĐỒ */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-base font-bold text-slate-800 mb-6 flex items-center italic">
                <FileText size={18} className="mr-2 text-blue-500" /> Thống kê số lượng đơn theo loại
              </h3>
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={EXAMINER_STATS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                    <Tooltip cursor={{ fill: "#f8fafc" }} contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={40}>
                      {EXAMINER_STATS.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
              <h3 className="text-base font-bold text-slate-800 mb-6 text-center italic text-blue-800 uppercase tracking-widest text-xs">
                Trạng thái xử lý
              </h3>
              <div style={{ width: "100%", height: 260 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={STATUS_DATA} innerRadius={60} outerRadius={85} paddingAngle={8} dataKey="value" stroke="none">
                      {STATUS_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* BẢNG DANH SÁCH DUYỆT ĐƠN */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-10">
            <div className="p-8 border-b flex justify-between items-center bg-gray-50/30">
              <h3 className="text-lg font-bold text-slate-800 uppercase tracking-tight italic">
                Danh sách đơn chờ xử lý mới nhất
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/80 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b">
                    <th className="px-8 py-5">Mã số đơn</th>
                    <th className="px-8 py-5">Tiêu đề giải pháp</th>
                    <th className="px-8 py-5">Loại đơn</th>
                    <th className="px-8 py-5">Người nộp</th>
                    <th className="px-8 py-5">Ngày nộp</th>
                    <th className="px-8 py-5 text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {MOCK_APPLICATIONS.map((app) => (
                    <tr key={app.id} className="hover:bg-blue-50/30 transition-all duration-150">
                      <td className="px-8 py-5 font-mono text-xs font-bold text-blue-600 underline cursor-pointer" onClick={() => handleGoToReview(app.type, app.id)}>
                        {app.id}
                      </td>
                      <td className="px-8 py-5 font-bold text-slate-700 text-sm">{app.title}</td>
                      <td className="px-8 py-5 text-xs text-slate-600 font-bold">{app.type}</td>
                      <td className="px-8 py-5 text-xs text-slate-600 font-medium">{app.owner}</td>
                      <td className="px-8 py-5 text-xs text-slate-500 font-medium">{app.date}</td>
                      <td className="px-8 py-5 text-center">
                        <button
                          onClick={() => handleGoToReview(app.type, app.id)}
                          className="bg-slate-900 text-white px-5 py-2 rounded-xl text-[10px] font-black hover:bg-blue-600 transition-all shadow-sm flex items-center justify-center mx-auto uppercase tracking-tighter"
                        >
                          <Eye size={14} className="mr-2" /> Duyệt hồ sơ
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

// Sub-component: Sidebar Item
const SidebarItem = ({ icon, label, active = false, isComingSoon = false, onClick }) => (
  <div
    onClick={onClick}
    className={`flex items-center space-x-4 p-4 rounded-2xl cursor-pointer transition-all duration-200
    ${active ? "bg-blue-600 text-white shadow-xl shadow-blue-900/20" : "text-slate-400 hover:bg-slate-800 hover:text-white"}
    ${isComingSoon ? "opacity-30 cursor-not-allowed pointer-events-none" : ""}`}
  >
    {icon}
    <span className="font-bold text-sm">{label}</span>
  </div>
);

// Sub-component: Thẻ thống kê
const StatBox = ({ label, value, icon, trend, highlight = false }) => (
  <div className={`p-6 rounded-3xl border transition-all hover:shadow-lg bg-white ${highlight ? "border-indigo-500 shadow-indigo-100 shadow-xl" : "border-slate-200 shadow-sm"}`}>
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">{icon}</div>
      <span className={`text-[9px] font-black px-2 py-1 rounded-lg ${highlight ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-500"}`}>{trend}</span>
    </div>
    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{label}</p>
    <h2 className="text-3xl font-black text-slate-900 mt-1">{value}</h2>
  </div>
);

export default ExaminerDashboard;