import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  X, CheckCircle2, ChevronLeft, Coins, CreditCard,
  Info, Loader2, AlertCircle, FileText, Award
} from "lucide-react";

const Phase3Payment = () => {
  const navigate = useNavigate();
  const { id, type } = useParams();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchApp = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/patents/${id}`);
        const data = await res.json();
        setApp(data);
      } catch (err) {
        console.error("Lỗi tải đơn:", err);
      } finally {
        setFetching(false);
      }
    };
    fetchApp();
  }, [id]);

  // --- LOGIC TÍNH PHÍ GIAI ĐOẠN 3 ---
  const FEE_GRANT = 600000; // Phí cấp văn bằng
  const FEE_PUBLICATION = 120000; // Phí công bố quyết định
  const FEE_MAINTENANCE_FIRST_YEAR = 400000; // Phí duy trì năm đầu tiên

  const totalAmount = FEE_GRANT + FEE_PUBLICATION + FEE_MAINTENANCE_FIRST_YEAR;
  const formatVND = (amount) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

  // --- XỬ LÝ THANH TOÁN VNPAY ---
  const handlePayment = async () => {
    setLoading(true);
    const API_BASE_URL = "http://localhost:8080";
    const stage = 3;

    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/payment-stage3/create-payment/${app.appNo}/${stage}`, {
          params: { amount: totalAmount },
          headers: { "ngrok-skip-browser-warning": "69420" }
        }
      );

      if (response.data?.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      alert("Lỗi kết nối thanh toán: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-20 text-center font-sans">Đang truy xuất dữ liệu hồ sơ...</div>;

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <header className="h-16 border-b flex items-center justify-between px-8 bg-white sticky top-0 z-10">
        <button onClick={() => navigate(`/applicant/applications/${type}/view/${id}`)} className="flex items-center gap-2 text-gray-500 hover:text-blue-600 font-medium">
          <ChevronLeft size={18} /> Quay lại chi tiết đơn
        </button>
        <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Hồ sơ:</span>
            <span className="text-sm font-black text-blue-600">{app?.appNo}</span>
        </div>
      </header>

      <main className="flex-grow p-12 bg-gray-50/30">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
                <Award size={24} />
            </div>
            <div>
                <h1 className="text-3xl font-black text-gray-800">Lệ phí Giai đoạn 3</h1>
                <p className="text-gray-500 text-sm font-medium">Cấp văn bằng, Đăng bạ và Duy trì hiệu lực</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <section className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
                <div className="flex items-center gap-2 border-b pb-4">
                    <Info size={16} className="text-blue-500" />
                    <h3 className="font-bold uppercase text-xs tracking-wider text-gray-600">Chi tiết bảng kê lệ phí</h3>
                </div>

                <div className="space-y-1">
                  <FeeRow 
                    label="1. Phí cấp văn bằng bảo hộ" 
                    price={formatVND(FEE_GRANT)} 
                    note="Lệ phí cố định"
                  />
                  <FeeRow 
                    label="2. Phí công bố quyết định cấp văn bằng" 
                    price={formatVND(FEE_PUBLICATION)} 
                    note="Lệ phí cố định"
                  />
                  <FeeRow 
                    label="3. Phí duy trì hiệu lực cho năm đầu tiên" 
                    price={formatVND(FEE_MAINTENANCE_FIRST_YEAR)} 
                    note="Tính từ ngày cấp văn bằng"
                  />
                  
                  <div className="pt-8 mt-6 border-t-2 border-dashed border-gray-100 flex justify-between items-center">
                    <div>
                        <span className="text-sm font-bold text-gray-400 uppercase block">Tổng cộng thanh toán</span>
                        <span className="text-xs text-blue-500 font-medium italic">* Đã bao gồm thuế và phí cổng thanh toán</span>
                    </div>
                    <span className="text-4xl font-black text-emerald-600 tracking-tighter">
                        {formatVND(totalAmount)}
                    </span>
                  </div>
                </div>
              </section>
            </div>

            <div className="space-y-6">
              <div className="p-8 bg-white rounded-[32px] border-2 border-emerald-100 shadow-md space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 bg-emerald-50 text-emerald-600 rounded-bl-2xl">
                    <CreditCard size={20} />
                </div>
                
                <h3 className="font-bold text-gray-800">VNPay Gateway</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Hệ thống sẽ chuyển hướng bạn đến cổng thanh toán bảo mật VNPay. Vui lòng không đóng trình duyệt cho đến khi nhận được thông báo thành công.
                </p>

                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black flex items-center justify-center gap-3 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" /> : "XÁC NHẬN THANH TOÁN"}
                </button>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const FeeRow = ({ label, price, note }) => (
  <div className="flex justify-between items-start py-5 border-b border-gray-50 last:border-0">
    <div className="space-y-1">
      <p className="text-sm font-bold text-gray-700">{label}</p>
      {note && <p className="text-[10px] text-gray-400 font-medium italic">{note}</p>}
    </div>
    <span className="text-sm font-black text-gray-800">{price}</span>
  </div>
);

export default Phase3Payment;
