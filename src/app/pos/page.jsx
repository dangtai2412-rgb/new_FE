"use client";

// =====================================================
// POS PAGE (PHIÊN BẢN CHI TIẾT + SẠCH LỖI + DỄ MỞ RỘNG)
// =====================================================

import React, { useState, useEffect, useMemo } from "react";
import { api_service } from "@/lib/api_service";

import {
  Search,
  Trash2,
  ShoppingCart,
  Plus,
  Minus,
  Loader2,
  Users,
  Filter
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

// =====================================================
// 1. DỮ LIỆU MẪU KHÁCH HÀNG
// =====================================================

const DEMO_CUSTOMERS = [
  { id: 0, name: "Khách lẻ (Không lưu)", phone: "" },
  { id: 1, name: "Nguyễn Văn A (Thầu xây dựng)", phone: "0909123456", debt: 5000000 },
  { id: 2, name: "Công ty XD Hưng Thịnh", phone: "0918888999", debt: 12500000 },
  { id: 3, name: "Chị Lan (Chủ nhà KDC 5)", phone: "0987654321", debt: 0 }
];

// =====================================================
// 2. DỮ LIỆU MẪU SẢN PHẨM
// =====================================================

const DEMO_PRODUCTS = [
  { id: 101, name: "Xi măng Holcim Đa Dụng", price: 89000, category: "tho", origin: "Thụy Sĩ", image: "🏗️" },
  { id: 102, name: "Thép Nippon D10", price: 125000, category: "tho", origin: "Nhật Bản", image: "⛓️" },
  { id: 201, name: "Sơn Dulux 18L", price: 2150000, category: "hoanthien", origin: "Hà Lan", image: "🎨" },
  { id: 301, name: "Dây điện Cadivi 100m", price: 680000, category: "diennuoc", origin: "Việt Nam", image: "⚡" },
  { id: 401, name: "Máy khoan Bosch", price: 1250000, category: "dungcu", origin: "Đức", image: "🛠️" }
];

// =====================================================
// 3. DANH MỤC SẢN PHẨM
// =====================================================

const CATEGORIES = [
  { id: "all", name: "Tất cả", icon: "🏢" },
  { id: "tho", name: "Xây dựng thô", icon: "🏗️" },
  { id: "hoanthien", name: "Hoàn thiện", icon: "🎨" },
  { id: "diennuoc", name: "Điện - Nước", icon: "⚡" },
  { id: "dungcu", name: "Dụng cụ", icon: "🛠️" }
];

// =====================================================
// 4. COMPONENT CHÍNH
// =====================================================

export default function PosPage() {

  // ------------------ STATE ------------------

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState(0);

  const [useDemoData, setUseDemoData] = useState(false);

  // ------------------ LOAD DATA ------------------

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);

    try {
      const response = await api_service.get_products();

      if (Array.isArray(response) && response.length > 0) {
        setProducts(response);
        setUseDemoData(false);
      } else {
        setProducts(DEMO_PRODUCTS);
        setUseDemoData(true);
      }
    } catch (error) {
      console.error("API lỗi, dùng dữ liệu mẫu", error);
      setProducts(DEMO_PRODUCTS);
      setUseDemoData(true);
    } finally {
      setLoading(false);
    }
  };

  // ------------------ CART LOGIC ------------------

  const addToCart = (product) => {
    setCart(prev => {
      const found = prev.find(i => i.id === product.id);

      if (found) {
        return prev.map(i =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const changeQty = (id, delta) => {
    setCart(prev =>
      prev.map(i => {
        if (i.id !== id) return i;

        const newQty = i.quantity + delta;
        return newQty > 0 ? { ...i, quantity: newQty } : i;
      })
    );
  };

  // ------------------ TOTAL ------------------

  const totalAmount = useMemo(() => {
    return cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  }, [cart]);

  // ------------------ FILTER ------------------

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchName = p.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchOrigin = p.origin?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchSearch = matchName || matchOrigin;
      const matchCategory = selectedCategory === "all" || p.category === selectedCategory;

      return matchSearch && matchCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  // ------------------ CHECKOUT ------------------

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    setProcessing(true);

    if (useDemoData) {
      setTimeout(() => {
        alert(`Thanh toán thành công! Tổng: ${totalAmount.toLocaleString()}đ`);
        setCart([]);
        setProcessing(false);
      }, 1000);

      return;
    }

    const orderPayload = {
      customer_id: selectedCustomer === 0 ? null : selectedCustomer,
      total_amount: totalAmount,
      order_details: cart.map(i => ({
        product_id: i.id,
        quantity: i.quantity,
        unit_price: i.price
      }))
    };

    try {
      const res = await api_service.create_order(orderPayload);

      if (!res?.error) {
        alert("Tạo đơn thành công!");
        setCart([]);
      } else {
        alert("Lỗi: " + res.error);
      }

    } catch (e) {
      alert("Không kết nối được server");
    } finally {
      setProcessing(false);
    }
  };

  // =====================================================
  // ===================== UI ============================
  // =====================================================

  return (
    <div className="flex h-screen bg-slate-50">

      {/* ================= LEFT : PRODUCT LIST ================= */}

      <div className="flex-1 p-4 flex flex-col gap-4 overflow-hidden">

        {/* SEARCH */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="w-full pl-12 pr-4 py-3 rounded-xl border focus:ring-2"
            placeholder="Tìm sản phẩm, quốc gia..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        {/* CATEGORY */}
        <div className="flex gap-2 overflow-x-auto">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full border transition ${
                selectedCategory === cat.id
                  ? "bg-blue-600 text-white"
                  : "bg-white"
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* PRODUCT GRID */}
        <div className="flex-1 overflow-y-auto">

          {loading ? (
            <div className="h-full flex items-center justify-center">
              <Loader2 className="animate-spin" size={40} />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <Filter size={40} />
              Không có sản phẩm
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

              {filteredProducts.map(p => (
                <Card
                  key={p.id}
                  onClick={() => addToCart(p)}
                  className="cursor-pointer hover:shadow-xl transition"
                >
                  <CardContent className="p-3 flex flex-col gap-2">

                    <div className="h-24 flex items-center justify-center text-4xl bg-slate-100 rounded-lg">
                      {p.image}
                    </div>

                    <div className="font-semibold text-sm line-clamp-2">
                      {p.name}
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-blue-600 font-bold">
                        {p.price.toLocaleString()}đ
                      </span>
                      <Plus size={16} />
                    </div>

                  </CardContent>
                </Card>
              ))}

            </div>
          )}

        </div>

      </div>

      {/* ================= RIGHT : CART ================= */}

      <div className="w-96 bg-white border-l flex flex-col">

        {/* HEADER */}
        <div className="p-4 border-b">
          <h2 className="flex items-center gap-2 font-bold text-lg">
            <ShoppingCart /> Đơn hàng
          </h2>

          <select
            className="mt-3 w-full border p-2 rounded"
            value={selectedCustomer}
            onChange={e => setSelectedCustomer(Number(e.target.value))}
          >
            {DEMO_CUSTOMERS.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* CART LIST */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-50">

          {cart.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-slate-300">
              <ShoppingCart size={60} />
              Chưa có sản phẩm
            </div>
          )}

          {cart.map(item => (
            <div key={item.id} className="bg-white p-3 rounded-xl flex gap-3 shadow">

              <div className="h-12 w-12 bg-blue-50 rounded flex items-center justify-center">
                {item.image}
              </div>

              <div className="flex-1">
                <div className="font-medium text-sm">{item.name}</div>
                <div className="text-xs text-slate-500">{item.price.toLocaleString()}đ</div>
                <div className="text-blue-600 font-bold">
                  {(item.price * item.quantity).toLocaleString()}đ
                </div>
              </div>

              <div className="flex flex-col items-end">

                <button onClick={() => removeFromCart(item.id)}>
                  <Trash2 size={14} className="text-red-400" />
                </button>

                <div className="flex items-center border rounded mt-2">
                  <button onClick={() => changeQty(item.id, -1)} className="px-2">-</button>
                  <span className="px-2 text-sm">{item.quantity}</span>
                  <button onClick={() => changeQty(item.id, 1)} className="px-2">+</button>
                </div>

              </div>

            </div>
          ))}

        </div>

        {/* FOOTER */}
        <div className="p-4 border-t space-y-3">

          <div className="flex justify-between font-bold text-lg">
            <span>Tổng:</span>
            <span className="text-blue-600">{totalAmount.toLocaleString()}đ</span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={processing || cart.length === 0}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold disabled:bg-slate-300"
          >
            {processing ? "Đang xử lý..." : "THANH TOÁN"}
          </button>

        </div>

      </div>

    </div>
  );
}
