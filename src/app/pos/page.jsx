"use client";

import React, { useState, useEffect } from "react";
import { api_service } from "@/lib/api_service";
import { Search, Trash2, ShoppingCart, Plus, Minus, Loader2, Star, Tag, Users, Filter, PackageOpen, LayoutGrid, Hammer, Droplets, Zap, Bath, Layers, Key } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// --- 1. DANH SÁCH KHÁCH HÀNG (Mở rộng thêm) ---
const DEMO_CUSTOMERS = [
  { id: 0, name: "Khách lẻ (Vãng lai)", phone: "", type: "guest" },
  { id: 1, name: "Anh Hùng (Thầu Xây Dựng)", phone: "0909123456", debt: 15500000, type: "vip" },
  { id: 2, name: "Cty XD Kiến Vàng", phone: "0918888999", debt: 82000000, type: "company" },
  { id: 3, name: "Cô Ba (Chủ trọ KDC 5)", phone: "0987654321", debt: 0, type: "regular" },
  { id: 4, name: "Chú Tư (Thợ điện nước)", phone: "0912345678", debt: 2500000, type: "regular" },
  { id: 5, name: "Anh Tâm (KTS Nội thất)", phone: "0933444555", debt: 0, type: "vip" },
];

// --- 2. KHO HÀNG KHỔNG LỒ (Đa dạng mẫu mã, giá cả) ---
const DEMO_PRODUCTS = [
  // === NHÓM 1: SƠN & HÓA CHẤT (Pain & Chemicals) ===
  { id: 101, name: "Sơn Dulux Weathershield Ngoại Thất (15L)", price: 2850000, category: "paint", origin: "🇳🇱 Hà Lan", image: "🎨" },
  { id: 102, name: "Sơn Dulux EasyClean Lau Chùi (15L)", price: 1650000, category: "paint", origin: "🇳🇱 Hà Lan", image: "🎨" },
  { id: 103, name: "Sơn Jotun Jotashield Bền Màu (15L)", price: 2600000, category: "paint", origin: "🇳🇴 Na Uy", image: "🎨" },
  { id: 104, name: "Sơn Jotun Essence Dễ Lau Chùi (17L)", price: 1450000, category: "paint", origin: "🇳🇴 Na Uy", image: "🎨" },
  { id: 105, name: "Sơn Kova Chống thấm CT-11A Gold (20kg)", price: 1950000, category: "paint", origin: "🇻🇳 Việt Mỹ", image: "💧" },
  { id: 106, name: "Sơn lót kháng kiềm Nippon Odour-less (18L)", price: 1850000, category: "paint", origin: "🇯🇵 Nhật Bản", image: "⚪" },
  { id: 107, name: "Sơn Maxilite Kinh Tế Nội Thất (18L)", price: 850000, category: "paint", origin: "🇬🇧 Anh", image: "🎨" },
  { id: 108, name: "Bột trét tường Dulux (Bao 40kg)", price: 380000, category: "paint", origin: "🇳🇱 Hà Lan", image: "🌫️" },
  { id: 109, name: "Bột trét Việt Mỹ (Bao 40kg)", price: 120000, category: "paint", origin: "🇻🇳 Việt Nam", image: "🌫️" },
  { id: 110, name: "Dung môi pha sơn Xăng thơm (Lít)", price: 25000, category: "paint", origin: "🇻🇳 Việt Nam", image: "🛢️" },
  { id: 111, name: "Cọ lăn sơn Việt Mỹ (Cây)", price: 15000, category: "paint", origin: "🇻🇳 Việt Nam", image: "🖌️" },

  // === NHÓM 2: THIẾT BỊ VỆ SINH (Sanitary Ware) ===
  { id: 201, name: "Bồn cầu 1 khối Inax AC-909VRN", price: 3800000, category: "sanitary", origin: "🇯🇵 Nhật Bản", image: "🚽" },
  { id: 202, name: "Bồn cầu thông minh Toto Washlet", price: 12500000, category: "sanitary", origin: "🇯🇵 Nhật Bản", image: "🚽" },
  { id: 203, name: "Bồn cầu Viglacera V35 (Giá rẻ)", price: 1450000, category: "sanitary", origin: "🇻🇳 Việt Nam", image: "🚽" },
  { id: 204, name: "Chậu Lavabo Caesar Treo Tường", price: 650000, category: "sanitary", origin: "🇹🇼 Đài Loan", image: "🛁" },
  { id: 205, name: "Sen cây tắm đứng Inax BFV-3415T", price: 3200000, category: "sanitary", origin: "🇯🇵 Nhật Bản", image: "🚿" },
  { id: 206, name: "Vòi sen tắm nóng lạnh Viglacera", price: 1200000, category: "sanitary", origin: "🇻🇳 Việt Nam", image: "🚿" },
  { id: 207, name: "Gương phòng tắm Bỉ Navado (60x80)", price: 450000, category: "sanitary", origin: "🇧🇪 Bỉ", image: "🪞" },
  { id: 208, name: "Bình nóng lạnh Ariston 30L Slim", price: 2850000, category: "sanitary", origin: "🇮🇹 Ý", image: "🔥" },
  { id: 209, name: "Bình nóng lạnh Ferroli 20L", price: 2100000, category: "sanitary", origin: "🇮🇹 Ý", image: "🔥" },

  // === NHÓM 3: ĐIỆN & CHIẾU SÁNG (Electrical) ===
  { id: 301, name: "Dây điện Cadivi 2.5mm (Cuộn 100m)", price: 680000, category: "electric", origin: "🇻🇳 Việt Nam", image: "⚡" },
  { id: 302, name: "Dây cáp điện trần Phú Thịnh 4.0", price: 950000, category: "electric", origin: "🇻🇳 Việt Nam", image: "⚡" },
  { id: 303, name: "Công tắc Panasonic Wide (Hạt)", price: 15000, category: "electric", origin: "🇯🇵 Nhật Bản", image: "🔌" },
  { id: 304, name: "Ổ cắm đôi 3 chấu Schneider Zencelo", price: 120000, category: "electric", origin: "🇫🇷 Pháp", image: "🔌" },
  { id: 305, name: "Bóng đèn LED Bulb Rạng Đông 30W", price: 85000, category: "electric", origin: "🇻🇳 Việt Nam", image: "💡" },
  { id: 306, name: "Đèn tuýp LED Philips 1.2m (Bộ)", price: 120000, category: "electric", origin: "🇳🇱 Hà Lan", image: "💡" },
  { id: 307, name: "Đèn âm trần Downlight Panasonic 9W", price: 110000, category: "electric", origin: "🇯🇵 Nhật Bản", image: "🔆" },
  { id: 308, name: "Aptomat chống giật Panasonic 32A", price: 450000, category: "electric", origin: "🇯🇵 Nhật Bản", image: "🛡️" },
  { id: 309, name: "Quạt trần Panasonic 4 cánh", price: 2100000, category: "electric", origin: "🇯🇵 Nhật Bản", image: "🌬️" },

  // === NHÓM 4: XÂY DỰNG THÔ (Structural) ===
  { id: 401, name: "Xi măng Hà Tiên 1 (Bao 50kg)", price: 86000, category: "raw", origin: "🇻🇳 Việt Nam", image: "🏗️" },
  { id: 402, name: "Xi măng Holcim Đa Dụng (Bao 50kg)", price: 89000, category: "raw", origin: "🇨🇭 Thụy Sĩ", image: "🏗️" },
  { id: 403, name: "Xi măng Trắng SCG Thái Lan", price: 180000, category: "raw", origin: "🇹🇭 Thái Lan", image: "🏗️" },
  { id: 404, name: "Thép vằn Hòa Phát D10 (Cây 11.7m)", price: 115000, category: "raw", origin: "🇻🇳 Việt Nam", image: "⛓️" },
  { id: 405, name: "Thép Pomina cuộn Ø6 (Kg)", price: 18500, category: "raw", origin: "🇻🇳 Việt Nam", image: "⛓️" },
  { id: 406, name: "Gạch ống 4 lỗ Tuynel Đồng Nai (Viên)", price: 1300, category: "raw", origin: "🇻🇳 Việt Nam", image: "🧱" },
  { id: 407, name: "Gạch Block không nung (Viên)", price: 1500, category: "raw", origin: "🇻🇳 Việt Nam", image: "🧱" },
  { id: 408, name: "Cát vàng bê tông rửa sạch (m³)", price: 480000, category: "raw", origin: "🇻🇳 Việt Nam", image: "⏳" },
  { id: 409, name: "Đá 1x2 Xanh Biên Hòa (m³)", price: 420000, category: "raw", origin: "🇻🇳 Việt Nam", image: "🪨" },

  // === NHÓM 5: GẠCH ỐP LÁT & SÀN (Flooring) ===
  { id: 501, name: "Gạch lát nền Đồng Tâm 60x60 (m²)", price: 185000, category: "flooring", origin: "🇻🇳 Việt Nam", image: "⬜" },
  { id: 502, name: "Gạch bóng kính Ấn Độ 80x80 (m²)", price: 320000, category: "flooring", origin: "🇮🇳 Ấn Độ", image: "✨" },
  { id: 503, name: "Gạch giả gỗ Prime 15x80 (m²)", price: 210000, category: "flooring", origin: "🇻🇳 Việt Nam", image: "🪵" },
  { id: 504, name: "Sàn gỗ công nghiệp Malaysia 12mm (m²)", price: 350000, category: "flooring", origin: "🇲🇾 Malaysia", image: "🪵" },
  { id: 505, name: "Sàn nhựa hèm khóa Hàn Quốc (m²)", price: 280000, category: "flooring", origin: "🇰🇷 Hàn Quốc", image: "🧱" },
  { id: 506, name: "Keo dán gạch Weber.tai Fix (Bao 25kg)", price: 350000, category: "flooring", origin: "🇫🇷 Pháp", image: "🧪" },
  { id: 507, name: "Keo chà ron cá sấu Thái Lan (Kg)", price: 15000, category: "flooring", origin: "🇹🇭 Thái Lan", image: "🐊" },

  // === NHÓM 6: KIM KHÍ & DỤNG CỤ (Tools & Hardware) ===
  { id: 601, name: "Máy khoan bê tông Bosch GSB 550", price: 1250000, category: "tools", origin: "🇩🇪 Đức", image: "🛠️" },
  { id: 602, name: "Máy mài góc Makita 9553NB", price: 950000, category: "tools", origin: "🇯🇵 Nhật Bản", image: "⚙️" },
  { id: 603, name: "Máy bắn vít pin Dewalt 18V", price: 3200000, category: "tools", origin: "🇺🇸 Mỹ", image: "🔫" },
  { id: 604, name: "Bộ cờ lê đa năng Stanley (12 món)", price: 450000, category: "tools", origin: "🇺🇸 Mỹ", image: "🔧" },
  { id: 605, name: "Thước cuộn Tajima 5m (Xịn)", price: 180000, category: "tools", origin: "🇯🇵 Nhật Bản", image: "📏" },
  { id: 606, name: "Khóa cửa tay gạt Việt Tiệp 04991", price: 350000, category: "tools", origin: "🇻🇳 Việt Nam", image: "🔒" },
  { id: 607, name: "Khóa điện tử vân tay Hafele", price: 5500000, category: "tools", origin: "🇩🇪 Đức", image: "🔐" },
  { id: 608, name: "Bản lề inox 304 Ivan (Cặp)", price: 45000, category: "tools", origin: "🇹🇼 Đài Loan", image: "🚪" },
  { id: 609, name: "Thang nhôm rút chữ A Nikawa (2.5m)", price: 1650000, category: "tools", origin: "🇯🇵 Nhật Bản", image: "🪜" },

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
  const [selectedCustomer, setSelectedCustomer] = useState(0); 
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
      console.error(e);
      setProducts(DEMO_PRODUCTS);
      setUseDemoData(true);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, change) => {
    setCart((prevCart) => {
      return prevCart.map((item) => {
        if (item.id === productId) {
          const newQty = item.quantity + change;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      });
    });
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const filteredProducts = products.filter(p => {
    const matchSearch = p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        p.origin?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === "all" || p.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setProcessing(true);

    if (useDemoData) {
      setTimeout(() => {
        const customer = DEMO_CUSTOMERS.find(c => c.id == selectedCustomer);
        alert(`✅ TẠO ĐƠN HÀNG THÀNH CÔNG!\n\n👤 Khách hàng: ${customer?.name}\n💰 Tổng tiền: ${totalAmount.toLocaleString()}đ\n📦 Số lượng: ${cart.reduce((a, b) => a + b.quantity, 0)} sản phẩm`);
        setCart([]);
        setProcessing(false);
      }, 800); 
      return;
    }

    const orderData = {
      order_details: cart.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price
      })),
      total_amount: totalAmount,
      customer_id: selectedCustomer === 0 ? null : selectedCustomer
    };

    try {
      const result = await api_service.create_order(orderData);
      if (result && !result.error) {
        alert("Thanh toán thành công!");
        setCart([]);
      } else {
        alert("Lỗi: " + (result.error || "Không xác định"));
      }
    } catch (error) {
      alert("Lỗi kết nối server");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* CỘT TRÁI: DANH SÁCH SẢN PHẨM */}
      <div className="flex-1 flex flex-col p-4 overflow-hidden gap-4">
        
        {/* Header: Tìm kiếm & Tabs danh mục */}
        <div className="flex flex-col gap-3">
          {/* Thanh tìm kiếm */}
          <div className="relative shadow-sm group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input 
              type="text"
              placeholder="Tìm kiếm: Sơn Dulux, Ống Bình Minh, Khóa Việt Tiệp, Bồn cầu..."
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-base transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Tabs Danh mục (Scroll ngang) */}
          <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all border text-sm
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

        {/* Grid Sản phẩm */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {loading ? (
            <div className="flex flex-col justify-center items-center h-full text-slate-400">
              <Loader2 className="animate-spin mb-2" size={40} />
              <p>Đang tải kho hàng...</p>
            </div>
          ) : (
            <>
              {filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                  <PackageOpen size={64} className="mb-4 opacity-50" />
                  <p className="text-lg">Không tìm thấy sản phẩm nào</p>
                  <p className="text-sm">Thử tìm "Sơn" hoặc "Thép" xem sao!</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 pb-20">
                  {filteredProducts.map((product) => (
                    <Card 
                      key={product.id}
                      onClick={() => addToCart(product)}
                      className="cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all group border-slate-200 overflow-hidden relative bg-white"
                    >
                      <CardContent className="p-3 flex flex-col h-full">
                        {/* Nhãn xuất xứ */}
                        {product.origin && (
                          <span className="absolute top-2 right-2 text-[10px] bg-white/90 backdrop-blur text-slate-600 px-2 py-0.5 rounded-full font-bold border border-slate-100 shadow-sm z-10">
                            {product.origin}
                          </span>
                        )}

                        {/* Hình ảnh (Icon lớn) */}
                        <div className="h-28 bg-slate-50 rounded-lg mb-3 flex items-center justify-center text-5xl group-hover:scale-110 transition-transform duration-300">
                          {product.image}
                        </div>
                        
                        {/* Tên sản phẩm */}
                        <h3 className="font-semibold text-slate-700 line-clamp-2 text-sm mb-auto leading-snug min-h-[2.5em]" title={product.name}>
                          {product.name}
                        </h3>
                        
                        {/* Giá tiền & Nút thêm */}
                        <div className="mt-3 flex justify-between items-end border-t border-slate-100 pt-2">
                          <div className="flex flex-col">
                            <span className="text-[10px] text-slate-400 font-medium">Đơn giá</span>
                            <span className="text-blue-700 font-bold text-base">
                              {product.price?.toLocaleString('vi-VN')}
                              <span className="text-[10px] align-top text-slate-500 font-normal">đ</span>
                            </span>
                          </div>
                          <div className="h-7 w-7 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
                            <Plus size={16} strokeWidth={3} />
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

      {/* CỘT PHẢI: HÓA ĐƠN & CÔNG NỢ */}
      <div className="w-96 bg-white border-l border-slate-200 flex flex-col h-full shadow-2xl z-20">
        
        {/* Header Giỏ hàng */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/80 backdrop-blur">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-xl flex items-center gap-2 text-slate-800">
              <ShoppingCart className="text-blue-600" size={24} />
              Đơn hàng
            </h2>
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
              {cart.reduce((a, b) => a + b.quantity, 0)} món
            </span>
          </div>

          {/* Chọn Khách hàng (Có hiển thị nợ cũ) */}
          <div className="relative group">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-blue-500 transition-colors" size={16} />
            <select 
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white appearance-none cursor-pointer hover:border-blue-300 transition-colors shadow-sm"
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(parseInt(e.target.value))}
            >
              {DEMO_CUSTOMERS.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.debt > 0 ? `(Nợ: ${c.debt.toLocaleString()}đ)` : ""}
                </option>
              ))}
            </select>
            {/* Mũi tên custom cho đẹp */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <div className="border-t-4 border-l-4 border-transparent border-t-slate-400"></div>
            </div>
          </div>
        </div>

        {/* Danh sách món đã chọn (Giỏ hàng) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/30">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-4 opacity-60">
              <div className="bg-slate-100 p-6 rounded-full">
                <ShoppingCart size={48} strokeWidth={1.5} />
              </div>
              <p className="font-medium text-sm">Chưa có sản phẩm nào</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-3 bg-white p-3 rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group animate-in slide-in-from-right-4 duration-300">
                <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center text-xl shrink-0 select-none">
                  {item.image}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-slate-800 text-sm truncate" title={item.name}>{item.name}</div>
                  <div className="text-slate-500 text-xs mt-0.5">
                    {item.price.toLocaleString()} x {item.quantity}
                  </div>
                  <div className="text-blue-600 font-bold text-sm mt-1">
                    {(item.price * item.quantity).toLocaleString()}đ
                  </div>
                </div>
                
                <div className="flex flex-col items-end justify-between gap-2">
                  <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-red-500 p-1 transition-colors rounded hover:bg-red-50">
                    <Trash2 size={14} />
                  </button>
                  <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
                    <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-white hover:text-red-500 rounded-md text-slate-600 transition-all shadow-sm">
                      <Minus size={12} />
                    </button>
                    <span className="w-7 text-center text-xs font-bold select-none">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-white hover:text-blue-600 rounded-md text-slate-600 transition-all shadow-sm">
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Thanh toán */}
        <div className="p-5 border-t border-slate-200 bg-white shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] z-30">
          <div className="space-y-3 mb-5 text-sm">
            <div className="flex justify-between text-slate-500">
              <span>Tạm tính</span>
              <span>{totalAmount.toLocaleString()}đ</span>
            </div>
            {selectedCustomer !== 0 && DEMO_CUSTOMERS.find(c => c.id === selectedCustomer)?.debt > 0 && (
              <div className="flex justify-between text-red-500 font-medium bg-red-50 px-2 py-1 rounded">
                <span>Nợ cũ</span>
                <span>{DEMO_CUSTOMERS.find(c => c.id === selectedCustomer)?.debt.toLocaleString()}đ</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-3 border-t border-dashed border-slate-200">
              <div className="flex flex-col">
                <span className="font-bold text-slate-800 text-base">TỔNG CỘNG</span>
                <span className="text-[10px] text-slate-400 font-normal uppercase">Đã bao gồm VAT</span>
              </div>
              <span className="text-2xl font-extrabold text-blue-600">
                {totalAmount.toLocaleString()}
                <span className="text-sm font-medium ml-0.5 text-blue-400">đ</span>
              </span>
            </div>
          </div>
          
          <button
            disabled={cart.length === 0 || processing}
            onClick={handleCheckout}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all transform active:scale-95
              ${cart.length === 0 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500'
              }`}
          >
            {processing ? <><Loader2 className="animate-spin" /> Đang xử lý...</> : "THANH TOÁN NGAY"}
          </button>
        </div>
      </div>
    </div>
  );
}