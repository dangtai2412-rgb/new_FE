"use client"

import { useEffect, useState, useMemo } from "react";
import { api_service } from "@/lib/api_service";
import { 
  Search, ShoppingCart, Trash2, Plus, Minus, 
  User, CreditCard, CheckCircle2, PackageX, History 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area"; // Nếu chưa có component này thì dùng div thường

// --- Helper Component: Avatar Sản phẩm (Giống bên Inventory) ---
const ProductAvatar = ({ name }) => {
  const initials = name ? name.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase() : "SP";
  const colors = ["bg-red-100 text-red-600", "bg-blue-100 text-blue-600", "bg-green-100 text-green-600", "bg-orange-100 text-orange-600", "bg-purple-100 text-purple-600"];
  const colorClass = colors[name.length % colors.length];
  
  return (
    <div className={`h-12 w-12 rounded-lg flex items-center justify-center font-bold text-sm ${colorClass}`}>
      {initials}
    </div>
  );
};

export default function POSPage() {
  // --- STATE ---
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [cart, setCart] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedCustomer, setSelectedCustomer] = useState(null); // null = Khách lẻ
  
  // State cho Modal Thanh toán
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // --- FETCH DATA ---
  useEffect(() => {
    const initData = async () => {
      try {
        const [pData, cData, custData] = await Promise.all([
          api_service.get_products().catch(() => []),
          api_service.get_categories().catch(() => []),
          api_service.get_customers().catch(() => [])
        ]);
        setProducts(pData || []);
        setCategories(cData || []);
        setCustomers(custData || []);
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, []);

  // --- CART LOGIC ---
  const addToCart = (product) => {
    if (product.stock_quantity <= 0) {
      alert("Sản phẩm này đã hết hàng!");
      return;
    }

    setCart(prev => {
      const existItem = prev.find(item => item.product_id === product.product_id);
      if (existItem) {
        // Kiểm tra tồn kho
        if (existItem.quantity >= product.stock_quantity) {
          alert("Không đủ tồn kho để thêm tiếp!");
          return prev;
        }
        return prev.map(item => item.product_id === product.product_id 
          ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.product_id === id) {
        const newQty = item.quantity + delta;
        // Logic xóa nếu về 0
        if (newQty <= 0) return null; 
        // Logic check tồn kho
        if (newQty > item.stock_quantity) return item; 
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(Boolean)); // Lọc bỏ item null (đã xóa)
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.product_id !== id));
  };

  const clearCart = () => setCart([]);

  // --- CALCULATE ---
  const totalAmount = cart.reduce((sum, item) => sum + (Number(item.selling_price) * item.quantity), 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // --- FILTER PRODUCTS ---
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSearch = (p.product_name || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (p.sku || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = selectedCategory === "ALL" || String(p.category_id) === String(selectedCategory);
      return matchSearch && matchCat;
    });
  }, [products, searchTerm, selectedCategory]);

  // --- CHECKOUT HANDLE ---
  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsProcessing(true);
    
    try {
      const orderPayload = {
        customer_id: selectedCustomer ? selectedCustomer.customer_id : null, // null là Khách lẻ
        total_amount: totalAmount,
        items: cart.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.selling_price
        }))
        // Backend nên tự xử lý ngày giờ (created_at)
      };

      await api_service.create_order(orderPayload);
      
      alert("Thanh toán thành công!");
      setCart([]);
      setIsPaymentOpen(false);
      // TODO: In hóa đơn hoặc tải lại tồn kho
    } catch (error) {
      alert("Lỗi thanh toán: " + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      
      {/* --- LEFT SIDE: PRODUCTS GRID (65%) --- */}
      <div className="flex-1 flex flex-col h-full border-r border-slate-200">
        {/* Header Left */}
        <div className="p-4 bg-white border-b border-slate-200 shadow-sm z-10">
          <div className="flex gap-4 mb-4">
             <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <Input 
                  placeholder="Tìm sản phẩm (F1)..." 
                  className="pl-10 h-12 text-lg bg-slate-50 border-slate-200 focus-visible:ring-blue-500"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  autoFocus
                />
             </div>
          </div>
          
          {/* Categories Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            <Button 
              variant={selectedCategory === "ALL" ? "default" : "outline"}
              onClick={() => setSelectedCategory("ALL")}
              className={`rounded-full px-6 ${selectedCategory === "ALL" ? "bg-blue-600 hover:bg-blue-700" : "bg-white text-slate-600 border-slate-300"}`}
            >
              Tất cả
            </Button>
            {categories.map(c => (
              <Button
                key={c.category_id}
                variant={selectedCategory === c.category_id ? "default" : "outline"}
                onClick={() => setSelectedCategory(c.category_id)}
                className={`rounded-full whitespace-nowrap ${selectedCategory === c.category_id ? "bg-blue-600" : "bg-white text-slate-600 border-slate-300"}`}
              >
                {c.category_name}
              </Button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-100">
          {loading ? (
             <div className="text-center text-slate-500 mt-10">Đang tải dữ liệu...</div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredProducts.map(p => (
                <div 
                  key={p.product_id}
                  onClick={() => addToCart(p)}
                  className="group bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 cursor-pointer transition-all active:scale-95 flex flex-col h-full"
                >
                   <div className="flex items-start justify-between mb-2">
                      <ProductAvatar name={p.product_name} />
                      <span className={`text-xs font-bold px-2 py-1 rounded ${p.stock_quantity > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                        SL: {p.stock_quantity}
                      </span>
                   </div>
                   <h3 className="font-semibold text-slate-800 text-sm line-clamp-2 mb-1 flex-1 group-hover:text-blue-600">
                     {p.product_name}
                   </h3>
                   <div className="text-xs text-slate-500 mb-2">{p.sku || "No SKU"}</div>
                   <div className="font-bold text-blue-600 text-base">
                     {Number(p.selling_price).toLocaleString()} ₫
                   </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
               <PackageX size={48} className="mb-4 opacity-50"/>
               <p>Không tìm thấy sản phẩm nào</p>
            </div>
          )}
        </div>
      </div>

      {/* --- RIGHT SIDE: CART (35%) --- */}
      <div className="w-[400px] bg-white flex flex-col h-full shadow-xl z-20">
        {/* Cart Header: Customer Select */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
           <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <ShoppingCart className="text-blue-600" />
                Giỏ hàng <span className="text-sm font-normal text-slate-500">({totalItems} món)</span>
              </h2>
              <Button variant="ghost" size="sm" onClick={clearCart} className="text-red-500 hover:text-red-600 hover:bg-red-50 px-2 h-8">
                <Trash2 size={16} className="mr-1"/> Xóa hết
              </Button>
           </div>
           
           {/* Chọn khách hàng đơn giản */}
           <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <select 
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                onChange={(e) => {
                  const cust = customers.find(c => String(c.customer_id) === e.target.value);
                  setSelectedCustomer(cust || null);
                }}
                value={selectedCustomer ? selectedCustomer.customer_id : ""}
              >
                <option value="">Khách lẻ (Walk-in Customer)</option>
                {customers.map(c => (
                  <option key={c.customer_id} value={c.customer_id}>{c.customer_name} - {c.phone_number}</option>
                ))}
              </select>
           </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length > 0 ? (
            cart.map(item => (
              <div key={item.product_id} className="flex gap-3 p-3 rounded-lg border border-slate-100 hover:border-blue-100 transition-colors bg-white shadow-sm">
                <div className="h-10 w-10 bg-slate-100 rounded flex items-center justify-center text-xs font-bold text-slate-500">
                   x{item.quantity}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-sm text-slate-800 line-clamp-1">{item.product_name}</h4>
                    <button onClick={() => removeFromCart(item.product_id)} className="text-slate-400 hover:text-red-500">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                     <div className="text-blue-600 font-bold text-sm">
                       {(Number(item.selling_price) * item.quantity).toLocaleString()} ₫
                     </div>
                     <div className="flex items-center gap-1 bg-slate-50 rounded-md p-0.5 border border-slate-200">
                        <button 
                          onClick={() => updateQuantity(item.product_id, -1)}
                          className="w-6 h-6 flex items-center justify-center hover:bg-white rounded text-slate-600"
                        >
                          <Minus size={12}/>
                        </button>
                        <span className="text-xs font-semibold w-6 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.product_id, 1)}
                          className="w-6 h-6 flex items-center justify-center hover:bg-white rounded text-blue-600"
                        >
                          <Plus size={12}/>
                        </button>
                     </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
               <ShoppingCart size={48} className="mb-2"/>
               <p>Chưa có sản phẩm nào</p>
               <p className="text-xs">Vui lòng chọn từ danh sách bên trái</p>
            </div>
          )}
        </div>

        {/* Cart Footer: Totals & Pay */}
        <div className="p-4 bg-white border-t border-slate-200 shadow-[0_-4px_10px_-5px_rgba(0,0,0,0.1)]">
           <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm text-slate-500">
                 <span>Tạm tính</span>
                 <span>{totalAmount.toLocaleString()} ₫</span>
              </div>
              <div className="flex justify-between text-sm text-slate-500">
                 <span>Thuế (0%)</span>
                 <span>0 ₫</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-slate-800 pt-2 border-t border-dashed border-slate-200">
                 <span>Tổng thanh toán</span>
                 <span className="text-blue-600">{totalAmount.toLocaleString()} ₫</span>
              </div>
           </div>
           
           <Button 
             className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg font-bold shadow-lg shadow-blue-200"
             disabled={cart.length === 0}
             onClick={() => setIsPaymentOpen(true)}
           >
             Thanh toán ngay
           </Button>
        </div>
      </div>

      {/* --- PAYMENT MODAL --- */}
      {isPaymentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
           <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
              <div className="p-6 text-center border-b border-slate-100">
                 <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-blue-600">
                    <CreditCard size={32} />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900">Xác nhận thanh toán</h3>
                 <p className="text-slate-500 text-sm mt-1">
                   {selectedCustomer ? `Khách: ${selectedCustomer.customer_name}` : "Khách lẻ"}
                 </p>
              </div>
              
              <div className="p-6 space-y-4">
                 <div className="flex justify-between items-center bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <span className="font-medium text-slate-600">Tổng tiền cần thu:</span>
                    <span className="text-2xl font-bold text-blue-600">{totalAmount.toLocaleString()} ₫</span>
                 </div>
                 
                 <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Phương thức thanh toán</label>
                    <div className="grid grid-cols-2 gap-3">
                       <Button variant="outline" className="border-blue-500 bg-blue-50 text-blue-700 font-medium">Tiền mặt</Button>
                       <Button variant="outline" className="text-slate-600">Chuyển khoản</Button>
                    </div>
                 </div>
              </div>

              <div className="p-4 bg-slate-50 flex gap-3">
                 <Button variant="ghost" className="flex-1" onClick={() => setIsPaymentOpen(false)}>Hủy bỏ</Button>
                 <Button 
                   className="flex-1 bg-green-600 hover:bg-green-700 text-white" 
                   onClick={handleCheckout}
                   disabled={isProcessing}
                 >
                   {isProcessing ? "Đang xử lý..." : "Hoàn tất đơn hàng"}
                 </Button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
}
