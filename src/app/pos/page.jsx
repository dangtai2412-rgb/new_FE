"use client";

import React, { useState, useEffect } from "react";
import { api_service } from "@/lib/api_service";
import { Search, Trash2, ShoppingCart, Plus, Minus, Loader2, Star, Tag, Users, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// --- 1. DỮ LIỆU KHÁCH HÀNG MẪU ---
const DEMO_CUSTOMERS = [
  { id: 0, name: "Khách lẻ (Không lưu)", phone: "" },
  { id: 1, name: "Nguyễn Văn A (Thầu xây dựng)", phone: "0909123456", debt: 5000000 },
  { id: 2, name: "Công ty XD Hưng Thịnh", phone: "0918888999", debt: 12500000 },
  { id: 3, name: "Chị Lan (Chủ nhà KDC 5)", phone: "0987654321", debt: 0 },
];

// --- 2. DỮ LIỆU SẢN PHẨM PHONG PHÚ TOÀN CẦU ---
const DEMO_PRODUCTS = [
  // --- A. XÂY DỰNG THÔ (Thép, Xi măng, Gạch) ---
  { id: 101, name: "Xi măng Holcim Đa Dụng (Thụy Sĩ)", price: 89000, category: "thô", origin: "🇨🇭 Thụy Sĩ", image: "🏗️" },
  { id: 102, name: "Xi măng Lafarge Power (Pháp)", price: 92000, category: "thô", origin: "🇫🇷 Pháp", image: "🏗️" },
  { id: 103, name: "Thép thanh vằn Nippon Steel D10 (Nhật Bản)", price: 125000, category: "thô", origin: "🇯🇵 Nhật Bản", image: "⛓️" },
  { id: 104, name: "Thép cuộn POSCO (Hàn Quốc)", price: 18500, category: "thô", origin: "🇰🇷 Hàn Quốc", image: "⛓️" },
  { id: 105, name: "Gạch đỏ Tuynel Bình Dương (Viên)", price: 1200, category: "thô", origin: "🇻🇳 Việt Nam", image: "🧱" },
  { id: 106, name: "Bê tông khí chưng áp AAC (Viên)", price: 15000, category: "thô", origin: "🇦🇺 Úc", image: "🧱" },
  { id: 107, name: "Cát vàng bê tông hạt lớn (m³)", price: 450000, category: "thô", origin: "🇻🇳 Việt Nam", image: "⏳" },

  // --- B. HOÀN THIỆN (Sơn, Gạch men, Keo) ---
  { id: 201, name: "Sơn Dulux Ambiance 5in1 (18L)", price: 2150000, category: "hoanthien", origin: "🇳🇱 Hà Lan", image: "🎨" },
  { id: 202, name: "Sơn Jotun Jotashield Bền Màu (15L)", price: 1850000, category: "hoanthien", origin: "🇳🇴 Na Uy", image: "🎨" },
  { id: 203, name: "Gạch lát nền Eurotile 60x60 (m²)", price: 320000, category: "hoanthien", origin: "🇮🇹 Ý", image: "⬜" },
  { id: 204, name: "Gạch men Tây Ban Nha Porcelanosa (m²)", price: 850000, category: "hoanthien", origin: "🇪🇸 TBN", image: "⬜" },
  { id: 205, name: "Keo dán gạch Weber.tai Fix (Bao 25kg)", price: 350000, category: "hoanthien", origin: "🇫🇷 Pháp", image: "🧪" },
  { id: 206, name: "Sàn gỗ công nghiệp KronoSwiss (m²)", price: 450000, category: "hoanthien", origin: "🇨🇭 Thụy Sĩ", image: "🪵" },

  // --- C. ĐIỆN & NƯỚC (Thiết bị, Ống) ---
  { id: 301, name: "Dây điện Cadivi 2.5mm (Cuộn 100m)", price: 680000, category: "diennuoc", origin: "🇻🇳 Việt Nam", image: "⚡" },
  { id: 302, name: "CB Chống giật Panasonic 32A", price: 125000, category: "diennuoc", origin: "🇯🇵 Nhật Bản", image: "🔌" },
  { id: 303, name: "Công tắc thông minh Schneider (Bộ)", price: 450000, category: "diennuoc", origin: "🇫🇷 Pháp", image: "💡" },
  { id: 304, name: "Ống nước PPR Tiền Phong Ø25 (Cây)", price: 42000, category: "diennuoc", origin: "🇻🇳 Việt Nam", image: "🚿" },
  { id: 305, name: "Máy bơm nước Panasonic 200W", price: 1450000, category: "diennuoc", origin: "🇯🇵 Nhật Bản", image: "💧" },

  // --- D. DỤNG CỤ & MÁY MÓC (Tools) ---
  { id: 401, name: "Máy khoan bê tông Bosch GSB 550", price: 1250000, category: "dungcu", origin: "🇩🇪 Đức", image: "🛠️" },
  { id: 402, name: "Máy mài góc Makita 9553NB", price: 950000, category: "dungcu", origin: "🇯🇵 Nhật Bản", image: "⚙️" },
  { id: 403, name: "Máy bắn vít Dewalt 18V Brushless", price: 3200000, category: "dungcu", origin: "🇺🇸 Mỹ", image: "🔫" },
  { id: 404, name: "Thước cuộn Tajima 5m (Xịn)", price: 180000, category: "dungcu", origin: "🇯🇵 Nhật Bản", image: "📏" },
  { id: 405, name: "Bay xây gạch Stanley (Cái)", price: 45000, category: "dungcu", origin: "🇺🇸 Mỹ", image: "🥄" },
];

const CATEGORIES = [
  { id: "all", name: "Tất cả", icon: "🏢" },
  { id: "thô", name: "Xây dựng thô", icon: "🏗️" },
  { id: "hoanthien", name: "Hoàn thiện", icon: "🎨" },
  { id: "diennuoc", name: "Điện - Nước", icon: "⚡" },
  { id: "dungcu", name: "Máy & Dụng cụ", icon: "🛠️" },
];

export default function PosPage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState(0); // Mặc định khách lẻ
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

  // Logic lọc sản phẩm: Theo Tìm kiếm AND Theo Danh mục
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
        alert(`✅ Đã thanh toán thành công!\n👤 Khách hàng: ${DEMO_CUSTOMERS.find(c=>c.id == selectedCustomer)?.name}\n💰 Tổng tiền: ${totalAmount.toLocaleString()}đ`);
        setCart([]);
        setProcessing(false);
      }, 1000); // Giả lập độ trễ mạng
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
      {/* CỘT TRÁI: SẢN PHẨM */}
      <div className="flex-1 flex flex-col p-4 overflow-hidden gap-4">
        
        {/* 1. Header: Tìm kiếm & Bộ lọc */}
        <div className="flex flex-col gap-4">
          {/* Thanh tìm kiếm */}
          <div className="relative shadow-sm group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input 
              type="text"
              placeholder="Tìm tên sản phẩm, thương hiệu (Bosch, Dulux), hoặc quốc gia (Nhật, Đức)..."
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-lg transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Tabs Danh mục (Nút bấm chọn loại) */}
          <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all border
                  ${selectedCategory === cat.id 
                    ? "bg-blue-600 text-white border-blue-600 shadow-md transform scale-105" 
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"}`}
              >
                <span>{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Lưới sản phẩm (Grid) */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {loading ? (
            <div className="flex flex-col justify-center items-center h-full text-slate-400">
              <Loader2 className="animate-spin mb-2" size={40} />
              <p>Đang tải dữ liệu kho...</p>
            </div>
          ) : (
            <>
              {filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                  <Filter size={48} className="mb-2 opacity-50" />
                  <p>Không tìm thấy sản phẩm nào</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pb-20">
                  {filteredProducts.map((product) => (
                    <Card 
                      key={product.id}
                      onClick={() => addToCart(product)}
                      className="cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all group border-slate-200 overflow-hidden relative"
                    >
                      <CardContent className="p-3 flex flex-col h-full">
                        {/* Nhãn xuất xứ (Badge) */}
                        {product.origin && (
                          <span className="absolute top-2 right-2 text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded-full font-bold border border-slate-200 z-10">
                            {product.origin}
                          </span>
                        )}

                        <div className="h-28 bg-slate-50 rounded-lg mb-3 flex items-center justify-center text-5xl group-hover:scale-110 transition-transform duration-300">
                          {product.image || "📦"}
                        </div>
                        
                        <h3 className="font-semibold text-slate-700 line-clamp-2 text-sm mb-auto leading-snug">
                          {product.name}
                        </h3>
                        
                        <div className="mt-3 flex justify-between items-center">
                          <span className="text-blue-700 font-bold text-base">
                            {product.price?.toLocaleString('vi-VN')}
                          </span>
                          <div className="h-8 w-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-sm">
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

      {/* CỘT PHẢI: HÓA ĐƠN & KHÁCH HÀNG */}
      <div className="w-96 bg-white border-l border-slate-200 flex flex-col h-full shadow-2xl z-20">
        {/* Header Giỏ hàng */}
        <div className="p-5 border-b border-slate-100 bg-slate-50">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-xl flex items-center gap-2 text-slate-800">
              <ShoppingCart className="text-blue-600" size={24} />
              Đơn hàng
            </h2>
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
              {cart.reduce((a, b) => a + b.quantity, 0)} món
            </span>
          </div>

          {/* Chọn Khách hàng (Quan trọng cho công nợ) */}
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <select 
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm font-medium focus:outline-none focus:border-blue-500 bg-white appearance-none cursor-pointer hover:border-blue-300 transition-colors"
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(parseInt(e.target.value))}
            >
              {DEMO_CUSTOMERS.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.debt ? `(Nợ: ${c.debt.toLocaleString('vi-VN')}đ)` : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Danh sách món đã chọn */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-4 opacity-70">
              <ShoppingCart size={64} strokeWidth={1} />
              <p className="font-medium text-sm">Chưa có sản phẩm nào</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-3 bg-white p-3 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all group animate-in slide-in-from-bottom-2 duration-300">
                <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center text-lg shrink-0">
                  {item.image || "📦"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-slate-700 text-sm truncate">{item.name}</div>
                  <div className="text-slate-500 text-xs mt-0.5">
                    {item.price.toLocaleString()} x {item.quantity}
                  </div>
                  <div className="text-blue-600 font-bold text-sm mt-1">
                    {(item.price * item.quantity).toLocaleString()}đ
                  </div>
                </div>
                
                <div className="flex flex-col items-end justify-between">
                  <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-red-500 p-1 transition-colors">
                    <Trash2 size={14} />
                  </button>
                  <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
                    <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-white rounded-md text-slate-600 transition-colors shadow-sm">
                      <Minus size={12} />
                    </button>
                    <span className="w-6 text-center text-xs font-bold select-none">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-white rounded-md text-blue-600 transition-colors shadow-sm">
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Thanh toán */}
        <div className="p-5 border-t border-slate-200 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="space-y-2 mb-4 text-sm">
            <div className="flex justify-between text-slate-500">
              <span>Tạm tính</span>
              <span>{totalAmount.toLocaleString()}đ</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Thuế (VAT 0%)</span>
              <span>0đ</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-dashed border-slate-200">
              <span className="font-bold text-slate-800">Tổng thanh toán</span>
              <span className="text-2xl font-bold text-blue-600">
                {totalAmount.toLocaleString()}đ
              </span>
            </div>
          </div>
          
          <button
            disabled={cart.length === 0 || processing}
            onClick={handleCheckout}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all transform active:scale-95
              ${cart.length === 0 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-blue-500/30 hover:from-blue-500 hover:to-indigo-500'
              }`}
          >
            {processing ? <><Loader2 className="animate-spin" /> Đang tạo đơn...</> : "THANH TOÁN"}
          </button>
        </div>
      </div>
    </div>
  );
}