"use client";

import React, { useState, useEffect } from "react";
import { api_service } from "@/lib/api_service";
import { Search, Trash2, ShoppingCart, Plus, Minus, Loader2, Star, Tag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// --- DỮ LIỆU MẪU ĐA DẠNG (Bao gồm các hãng Xi măng nổi tiếng thế giới & VN) ---
const DEMO_PRODUCTS = [
  // 1. Nhóm Xi măng (Các thương hiệu lớn)
  { id: 101, name: "Xi măng Holcim Đa Dụng (Bao 50kg)", price: 89000, image: "🏗️" }, // Thụy Sĩ
  { id: 102, name: "Xi măng Lafarge Power (Bao 50kg)", price: 92000, image: "🏗️" }, // Pháp
  { id: 103, name: "Xi măng Cemex Ruby (Bao 50kg)", price: 88000, image: "🏗️" }, // Mexico
  { id: 104, name: "Xi măng Heidelberg (Bao 50kg)", price: 95000, image: "🏗️" }, // Đức
  { id: 105, name: "Xi măng Vicem Hà Tiên 1 (Bao 50kg)", price: 86000, image: "🏗️" }, // Việt Nam
  { id: 106, name: "Xi măng Nghi Sơn PCB40 (Bao 50kg)", price: 84000, image: "🏗️" }, // Liên doanh Nhật
  { id: 107, name: "Xi măng Trắng SCG (Bao 40kg)", price: 180000, image: "✨" }, // Thái Lan

  // 2. Nhóm Sắt Thép
  { id: 201, name: "Thép cuộn Pomina Ø6 (Kg)", price: 18500, image: "⛓️" },
  { id: 202, name: "Thép thanh vằn Hòa Phát D10 (Cây 11.7m)", price: 115000, image: "⛓️" },
  { id: 203, name: "Thép Việt Nhật Vinakyoei D16 (Cây)", price: 290000, image: "⛓️" },

  // 3. Nhóm Gạch - Cát - Đá
  { id: 301, name: "Gạch ống 4 lỗ Tuynel (Viên)", price: 1200, image: "🧱" },
  { id: 302, name: "Gạch Block không nung (Viên)", price: 1600, image: "🧱" },
  { id: 303, name: "Cát vàng bê tông hạt lớn (Khối)", price: 450000, image: "⏳" },
  { id: 304, name: "Cát xây tô (Khối)", price: 350000, image: "⏳" },
  { id: 305, name: "Đá 1x2 xanh Biên Hòa (Khối)", price: 420000, image: "🪨" },

  // 4. Nhóm Sơn & Chống thấm
  { id: 401, name: "Sơn Dulux Inspire Nội Thất (Thùng 18L)", price: 1450000, image: "🎨" },
  { id: 402, name: "Sơn Jotun Jotashield Ngoại Thất (Lon 5L)", price: 650000, image: "🎨" },
  { id: 403, name: "Sơn Kova Chống Thấm CT-11A (Thùng 20kg)", price: 1950000, image: "💧" },
  
  // 5. Điện nước
  { id: 501, name: "Ống nhựa Bình Minh PVC Ø27 (Cây 4m)", price: 32000, image: "🚿" },
  { id: 502, name: "Dây điện Cadivi 2.5 (Cuộn 100m)", price: 680000, image: "⚡" },
];

export default function PosPage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
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

  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Lấy 4 sản phẩm đầu tiên làm gợi ý (Ưu tiên Xi măng)
  const suggestedProducts = products.slice(0, 4);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setProcessing(true);

    if (useDemoData) {
      alert("Đang dùng dữ liệu mẫu (Demo), không thể thanh toán thật! Vui lòng kết nối Backend để tạo đơn.");
      setProcessing(false);
      return;
    }

    const orderData = {
      order_details: cart.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price
      })),
      total_amount: totalAmount,
      customer_id: null 
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
        
        {/* 1. Thanh tìm kiếm */}
        <div className="relative shadow-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text"
            placeholder="Tìm kiếm: Holcim, Hà Tiên, thép, sơn..."
            className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* 2. Khu vực chính (Cuộn được) */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
          
          {/* MỤC ĐỀ XUẤT */}
          {searchTerm === "" && (
            <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
              <h2 className="text-lg font-bold text-blue-800 mb-3 flex items-center gap-2">
                <Star className="text-yellow-500 fill-yellow-500" size={20} />
                Sản phẩm bán chạy
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {suggestedProducts.map((product) => (
                  <div 
                    key={`suggest-${product.id}`}
                    onClick={() => addToCart(product)}
                    className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm cursor-pointer hover:shadow-md transition-all flex items-center gap-3 group"
                  >
                    <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center text-xl">
                      {product.image || "📦"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-slate-700 truncate text-sm">{product.name}</div>
                      <div className="text-blue-600 font-bold text-xs">
                        {product.price?.toLocaleString('vi-VN')}đ
                      </div>
                    </div>
                    <Plus size={16} className="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MỤC DANH SÁCH TẤT CẢ */}
          <div>
            <h2 className="text-lg font-bold text-slate-700 mb-3 flex items-center gap-2">
              <Tag size={20} className="text-slate-500" />
              Kho hàng ({filteredProducts.length} sản phẩm)
            </h2>
            
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="animate-spin text-blue-500" size={32} />
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map((product) => (
                  <Card 
                    key={product.id}
                    onClick={() => addToCart(product)}
                    className="cursor-pointer hover:shadow-lg hover:border-blue-500 transition-all group overflow-hidden border-slate-200"
                  >
                    <CardContent className="p-4">
                      <div className="h-32 bg-slate-100 rounded-lg mb-3 flex items-center justify-center text-5xl group-hover:scale-105 transition-transform duration-300 select-none">
                        {product.image || "🏗️"}
                      </div>
                      <h3 className="font-semibold text-slate-700 line-clamp-2 min-h-[2.5rem] leading-tight mb-2 text-sm">
                        {product.name}
                      </h3>
                      <div className="flex justify-between items-end">
                        <span className="text-red-600 font-bold text-lg">
                          {product.price?.toLocaleString('vi-VN')}
                          <span className="text-xs font-normal text-slate-500 ml-0.5">đ</span>
                        </span>
                        <div className="bg-blue-600 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 shadow-md">
                          <Plus size={16} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CỘT PHẢI: GIỎ HÀNG */}
      <div className="w-96 bg-white border-l border-slate-200 flex flex-col h-full shadow-2xl z-10">
        <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <h2 className="font-bold text-xl flex items-center gap-2 text-slate-800">
            <ShoppingCart className="text-blue-600" size={24} />
            Đơn hàng
          </h2>
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
            {cart.reduce((a, b) => a + b.quantity, 0)} món
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-4">
              <ShoppingCart size={64} strokeWidth={1} />
              <p className="font-medium">Giỏ hàng đang trống</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-3 bg-white p-3 rounded-xl border border-slate-100 shadow-sm hover:border-blue-200 transition-colors group">
                <div className="h-12 w-12 bg-slate-50 rounded-lg flex items-center justify-center text-lg select-none">
                  {item.image || "📦"}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-slate-700 text-sm line-clamp-1">{item.name}</div>
                  <div className="text-blue-600 font-bold text-sm mt-1">
                    {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
                    <button onClick={(e) => { e.stopPropagation(); updateQuantity(item.id, -1); }} className="p-1.5 hover:bg-slate-200 text-slate-600">
                      <Minus size={12} />
                    </button>
                    <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                    <button onClick={(e) => { e.stopPropagation(); updateQuantity(item.id, 1); }} className="p-1.5 hover:bg-slate-200 text-slate-600">
                      <Plus size={12} />
                    </button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-300 hover:text-red-500 p-1">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-5 border-t border-slate-100 bg-slate-50">
          <div className="flex justify-between items-center mb-4">
            <span className="text-slate-500 font-medium">Tổng thanh toán:</span>
            <span className="text-2xl font-bold text-blue-700">
              {totalAmount.toLocaleString('vi-VN')}đ
            </span>
          </div>
          
          <button
            disabled={cart.length === 0 || processing}
            onClick={handleCheckout}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all transform active:scale-95
              ${cart.length === 0 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:shadow-blue-500/30'
              }`}
          >
            {processing ? <><Loader2 className="animate-spin" /> Đang xử lý...</> : "THANH TOÁN NGAY"}
          </button>
        </div>
      </div>
    </div>
  );
}