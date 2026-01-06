import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  X, CheckCircle2, ChevronLeft, Coins, CreditCard,
  Info, Loader2, AlertCircle, FileText
} from "lucide-react";

const Phase2Payment = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  // --- 1. FETCH DỮ LIỆU HỒ SƠ TỪ DB ---
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

  // --- 2. LOGIC TÍNH PHÍ GIAI ĐOẠN 2 THEO QUY ĐỊNH MỚI ---
  const FEE_PUBLICATION = 120000; // Phí công bố đơn
  const FEE_SUBSTANTIVE_EXAM_PER_CLAIM = 720000; // Phí TĐND mỗi điểm độc lập
  const FEE_EXCESS_PAGE = 32000; // Phí từ trang thứ 7 trở đi

  // Lấy dữ liệu từ Database (app object)
  const numIndependentClaims = app?.claims?.filter(c => 
    c.type === "DOK_LAP" || 
    c.claimType === "DOK_LAP" || 
    c.type === "Độc lập" ||
    c.claimType === "Độc lập"
  ).length || 0;
  const totalPages = parseInt(app?.totalPages) || 0; // Đảm bảo trường totalPages có trong Entity Application

  // Tính toán chi tiết
  const publicationFee = FEE_PUBLICATION;
  const substantiveExamFee = numIndependentClaims * FEE_SUBSTANTIVE_EXAM_PER_CLAIM;
  const excessPageFee = totalPages > 6 ? (totalPages - 6) * FEE_EXCESS_PAGE : 0;
  
  const totalAmount = publicationFee + substantiveExamFee + excessPageFee;

  const formatVND = (amount) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

  // --- 3. XỬ LÝ THANH TOÁN VNPAY ---
  const handlePayment = async () => {
    setLoading(true);
    const API_BASE_URL = "http://localhost:8080";
    const stage = 2;

    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/payment/create-payment/${app.appNo}/${stage}`, {
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
        <button onClick={() => navigate(`/applicant/patent/view/${id}`)} className="flex items-center gap-2 text-gray-500 hover:text-blue-600 font-medium">
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
            <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
                <Coins size={24} />
            </div>
            <div>
                <h1 className="text-3xl font-black text-gray-800">Lệ phí Giai đoạn 2</h1>
                <p className="text-gray-500 text-sm font-medium">Công bố đơn & Thẩm định nội dung</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              
              {/* Thống kê dữ liệu tính phí */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 bg-white rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><CheckCircle2 size={20}/></div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Điểm độc lập</p>
                        <p className="text-xl font-black text-gray-800">{numIndependentClaims} Điểm</p>
                    </div>
                </div>
                <div className="p-5 bg-white rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center"><FileText size={20}/></div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Tổng số trang</p>
                        <p className="text-xl font-black text-gray-800">{totalPages} Trang</p>
                    </div>
                </div>
              </div>

              {/* Bảng kê chi tiết phí */}
              <section className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
                <div className="flex items-center gap-2 border-b pb-4">
                    <Info size={16} className="text-blue-500" />
                    <h3 className="font-bold uppercase text-xs tracking-wider text-gray-600">Chi tiết bảng kê lệ phí</h3>
                </div>

                <div className="space-y-1">
                  <FeeRow 
                    label="1. Phí công bố đơn" 
                    price={formatVND(publicationFee)} 
                    note="Lệ phí cố định"
                  />
                  <FeeRow 
                    label="2. Phí thẩm định nội dung" 
                    price={formatVND(substantiveExamFee)} 
                    note={`720.000đ x ${numIndependentClaims} điểm độc lập`}
                  />
                  <FeeRow 
                    label="3. Phí trang bản mô tả bổ sung" 
                    price={formatVND(excessPageFee)} 
                    note={totalPages > 6 ? `32.000đ x ${totalPages - 6} trang (từ trang thứ 7)` : "Dưới 7 trang (Miễn phí)"} 
                  />
                  
                  <div className="pt-8 mt-6 border-t-2 border-dashed border-gray-100 flex justify-between items-center">
                    <div>
                        <span className="text-sm font-bold text-gray-400 uppercase block">Tổng cộng thanh toán</span>
                        <span className="text-xs text-blue-500 font-medium italic">* Đã bao gồm thuế và phí cổng thanh toán</span>
                    </div>
                    <span className="text-4xl font-black text-indigo-600 tracking-tighter">
                        {formatVND(totalAmount)}
                    </span>
                  </div>
                </div>
              </section>
            </div>

            {/* Cột bên phải: Nút thanh toán & Thông tin thẻ */}
            <div className="space-y-6">
              <div className="p-8 bg-white rounded-[32px] border-2 border-indigo-100 shadow-md space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 bg-indigo-50 text-indigo-600 rounded-bl-2xl">
                    <CreditCard size={20} />
                </div>
                
                <h3 className="font-bold text-gray-800">VNPay Gateway</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Hệ thống sẽ chuyển hướng bạn đến cổng thanh toán bảo mật VNPay. Vui lòng không đóng trình duyệt cho đến khi nhận được thông báo thành công.
                </p>

                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black flex items-center justify-center gap-3 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" /> : "XÁC NHẬN THANH TOÁN"}
                </button>
              </div>

              <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 space-y-3">
                <div className="flex items-center gap-2 text-amber-700">
                    <AlertCircle size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-tight">Thông tin thẻ thử nghiệm</span>
                </div>
                <div className="text-[11px] text-amber-900 font-mono space-y-1">
                    <p>Ngân hàng: <b>NCB</b></p>
                    <p>Số thẻ: <b>9704198526191432198</b></p>
                    <p>Tên chủ thẻ: <b>NGUYEN VAN A</b></p>
                    <p>OTP: <b>123456</b></p>
                </div>
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

export default Phase2Payment;