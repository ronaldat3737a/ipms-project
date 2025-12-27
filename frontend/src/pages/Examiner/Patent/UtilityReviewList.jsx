import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, UserCheck, FileText, Lightbulb, Package, 
  CreditCard, Settings, Bell, Search, Filter, LogOut, ShieldCheck 
} from "lucide-react";

const UtilityReviewList = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("hinh-thuc");

  const MOCK_DATA = [
    { id: "2-2025-00012", times: 1, status: "Đã sửa - Chờ duyệt lại", date: "2025-01-24", owner: "Công ty ABC" },
    { id: "2-2025-00015", times: 1, status: "Chờ phí nội dung", date: "2025-02-05", owner: "Lê Văn L" },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans text-slate-900">
      <aside className="w-72 bg-slate-900 text-white flex flex-col shadow-2xl shrink-0">
        <div className="p-8 border-b border-slate-800">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center"><UserCheck size={20} className="text-white" /></div>
            <span className="text-xl font-black tracking-tight uppercase">IPMS <span className="text-blue-400">Examiner</span></span>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          <SidebarItem icon={<LayoutDashboard size={20} />} label="Dashboard" onClick={() => navigate("/examiner-dashboard")} />
          <SidebarItem icon={<FileText size={18} />} label="TĐ Sáng chế" onClick={() => navigate("/examiner/patents")} />
          <SidebarItem icon={<Lightbulb size={18} />} label="TĐ Giải pháp hữu ích" active />
          <SidebarItem icon={<Package size={18} />} label="TĐ Kiểu dáng công nghiệp" />
          <SidebarItem icon={<ShieldCheck size={18}/>} label="TĐ Nhãn hiệu" />
          <div className="mt-8 mb-2 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-left">
            Hệ thống
          </div>
          <SidebarItem icon={<CreditCard size={18} />} label="Theo dõi Lệ phí" />
          <SidebarItem icon={<Settings size={18} />} label="Cấu hình Quy trình" />
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={() => navigate("/")} className="flex items-center gap-3 text-slate-400 hover:text-red-400 w-full px-4 py-3 transition"><LogOut size={20} /> <span className="font-medium">Đăng xuất</span></button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white border-b flex items-center justify-between px-10 shadow-sm z-10 shrink-0">
          <h1 className="text-xl font-bold text-blue-800 uppercase tracking-tighter">Đơn đăng kí giải pháp hữu ích</h1>
          <div className="flex items-center space-x-6"><Bell className="text-slate-400" size={22} /><img src="https://ui-avatars.com/api/?name=Examiner&background=0D8ABC&color=fff" className="w-10 h-10 rounded-xl" alt="avatar" /></div>
        </header>

        <section className="flex-1 overflow-y-auto p-8 space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-800">Danh sách đơn Giải pháp hữu ích</h2>
            <p className="text-sm text-slate-500 font-medium">Quản lý các giải pháp hữu ích theo trạng thái thẩm định.</p>
          </div>

          <div className="flex bg-gray-200/50 p-1 rounded-lg w-full">
            <TabItem label="Thẩm định Hình thức" active={activeTab === "hinh-thuc"} onClick={() => setActiveTab("hinh-thuc")} />
            <TabItem label="Chờ phí Nội dung" active={activeTab === "phi-nd"} onClick={() => setActiveTab("phi-nd")} />
            <TabItem label="Thẩm định Nội dung" active={activeTab === "noi-dung"} onClick={() => setActiveTab("noi-dung")} />
            <TabItem label="Cấp văn bằng" active={activeTab === "cap-bang"} onClick={() => setActiveTab("cap-bang")} />
          </div>

          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="Tìm kiếm mã đơn, tên người nộp..." className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20" />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg font-bold text-sm text-slate-700 hover:bg-gray-50"><Filter size={18} /> Lọc</button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b">
              <h3 className="font-bold text-slate-800">Danh sách đơn GPHU</h3>
              <p className="text-xs text-slate-500 mt-1">Tổng cộng {MOCK_DATA.length} đơn đang chờ duyệt</p>
            </div>
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-[11px] font-black text-slate-500 uppercase tracking-widest border-b">
                <tr><th className="px-8 py-5">Mã số đơn</th><th className="px-8 py-5">Lần thẩm định</th><th className="px-8 py-5">Trạng thái chi tiết</th><th className="px-8 py-5">Ngày nộp đơn</th><th className="px-8 py-5">Tên người nộp đơn</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_DATA.map((item) => (
                  <tr key={item.id} className="hover:bg-blue-50/30 transition-all cursor-pointer" onClick={() => navigate(`/examiner/review/giai-phap-huu-ich/${item.id}`)}>
                    <td className="px-8 py-5 font-bold text-blue-600 underline text-sm">{item.id}</td>
                    <td className="px-8 py-5 text-sm font-medium">{item.times}</td>
                    <td className="px-8 py-5 text-sm font-black text-slate-700">{item.status}</td>
                    <td className="px-8 py-5 text-sm text-slate-500 font-medium">{item.date}</td>
                    <td className="px-8 py-5 text-sm text-slate-700 font-medium">{item.owner}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

const TabItem = ({ label, active, onClick }) => (
  <button onClick={onClick} className={`flex-1 py-3 text-xs font-bold rounded-md transition-all ${active ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>{label}</button>
);

const SidebarItem = ({ icon, label, active = false, onClick }) => (
  <div onClick={onClick} className={`flex items-center space-x-4 p-4 rounded-2xl cursor-pointer transition-all ${active ? "bg-blue-600 text-white shadow-xl shadow-blue-900/20" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}>{icon} <span className="font-bold text-sm">{label}</span></div>
);

export default UtilityReviewList;