"use client";

import React, { useState, useEffect } from "react";
import { api_service } from "@/lib/api_service";
import { Search, Trash2, ShoppingCart, Plus, Minus, Loader2 } from "lucide-react";

export default function PosPage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [processing, setProcessing] = useState(false);

  // 1. Lấy danh sách sản phẩm
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await api_service.get_products();
      // Backend trả về mảng, nếu lỗi thì fallback về mảng rỗng
      setProducts(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // 2. Thêm vào giỏ hàng
  const addToCart = (product) => {
    setCart((prevCart) => {
      // Backend trả về 'id', nên phải tìm theo 'id'
      const existingItem = prevCart.find((item) => item.id === product.id);
      
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  // 3. Xóa hoặc điều chỉnh số lượng
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

  // 4. Tính tổng tiền (Dùng trường 'price' từ backend)
  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // 5. Tìm kiếm (Sửa lỗi quan trọng: dùng trường 'name')
  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 6. Thanh toán
  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setProcessing(true);

    const orderData = {
      order_details: cart.map(item => ({
        product_id: item.id, // Backend cần product_id, map từ item.id
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
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {/* CỘT TRÁI: SẢN PHẨM */}
      <div className="flex-1 flex flex-col p-4 overflow-hidden">
        {/* Ô tìm kiếm */}
        <div className="mb-4 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text"
              placeholder="Gõ tên sản phẩm để tìm (Ví dụ: Xi măng)..."
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Danh sách sản phẩm */}
        <div className="flex-1 overflow-y-auto pr-2">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="animate-spin text-blue-500" size={32} />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.length === 0 ? (
                <div className="col-span-full text-center text-slate-500 mt-10">
                  Không tìm thấy sản phẩm nào khớp với "{searchTerm}"
                </div>
              ) : (
                filteredProducts.map((product) => (
                  <div 
                    key={product.id} // Dùng id
                    onClick={() => addToCart(product)}
                    className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 cursor-pointer hover:shadow-md hover:border-blue-400 transition-all active:scale-95 group"
                  >
                    <div className="h-24 bg-slate-100 rounded-lg mb-3 flex items-center justify-center text-slate-400">
                      <span className="text-xl font-bold text-slate-300">IMG</span>
                    </div>
                    {/* Dùng name thay vì product_name */}
                    <h3 className="font-semibold text-slate-700 line-clamp-2 min-h-[3rem] text-sm">
                      {product.name} 
                    </h3>
                    <div className="flex justify-between items-end mt-2">
                      {/* Dùng price thay vì selling_price */}
                      <span className="text-blue-600 font-bold">
                        {product.price?.toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* CỘT PHẢI: GIỎ HÀNG */}
      <div className="w-96 bg-white border-l border-slate-200 flex flex-col h-full shadow-xl">
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <h2 className="font-bold text-lg flex items-center gap-2 text-slate-700">
            <ShoppingCart size={20} />
            Giỏ hàng ({cart.reduce((a, b) => a + b.quantity, 0)})
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="text-center text-slate-400 mt-10 flex flex-col items-center">
              <ShoppingCart size={48} className="mb-2 opacity-20" />
              <p>Chưa có sản phẩm nào</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div className="flex-1">
                  {/* Sửa lại hiển thị dùng name và price */}
                  <div className="font-medium text-sm text-slate-700">{item.name}</div>
                  <div className="text-blue-600 font-semibold text-sm mt-1">
                    {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600">
                    <Trash2 size={16} />
                  </button>
                  <div className="flex items-center bg-white rounded border border-slate-200">
                    <button onClick={(e) => { e.stopPropagation(); updateQuantity(item.id, -1); }} className="p-1 hover:bg-slate-100 text-slate-600">
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button onClick={(e) => { e.stopPropagation(); updateQuantity(item.id, 1); }} className="p-1 hover:bg-slate-100 text-slate-600">
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-slate-100 bg-white">
          <div className="flex justify-between items-center mb-4">
            <span className="text-slate-500">Tổng tiền hàng:</span>
            <span className="text-xl font-bold text-blue-700">
              {totalAmount.toLocaleString('vi-VN')}đ
            </span>
          </div>
          
          <button
            disabled={cart.length === 0 || processing}
            onClick={handleCheckout}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all
              ${cart.length === 0 ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
          >
            {processing ? <><Loader2 className="animate-spin" /> Đang xử lý...</> : "THANH TOÁN"}
          </button>
        </div>
      </div>
    </div>
  );
}