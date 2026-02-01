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
//import { Badge } from "@/components/ui/badge"; // Nếu có component Badge
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// --- 1. DANH SÁCH KHÁCH HÀNG (Giữ nguyên của bạn) ---
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

// Hàm format tiền (Helper)
const formatMoney = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

export default function POSOwnerPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  
  // State tìm kiếm & Lọc
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  
  // State nghiệp vụ bán hàng
  const [selectedCustomer, setSelectedCustomer] = useState(DEMO_CUSTOMERS[0]);
  const [discount, setDiscount] = useState(0); // Chiết khấu (VNĐ)
  const [processing, setProcessing] = useState(false);

  // --- 1. Load dữ liệu (Logic giữ nguyên) ---
  useEffect(() => {
    const loadProducts = async () => {
      try {
        // Ưu tiên lấy từ LocalStorage để đồng bộ với trang Inventory
        const localData = localStorage.getItem("bizflow_products");
        if (localData) {
          setProducts(JSON.parse(localData));
          setLoading(false);
          return;
        }

        // Nếu không có LocalStorage thì gọi API hoặc Mock
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
          setProducts(INITIAL_PRODUCTS); // Fallback
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

  // --- 2. Các hàm xử lý giỏ hàng (Logic giữ nguyên) ---
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
        if (newQty > item.stock) return item; // Không cho quá tồn kho
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  // --- 3. Tính toán tiền nong (Logic giữ nguyên) ---
  const subTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const vatAmount = subTotal * 0.08; // VAT 8%
  const finalAmount = Math.max(0, subTotal + vatAmount - discount);

  // --- 4. Xử lý thanh toán (Giữ nguyên logic của bạn) ---
  const handleCheckout = (type) => {
    setProcessing(true);
    // Giả lập delay gửi API
    setTimeout(() => {
      if (type === 'debt') {
        alert(`Đã ghi nợ thành công cho khách: ${selectedCustomer.name}\nSố tiền: ${formatMoney(finalAmount)}\n(Cập nhật vào công nợ)`);
      } else {
        alert(`Thanh toán TIỀN MẶT thành công!\nSố tiền: ${formatMoney(finalAmount)}\n(In hóa đơn...)`);
      }
      setCart([]);
      setDiscount(0);
      setProcessing(false);
      setSelectedCustomer(DEMO_CUSTOMERS[0]); // Reset về khách lẻ
    }, 1000);
  };

  // Filter sản phẩm
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
      
      {/* ================= CỘT TRÁI: DANH SÁCH SẢN PHẨM ================= */}
      <div className="flex-1 flex flex-col h-full border-r border-slate-200">
        
        {/* Header: Search & Filter */}
        <div className="p-4 bg-white shadow-sm z-10 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Store className="text-blue-600"/> Bán Hàng (Owner Mode)
              </h1>
              <p className="text-xs text-slate-500">Hệ thống BizFlow - Phiên bản Hộ kinh doanh</p>
            </div>
            <div className="relative w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input 
                className="pl-10 rounded-full border-slate-200 bg-slate-50 focus:bg-white transition-all" 
                placeholder="Tìm tên hàng, mã vạch..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Danh mục dạng Pills (Viên thuốc) - Đẹp hơn dropdown */}
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

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 pb-20">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => addToCart(product)}
                className="group bg-white rounded-xl border border-slate-100 p-3 shadow-sm hover:shadow-lg hover:border-blue-400 cursor-pointer transition-all duration-200 relative flex flex-col h-[220px]"
              >
                {/* Badge Tồn kho */}
                <div className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  product.stock < 10 
                    ? "bg-red-50 text-red-600 border-red-100" 
                    : "bg-green-50 text-green-600 border-green-100"
                }`}>
                  Tồn: {product.stock}
                </div>

                {/* Hình ảnh giả lập bằng Emoji hoặc Icon */}
                <div className="flex-1 flex items-center justify-center bg-slate-50 rounded-lg mb-2 group-hover:bg-blue-50 transition-colors">
                  <div className="text-5xl drop-shadow-sm transform group-hover:scale-110 transition-transform duration-300">
                    {product.image || "📦"}
                  </div>
                </div>

                {/* Thông tin */}
                <div className="mt-auto">
                  <h3 className="font-semibold text-slate-700 text-sm line-clamp-2 h-[40px]" title={product.name}>
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400">Đơn giá</span>
                      <span className="font-bold text-blue-700">{product.price.toLocaleString()}</span>
                    </div>
                    <button className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= CỘT PHẢI: GIỎ HÀNG & THANH TOÁN ================= */}
      <div className="w-[420px] flex flex-col bg-white shadow-2xl h-full z-20">
        
        {/* 1. Chọn khách hàng (Quan trọng với Chủ Shop) */}
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Khách hàng</label>
          <div className="relative">
            <select 
              className="w-full p-3 pl-10 rounded-lg border border-slate-300 bg-white appearance-none outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700"
              value={selectedCustomer.id}
              onChange={(e) => {
                const cust = DEMO_CUSTOMERS.find(c => c.id === parseInt(e.target.value));
                setSelectedCustomer(cust);
              }}
            >
              {DEMO_CUSTOMERS.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
          </div>
          
          {/* Cảnh báo nợ (Chỉ hiện nếu khách có nợ) */}
          {selectedCustomer.debt > 0 && (
            <div className="mt-3 flex items-start gap-2 bg-orange-50 p-2 rounded-lg border border-orange-100 animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={16} className="text-orange-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-bold text-orange-700">Khách đang nợ cũ:</p>
                <p className="text-sm font-extrabold text-orange-600">{formatMoney(selectedCustomer.debt)}</p>
              </div>
            </div>
          )}
        </div>

        {/* 2. Danh sách hàng trong giỏ */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
              <PackageOpen size={64} className="mb-4 text-slate-200"/>
              <p>Chưa có sản phẩm nào</p>
              <p className="text-sm">Vui lòng chọn từ danh sách</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-3 items-center group">
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-2xl border border-slate-200">
                  {item.image || "📦"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-800 truncate">{item.name}</div>
                  <div className="text-xs text-blue-600 font-bold">{item.price.toLocaleString()} ₫</div>
                </div>
                
                {/* Bộ điều khiển số lượng nhỏ gọn */}
                <div className="flex items-center bg-slate-100 rounded-lg h-8">
                  <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-full flex items-center justify-center hover:bg-slate-200 text-slate-600 rounded-l-lg disabled:opacity-30" disabled={item.quantity <= 1}>
                    <Minus size={12}/>
                  </button>
                  <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-full flex items-center justify-center hover:bg-slate-200 text-slate-600 rounded-r-lg">
                    <Plus size={12}/>
                  </button>
                </div>

                <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* 3. Footer Thanh toán */}
        <div className="p-5 bg-white border-t border-slate-200 shadow-[0_-5px_15px_-5px_rgba(0,0,0,0.1)]">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm text-slate-500">
              <span>Tổng tiền hàng</span>
              <span>{formatMoney(subTotal)}</span>
            </div>
            
            <div className="flex justify-between text-sm text-slate-500 items-center">
              <span>Chiết khấu</span>
              <div className="flex items-center gap-1 w-32">
                <Input 
                  type="number" 
                  className="h-7 text-right text-xs" 
                  placeholder="0"
                  value={discount === 0 ? '' : discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="flex justify-between text-sm text-slate-500">
              <span>VAT (8%)</span>
              <span>{formatMoney(vatAmount)}</span>
            </div>

            <div className="flex justify-between items-end border-t border-dashed border-slate-300 pt-3 mt-2">
              <span className="text-slate-800 font-bold text-lg">KHÁCH PHẢI TRẢ</span>
              <span className="text-2xl font-extrabold text-blue-700">{formatMoney(finalAmount)}</span>
            </div>
          </div>

          {/* Nút hành động: Chia 2 nút Ghi Nợ & Tiền Mặt rõ ràng */}
          <div className="grid grid-cols-2 gap-3">
            <button
              disabled={cart.length === 0 || processing}
              onClick={() => handleCheckout('debt')}
              className="py-3 rounded-xl font-bold text-orange-700 bg-orange-50 border border-orange-200 hover:bg-orange-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {processing ? <Loader2 className="animate-spin"/> : <FileText size={20} className="group-hover:scale-110 transition-transform"/>}
              Ghi nợ
            </button>
            
            <button
              disabled={cart.length === 0 || processing}
              onClick={() => handleCheckout('cash')}
              className="py-3 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {processing ? <Loader2 className="animate-spin"/> : <CreditCard size={20} className="group-hover:scale-110 transition-transform"/>}
              Tiền mặt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}