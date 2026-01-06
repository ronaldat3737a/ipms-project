import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, UserCheck, FileText, Lightbulb, Package, 
  CreditCard, Settings, Bell, Search, Filter, LogOut, ShieldCheck 
} from "lucide-react";

const PatentReviewList = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("hinh-thuc");
  
  // --- LOGIC KẾT NỐI BACKEND ---
  const [patents, setPatents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPatents = async () => {
      setLoading(true);
      try {
        // Gọi đến API Spring Boot của bạn
        const response = await fetch("http://localhost:8080/api/patents/all");
        const data = await response.json();
        setPatents(data);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu từ Postgres:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPatents();
  }, []);

  // --- LOGIC LỌC DỮ LIỆU (Khớp với AppStatus.MOI trong Java) ---
  const filteredData = Array.isArray(patents) ? patents.filter(item => {
  // 1. Chuyển status về String để so sánh (đề phòng kiểu dữ liệu từ DB)
  const status = item.status || "";

  const matchesTab = () => {
    switch (activeTab) {
      case "hinh-thuc":
        return ["MOI", "DANG_TD_HINH_THUC"].includes(status);
      case "cho-nop-phi":
        return ["CHO_NOP_PHI_GD1", "CHO_NOP_PHI_GD2", "CHO_NOP_PHI_GD3"].includes(status);
      case "sua-doi-hinh-thuc":
        return status === "CHO_SUA_DOI_HINH_THUC";
      case "noi-dung":
        return ["DANG_TD_NOI_DUNG"].includes(status);
      case "sua-doi-noi-dung":
        return status === "CHO_SUA_DOI_NOI_DUNG";
      case "da-tu-choi":
        return status === "TU_CHOI_DON";
      case "cap-bang":
        return status === "DA_CAP_VAN_BANG";
      default:
        return true;
    }
  };

  // 2. Logic tìm kiếm (Phải dùng đúng tên trường appNo và fullName từ applicant)
  const searchLower = searchTerm.toLowerCase();
  const matchesSearch = 
    (item.appNo || "").toLowerCase().includes(searchLower) || 
    (item.applicant?.fullName || "").toLowerCase().includes(searchLower);

  return matchesTab() && matchesSearch;
}) : [];

  const handleRowClick = (item) => {
    const substantiveReviewStatuses = ["DANG_TD_NOI_DUNG", "CHO_SUA_DOI_NOI_DUNG"];
    if (substantiveReviewStatuses.includes(item.status)) {
      navigate(`/examiner/substantive-review/sang-che/${item.id}`);
    } else {
      navigate(`/examiner/review/sang-che/${item.id}`);
    }
  };

  const renderStatusBadge = (status) => {
    let colorClass = "bg-blue-100 text-blue-600";
    let statusText = status;

    if (status.startsWith("CHO_NOP_PHI")) {
      colorClass = "bg-sky-100 text-sky-600";
      statusText = "Chờ nộp phí";
    } else if (status.startsWith("CHO_SUA_DOI")) {
      colorClass = "bg-amber-100 text-amber-600";
    } else if (status === "TU_CHOI_DON") {
      colorClass = "bg-red-100 text-red-600";
    } else if (["MOI", "DANG_TD_HINH_THUC", "DANG_TD_NOI_DUNG"].includes(status)) {
      colorClass = "bg-orange-100 text-orange-600";
    }

    return (
      <span className={`px-3 py-1 rounded-full text-[10px] font-black ${colorClass}`}>
        {statusText}
      </span>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans text-slate-900">
      {/* --- SIDEBAR: GIỮ NGUYÊN 100% --- */}
      <aside className="w-72 bg-slate-900 text-white flex flex-col shadow-2xl shrink-0">
        <div className="p-8 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <UserCheck size={20} className="text-white" />
            </div>
            <span className="text-xl font-black tracking-tight uppercase">IPMS <span className="text-blue-400">Examiner</span></span>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          <SidebarItem icon={<LayoutDashboard size={20} />} label="Dashboard" onClick={() => navigate("/examiner-dashboard")} />
          <SidebarItem icon={<FileText size={18} />} label="TĐ Sáng chế" active />
          <SidebarItem icon={<Lightbulb size={18} />} label="TĐ Giải pháp hữu ích" onClick={() => navigate("/examiner/utility-solutions")} />
          <SidebarItem icon={<Package size={18} />} label="TĐ Kiểu dáng công nghiệp" />
          <SidebarItem icon={<ShieldCheck size={18}/>} label="TĐ Nhãn hiệu" />
          <div className="mt-8 mb-2 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-left">Hệ thống</div>
          <SidebarItem icon={<CreditCard size={18} />} label="Theo dõi Lệ phí" />
          <SidebarItem icon={<Settings size={18} />} label="Cấu hình Quy trình" />
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={() => navigate("/")} className="flex items-center gap-3 text-slate-400 hover:text-red-400 w-full px-4 py-3 transition">
            <LogOut size={20} /> <span className="font-medium">Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT: GIỮ NGUYÊN 100% --- */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white border-b flex items-center justify-between px-10 shadow-sm z-10 shrink-0">
          <h1 className="text-xl font-bold text-blue-800 uppercase tracking-tighter">Đơn đăng kí sáng chế</h1>
          <div className="flex items-center space-x-6">
            <Bell className="text-slate-400" size={22} />
            <img src="https://ui-avatars.com/api/?name=Examiner&background=0D8ABC&color=fff" className="w-10 h-10 rounded-xl" alt="avatar" />
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-8 space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-800">Danh sách đơn đăng ký Sáng chế</h2>
            <p className="text-sm text-slate-500 font-medium">Quản lý các đơn đăng ký sáng chế từ PostgreSQL.</p>
          </div>

          {/* TAB BAR */}
          <div className="flex bg-gray-200/50 p-1 rounded-lg w-full">
            <TabItem label="Thẩm định Hình thức" active={activeTab === "hinh-thuc"} onClick={() => setActiveTab("hinh-thuc")} />
            <TabItem label="Chờ nộp phí" active={activeTab === "cho-nop-phi"} onClick={() => setActiveTab("cho-nop-phi")} />
            <TabItem label="Sửa đổi Hình thức" active={activeTab === "sua-doi-hinh-thuc"} onClick={() => setActiveTab("sua-doi-hinh-thuc")} />
            <TabItem label="Thẩm định Nội dung" active={activeTab === "noi-dung"} onClick={() => setActiveTab("noi-dung")} />
            <TabItem label="Sửa đổi Nội dung" active={activeTab === "sua-doi-noi-dung"} onClick={() => setActiveTab("sua-doi-noi-dung")} />
            <TabItem label="Đã từ chối" active={activeTab === "da-tu-choi"} onClick={() => setActiveTab("da-tu-choi")} />
            <TabItem label="Cấp văn bằng" active={activeTab === "cap-bang"} onClick={() => setActiveTab("cap-bang")} />
          </div>

          {/* SEARCH & FILTER */}
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Tìm kiếm mã đơn hoặc người nộp..." 
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg font-bold text-sm text-slate-700 hover:bg-gray-50">
              <Filter size={18} /> Lọc
            </button>
          </div>

          {/* TABLE - HIỂN THỊ DỮ LIỆU THẬT */}
<div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
  <div className="p-6 border-b flex justify-between items-center">
    <div>
      <h3 className="font-bold text-slate-800">Danh sách đơn</h3>
      <p className="text-xs text-slate-500 font-medium mt-1">
        {loading ? "Đang truy vấn database..." : `Tổng cộng ${filteredData.length} đơn đăng ký`}
      </p>
    </div>
  </div>
  
  <table className="w-full text-left">
    <thead className="bg-gray-50 text-[11px] font-black text-slate-500 uppercase tracking-widest border-b">
      <tr>
        <th className="px-8 py-5">Mã số đơn</th>
        <th className="px-8 py-5">Trạng thái</th>
        <th className="px-8 py-5">Ngày nộp đơn</th>
        <th className="px-8 py-5">Người nộp đơn</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-slate-100">
      {filteredData.length > 0 ? (
        filteredData.map((item) => (
          <tr key={item.id} className="hover:bg-blue-50/30 transition-all">
            <td 
              className="px-8 py-5 font-bold text-blue-600 underline text-sm cursor-pointer hover:text-blue-800"
              onClick={() => handleRowClick(item)}
            >
              {item.appNo || "Đang cấp mã..."}
            </td>
            <td className="px-8 py-5 text-sm font-black">
              {renderStatusBadge(item.status)}
            </td>
            <td className="px-8 py-5 text-sm text-slate-500 font-medium">
              {item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : "N/A"}
            </td>
            <td className="px-8 py-5 text-sm text-slate-700 font-medium">
              {item.applicant?.fullName || "Chưa cập nhật"}
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="4" className="px-8 py-10 text-center text-slate-400 italic text-sm">
            {loading ? "Vui lòng đợi hệ thống kết nối..." : "Không tìm thấy hồ sơ nào trong mục này."}
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>
        </section>
      </main>
    </div>
  );
};

// Sub-components giữ nguyên
const TabItem = ({ label, active, onClick }) => (
  <button onClick={onClick} className={`flex-1 py-3 text-xs font-bold rounded-md transition-all ${active ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
    {label}
  </button>
);

const SidebarItem = ({ icon, label, active = false, onClick }) => (
  <div onClick={onClick} className={`flex items-center space-x-4 p-4 rounded-2xl cursor-pointer transition-all ${active ? "bg-blue-600 text-white shadow-xl shadow-blue-900/20" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}>
    {icon} <span className="font-bold text-sm">{label}</span>
  </div>
);

export default PatentReviewList;