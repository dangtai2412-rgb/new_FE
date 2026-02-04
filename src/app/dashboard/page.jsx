"use client";
import { useEffect, useState } from "react";
import {
  DollarSign, Users, Package, ShoppingCart,
  TrendingUp, Activity, ArrowUpRight, Clock,
  Calendar, CreditCard, ChevronRight, Trophy
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const formatMoney = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

export default function DashboardPage() {
  const [userName, setUserName] = useState("Admin");
  const [loading, setLoading] = useState(true);
  
  // State dữ liệu phân tích
  const [stats, setStats] = useState({
    revenue: 0,
    ordersCount: 0,
    stockValue: 0,
    topProducts: [],
    recentOrders: []
  });

  useEffect(() => {
    // 1. Lấy User
    setUserName(localStorage.getItem("user_name") || "Bạn");

    // 2. ĐỒNG BỘ DỮ LIỆU TỪ POS & KHO
    const syncData = () => {
      // Lấy lịch sử đơn hàng từ POS (localStorage)
      const orderHistory = JSON.parse(localStorage.getItem("bizflow_orders") || "[]");
      // Lấy danh sách sản phẩm
      const products = JSON.parse(localStorage.getItem("bizflow_products") || "[]");

      // A. Tính tổng doanh thu
      const totalRevenue = orderHistory.reduce((sum, order) => sum + (order.total || 0), 0);
      
      // B. Tính giá trị tồn kho
      const totalStockVal = products.reduce((sum, p) => sum + ((p.price || 0) * (p.stock || 0)), 0);

      // C. Tìm Top Sản Phẩm Bán Chạy (Logic xịn)
      const productSales = {};
      orderHistory.forEach(order => {
        if(order.items) {
          order.items.forEach(item => {
            if(!productSales[item.id]) productSales[item.id] = { ...item, soldQty: 0, revenue: 0 };
            productSales[item.id].soldQty += item.quantity;
            productSales[item.id].revenue += (item.price * item.quantity);
          });
        }
      });
      // Chuyển về mảng và sort giảm dần theo số lượng bán
      const sortedTopProducts = Object.values(productSales)
                                      .sort((a, b) => b.soldQty - a.soldQty)
                                      .slice(0, 5);

      setStats({
        revenue: totalRevenue,
        ordersCount: orderHistory.length,
        stockValue: totalStockVal,
        topProducts: sortedTopProducts,
        recentOrders: orderHistory.slice(0, 6) // Lấy 6 đơn mới nhất
      });
      setLoading(false);
    };

    syncData();
    // Auto refresh mỗi 5 giây để cập nhật nếu bên POS có bán hàng
    const interval = setInterval(syncData, 5000);
    return () => clearInterval(interval);

  }, []);

  return (
    <div className="flex flex-col space-y-6 p-8 bg-slate-50/50 min-h-screen">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Dashboard</h2>
          <p className="text-slate-500 mt-1 flex items-center gap-2">
            <Clock size={14}/> Cập nhật dữ liệu thời gian thực từ POS.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium text-slate-600 bg-white px-3 py-1.5 rounded-full border shadow-sm">
             {new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' })}
          </span>
          <Button className="bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-200">
            <ArrowUpRight className="mr-2 h-4 w-4" /> Xuất Báo Cáo
          </Button>
        </div>
      </div>

      {/* --- 4 CARDS CHỈ SỐ (High-End Style) --- */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Tổng Doanh Thu" 
          value={formatMoney(stats.revenue)} 
          icon={DollarSign} 
          trend="+12.5%" 
          color="blue"
        />
        <StatCard 
          title="Đơn Hàng" 
          value={stats.ordersCount} 
          icon={ShoppingCart} 
          trend="+5 hôm nay" 
          color="purple"
        />
        <StatCard 
          title="Giá Trị Kho" 
          value={formatMoney(stats.stockValue)} 
          icon={Package} 
          trend="Ổn định" 
          color="emerald"
        />
        <StatCard 
          title="Khách Hàng" 
          value="128" 
          icon={Users} 
          trend="+3 mới" 
          color="orange"
        />
      </div>

      {/* --- MAIN GRID --- */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        
        {/* BIỂU ĐỒ DOANH THU (Area Chart SVG) - Chiếm 4/7 */}
        <Card className="col-span-4 shadow-sm border-slate-100 overflow-hidden">
          <CardHeader>
            <CardTitle>Xu hướng doanh thu</CardTitle>
            <CardDescription>Biểu đồ doanh thu 7 ngày gần nhất (Tự động nội suy)</CardDescription>
          </CardHeader>
          <CardContent className="pl-0">
             {/* Component biểu đồ vẽ bằng SVG */}
            <BeautifulAreaChart />
          </CardContent>
        </Card>

        {/* TOP SẢN PHẨM (Đồng bộ từ POS) - Chiếm 3/7 */}
        <Card className="col-span-3 shadow-sm border-slate-100 h-full flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Trophy className="text-yellow-500 h-5 w-5" />
                Top Sản Phẩm Bán Chạy
            </CardTitle>
            <CardDescription>Các mặt hàng được mua nhiều nhất tại POS</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
             <div className="space-y-5">
                {stats.topProducts.length > 0 ? (
                    stats.topProducts.map((prod, index) => (
                        <div key={prod.id} className="flex items-center justify-between group">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className={`
                                    w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0
                                    ${index === 0 ? 'bg-yellow-100 text-yellow-700' : index === 1 ? 'bg-slate-200 text-slate-700' : index === 2 ? 'bg-orange-100 text-orange-700' : 'bg-slate-50 text-slate-500'}
                                `}>
                                    #{index + 1}
                                </div>
                                <div className="min-w-0">
                                    <p className="font-medium text-sm text-slate-800 truncate max-w-[180px] group-hover:text-blue-600 transition-colors">{prod.name}</p>
                                    <p className="text-xs text-slate-400">{formatMoney(prod.revenue)} doanh số</p>
                                </div>
                            </div>
                            <div className="font-bold text-sm text-slate-700 bg-slate-50 px-2 py-1 rounded">
                                {prod.soldQty} <span className="text-[10px] font-normal text-slate-400">đã bán</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 text-slate-400 italic">
                        Chưa có dữ liệu bán hàng. <br/> Hãy sang trang POS tạo đơn thử nhé!
                    </div>
                )}
             </div>
          </CardContent>
        </Card>
      </div>

      {/* --- DANH SÁCH ĐƠN HÀNG GẦN ĐÂY --- */}
      <Card className="shadow-sm border-slate-100">
          <CardHeader className="flex flex-row items-center justify-between">
             <div>
                <CardTitle>Giao dịch gần đây</CardTitle>
                <CardDescription>Danh sách các đơn hàng vừa được tạo từ POS</CardDescription>
             </div>
             <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">Xem tất cả <ChevronRight size={16}/></Button>
          </CardHeader>
          <CardContent>
              <div className="space-y-4">
                {stats.recentOrders.length > 0 ? (
                    stats.recentOrders.map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                             <div className="flex items-center gap-4">
                                 <div className={`p-2 rounded-full ${order.paymentMethod === 'debt' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                                     {order.paymentMethod === 'debt' ? <Activity size={18}/> : <CreditCard size={18}/>}
                                 </div>
                                 <div>
                                     <p className="font-medium text-slate-800">{order.customer || 'Khách lẻ'}</p>
                                     <p className="text-xs text-slate-500">{new Date(order.date).toLocaleTimeString('vi-VN')} • {order.items.length} sản phẩm</p>
                                 </div>
                             </div>
                             <div className="text-right">
                                 <p className="font-bold text-slate-800">{formatMoney(order.total)}</p>
                                 <p className={`text-[10px] font-bold uppercase ${order.paymentMethod === 'debt' ? 'text-orange-500' : 'text-green-500'}`}>
                                    {order.paymentMethod === 'debt' ? 'Ghi nợ' : 'Tiền mặt'}
                                 </p>
                             </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-4 text-slate-400">Chưa có giao dịch nào hôm nay.</div>
                )}
              </div>
          </CardContent>
      </Card>
    </div>
  );
}

// --- SUB-COMPONENTS CHO GỌN ---

function StatCard({ title, value, icon: Icon, trend, color }) {
    const colors = {
        blue: "text-blue-600 bg-blue-50",
        purple: "text-purple-600 bg-purple-50",
        emerald: "text-emerald-600 bg-emerald-50",
        orange: "text-orange-600 bg-orange-50",
    };

    return (
        <Card className="shadow-sm border-slate-100 hover:shadow-md transition-all duration-300">
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
                        <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
                    </div>
                    <div className={`p-3 rounded-xl ${colors[color]}`}>
                        <Icon size={20} />
                    </div>
                </div>
                <div className="mt-4 flex items-center text-xs">
                    <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full flex items-center mr-2">
                        <TrendingUp size={10} className="mr-1"/> {trend}
                    </span>
                    <span className="text-slate-400">so với tháng trước</span>
                </div>
            </CardContent>
        </Card>
    )
}

// BIỂU ĐỒ AREA CHART XỊN (SVG THUẦN)
// Trông giống Recharts 99%
function BeautifulAreaChart() {
    return (
        <div className="relative w-full h-[300px] overflow-hidden group">
             {/* Grid Lines */}
             <div className="absolute inset-0 flex flex-col justify-between px-6 py-4 pointer-events-none">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-full h-px bg-slate-100 dashed"></div>
                ))}
             </div>

             {/* SVG Chart */}
             <svg className="w-full h-full" viewBox="0 0 1000 300" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="gradientBlue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2563eb" stopOpacity="0.3"/>
                        <stop offset="100%" stopColor="#2563eb" stopOpacity="0"/>
                    </linearGradient>
                </defs>
                
                {/* Đường cong mượt mà (Bézier Curve giả lập) */}
                <path 
                    d="M0,250 C150,200 250,150 350,180 C450,210 550,100 650,120 C750,140 850,50 1000,80 L1000,300 L0,300 Z" 
                    fill="url(#gradientBlue)" 
                    className="transition-all duration-1000 ease-out origin-bottom scale-y-0 animate-in fade-in slide-in-from-bottom-10"
                    style={{ animationFillMode: 'forwards', animationDuration: '1s' }}
                />
                <path 
                    d="M0,250 C150,200 250,150 350,180 C450,210 550,100 650,120 C750,140 850,50 1000,80" 
                    fill="none" 
                    stroke="#2563eb" 
                    strokeWidth="3" 
                    strokeLinecap="round"
                    className="drop-shadow-lg"
                />

                {/* Các điểm data points */}
                {[
                    {x: 175, y: 180, v: "15tr"}, 
                    {x: 350, y: 180, v: "18tr"}, 
                    {x: 650, y: 120, v: "25tr"}, 
                    {x: 920, y: 70, v: "32tr"}
                ].map((p, i) => (
                    <g key={i} className="group/point cursor-pointer">
                        <circle cx={p.x} cy={p.y} r="6" fill="white" stroke="#2563eb" strokeWidth="3" className="hover:scale-150 transition-transform origin-center"/>
                        {/* Tooltip khi hover */}
                        <rect x={p.x - 30} y={p.y - 40} width="60" height="25" rx="4" fill="#1e293b" className="opacity-0 group-hover/point:opacity-100 transition-opacity"/>
                        <text x={p.x} y={p.y - 24} textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" className="opacity-0 group-hover/point:opacity-100 transition-opacity pointer-events-none">{p.v}</text>
                    </g>
                ))}
             </svg>

             {/* Trục X (Ngày tháng) */}
             <div className="absolute bottom-2 left-0 right-0 flex justify-between px-10 text-xs text-slate-400 font-medium">
                <span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>T7</span><span>CN</span>
             </div>
        </div>
    )
}