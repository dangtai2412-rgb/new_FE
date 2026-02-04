"use client";
import React, { useState, useEffect } from "react";
import { 
  Search, Trash2, Plus, Minus, LayoutGrid, Layers, Hammer, Droplets, Zap, 
  User, CreditCard, FileText, Loader2 
} from "lucide-react";
import { INITIAL_PRODUCTS } from "@/lib/mock_data";
import { Input } from "@/components/ui/input";

const formatMoney = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

const CATEGORIES = [
  { id: "all", name: "Tất cả", icon: LayoutGrid },
  { id: "thô", name: "Vật liệu thô", icon: Layers },
  { id: "sắt", name: "Sắt thép", icon: Hammer },
  { id: "nước", name: "Sơn nước", icon: Droplets },
  { id: "điện", name: "Thiết bị điện", icon: Zap },
];

const CUSTOMERS = [
  { id: 0, name: "Khách lẻ (Vãng lai)", debt: 0 },
  { id: 1, name: "Anh Hùng (Thầu Xây Dựng)", debt: 15500000 },
  { id: 2, name: "Cty Kiến Vàng", debt: 82000000 },
  { id: 3, name: "Cô Ba (Chủ trọ KDC 5)", debt: 0 },
];

export default function POSPage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState(CUSTOMERS[0]);
  const [loading, setLoading] = useState(false);

  // Load đồng bộ với Kho
  useEffect(() => {
    const saved = localStorage.getItem("bizflow_products");
    if (saved) setProducts(JSON.parse(saved));
    else setProducts(INITIAL_PRODUCTS);
  }, []);

  const addToCart = (p) => {
    const exist = cart.find(i => i.id === p.id);
    if (exist) setCart(cart.map(i => i.id === p.id ? { ...i, quantity: i.quantity + 1 } : i));
    else setCart([...cart, { ...p, quantity: 1 }]);
  };

  const updateQty = (id, delta) => {
    setCart(cart.map(i => i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i));
  };

  const handleCheckout = (type) => {
    setLoading(true);
    setTimeout(() => {
      alert(`Thanh toán ${type === 'debt' ? 'GHI NỢ' : 'TIỀN MẶT'} thành công!\nKhách hàng: ${selectedCustomer.name}\nTổng tiền: ${formatMoney(cart.reduce((a, b) => a + b.price * b.quantity, 0))}`);
      setCart([]);
      setLoading(false);
    }, 800); // Giả lập độ trễ mạng
  };

  const filtered = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
    (activeCategory === 'all' || p.category.includes(activeCategory))
  );

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {/* --- CỘT TRÁI: DANH SÁCH SP --- */}
      <div className="flex-1 flex flex-col p-4 gap-4">
        {/* Thanh tìm kiếm & Tabs */}
        <div className="bg-white p-3 rounded-xl shadow-sm space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={20}/>
            <Input className="pl-10 bg-slate-50 border-slate-200" placeholder="Tìm tên sản phẩm, mã vạch..." onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {CATEGORIES.map(c => (
              <button key={c.id} onClick={() => setActiveCategory(c.id)} className={`px-3 py-1.5 rounded-full flex items-center gap-2 text-sm font-medium transition-colors whitespace-nowrap ${activeCategory===c.id ? "bg-blue-600 text-white shadow" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                <c.icon size={14}/> {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Lưới sản phẩm */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto pb-20 pr-1">
          {filtered.map(p => (
            <div key={p.id} onClick={() => addToCart(p)} className="bg-white p-3 rounded-xl shadow-sm hover:shadow-lg cursor-pointer border border-transparent hover:border-blue-500 group flex flex-col justify-between h-[200px] transition-all relative">
              <div className="absolute top-2 right-2 text-[10px] px-2 py-0.5 bg-slate-100 rounded-full font-bold text-slate-500">Kho: {p.stock}</div>
              <div className="flex-1 flex items-center justify-center text-5xl group-hover:scale-110 transition-transform">{p.image}</div>
              <div className="mt-2">
                <h3 className="font-semibold text-slate-700 text-sm line-clamp-2 h-10 leading-tight">{p.name}</h3>
                <p className="text-blue-700 font-bold text-base mt-1">{formatMoney(p.price)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- CỘT PHẢI: GIỎ HÀNG --- */}
      <div className="w-[400px] bg-white shadow-2xl flex flex-col h-full z-20 border-l border-slate-200">
        <div className="p-5 border-b bg-slate-50 space-y-3">
          <h2 className="font-bold text-lg flex items-center gap-2 text-slate-800"><div className="bg-blue-600 text-white p-1 rounded-md"><CreditCard size={18}/></div> Đơn hàng mới</h2>
          
          {/* Chọn khách hàng */}
          <div className="bg-white p-3 border rounded-xl shadow-sm">
            <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Khách hàng</label>
            <div className="flex items-center gap-2">
              <User size={20} className="text-blue-500"/>
              <select className="flex-1 bg-transparent outline-none font-medium text-slate-700" onChange={e => setSelectedCustomer(CUSTOMERS.find(c => c.id == e.target.value))}>
                {CUSTOMERS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            {selectedCustomer.debt > 0 && <div className="mt-2 text-xs bg-orange-50 text-orange-700 p-2 rounded border border-orange-100 font-semibold flex items-center gap-1">⚠️ Khách đang nợ: {formatMoney(selectedCustomer.debt)}</div>}
          </div>
        </div>

        {/* List items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
              <CreditCard size={48} className="mb-2"/>
              <p>Chưa có sản phẩm nào</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm border border-slate-100">
                <div className="w-10 h-10 flex items-center justify-center bg-slate-100 rounded-md text-xl mr-3">{item.image}</div>
                <div className="flex-1">
                  <div className="font-medium text-sm text-slate-800 line-clamp-1">{item.name}</div>
                  <div className="text-blue-600 text-xs font-bold">{formatMoney(item.price)}</div>
                </div>
                <div className="flex items-center bg-slate-100 rounded-md h-8">
                  <button onClick={() => updateQty(item.id, -1)} className="w-8 h-full flex items-center justify-center hover:bg-slate-200 text-slate-600"><Minus size={12}/></button>
                  <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                  <button onClick={() => updateQty(item.id, 1)} className="w-8 h-full flex items-center justify-center hover:bg-slate-200 text-slate-600"><Plus size={12}/></button>
                </div>
                <button onClick={() => setCart(cart.filter(i => i.id !== item.id))} className="ml-2 text-slate-300 hover:text-red-500"><Trash2 size={16}/></button>
              </div>
            ))
          )}
        </div>

        {/* Footer Payment */}
        <div className="p-5 border-t bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.05)] space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between text-sm text-slate-500"><span>Tạm tính:</span> <span>{formatMoney(total)}</span></div>
            <div className="flex justify-between text-sm text-slate-500"><span>VAT (8%):</span> <span>{formatMoney(total * 0.08)}</span></div>
            <div className="flex justify-between font-bold text-xl text-slate-800 pt-2 border-t border-dashed mt-2"><span>Tổng tiền:</span> <span className="text-blue-600">{formatMoney(total * 1.08)}</span></div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <button disabled={cart.length===0} onClick={() => handleCheckout('debt')} className="py-3 bg-orange-50 border border-orange-200 text-orange-700 font-bold rounded-xl hover:bg-orange-100 flex items-center justify-center gap-2 transition-colors disabled:opacity-50">
              {loading ? <Loader2 className="animate-spin" size={18}/> : <FileText size={18}/>} Ghi nợ
            </button>
            <button disabled={cart.length===0} onClick={() => handleCheckout('cash')} className="py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 flex items-center justify-center gap-2 transition-all disabled:opacity-50">
              {loading ? <Loader2 className="animate-spin" size={18}/> : <CreditCard size={18}/>} Tiền mặt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}