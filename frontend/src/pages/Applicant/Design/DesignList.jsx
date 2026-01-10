import React, { useState, useEffect } from "react";
import {
  Search, Bell, Plus, Eye, Edit3, CreditCard,
  ChevronLeft, ChevronRight, LayoutDashboard,
  FileText, Bookmark, PenTool, FileStack, LogOut,
  AlertCircle, XCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const DesignList = () => {
  const navigate = useNavigate();

  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const pageTitle = 'Kiểu dáng công nghiệp';

  const [statusFilter, setStatusFilter] = useState("Tất cả");

  const getStatusUI = (status) => {
    switch (status) {
      case "DANG_TD_HINH_THUC":
        return { label: "Đang TĐ Hình thức", color: "bg-blue-50 text-blue-600 border-blue-100" };
      case "CHO_NOP_PHI_GD2":
        return { label: "Chờ nộp lệ phí GĐ 2", color: "bg-purple-50 text-purple-600 border-purple-100", fee: true };
      case "DANG_TD_NOI_DUNG":
        return { label: "Đang TĐ Nội dung", color: "bg-indigo-50 text-indigo-600 border-indigo-100" };
      case "CHO_NOP_PHI_GD3":
        return { label: "Chờ nộp lệ phí GĐ 3", color: "bg-pink-50 text-pink-600 border-pink-100", fee: true };
      case "CHO_SUA_DOI_HINH_THUC":
        return { label: "Sửa đổi hình thức", color: "bg-orange-50 text-orange-600 border-orange-100", warning: true };
      case "CHO_SUA_DOI_NOI_DUNG":
        return { label: "Sửa đổi nội dung", color: "bg-amber-50 text-amber-600 border-amber-100", warning: true };
      case "TU_CHOI_DON":
        return { label: "Từ chối", color: "bg-red-50 text-red-600 border-red-100" };
      case "DA_CAP_VAN_BANG":
        return { label: "Đã cấp văn bằng", color: "bg-green-50 text-green-600 border-green-100" };
      default:
        return { label: "Đang xử lý", color: "bg-gray-50 text-gray-500 border-gray-100" };
    }
  };

  useEffect(() => {
    document.title = `Danh sách ${pageTitle}`;
    const fetchDesigns = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8080/api/industrial-designs/all`);
        if (!response.ok) throw new Error(`Lỗi Server: ${response.status}`);
        const data = await response.json();
        if (Array.isArray(data)) {
          // Filter for KDCN just in case API returns others
          setDesigns(data.filter(item => item.appType === 'KIEU_DANG_CN'));
        } else {
          setDesigns([]);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Không thể kết nối đến máy chủ.");
      } finally {
        setLoading(false);
      }
    };
    fetchDesigns();
  }, []);


  const filteredDesigns = designs.filter((item) => {
    const ui = getStatusUI(item.status);
    const matchStatus = statusFilter === "Tất cả" || ui.label === statusFilter;
    return matchStatus;
  });

  if (loading) return <div className="flex h-screen items-center justify-center">Đang tải dữ liệu...</div>;

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
             <div className="w-3 h-3 border-2 border-white rotate-45"></div>
          </div>
          <span className="text-xl font-bold text-blue-600">IP Hub</span>
        </div>
        <nav className="flex-grow px-4 space-y-2">
          <NavItem onClick={() => navigate("/applicant-dashboard")} icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <NavItem onClick={() => navigate("/applicant/applications/sang-che")} icon={<FileText size={20} />} label="Sáng chế" />
          <NavItem onClick={() => navigate("/applicant/applications/giai-phap-huu-ich")} icon={<FileText size={20} />} label="Giải pháp hữu ích" />
          <NavItem icon={<Bookmark size={20} />} label="Nhãn hiệu" />
          <NavItem onClick={() => navigate('/applicant/applications/KIEU_DANG_CN')} icon={<PenTool size={20} />} label="Kiểu dáng CN" active={true} />
          <NavItem icon={<FileStack size={20} />} label="Hồ sơ của tôi" />
        </nav>
        <div className="p-4 border-t border-gray-100">
          <button onClick={() => navigate("/")}
          className="flex items-center gap-3 text-gray-500 hover:text-red-500 w-full px-4 py-3 transition">
            <LogOut size={20} />
            <span className="font-bold text-sm">Đăng xuất</span>
          </button>
        </div>
      </aside>

      <main className="flex-grow flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 text-sm">
          <div className="flex items-center gap-4 font-medium text-gray-500">
            <span>{pageTitle}</span>
            <button
              onClick={() => navigate(`/applicant/design/filing/step1`)}
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
                <p className="text-xs text-gray-400 font-medium">an.tran@example.com</p>
              </div>
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" className="w-9 h-9 rounded-full border" />
            </div>
          </div>
        </header>

        <div className="p-8 space-y-6 overflow-y-auto">
          <h1 className="text-2xl font-bold text-gray-800">Đơn {pageTitle} của tôi</h1>

          <div className="space-y-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-start gap-4">
              <span className="text-sm font-bold text-gray-400 w-24 uppercase mt-2 tracking-tighter">Trạng thái:</span>
              <div className="flex flex-wrap gap-2 flex-1">
                {["Tất cả", "Đang TĐ Hình thức", "Sửa đổi hình thức","Chờ nộp lệ phí GĐ 2", "Đang TĐ Nội dung", "Sửa đổi nội dung", "Chờ nộp lệ phí GĐ 3", "Từ chối", "Đã cấp văn bằng"].map(s => (
                  <FilterButton key={s} label={s} active={statusFilter === s} onClick={() => setStatusFilter(s)} />
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            {error ? (
              <div className="p-10 text-center text-red-500 flex flex-col items-center gap-2">
                <AlertCircle size={40} />
                <p>{error}</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="px-6 py-4">Mã đơn</th>
                    <th className="px-6 py-4">Tên đơn</th>
                    <th className="px-6 py-4">Ngày nộp</th>
                    <th className="px-6 py-4">Trạng thái</th>
                    <th className="px-6 py-4 text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredDesigns.length > 0 ? filteredDesigns.map((item) => {
                    const ui = getStatusUI(item.status);
                    return (
                      <React.Fragment key={item.id}>
                        <tr className={`hover:bg-gray-50 transition group ${ui.rejected ? 'bg-red-50/20' : ''}`}>
                          <td
                            className="px-6 py-4 text-sm font-bold text-blue-500 cursor-pointer hover:underline"
                            onClick={() => navigate(`/applicant/applications/KIEU_DANG_CN/view/${item.id}`)}
                          >
                            {item.appNo || "ĐANG CẤP"}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-700 max-w-xs truncate">
                            {item.title || "Chưa có tên"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                            {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1 w-fit ${ui.color}`}>
                              {ui.warning && <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></span>}
                              {ui.label}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-3 text-gray-400">
                              <Eye size={16} className="cursor-pointer hover:text-blue-500" onClick={() => navigate(`/applicant/applications/KIEU_DANG_CN/view/${item.id}`)} />
                              {ui.fee && <CreditCard size={16} className="cursor-pointer hover:text-blue-600" />}
                            </div>
                          </td>
                        </tr>
                      </React.Fragment>
                    );
                  }) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-10 text-center text-gray-400 italic font-medium">Không có dữ liệu phù hợp</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active = false, onClick }) => (
  <div onClick={onClick} className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${active ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:bg-gray-50"}`}>
    {icon}
    <span className="font-bold text-sm">{label}</span>
  </div>
);

const FilterButton = ({ label, active = false, onClick }) => (
  <button onClick={onClick} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all border ${active ? "bg-blue-500 text-white border-blue-500 shadow-sm" : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"}`}>
    {label}
  </button>
);

export default DesignList;