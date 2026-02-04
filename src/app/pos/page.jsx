"use client";
import { INITIAL_PRODUCTS } from "@/lib/mock_data";
import React, { useState, useEffect } from "react";
import { api_service } from "@/lib/api_service";
import { 
  Search, Trash2, ShoppingCart, Plus, Minus, Loader2, 
  LayoutGrid, Hammer, Droplets, Zap, Bath, Layers, Key, 
  Mic, Phone, Store, User, CreditCard, FileText, PackageOpen,
  AlertCircle, Tag, CheckCircle2
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// --- 1. DANH SÁCH KHÁCH HÀNG ---
const DEMO_CUSTOMERS = [
  { id: 0, name: "Khách lẻ (Vãng lai)", phone: "", type: "guest" },
  { id: 1, name: "Anh Hùng (Thầu Xây Dựng)", phone: "0909123456", debt: 15500000, type: "vip" },
  { id: 2, name: "Cty XD Kiến Vàng", phone: "0918888999", debt: 82000000, type: "company" },
  { id: 3, name: "Cô Ba (Chủ trọ KDC 5)", phone: "0987654321", debt: 0, type: "regular" },
  { id: 4, name: "Chú Tư (Thợ điện nước)", phone: "0909888777", debt: 2500000, type: "regular" },
];

const categories = [
  { id: "all", name: "Tất cả", icon: LayoutGrid },
  { id: "thô", name: "Vật liệu thô", icon: Layers },
  { id: "sắt", name: "Sắt thép", icon: Hammer },
  { id: "nước", name: "Sơn nước", icon: Droplets },
  { id: "điện", name: "Thiết bị điện", icon: Zap },
  { id: "nước_tb", name: "Ngành nước", icon: Bath },
];

const formatMoney = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

export default function POSOwnerPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState(DEMO_CUSTOMERS[0]);
  const [discount, setDiscount] = useState(0); 
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const localData = localStorage.getItem("bizflow_products");
        if (localData) {
          setProducts(JSON.parse(localData));
          setLoading(false);
          return;
        }
        const data = await api_service.get_products();
        if (data && data.length > 0) {
           const mappedData = data.map(item => ({
            id: item.product_id || item.id,
            name: item.product_name || item.name,
            price: item.selling_price || item.price || 0,
            stock: item.stock_quantity || item.stock || 0,
            unit: item.unit || "Cái",
            category: item.category || "general",
            image: "📦" 
          }));
          setProducts(mappedData);
        } else {
          setProducts(INITIAL_PRODUCTS); 
        }
      } catch (error) {
        console.error("POS Load Error", error);
        setProducts(INITIAL_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      if(existing.quantity >= product.stock) {
        alert("Đã hết hàng trong kho!");
        return;
      }
      setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      if(product.stock <= 0) {
        alert("Sản phẩm này đã hết hàng!");
        return;
      }
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, change) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + change;
        if (newQty > item.stock) return item; 
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const subTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const vatAmount = subTotal * 0.08; 
  const finalAmount = Math.max(0, subTotal + vatAmount - discount);

  // --- CẬP NHẬT: LƯU LỊCH SỬ ĐƠN HÀNG ĐỂ DASHBOARD ĐỌC ---
  const handleCheckout = (type) => {
    setProcessing(true);
    
    // Tạo object đơn hàng
    const newOrder = {
        id: `OD-${Date.now()}`,
        date: new Date().toISOString(), // Lưu thời gian thực
        customer: selectedCustomer.name,
        total: finalAmount,
        items: cart, // Lưu chi tiết sản phẩm để tính Top Bán Chạy
        paymentMethod: type
    };

    setTimeout(() => {
      // 1. Lưu vào LocalStorage (Giả lập Database)
      const currentHistory = JSON.parse(localStorage.getItem("bizflow_orders") || "[]");
      // Thêm vào đầu danh sách
      localStorage.setItem("bizflow_orders", JSON.stringify([newOrder, ...currentHistory]));

      // 2. Trừ tồn kho (Giả lập)
      const updatedProducts = products.map(p => {
          const inCart = cart.find(c => c.id === p.id);
          if (inCart) return { ...p, stock: p.stock - inCart.quantity };
          return p;
      });
      setProducts(updatedProducts);
      localStorage.setItem("bizflow_products", JSON.stringify(updatedProducts)); // Đồng bộ Inventory

      if (type === 'debt') {
        alert(`Đã ghi nợ thành công!`);
      } else {
        alert(`Thanh toán thành công!`);
      }
      
      setCart([]);
      setDiscount(0);
      setProcessing(false);
      setSelectedCustomer(DEMO_CUSTOMERS[0]); 
    }, 800);
  };

  const filteredProducts = products.filter(p => {
    const matchName = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = activeCategory === 'all' || 
                     (p.category && p.category.toLowerCase().includes(activeCategory)) ||
                     (p.name && p.name.toLowerCase().includes(activeCategory));
    return matchName && matchCat;
  });

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={40}/></div>;

  return (
    <div className="flex h-screen bg-slate-100 font-sans overflow-hidden">
      {/* GIỮ NGUYÊN PHẦN GIAO DIỆN CỦA CẬU Ở ĐÂY */}
      {/* ... (Copy y nguyên phần return UI cũ vào đây, chỉ thay đổi logic handleCheckout ở trên thôi) ... */}
      
      {/* Để tiết kiệm không gian tớ viết tắt phần UI, cậu giữ nguyên UI cũ nhé, chỉ copy đè hàm handleCheckout là được */}
      <div className="flex-1 flex flex-col h-full border-r border-slate-200">
        <div className="p-4 bg-white shadow-sm z-10 space-y-4">
           {/* ... Header & Filter ... */}
           <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Store className="text-blue-600"/> Bán Hàng (Owner Mode)
              </h1>
            </div>
            <div className="relative w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input 
                className="pl-10 rounded-full border-slate-200 bg-slate-50 focus:bg-white transition-all" 
                placeholder="Tìm tên hàng..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
           {/* Categories */}
           <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border ${
                  activeCategory === cat.id
                    ? "bg-blue-600 text-white border-blue-600 shadow-md transform scale-105"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <cat.icon size={16} /> {cat.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Product List */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 pb-20">
            {filteredProducts.map((product) => (
              <div key={product.id} onClick={() => addToCart(product)} className="group bg-white rounded-xl border border-slate-100 p-3 shadow-sm hover:shadow-lg hover:border-blue-400 cursor-pointer transition-all duration-200 relative flex flex-col h-[220px]">
                <div className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full border ${product.stock < 10 ? "bg-red-50 text-red-600 border-red-100" : "bg-green-50 text-green-600 border-green-100"}`}>Tồn: {product.stock}</div>
                <div className="flex-1 flex items-center justify-center bg-slate-50 rounded-lg mb-2 group-hover:bg-blue-50 transition-colors">
                  <div className="text-5xl">{product.image || "📦"}</div>
                </div>
                <div className="mt-auto">
                  <h3 className="font-semibold text-slate-700 text-sm line-clamp-2 h-[40px]">{product.name}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex flex-col"><span className="text-[10px] text-slate-400">Đơn giá</span><span className="font-bold text-blue-700">{product.price.toLocaleString()}</span></div>
                    <button className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm"><Plus size={16} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-[420px] flex flex-col bg-white shadow-2xl h-full z-20">
         {/* Cart & Checkout UI (Giữ nguyên) */}
         <div className="p-4 bg-slate-50 border-b border-slate-200">
             <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Khách hàng</label>
             <select className="w-full p-3 rounded-lg border border-slate-300 bg-white" value={selectedCustomer.id} onChange={(e) => setSelectedCustomer(DEMO_CUSTOMERS.find(c => c.id === parseInt(e.target.value)))}>
                {DEMO_CUSTOMERS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
             </select>
         </div>
         <div className="flex-1 overflow-y-auto p-4 space-y-3">
             {cart.map((item) => (
                 <div key={item.id} className="flex gap-3 items-center">
                    <div className="w-10 h-10 bg-slate-100 rounded flex items-center justify-center">{item.image || "📦"}</div>
                    <div className="flex-1"><div className="text-sm font-medium">{item.name}</div><div className="text-xs text-blue-600">{item.price.toLocaleString()}</div></div>
                    <div className="flex items-center bg-slate-100 rounded-lg h-8"><button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-full flex items-center justify-center text-slate-600">-</button><span className="w-6 text-center text-sm font-bold">{item.quantity}</span><button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-full flex items-center justify-center text-slate-600">+</button></div>
                    <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-red-500"><Trash2 size={16} /></button>
                 </div>
             ))}
         </div>
         <div className="p-5 bg-white border-t border-slate-200 shadow-inner">
             <div className="flex justify-between items-end mb-4"><span className="font-bold">KHÁCH TRẢ</span><span className="text-2xl font-extrabold text-blue-700">{formatMoney(finalAmount)}</span></div>
             <div className="grid grid-cols-2 gap-3">
                <button onClick={() => handleCheckout('debt')} className="py-3 rounded-xl font-bold text-orange-700 bg-orange-50 border border-orange-200">Ghi nợ</button>
                <button onClick={() => handleCheckout('cash')} className="py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200">Tiền mặt</button>
             </div>
         </div>
      </div>
    </div>
  );
}