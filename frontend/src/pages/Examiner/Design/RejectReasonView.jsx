import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, AlertCircle, Clock, FileText, ShieldAlert } from "lucide-react";

const RejectReasonView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rejectData, setRejectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReason = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8080/api/patents/${id}/rejection-detail`);
        if (response.ok) {
          const data = await response.json();
          setRejectData(data);
        } else {
          setError("Không tìm thấy thông tin lý do từ chối.");
        }
      } catch (err) {
        setError("Lỗi kết nối đến hệ thống.");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchReason();
  }, [id]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center italic text-gray-500">
      Đang trích xuất dữ liệu từ nhật ký thẩm định...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-6 font-sans text-[#333]">
      <div className="max-w-2xl mx-auto mt-10">
        {/* Nút quay lại */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 mb-4 transition-all"
        >
          <ChevronLeft size={18} /> Quay lại chi tiết hồ sơ
        </button>

        <div className="bg-white rounded-xl shadow-lg border border-red-100 overflow-hidden">
          {/* Header Trang */}
          <div className="bg-red-600 px-6 py-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <ShieldAlert size={24} />
              <h1 className="font-bold text-lg tracking-tight">LÝ DO TỪ CHỐI ĐƠN</h1>
            </div>
          </div>

          <div className="p-8">
            {error ? (
              <div className="text-center py-10 text-gray-400 italic">
                {error}
              </div>
            ) : (
              <div className="space-y-6">
                {/* Thông tin thời gian */}
                <div className="flex items-center gap-4 border-b border-gray-50 pb-4">
                  <div className="p-3 bg-gray-50 rounded-full">
                    <Clock className="text-gray-400" size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Thời gian quyết định</p>
                    <p className="text-sm font-semibold">
                      {rejectData?.date ? new Date(rejectData.date).toLocaleString('vi-VN') : "N/A"}
                    </p>
                  </div>
                </div>

                {/* Nội dung lý do */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-red-600">
                    <FileText size={18} />
                    <h2 className="text-sm font-bold uppercase">Nội dung ghi chú thẩm định:</h2>
                  </div>
                  <div className="bg-red-50/50 border border-red-100 rounded-xl p-6 shadow-inner">
                    <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-line italic">
                      "{rejectData?.reason || "Không có nội dung chi tiết được ghi lại."}"
                    </p>
                  </div>
                </div>

                {/* Chân trang ghi chú */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <div className="flex items-start gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg">
                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                    <p className="text-[11px] leading-4">
                      Dữ liệu này được trích xuất từ bảng <b>Review History</b>. Mọi thay đổi đối với trạng thái hồ sơ đều được lưu vết để phục vụ công tác tra cứu và khiếu nại.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RejectReasonView;