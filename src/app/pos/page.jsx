"use client";

import React, { useState, useEffect } from "react";
import { api_service } from "@/lib/api_service";
import { 
  Search, Trash2, ShoppingCart, Plus, Minus, Loader2, 
  LayoutGrid, Hammer, Droplets, Zap, Bath, Layers, Key, 
  Mic, Phone, Store, User, CreditCard, FileText, PackageOpen 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// --- 1. DANH SÁCH KHÁCH HÀNG (Có phân loại khách) ---
const DEMO_CUSTOMERS = [
  { id: 0, name: "Khách lẻ (Vãng lai)", phone: "", type: "guest" },
  { id: 1, name: "Anh Hùng (Thầu Xây Dựng)", phone: "0909123456", debt: 15500000, type: "vip" },
  { id: 2, name: "Cty XD Kiến Vàng", phone: "0918888999", debt: 82000000, type: "company" },
  { id: 3, name: "Cô Ba (Chủ trọ KDC 5)", phone: "0987654321", debt: 0, type: "regular" },
  { id: 4, name: "Chú Tư (Thợ điện nước)", phone: "0912345678", debt: 2500000, type: "regular" },
  { id: 5, name: "Anh Tâm (KTS Nội thất)", phone: "0933444555", debt: 0, type: "vip" },
];


// --- 2. KHO HÀNG KHỔNG LỒ (Đã khôi phục đầy đủ) ---
const DEMO_PRODUCTS = [
  // === NHÓM 1: SƠN & HÓA CHẤT ===
  { id: 101, name: "Sơn Dulux Weathershield Ngoại Thất (15L)", price: 2850000, category: "paint", origin: "🇳🇱 Hà Lan", image: "🎨" },
  { id: 102, name: "Sơn Dulux EasyClean Lau Chùi (15L)", price: 1650000, category: "paint", origin: "🇳🇱 Hà Lan", image: "🎨" },
  { id: 103, name: "Sơn Jotun Jotashield Bền Màu (15L)", price: 2600000, category: "paint", origin: "🇳🇴 Na Uy", image: "🎨" },
  { id: 104, name: "Sơn Jotun Essence Dễ Lau Chùi (17L)", price: 1450000, category: "paint", origin: "🇳🇴 Na Uy", image: "🎨" },
  { id: 105, name: "Sơn Kova Chống thấm CT-11A Gold (20kg)", price: 1950000, category: "paint", origin: "🇻🇳 Việt Mỹ", image: "💧" },
  { id: 106, name: "Sơn lót kháng kiềm Nippon Odour-less (18L)", price: 1850000, category: "paint", origin: "🇯🇵 Nhật Bản", image: "⚪" },
  { id: 107, name: "Sơn Maxilite Kinh Tế Nội Thất (18L)", price: 850000, category: "paint", origin: "🇬🇧 Anh", image: "🎨" },
  { id: 108, name: "Bột trét tường Dulux (Bao 40kg)", price: 380000, category: "paint", origin: "🇳🇱 Hà Lan", image: "🌫️" },
  { id: 109, name: "Dung môi pha sơn Xăng thơm (Lít)", price: 25000, category: "paint", origin: "🇻🇳 Việt Nam", image: "🛢️" },

  // === NHÓM 2: THIẾT BỊ VỆ SINH ===
  { id: 201, name: "Bồn cầu 1 khối Inax AC-909VRN", price: 3800000, category: "sanitary", origin: "🇯🇵 Nhật Bản", image: "🚽" },
  { id: 202, name: "Bồn cầu thông minh Toto Washlet", price: 12500000, category: "sanitary", origin: "🇯🇵 Nhật Bản", image: "🚽" },
  { id: 203, name: "Bồn cầu Viglacera V35 (Giá rẻ)", price: 1450000, category: "sanitary", origin: "🇻🇳 Việt Nam", image: "🚽" },
  { id: 204, name: "Chậu Lavabo Caesar Treo Tường", price: 650000, category: "sanitary", origin: "🇹🇼 Đài Loan", image: "🛁" },
  { id: 205, name: "Sen cây tắm đứng Inax BFV-3415T", price: 3200000, category: "sanitary", origin: "🇯🇵 Nhật Bản", image: "🚿" },
  { id: 206, name: "Vòi sen tắm nóng lạnh Viglacera", price: 1200000, category: "sanitary", origin: "🇻🇳 Việt Nam", image: "🚿" },
  { id: 207, name: "Gương phòng tắm Bỉ Navado (60x80)", price: 450000, category: "sanitary", origin: "🇧🇪 Bỉ", image: "🪞" },
  { id: 208, name: "Bình nóng lạnh Ariston 30L Slim", price: 2850000, category: "sanitary", origin: "🇮🇹 Ý", image: "🔥" },

  // === NHÓM 3: ĐIỆN & CHIẾU SÁNG ===
  { id: 301, name: "Dây điện Cadivi 2.5mm (Cuộn 100m)", price: 680000, category: "electric", origin: "🇻🇳 Việt Nam", image: "⚡" },
  { id: 302, name: "Dây cáp điện trần Phú Thịnh 4.0", price: 950000, category: "electric", origin: "🇻🇳 Việt Nam", image: "⚡" },
  { id: 303, name: "Công tắc Panasonic Wide (Hạt)", price: 15000, category: "electric", origin: "🇯🇵 Nhật Bản", image: "🔌" },
  { id: 304, name: "Ổ cắm đôi 3 chấu Schneider Zencelo", price: 120000, category: "electric", origin: "🇫🇷 Pháp", image: "🔌" },
  { id: 305, name: "Bóng đèn LED Bulb Rạng Đông 30W", price: 85000, category: "electric", origin: "🇻🇳 Việt Nam", image: "💡" },
  { id: 306, name: "Đèn tuýp LED Philips 1.2m (Bộ)", price: 120000, category: "electric", origin: "🇳🇱 Hà Lan", image: "💡" },
  { id: 307, name: "Đèn âm trần Downlight Panasonic 9W", price: 110000, category: "electric", origin: "🇯🇵 Nhật Bản", image: "🔆" },
  { id: 308, name: "Aptomat chống giật Panasonic 32A", price: 450000, category: "electric", origin: "🇯🇵 Nhật Bản", image: "🛡️" },

  // === NHÓM 4: XÂY DỰNG THÔ ===
  { id: 401, name: "Xi măng Hà Tiên 1 (Bao 50kg)", price: 86000, category: "raw", origin: "🇻🇳 Việt Nam", image: "🏗️" },
  { id: 402, name: "Xi măng Holcim Đa Dụng (Bao 50kg)", price: 89000, category: "raw", origin: "🇨🇭 Thụy Sĩ", image: "🏗️" },
  { id: 403, name: "Xi măng Trắng SCG Thái Lan", price: 180000, category: "raw", origin: "🇹🇭 Thái Lan", image: "🏗️" },
  { id: 404, name: "Thép vằn Hòa Phát D10 (Cây 11.7m)", price: 115000, category: "raw", origin: "🇻🇳 Việt Nam", image: "⛓️" },
  { id: 405, name: "Thép Pomina cuộn Ø6 (Kg)", price: 18500, category: "raw", origin: "🇻🇳 Việt Nam", image: "⛓️" },
  { id: 406, name: "Gạch ống 4 lỗ Tuynel Đồng Nai (Viên)", price: 1300, category: "raw", origin: "🇻🇳 Việt Nam", image: "🧱" },
  { id: 407, name: "Cát vàng bê tông rửa sạch (m³)", price: 480000, category: "raw", origin: "🇻🇳 Việt Nam", image: "⏳" },
  { id: 408, name: "Đá 1x2 Xanh Biên Hòa (m³)", price: 420000, category: "raw", origin: "🇻🇳 Việt Nam", image: "🪨" },

  // === NHÓM 5: GẠCH ỐP LÁT & SÀN ===
  { id: 501, name: "Gạch lát nền Đồng Tâm 60x60 (m²)", price: 185000, category: "flooring", origin: "🇻🇳 Việt Nam", image: "⬜" },
  { id: 502, name: "Gạch bóng kính Ấn Độ 80x80 (m²)", price: 320000, category: "flooring", origin: "🇮🇳 Ấn Độ", image: "✨" },
  { id: 503, name: "Gạch giả gỗ Prime 15x80 (m²)", price: 210000, category: "flooring", origin: "🇻🇳 Việt Nam", image: "🪵" },
  { id: 504, name: "Sàn gỗ công nghiệp Malaysia 12mm (m²)", price: 350000, category: "flooring", origin: "🇲🇾 Malaysia", image: "🪵" },
  { id: 505, name: "Keo dán gạch Weber.tai Fix (Bao 25kg)", price: 350000, category: "flooring", origin: "🇫🇷 Pháp", image: "🧪" },

  // === NHÓM 6: KIM KHÍ & DỤNG CỤ ===
  { id: 601, name: "Máy khoan bê tông Bosch GSB 550", price: 1250000, category: "tools", origin: "🇩🇪 Đức", image: "🛠️" },
  { id: 602, name: "Máy mài góc Makita 9553NB", price: 950000, category: "tools", origin: "🇯🇵 Nhật Bản", image: "⚙️" },
  { id: 603, name: "Máy bắn vít pin Dewalt 18V", price: 3200000, category: "tools", origin: "🇺🇸 Mỹ", image: "🔫" },
  { id: 604, name: "Bộ cờ lê đa năng Stanley (12 món)", price: 450000, category: "tools", origin: "🇺🇸 Mỹ", image: "🔧" },
  { id: 605, name: "Thước cuộn Tajima 5m (Xịn)", price: 180000, category: "tools", origin: "🇯🇵 Nhật Bản", image: "📏" },
  { id: 606, name: "Khóa cửa tay gạt Việt Tiệp 04991", price: 350000, category: "tools", origin: "🇻🇳 Việt Nam", image: "🔒" },
  { id: 607, name: "Thang nhôm rút chữ A Nikawa (2.5m)", price: 1650000, category: "tools", origin: "🇯🇵 Nhật Bản", image: "🪜" },

  // === NHÓM 7: ĐIỆN NƯỚC (Plumbing) ===
  { id: 701, name: "Ống nước Bình Minh PVC Ø90 (Cây 4m)", price: 145000, category: "plumbing", origin: "🇻🇳 Việt Nam", image: "🕳️" },
  { id: 702, name: "Ống nhiệt PPR Tiền Phong Ø25 (Cây)", price: 42000, category: "plumbing", origin: "🇻🇳 Việt Nam", image: "🔴" },
  { id: 703, name: "Co góc 90 độ PVC Bình Minh Ø27", price: 3000, category: "plumbing", origin: "🇻🇳 Việt Nam", image: "↩️" },
  { id: 704, name: "Máy bơm nước Panasonic 200W", price: 1450000, category: "plumbing", origin: "🇯🇵 Nhật Bản", image: "⚙️" },
  { id: 705, name: "Bồn nước Inox Sơn Hà 1000L", price: 3200000, category: "plumbing", origin: "🇻🇳 Việt Nam", image: "🛢️" },
  { id: 706, name: "Chậu rửa bát Inox 304 2 hố (Hàn Quốc)", price: 1850000, category: "plumbing", origin: "🇰🇷 Hàn Quốc", image: "🍽️" },
];

const CATEGORIES = [
  { id: "all", name: "Tất cả", icon: LayoutGrid },
  { id: "raw", name: "Xây dựng thô", icon: Hammer },
  { id: "paint", name: "Sơn & Hóa chất", icon: Droplets },
  { id: "sanitary", name: "TB Vệ sinh", icon: Bath },
  { id: "electric", name: "Điện & Đèn", icon: Zap },
  { id: "plumbing", name: "Nước & Bếp", icon: Layers },
  { id: "flooring", name: "Gạch & Sàn", icon: Layers },
  { id: "tools", name: "Kim khí & Tool", icon: Key },
];

export default function PosPage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  // States mới cho BizFlow (Đáp ứng yêu cầu đồ án)
  const [selectedCustomer, setSelectedCustomer] = useState(0); 
  const [orderSource, setOrderSource] = useState("counter"); // 'counter' hoặc 'zalo'
  const [isVatInvoice, setIsVatInvoice] = useState(false);   // Xuất hóa đơn đỏ (TT88)
  
  const [processing, setProcessing] = useState(false);
  const [useDemoData, setUseDemoData] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await api_service.get_products();
      if (Array.isArray(data) && data.length > 0) {
        setProducts(data);
        setUseDemoData(false);
      } else {
        setProducts(DEMO_PRODUCTS);
        setUseDemoData(true);
      }
    } catch (e) {
      setProducts(DEMO_PRODUCTS);
      setUseDemoData(true);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    setCart((prev) => {
      const exist = prev.find((item) => item.id === product.id);
      return exist 
        ? prev.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, change) => {
    setCart((prev) => prev.map((item) => {
      if (item.id === id) {
        const newQty = item.quantity + change;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((item) => item.id !== id));

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  // Tính toán VAT (nếu có)
  const vatAmount = isVatInvoice ? totalAmount * 0.08 : 0; // VAT 8%
  const finalAmount = totalAmount + vatAmount;

  const filteredProducts = products.filter(p => {
    const matchSearch = p.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === "all" || p.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const handleCheckout = async (paymentMethod) => {
    if (cart.length === 0) return;
    setProcessing(true);

    // Giả lập xử lý đơn hàng (Demo cho đồ án)
    setTimeout(() => {
      const customer = DEMO_CUSTOMERS.find(c => c.id == selectedCustomer);
      const methodText = paymentMethod === 'debt' ? 'GHI NỢ (Sổ cái) 📒' : 'TIỀN MẶT 💵';
      const sourceText = orderSource === 'counter' ? 'Tại quầy' : 'Qua Zalo/ĐT 📱';
      
      alert(
        `✅ BIZFLOW: TẠO ĐƠN HÀNG THÀNH CÔNG!\n` +
        `-----------------------------\n` +
        `👤 Khách hàng: ${customer?.name}\n` +
        `🛒 Kênh bán: ${sourceText}\n` +
        `📦 Số lượng: ${cart.reduce((a,b)=>a+b.quantity,0)} sản phẩm\n` +
        `📝 Hình thức: ${methodText}\n` +
        `-----------------------------\n` +
        `Tạm tính: ${totalAmount.toLocaleString()}đ\n` +
        `Thuế VAT (8%): ${vatAmount.toLocaleString()}đ\n` +
        `TỔNG CỘNG: ${finalAmount.toLocaleString()}đ`
      );
      
      setCart([]);
      setProcessing(false);
    }, 1200);
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      
      {/* --- CỘT TRÁI: KHO HÀNG (Sản phẩm phong phú) --- */}
      <div className="flex-1 flex flex-col p-4 gap-4 overflow-hidden">
        
        {/* Header: Tìm kiếm & Lọc */}
        <div className="flex flex-col gap-3">
          <div className="relative flex gap-2">
            <div className="relative flex-1 shadow-sm group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text"
                placeholder="Tìm: Sơn Dulux, Thép Hòa Phát, Khoan Bosch, Ống nước..."
                className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {/* Nút Micro (AI Voice Input - Demo) */}
              <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-slate-100 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="Nhập liệu bằng giọng nói (AI)">
                <Mic size={18} />
              </button>
            </div>
          </div>

          {/* Tabs Danh mục (Đầy đủ icon) */}
          <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium whitespace-nowrap border text-sm transition-all
                  ${selectedCategory === cat.id 
                    ? "bg-blue-600 text-white border-blue-600 shadow-md" 
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-blue-600"}`}
              >
                <cat.icon size={16} />
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Lưới sản phẩm (Hiển thị đẹp) */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {loading ? (
            <div className="flex justify-center items-center h-full flex-col text-slate-400 gap-2">
              <Loader2 className="animate-spin text-blue-500" size={40} />
              <span>Đang tải dữ liệu kho...</span>
            </div>
          ) : (
            <>
              {filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                  <PackageOpen size={64} className="mb-4 opacity-50" />
                  <p>Không tìm thấy sản phẩm phù hợp</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 pb-20">
                  {filteredProducts.map((product) => (
                    <Card key={product.id} onClick={() => addToCart(product)} 
                      className="cursor-pointer hover:shadow-lg hover:border-blue-400 transition-all group overflow-hidden border-slate-200"
                    >
                      <CardContent className="p-3 flex flex-col h-full">
                        <span className="absolute top-2 right-2 text-[10px] bg-slate-100 px-2 py-0.5 rounded-full border text-slate-600 font-medium z-10">
                          {product.origin}
                        </span>
                        <div className="h-24 bg-slate-50 rounded-lg mb-2 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform select-none">
                          {product.image}
                        </div>
                        <h3 className="font-semibold text-slate-700 text-sm line-clamp-2 mb-auto leading-snug" title={product.name}>
                          {product.name}
                        </h3>
                        <div className="mt-3 flex justify-between items-end border-t border-slate-100 pt-2">
                          <span className="text-blue-700 font-bold text-sm">
                            {product.price.toLocaleString()}đ
                          </span>
                          <div className="bg-blue-100 text-blue-600 p-1 rounded-md hover:bg-blue-600 hover:text-white transition-colors">
                            <Plus size={16} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* --- CỘT PHẢI: XỬ LÝ ĐƠN HÀNG (BIZFLOW FEATURES) --- */}
      <div className="w-96 bg-white border-l border-slate-200 flex flex-col h-full shadow-2xl z-20">
        
        {/* 1. Header: Kênh bán & Khách hàng */}
        <div className="p-4 border-b border-slate-100 space-y-3 bg-slate-50/80 backdrop-blur">
          
          {/* Toggle Nguồn đơn (Multi-channel: Quầy vs Online) */}
          <div className="bg-slate-200 p-1 rounded-lg flex text-xs font-bold">
            <button 
              onClick={() => setOrderSource("counter")}
              className={`flex-1 py-2 rounded-md flex items-center justify-center gap-1 transition-all ${orderSource === "counter" ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              <Store size={14} /> Tại quầy
            </button>
            <button 
              onClick={() => setOrderSource("zalo")}
              className={`flex-1 py-2 rounded-md flex items-center justify-center gap-1 transition-all ${orderSource === "zalo" ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              <Phone size={14} /> Zalo / ĐT
            </button>
          </div>

          {/* Chọn khách hàng (Công nợ) */}
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <select 
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none bg-white cursor-pointer hover:border-blue-300"
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(parseInt(e.target.value))}
            >
              {DEMO_CUSTOMERS.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.debt > 0 ? `(Nợ: ${c.debt.toLocaleString()})` : ""}
                </option>
              ))}
            </select>
          </div>
          
          {/* Alert: Cảnh báo nợ cũ (Tính năng quản lý nợ) */}
          {selectedCustomer !== 0 && DEMO_CUSTOMERS.find(c => c.id === selectedCustomer)?.debt > 0 && (
            <div className="flex items-center justify-between text-xs bg-red-50 text-red-600 px-3 py-2 rounded-lg border border-red-100 animate-pulse">
              <span className="font-semibold flex items-center gap-1"><FileText size={12}/> Đang nợ cũ:</span>
              <span className="font-bold text-sm">{DEMO_CUSTOMERS.find(c => c.id === selectedCustomer)?.debt.toLocaleString()}đ</span>
            </div>
          )}
        </div>

        {/* 2. Danh sách giỏ hàng */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/30">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-300 opacity-60 gap-2">
              <div className="bg-slate-100 p-4 rounded-full">
                <ShoppingCart size={32} />
              </div>
              <p className="font-medium text-sm">Chưa có hàng</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-2 items-center bg-white p-2 rounded-lg border border-slate-100 shadow-sm animate-in slide-in-from-right-2 duration-200">
                <div className="h-10 w-10 bg-blue-50 rounded-md flex items-center justify-center text-lg shrink-0">{item.image}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate text-slate-700">{item.name}</div>
                  <div className="text-blue-600 text-xs font-bold mt-0.5">
                    {(item.price * item.quantity).toLocaleString()}đ
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-slate-50 rounded-lg p-0.5 border border-slate-200">
                  <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-white rounded-md text-slate-500 hover:text-red-500 transition-colors"><Minus size={12}/></button>
                  <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-white rounded-md text-slate-500 hover:text-blue-600 transition-colors"><Plus size={12}/></button>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-red-500 ml-1 p-1"><Trash2 size={14}/></button>
              </div>
            ))
          )}
        </div>

        {/* 3. Footer: Thanh toán & VAT */}
        <div className="p-4 border-t border-slate-200 bg-white shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] space-y-3 z-30">
          
          {/* Tùy chọn hóa đơn (Thông tư 88) */}
          <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer select-none">
              <input type="checkbox" checked={isVatInvoice} onChange={() => setIsVatInvoice(!isVatInvoice)} className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4" />
              Xuất hóa đơn đỏ (TT88)
            </label>
            {isVatInvoice && <span className="text-[10px] font-bold bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded border border-orange-200">+8% VAT</span>}
          </div>

          {/* Tổng tiền */}
          <div className="space-y-1">
            <div className="flex justify-between text-slate-500 text-sm">
              <span>Tạm tính:</span>
              <span>{totalAmount.toLocaleString()}đ</span>
            </div>
            {isVatInvoice && (
              <div className="flex justify-between text-orange-500 text-sm">
                <span>VAT (8%):</span>
                <span>+{vatAmount.toLocaleString()}đ</span>
              </div>
            )}
            <div className="flex justify-between items-end border-t border-dashed pt-2 mt-2">
              <span className="text-slate-800 font-bold">KHÁCH PHẢI TRẢ</span>
              <span className="text-2xl font-extrabold text-blue-700">{finalAmount.toLocaleString()}đ</span>
            </div>
          </div>

          {/* Nút hành động: Chia 2 nút Ghi Nợ & Tiền Mặt */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              disabled={cart.length === 0 || processing}
              onClick={() => handleCheckout('debt')}
              className="py-3 rounded-xl font-bold text-orange-700 bg-orange-50 border border-orange-200 hover:bg-orange-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileText size={18} /> Ghi nợ
            </button>
            
            <button
              disabled={cart.length === 0 || processing}
              onClick={() => handleCheckout('cash')}
              className="py-3 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? <Loader2 className="animate-spin" /> : <><CreditCard size={18} /> Thanh toán</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}