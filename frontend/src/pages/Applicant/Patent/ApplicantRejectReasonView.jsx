import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, AlertCircle, Clock, FileText, ShieldAlert } from "lucide-react";

const ApplicantRejectReasonView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rejectData, setRejectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  const fetchReason = async () => {
    try {
      // Thử gọi API lấy từ bảng History (nếu bạn đã viết endpoint này)
      const res = await fetch(`http://localhost:8080/api/patents/${id}/rejection-detail`);
      const data = await res.json();
      
      if (data && (data.reason || data.content)) {
        setRejectData({
          reason: data.reason || data.content,
          date: data.date || data.createdAt
        });
      } else {
        // Nếu API trên không có, quay lại lấy từ API Patent tổng quát
        const res2 = await fetch(`http://localhost:8080/api/patents/${id}`);
        const data2 = await res2.json();
        setRejectData({
          reason: data2.rejectionReason || "Nội dung đang được phê duyệt cuối cùng...",
          date: data2.updatedAt
        });
      }
    } catch (err) {
      setError("Không thể trích xuất lý do từ chối.");
    } finally {
      setLoading(false);
    }
  };
  fetchReason();
}, [id]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#F8F9FA] text-gray-500 italic">
      Đang tải lý do từ chối hồ sơ {id}...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-6 font-sans">
      <div className="max-w-2xl mx-auto mt-10">
        {/* Nút quay lại */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-blue-600 mb-6 transition-all"
        >
          <ChevronLeft size={18} /> QUAY LẠI CHI TIẾT
        </button>

        <div className="bg-white rounded-2xl shadow-xl border border-red-100 overflow-hidden">
          {/* Header */}
          <div className="bg-red-600 px-6 py-5 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <ShieldAlert size={28} />
              <div>
                <h1 className="font-black text-lg uppercase leading-tight">Lý do từ chối</h1>
                <p className="text-[10px] opacity-80 font-bold uppercase tracking-widest">Mã đơn: {rejectData?.appNo}</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {error ? (
              <div className="text-center py-10 bg-red-50 rounded-xl border border-red-100 text-red-600 font-medium">
                <AlertCircle size={32} className="mx-auto mb-2 opacity-50" />
                {error}
              </div>
            ) : (
              <div className="space-y-8">
                {/* Thời gian */}
                <div className="flex items-center gap-4 border-b border-gray-50 pb-6">
                  <div className="p-3 bg-gray-50 rounded-xl text-gray-400">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ngày cập nhật trạng thái</p>
                    <p className="text-sm font-bold text-slate-700">
                      {new Date(rejectData?.date).toLocaleString('vi-VN')}
                    </p>
                  </div>
                </div>

                {/* Nội dung */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-red-600">
                    <FileText size={18} />
                    <h2 className="text-xs font-black uppercase tracking-tighter">Nội dung thông báo từ cục:</h2>
                  </div>
                  <div className="bg-red-50/50 border border-red-100 rounded-2xl p-6 shadow-inner">
                    <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-line italic font-medium">
                      "{rejectData?.reason}"
                    </p>
                  </div>
                </div>

                {/* Ghi chú chân trang */}
                <div className="mt-8 pt-6 border-t border-gray-100 flex items-start gap-3 text-amber-600 bg-amber-50 p-4 rounded-xl border border-amber-100">
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed">
                    Theo quy định, bạn có quyền khiếu nại hoặc nộp lại hồ sơ sửa đổi trong vòng 90 ngày kể từ ngày nhận được thông báo này.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantRejectReasonView;