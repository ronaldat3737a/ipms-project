import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Check, ChevronLeft, Bell, ShieldCheck } from "lucide-react";

const AcceptConfirmation = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // ID này phải là UUID được truyền từ danh sách

  // --- TRẠNG THÁI DỮ LIỆU THẬT ---
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- FETCH CHI TIẾT ĐƠN ---
  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8080/api/patents/${id}`);
        if (!response.ok) throw new Error("Lỗi tải dữ liệu");
        const data = await response.json();
        setApp(data);
      } catch (error) {
        console.error("Lỗi lấy thông tin xác nhận:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetail();
  }, [id]);

  // --- HÀM XỬ LÝ CẬP NHẬT TRẠNG THÁI ---
  const handleConfirm = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/patents/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        // SỬA TẠI ĐÂY: Chuyển sang trạng thái Chờ nộp phí GD2 thay vì Thẩm định nội dung
        body: JSON.stringify({ 
          status: "CHO_NOP_PHI_GD2",
          note: "Hồ sơ đạt yêu cầu hình thức. Chờ người nộp đơn hoàn thành lệ phí giai đoạn 2."
        }), 
      });

      if (response.ok) {
        // Cập nhật lại thông báo cho đúng nghiệp vụ
        alert(`Hồ sơ ${app?.appNo} đã được xác nhận Hợp lệ hình thức và đang chờ nộp lệ phí GĐ2!`);
        navigate("/examiner/utility-solutions"); 
      } else {
        const errorData = await response.json();
        alert("Lỗi: " + (errorData.message || "Không thể cập nhật trạng thái"));
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
      alert("Lỗi kết nối! Vui lòng kiểm tra lại server Backend.");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#94a3b8] flex items-center justify-center font-sans text-white">
      Đang chuẩn bị dữ liệu xác nhận...
    </div>
  );

  if (!app) return (
    <div className="min-h-screen bg-[#94a3b8] flex items-center justify-center font-sans text-white text-center">
      Lỗi: Không tìm thấy hồ sơ tương ứng hoặc ID không đúng định dạng UUID.
    </div>
  );

  return (
    <div className="min-h-screen bg-[#94a3b8] flex flex-col font-sans text-slate-900">
      {/* --- HEADER --- */}
      <header className="h-16 bg-white px-8 flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center gap-6">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-md">
            <ShieldCheck size={24} />
          </div>
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#0D6EFD] font-bold text-sm hover:underline"
          >
            <ChevronLeft size={20} /> Quay lại
          </button>
        </div>
        <div className="flex items-center gap-6">
          <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
            <Bell size={22} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200">
            <img src="https://ui-avatars.com/api/?name=Examiner&background=0D8ABC&color=fff" alt="Avatar" />
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT (MODAL) --- */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-[720px] w-full bg-white rounded-[24px] shadow-2xl p-12 flex flex-col items-center animate-in fade-in zoom-in duration-300">
          {/* Icon Checkmark */}
          <div className="w-24 h-24 bg-[#EEF2FF] rounded-full flex items-center justify-center text-[#4F46E5] mb-8">
            <div className="w-16 h-16 rounded-full border-4 border-[#4F46E5] flex items-center justify-center">
              <Check size={40} strokeWidth={3} />
            </div>
          </div>

          <h1 className="text-[28px] font-black text-[#1E293B] uppercase tracking-tight mb-12 text-center">
            XÁC NHẬN HỢP LỆ HÌNH THỨC
          </h1>

          {/* Info List (Đã dọn sạch lỗi Hydration) */}
          <div className="w-full max-w-[420px] space-y-6 mb-12">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <span className="text-slate-500 font-medium">Mã số đơn</span>
              <span className="text-[#4F46E5] font-black text-right">{app.appNo || "CHƯA CẤP"}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <span className="text-slate-500 font-medium">Loại đơn</span>
              <span className="text-[#1E293B] font-bold text-right">{app.appType}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm items-start">
              <span className="text-slate-500 font-medium pt-1">Tên chủ đơn</span>
              <span className="text-[#1E293B] font-bold text-right leading-relaxed">
                {app.applicant?.fullName || "Chưa cập nhật"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <span className="text-slate-500 font-medium">Người thẩm định</span>
              <span className="text-[#1E293B] font-bold text-right">Cán bộ hệ thống</span>
            </div>
          </div>

          <p className="text-center text-slate-500 text-sm leading-relaxed max-w-[500px] mb-12">
            Hệ thống sẽ ghi nhận hồ sơ <b>{app.appNo}</b> đủ điều kiện hình thức và chuyển sang trạng thái 
            <b className="text-[#4F46E5]"> Chờ nộp lệ phí giai đoạn 2</b>. Thông báo yêu cầu thanh toán sẽ được gửi đến người nộp đơn.
          </p>

          <div className="flex gap-4 w-full justify-center">
            <button 
              onClick={() => navigate(-1)}
              className="px-10 py-3 border border-slate-300 rounded-lg font-bold text-sm text-slate-600 hover:bg-slate-50 transition-all"
            >
              Quay lại
            </button>
            <button 
              className="px-10 py-3 bg-[#4F46E5] text-white rounded-lg font-bold text-sm hover:bg-[#4338ca] transition-all shadow-lg shadow-indigo-100"
              onClick={handleConfirm}
            >
              Xác nhận & Yêu cầu đóng phí
            </button>
          </div>
        </div>
      </main>

      <footer className="h-16 flex items-center justify-center border-t border-slate-200/50 shrink-0">
        <p className="text-xs text-slate-500 font-medium tracking-tight">
          © 2025 IP Registration Management. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default AcceptConfirmation;