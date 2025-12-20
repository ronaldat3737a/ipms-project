import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lightbulb, Search, CreditCard, Facebook, Twitter, Linkedin, Youtube, ChevronRight } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* --- HEADER --- */}
      <nav className="flex items-center justify-between px-10 py-5 border-b sticky top-0 bg-white z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded rotate-45 flex items-center justify-center">
            <div className="w-3 h-3 border-2 border-white"></div>
          </div>
        </div>
        <div className="space-x-6">
          <button onClick={() => navigate('/login')} className="text-blue-600 font-semibold hover:text-blue-800">
            Đăng nhập
          </button>
          <button onClick={() => navigate('/register')} className="bg-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 transition">
            Đăng ký
          </button>
        </div>
      </nav>

      {/* --- SECTION 1: TÍNH NĂNG NỔI BẬT --- */}
      <section className="max-w-7xl mx-auto py-20 px-6">
        <h2 className="text-3xl font-bold text-center mb-16">Tính năng nổi bật</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <FeatureCard 
            icon={<Lightbulb className="w-10 h-10 text-blue-500" />}
            title="Nộp đơn thông minh"
            desc="Hệ thống hướng dẫn chi tiết, đơn giản hóa quy trình nộp đơn với các biểu mẫu điện tử trực quan."
          />
          <FeatureCard 
            icon={<Search className="w-10 h-10 text-blue-500" />}
            title="Tra cứu & So sánh"
            desc="Dễ dàng tìm kiếm thông tin tài sản trí tuệ đã đăng ký, so sánh và phân tích dữ liệu hiệu quả."
          />
          <FeatureCard 
            icon={<CreditCard className="w-10 h-10 text-blue-500" />}
            title="Thanh toán trực tuyến"
            desc="An toàn và tiện lợi với các tùy chọn thanh toán đa dạng, theo dõi trạng thái giao dịch mọi lúc."
          />
        </div>
      </section>

      {/* --- SECTION 2: GIỚI THIỆU --- */}
      <section className="bg-gray-50 py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Giới thiệu về IPMS Public Gateway</h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            IPMS Public Gateway là cầu nối điện tử giúp cá nhân và tổ chức dễ dàng tiếp cận hệ thống quản lý tài sản trí tuệ quốc gia. 
            Chúng tôi cam kết mang đến một nền tảng minh bạch, hiệu quả và thân thiện để bảo vệ đổi mới.
          </p>
          <p className="text-gray-600 text-lg leading-relaxed">
            Từ việc nộp đơn đăng ký đến tra cứu thông tin và quản lý hồ sơ, mọi thao tác đều được số hóa, đảm bảo tính chính xác và kịp thời.
          </p>
        </div>
      </section>

      {/* --- SECTION 3: QUY TRÌNH ĐĂNG KÝ --- */}
      <section className="max-w-7xl mx-auto py-24 px-6">
        <h2 className="text-3xl font-bold text-center mb-16">Quy trình Đăng ký Tài sản Trí tuệ</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ProcessCard 
            title="Sáng chế" 
            desc="Bảo vệ các phát minh kỹ thuật, quy trình mới và cải tiến sản phẩm." 
            color="bg-blue-100" 
          />
          <ProcessCard 
            title="Kiểu dáng" 
            desc="Đăng ký bảo hộ hình dáng bên ngoài của sản phẩm, tạo dấu ấn riêng biệt." 
            color="bg-blue-200" 
          />
          <ProcessCard 
            title="Nhãn hiệu" 
            desc="Bảo vệ tên thương hiệu, logo và các dấu hiệu nhận biết sản phẩm, dịch vụ." 
            color="bg-blue-400" 
            isDark 
          />
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-white pt-20 pb-10 px-10 border-t">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1">
            <div className="w-8 h-8 bg-blue-500 rounded rotate-45 mb-6"></div>
            <p className="text-sm text-gray-500">123 Đường Sáng Chế, Quận IP, TP Công Nghệ</p>
            <p className="text-sm text-gray-500 mt-2">Phone: +84 123 456 789</p>
            <div className="flex gap-4 mt-6 text-gray-400">
              <Facebook size={20} className="hover:text-blue-600 cursor-pointer" />
              <Twitter size={20} className="hover:text-blue-400 cursor-pointer" />
              <Linkedin size={20} className="hover:text-blue-700 cursor-pointer" />
              <Youtube size={20} className="hover:text-red-600 cursor-pointer" />
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-6">Biểu phí</h4>
            <ul className="text-sm text-gray-500 space-y-3">
              <li>Lệ phí nộp đơn: 150.000 VNĐ</li>
              <li>Phí thẩm định hình thức: 180.000 VNĐ</li>
              <li>Phí thẩm định nội dung: 720.000 VNĐ</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Liên kết pháp lý</h4>
            <ul className="text-sm text-gray-500 space-y-3">
              <li className="hover:text-blue-500 cursor-pointer">Điều khoản sử dụng</li>
              <li className="hover:text-blue-500 cursor-pointer">Chính sách bảo mật</li>
              <li className="hover:text-blue-500 cursor-pointer">Quy định chung</li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-16 pt-8 text-center text-xs text-gray-400">
          © 2025 IPMS Public Gateway. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

// --- SUB-COMPONENTS ---
const FeatureCard = ({ icon, title, desc }) => (
  <div className="p-10 border rounded-2xl text-center hover:shadow-lg transition bg-white group">
    <div className="flex justify-center mb-6 group-hover:scale-110 transition">{icon}</div>
    <h3 className="text-xl font-bold mb-4">{title}</h3>
    <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
  </div>
);

const ProcessCard = ({ title, desc, color, isDark }) => (
  <div className={`${color} p-10 rounded-3xl h-72 flex flex-col justify-between shadow-sm relative overflow-hidden`}>
    <div>
      <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>{title}</h3>
      <p className={`text-sm mt-4 leading-relaxed ${isDark ? 'text-blue-50' : 'text-gray-600'}`}>{desc}</p>
    </div>
    <button className={`flex items-center gap-1 font-bold ${isDark ? 'text-white' : 'text-blue-600'}`}>
      Bắt đầu <ChevronRight size={20} />
    </button>
  </div>
);

export default Landing;
