"use client";
import { useEffect, useState } from "react";
import {
  DollarSign, Users, Package, ShoppingCart,
  TrendingUp, Activity, ArrowUpRight, Clock,
  AlertTriangle, CheckCircle2, RefreshCcw
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api_service } from "@/lib/api_service"; // Import service gọi API

// Hàm format tiền tệ
const formatMoney = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

export default function DashboardPage() {
  const [role, setRole] = useState("employee");
  const [userName, setUserName] = useState("User");
  const [loading, setLoading] = useState(true);
  
  // --- STATE DỮ LIỆU THỰC TẾ ---
  const [products, setProducts] = useState([]); // Danh sách sản phẩm từ API
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalStockValue: 0,
    lowStockCount: 0,
    outOfStockCount: 0
  });

  useEffect(() => {
    // 1. Lấy thông tin User
    const storedRole = localStorage.getItem("role") || "employee";
    const storedName = localStorage.getItem("user_name") || "Bạn";
    setRole(storedRole.toLowerCase());
    setUserName(storedName);

    // 2. Gọi API lấy dữ liệu sản phẩm để đồng bộ
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Gọi API lấy danh sách sản phẩm (giống trang POS/Inventory)
      const fetchedProducts = await api_service.get_products();
      
      if (Array.isArray(fetchedProducts)) {
        setProducts(fetchedProducts);
        
        // --- TÍNH TOÁN CHỈ SỐ DASHBOARD TỪ DỮ LIỆU THẬT ---
        const totalProds = fetchedProducts.length;
        
        // Tính tổng giá trị tồn kho (Số lượng * Giá vốn hoặc Giá bán)
        const totalValue = fetchedProducts.reduce((sum, p) => sum + ((p.price || 0) * (p.stock || 0)), 0);
        
        // Đếm sản phẩm sắp hết (dưới 10)
        const lowStock = fetchedProducts.filter(p => (p.stock || 0) > 0 && (p.stock || 0) <= 10).length;
        
        // Đếm sản phẩm đã hết hàng
        const outStock = fetchedProducts.filter(p => (p.stock || 0) === 0).length;

        setStats({
          totalProducts: totalProds,
          totalStockValue: totalValue,
          lowStockCount: lowStock,
          outOfStockCount: outStock
        });
      }
    } catch (error) {
      console.error("Lỗi đồng bộ Dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-6 p-6 bg-slate-50/50 min-h-screen">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h2>
          <p className="text-slate-500 mt-1">
            Xin chào <span className="font-semibold text-blue-600">{userName}</span>, đây là tổng quan tình hình kinh doanh.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={fetchDashboardData} disabled={loading} className="bg-white">
             <RefreshCcw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
             Làm mới dữ liệu
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <ArrowUpRight className="mr-2 h-4 w-4" />
            Tải báo cáo
          </Button>
        </div>
      </div>

      {/* --- STATS CARDS (DỮ LIỆU ĐỒNG BỘ) --- */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Doanh thu (Vẫn là giả định vì chưa có API Orders đầy đủ) */}
        <StatsCard 
          title="Tổng Doanh Thu" 
          value={formatMoney(45231000)} 
          subtext="+20.1% so với tháng trước" 
          icon={DollarSign} 
          trend="up"
        />
        
        {/* Card 2: Giá trị kho (TÍNH TỪ SẢN PHẨM THẬT) */}
        <StatsCard 
          title="Giá Trị Tồn Kho" 
          value={loading ? "..." : formatMoney(stats.totalStockValue)} 
          subtext={`${stats.totalProducts} mã sản phẩm đang quản lý`}
          icon={Package} 
          trend="neutral"
        />
        
        {/* Card 3: Cảnh báo kho (TÍNH TỪ SẢN PHẨM THẬT) */}
        <StatsCard 
          title="Cần Nhập Hàng" 
          value={loading ? "..." : (stats.lowStockCount + stats.outOfStockCount).toString()} 
          subtext={
             <span className="flex items-center text-red-600 font-medium">
                {stats.outOfStockCount} hết hàng, {stats.lowStockCount} sắp hết
             </span>
          }
          icon={AlertTriangle} 
          trend={stats.lowStockCount > 0 ? "down" : "up"}
          highlight={stats.lowStockCount > 0}
        />
        
        {/* Card 4: Hoạt động */}
        <StatsCard 
          title="Đơn Hàng Mới" 
          value="12" 
          subtext="Đơn hàng chờ xử lý hôm nay" 
          icon={ShoppingCart} 
          trend="up"
        />
      </div>

      {/* --- MAIN CONTENT GRID --- */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        
        {/* BIỂU ĐỒ DOANH THU (Giữ nguyên UI) */}
        <Card className="col-span-4 shadow-sm">
          <CardHeader>
            <CardTitle>Biểu đồ Doanh thu</CardTitle>
            <CardDescription>Doanh thu ghi nhận trong 7 ngày qua</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <OverviewChart />
          </CardContent>
        </Card>

        {/* TOP SẢN PHẨM (Lấy ngẫu nhiên từ danh sách thật để hiển thị) */}
        <Card className="col-span-3 shadow-sm">
          <CardHeader>
            <CardTitle>Sản phẩm bán chạy</CardTitle>
            <CardDescription>
              Dựa trên xu hướng nhập hàng gần đây.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <div className="space-y-6">
                {loading ? (
                    <p className="text-sm text-slate-400">Đang tải dữ liệu...</p>
                ) : products.length > 0 ? (
                    // Lấy 4 sản phẩm đầu tiên hoặc ngẫu nhiên từ list thật để hiển thị
                    products.slice(0, 4).map((prod, idx) => (
                        <ProductItem 
                            key={prod.id || idx} 
                            name={prod.name} 
                            // Giả lập doanh số dựa trên giá
                            sales={formatMoney((prod.price || 0) * 5)} 
                            percent={80 - (idx * 15)} 
                        />
                    ))
                ) : (
                    <p className="text-sm text-slate-500">Chưa có dữ liệu sản phẩm.</p>
                )}
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// --- SUB COMPONENTS ---

function StatsCard({ title, value, subtext, icon: Icon, trend, highlight }) {
  return (
    <Card className={`shadow-sm transition-all duration-200 ${highlight ? 'border-red-200 bg-red-50/50' : 'hover:shadow-md'}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${highlight ? 'text-red-500' : 'text-slate-400'}`} />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${highlight ? 'text-red-700' : 'text-slate-900'}`}>{value}</div>
        <div className={`text-xs mt-1 text-slate-500 flex items-center`}>
          {typeof subtext === 'string' ? subtext : subtext}
        </div>
      </CardContent>
    </Card>
  );
}

function OverviewChart() {
    const data = [
        { name: "T2", total: 45, height: "60%" },
        { name: "T3", total: 23, height: "30%" },
        { name: "T4", total: 78, height: "85%" },
        { name: "T5", total: 56, height: "65%" },
        { name: "T6", total: 92, height: "100%" },
        { name: "T7", total: 64, height: "70%" },
        { name: "CN", total: 35, height: "45%" },
    ];

    return (
        <div className="mt-4 h-[250px] w-full flex items-end justify-between gap-2 px-2">
            {data.map((item, index) => (
                <div key={index} className="flex flex-col items-center gap-2 w-full group relative">
                    <div className="w-full max-w-[40px] bg-slate-100 rounded-t-md relative overflow-hidden group-hover:bg-slate-200 transition-all cursor-pointer" style={{ height: '200px' }}>
                         <div className="absolute bottom-0 left-0 right-0 bg-blue-600 rounded-t-md transition-all duration-500 ease-out group-hover:bg-blue-500" style={{ height: item.height }}></div>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">{item.name}</span>
                </div>
            ))}
        </div>
    )
}

function ProductItem({ name, sales, percent }) {
    return (
        <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700 truncate max-w-[180px]">{name}</span>
                <span className="text-slate-500">{sales}</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${percent}%` }}></div>
            </div>
        </div>
    )
}