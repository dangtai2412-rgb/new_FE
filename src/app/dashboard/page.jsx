"use client"

import { useEffect, useState, useMemo } from "react";
import { api_service } from "@/lib/api_service";
import { 
  DollarSign, ShoppingBag, Users, Package, 
  TrendingUp, TrendingDown, Clock, ArrowRight 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    recentOrders: [],
    lowStockProducts: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Gọi song song tất cả API để tính toán
        const [orders, products, customers] = await Promise.all([
          api_service.get_orders().catch(() => []),
          api_service.get_products().catch(() => []),
          api_service.get_customers().catch(() => [])
        ]);

        // 1. Tính tổng doanh thu
        const revenue = orders.reduce((sum, ord) => sum + Number(ord.total_amount || 0), 0);

        // 2. Lấy 5 đơn gần nhất (Giả sử API trả về list chưa sort, ta sort theo ID hoặc Date)
        // Nếu object order có field created_at thì sort, không thì lấy cuối mảng
        const sortedOrders = [...orders].reverse().slice(0, 5); 

        // 3. Tìm sản phẩm sắp hết hàng (< 10)
        const lowStock = products.filter(p => (p.stock_quantity || 0) < 10).slice(0, 5);

        setStats({
          totalRevenue: revenue,
          totalOrders: orders.length,
          totalCustomers: customers.length,
          totalProducts: products.length,
          recentOrders: sortedOrders,
          lowStockProducts: lowStock
        });
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // --- Helper Components ---
  const StatCard = ({ title, value, icon: Icon, color, subtext }) => (
    <Card className="border-slate-100 shadow-sm hover:shadow-md transition-all">
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <div className={`p-2 rounded-full ${color} bg-opacity-10`}>
            <Icon className={`h-4 w-4 ${color.replace("bg-", "text-")}`} />
          </div>
        </div>
        <div className="flex items-baseline gap-2 mt-2">
           <div className="text-2xl font-bold text-slate-800">{value}</div>
        </div>
        <p className="text-xs text-slate-400 mt-1">{subtext}</p>
      </CardContent>
    </Card>
  );

  if (loading) return <div className="p-8 text-center text-slate-500">Đang tổng hợp số liệu...</div>;

  return (
    <div className="p-6 space-y-6 bg-slate-50/50 min-h-screen">
      {/* 1. Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Tổng Quan</h2>
        <div className="flex items-center gap-2 text-sm text-slate-500 bg-white px-3 py-1 rounded-full border shadow-sm">
           <Clock size={14} /> 
           Cập nhật: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* 2. KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Tổng Doanh Thu" 
          value={`${stats.totalRevenue.toLocaleString()} ₫`} 
          icon={DollarSign} 
          color="bg-green-500" 
          subtext="Tính trên toàn bộ đơn hàng"
        />
        <StatCard 
          title="Đơn Hàng" 
          value={stats.totalOrders} 
          icon={ShoppingBag} 
          color="bg-blue-500"
          subtext="Tổng số đơn đã bán"
        />
        <StatCard 
          title="Khách Hàng" 
          value={stats.totalCustomers} 
          icon={Users} 
          color="bg-orange-500"
          subtext="Số lượng khách lưu hồ sơ"
        />
        <StatCard 
          title="Sản Phẩm" 
          value={stats.totalProducts} 
          icon={Package} 
          color="bg-indigo-500"
          subtext="Mặt hàng đang kinh doanh"
        />
      </div>

      {/* 3. Main Content Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        
        {/* Chart Section (Chiếm 4 phần) */}
        <Card className="col-span-4 border-slate-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-slate-800">Doanh thu tuần qua</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            {/* CSS Bar Chart giả lập */}
            <div className="h-[300px] flex items-end justify-between gap-2 px-4 pb-2">
               {[65, 40, 75, 50, 90, 80, 100].map((h, i) => (
                 <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                    <div 
                      className="w-full bg-blue-500 rounded-t-sm opacity-80 group-hover:opacity-100 transition-all relative"
                      style={{ height: `${h}%` }}
                    >
                       <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                         {h * 100}k
                       </div>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">T{i+2}</span>
                 </div>
               ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders & Low Stock (Chiếm 3 phần) */}
        <div className="col-span-3 space-y-4">
          
          {/* Đơn hàng gần đây */}
          <Card className="border-slate-100 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold text-slate-800">Đơn hàng mới</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs text-blue-600">Xem tất cả</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentOrders.length > 0 ? stats.recentOrders.map((order, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-slate-50 last:border-0 pb-2 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs">
                        #{order.order_id || i+1}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">
                          {order.customer_id ? `Khách hàng ${order.customer_id}` : "Khách lẻ"}
                        </p>
                        <p className="text-xs text-slate-400">Vừa xong</p>
                      </div>
                    </div>
                    <div className="font-bold text-sm text-slate-700">
                      +{Number(order.total_amount).toLocaleString()}đ
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-slate-400 text-center py-4">Chưa có đơn hàng nào</p>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Cảnh báo tồn kho */}
          <Card className="border-red-100 bg-red-50/30 shadow-sm">
            <CardHeader className="pb-2">
               <CardTitle className="text-sm font-semibold text-red-700 flex items-center gap-2">
                 <TrendingDown size={16} /> Cảnh báo tồn kho
               </CardTitle>
            </CardHeader>
            <CardContent>
               <div className="space-y-2">
                 {stats.lowStockProducts.length > 0 ? stats.lowStockProducts.map(p => (
                   <div key={p.product_id} className="flex justify-between items-center bg-white p-2 rounded border border-red-100">
                      <span className="text-sm text-slate-700 truncate max-w-[180px]">{p.product_name}</span>
                      <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                        Còn {p.stock_quantity}
                      </span>
                   </div>
                 )) : (
                   <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                     <TrendingUp size={14}/> Tồn kho ổn định
                   </p>
                 )}
               </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}