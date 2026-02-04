"use client";
import { useEffect, useState } from "react";
import { 
  DollarSign, Users, Package, TrendingUp, 
  Activity, AlertCircle, Truck, Wallet, 
  Trophy, ArrowUpRight, Calendar
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// Import dữ liệu mẫu để dùng khi localStorage bị trống (Fallback)
import { INITIAL_PRODUCTS, INITIAL_SUPPLIERS } from "@/lib/mock_data";

// Hàm format tiền tệ
const formatMoney = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

export default function DashboardPage() {
  // Mặc định role là owner để demo cho đẹp
  const [role, setRole] = useState("owner"); 
  const [userName, setUserName] = useState("User");

  // State lưu trữ thống kê
  const [stats, setStats] = useState({
    totalStockValue: 0,
    potentialRevenue: 0,
    supplierDebt: 0,
    lowStockCount: 0,
    totalProducts: 0,
    totalQuantity: 0,
    weeklyRevenue: [], 
    topProducts: []
  });

  useEffect(() => {
    // 1. Lấy thông tin User
    const storedRole = localStorage.getItem("role");
    const storedName = localStorage.getItem("user_name") || "Bạn";
    
    // Nếu có role trong storage thì dùng, không thì mặc định là owner
    if (storedRole) {
      setRole(storedRole.toLowerCase());
    }
    setUserName(storedName);

    // 2. LOGIC QUAN TRỌNG: Đọc dữ liệu + Fallback dữ liệu mẫu
    const loadRealData = () => {
      try {
        // Lấy dữ liệu từ LocalStorage. Nếu null hoặc rỗng [] thì dùng INITIAL_PRODUCTS
        const localProducts = localStorage.getItem("bizflow_products");
        let products = localProducts ? JSON.parse(localProducts) : [];
        if (products.length === 0) products = INITIAL_PRODUCTS || [];

        const localSuppliers = localStorage.getItem("bizflow_suppliers");
        let suppliers = localSuppliers ? JSON.parse(localSuppliers) : [];
        if (suppliers.length === 0) suppliers = INITIAL_SUPPLIERS || [];

        // --- TÍNH TOÁN SỐ LIỆU ---
        const stockValue = products.reduce((acc, p) => acc + ((Number(p.cost) || 0) * (Number(p.stock) || 0)), 0);
        const revenuePotential = products.reduce((acc, p) => acc + ((Number(p.price) || 0) * (Number(p.stock) || 0)), 0);
        const debt = suppliers.reduce((acc, s) => acc + (Number(s.debt) || 0), 0);
        const lowStock = products.filter(p => (Number(p.stock) || 0) < 10).length;
        const totalQty = products.reduce((acc, p) => acc + (Number(p.stock) || 0), 0);

        // --- GIẢ LẬP BIỂU ĐỒ & TOP SẢN PHẨM ---
        // (Random số liệu cho sinh động)
        const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'];
        const fakeWeeklyRevenue = days.map((day) => ({
            day,
            revenue: Math.floor(Math.random() * 5000000) + 2000000, // 2tr - 7tr
        }));

        // Lấy 5 sản phẩm ngẫu nhiên làm Top Bán Chạy
        const shuffled = [...products].sort(() => 0.5 - Math.random());
        const fakeTopProducts = shuffled.slice(0, 5).map(p => ({
            ...p,
            sold_qty: Math.floor(Math.random() * 50) + 10,
            trend: Math.random() > 0.5 ? 'up' : 'down'
        })).sort((a, b) => b.sold_qty - a.sold_qty);

        setStats({
          totalStockValue: stockValue,
          potentialRevenue: revenuePotential,
          supplierDebt: debt,
          lowStockCount: lowStock,
          totalProducts: products.length,
          totalQuantity: totalQty,
          weeklyRevenue: fakeWeeklyRevenue,
          topProducts: fakeTopProducts
        });

      } catch (error) {
        console.error("Lỗi đọc dữ liệu Dashboard:", error);
      }
    };

    loadRealData();
    
    // Lắng nghe sự kiện storage để cập nhật realtime khi tab khác thay đổi
    window.addEventListener('storage', loadRealData);
    return () => window.removeEventListener('storage', loadRealData);

  }, []);

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Tổng quan kinh doanh</h2>
          <p className="text-slate-500">Xin chào, {userName}! Báo cáo hoạt động hôm nay.</p>
        </div>
        
        <span className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase border shadow-sm ${
          role === 'admin' ? 'bg-purple-100 text-purple-700 border-purple-200' : 
          role === 'owner' ? 'bg-blue-600 text-white border-blue-700' : 
          'bg-green-100 text-green-700 border-green-200'
        }`}>
          {role === 'admin' ? 'Quản trị viên' : role === 'owner' ? '👑 Chủ cửa hàng' : 'Nhân viên'}
        </span>
      </div>

      {/* --- DASHBOARD CHO OWNER (CHỦ SHOP) --- */}
      {role === "owner" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* HÀNG 1: 4 CARD CHỈ SỐ */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="shadow-sm border-l-4 border-l-blue-600 hover:shadow-md transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Vốn Tồn Kho</CardTitle>
                <Package className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">{formatMoney(stats.totalStockValue)}</div>
                <p className="text-xs text-slate-500 mt-1">{stats.totalProducts} mã sản phẩm</p>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-l-4 border-l-green-600 hover:shadow-md transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Doanh Thu Dự Kiến</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-700">{formatMoney(stats.potentialRevenue)}</div>
                <p className="text-xs text-slate-500 mt-1">Tổng giá bán hàng tồn</p>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-l-4 border-l-orange-500 hover:shadow-md transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Nợ Phải Trả</CardTitle>
                <Truck className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-700">{formatMoney(stats.supplierDebt)}</div>
                <p className="text-xs text-slate-500 mt-1">Công nợ nhà cung cấp</p>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-l-4 border-l-red-500 hover:shadow-md transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Sắp Hết Hàng</CardTitle>
                <AlertCircle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-700">{stats.lowStockCount}</div>
                <p className="text-xs text-slate-500 mt-1">Sản phẩm dưới định mức (10)</p>
              </CardContent>
            </Card>
          </div>

          {/* HÀNG 2: BIỂU ĐỒ & TOP SẢN PHẨM */}
          <div className="grid gap-4 md:grid-cols-7">
             
             {/* Biểu đồ Doanh thu (CSS thuần) */}
             <Card className="md:col-span-4 shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                        <Calendar className="w-5 h-5 text-blue-600"/> 
                        Biểu đồ doanh thu 7 ngày
                    </CardTitle>
                    <CardDescription>Số liệu cập nhật theo thời gian thực</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-end justify-between gap-2 h-[200px] mt-4 px-2">
                    {stats.weeklyRevenue.map((item, index) => {
                        const maxRev = Math.max(...stats.weeklyRevenue.map(r => r.revenue), 1);
                        const heightPercent = (item.revenue / maxRev) * 100;
                        return (
                            <div key={index} className="flex flex-col items-center justify-end w-full group h-full cursor-pointer">
                                <div className="w-full bg-blue-100 rounded-t-md group-hover:bg-blue-500 transition-all relative" style={{ height: `${heightPercent}%` }}>
                                   {/* Tooltip */}
                                   <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap z-10 pointer-events-none">
                                     {formatMoney(item.revenue)}
                                   </div>
                                </div>
                                <div className="mt-2 text-[10px] font-bold text-slate-400 group-hover:text-blue-600">{item.day}</div>
                            </div>
                        )
                    })}
                    </div>
                </CardContent>
             </Card>

             {/* Top Sản Phẩm Bán Chạy */}
             <Card className="md:col-span-3 shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                        <Trophy className="w-5 h-5 text-yellow-500"/>
                        Top Bán Chạy
                    </CardTitle>
                    <CardDescription>Sản phẩm hot nhất kho hàng</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pr-1 max-h-[300px] overflow-y-auto">
                    {stats.topProducts.map((prod, i) => (
                        <div key={i} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors border-b border-dashed border-slate-100 last:border-0">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-sm ${
                                    i === 0 ? 'bg-yellow-100 text-yellow-700 ring-2 ring-yellow-200' : 
                                    i === 1 ? 'bg-slate-200 text-slate-700' : 
                                    i === 2 ? 'bg-orange-100 text-orange-800' : 'bg-slate-50 text-slate-500'
                                }`}>
                                    #{i + 1}
                                </div>
                                <div className="min-w-0">
                                    <p className="font-semibold text-sm text-slate-700 truncate max-w-[120px]" title={prod.name}>{prod.name}</p>
                                    <p className="text-[10px] text-slate-400">{formatMoney(prod.price)}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-slate-800 text-sm">{prod.sold_qty}</div>
                                {prod.trend === 'up' ? (
                                    <span className="text-[10px] text-green-600 flex items-center justify-end font-medium"><ArrowUpRight size={10}/> Tăng</span>
                                ) : (
                                    <span className="text-[10px] text-slate-400">Ổn định</span>
                                )}
                            </div>
                        </div>
                    ))}
                </CardContent>
             </Card>
          </div>
        </div>
      )}

      {/* --- DASHBOARD NHÂN VIÊN --- */}
      {role === "employee" && (
        <div className="p-8 text-center bg-white rounded-xl border shadow-sm">
            <h3 className="text-lg font-bold text-slate-700">Giao diện Nhân viên</h3>
            <p className="text-slate-500 mb-4">Bạn đang xem ở chế độ nhân viên.</p>
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                 <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="text-2xl font-bold text-blue-600">08:00 - 17:00</div>
                    <div className="text-xs text-slate-500">Ca làm việc</div>
                 </div>
                 <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                    <div className="text-2xl font-bold text-green-600">{formatMoney(4500000)}</div>
                    <div className="text-xs text-slate-500">Doanh số cá nhân</div>
                 </div>
            </div>
        </div>
      )}

      {/* --- DASHBOARD ADMIN --- */}
      {role === "admin" && (
         <div className="p-10 text-center bg-purple-50 rounded-xl border border-dashed border-purple-300 text-purple-800">
            🔔 Giao diện Admin SaaS (Quản lý hệ thống)
         </div>
      )}
    </div>
  );
}