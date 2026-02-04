"use client";
import { useEffect, useState } from "react";
import {
  DollarSign, Users, Package, ShoppingCart,
  TrendingUp, Activity, ArrowUpRight, Clock,
  MoreHorizontal, CreditCard, Calendar
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Hàm format tiền tệ
const formatMoney = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

export default function DashboardPage() {
  const [role, setRole] = useState("employee");
  const [userName, setUserName] = useState("User");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedRole = localStorage.getItem("role") || "employee";
    const storedName = localStorage.getItem("user_name") || "Bạn";
    setRole(storedRole.toLowerCase());
    setUserName(storedName);
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col space-y-6 p-6 bg-slate-50/50 min-h-screen">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h2>
          <p className="text-slate-500 mt-1">
            Tổng quan tình hình kinh doanh hôm nay.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="hidden md:flex bg-white">
            <Calendar className="mr-2 h-4 w-4" />
            {new Date().toLocaleDateString('vi-VN')}
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <ArrowUpRight className="mr-2 h-4 w-4" />
            Tải báo cáo
          </Button>
        </div>
      </div>

      {/* --- STATS CARDS (4 CHỈ SỐ QUAN TRỌNG) --- */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
          title="Tổng Doanh Thu" 
          value={formatMoney(45231000)} 
          subtext="+20.1% so với tháng trước" 
          icon={DollarSign} 
          trend="up"
        />
        <StatsCard 
          title="Khách Hàng Mới" 
          value="+2,350" 
          subtext="+180 trong tuần này" 
          icon={Users} 
          trend="up"
        />
        <StatsCard 
          title="Đơn Hàng" 
          value="12,234" 
          subtext="+19% so với tháng trước" 
          icon={ShoppingCart} 
          trend="up"
        />
        <StatsCard 
          title="Hàng Tồn Kho" 
          value="573" 
          subtext="-20 sản phẩm hết hàng" 
          icon={Activity} 
          trend="down"
        />
      </div>

      {/* --- MAIN CONTENT GRID --- */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        
        {/* BIỂU ĐỒ (Chiếm 4/7 chiều rộng) */}
        <Card className="col-span-4 shadow-sm">
          <CardHeader>
            <CardTitle>Biểu đồ Doanh thu</CardTitle>
            <CardDescription>Doanh thu 7 ngày gần nhất (Đơn vị: Triệu VNĐ)</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <OverviewChart />
          </CardContent>
        </Card>

        {/* HOẠT ĐỘNG GẦN ĐÂY (Chiếm 3/7 chiều rộng) */}
        <Card className="col-span-3 shadow-sm">
          <CardHeader>
            <CardTitle>Vừa mới bán</CardTitle>
            <CardDescription>
              Bạn có 265 đơn hàng trong tháng này.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentSales />
          </CardContent>
        </Card>
      </div>

      {/* --- BOTTOM SECTION --- */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* TOP SẢN PHẨM (Chiếm 4/7) */}
         <Card className="col-span-4 shadow-sm">
          <CardHeader>
            <CardTitle>Top Sản Phẩm Bán Chạy</CardTitle>
            <CardDescription>Các mặt hàng có doanh số cao nhất tháng</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="space-y-6">
                <ProductItem name="Áo thun Premium Cotton" sales="2.4tr" percent={85} />
                <ProductItem name="Quần Jean Slimfit Nam" sales="1.8tr" percent={65} />
                <ProductItem name="Giày Sneaker White" sales="1.2tr" percent={45} />
                <ProductItem name="Balo Laptop Chống Nước" sales="950k" percent={30} />
             </div>
          </CardContent>
        </Card>

        {/* THÔNG BÁO / NHẮC NHỞ (Chiếm 3/7) */}
        <Card className="col-span-3 bg-blue-600 text-white shadow-md">
            <CardHeader>
                <CardTitle className="text-white">Thông báo hệ thống</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-start gap-3 bg-white/10 p-3 rounded-lg">
                    <Activity className="h-5 w-5 mt-0.5 text-blue-200" />
                    <div>
                        <p className="font-medium text-sm">Bảo trì định kỳ</p>
                        <p className="text-xs text-blue-100">Hệ thống sẽ bảo trì vào 02:00 sáng mai.</p>
                    </div>
                </div>
                <div className="flex items-start gap-3 bg-white/10 p-3 rounded-lg">
                    <Package className="h-5 w-5 mt-0.5 text-blue-200" />
                    <div>
                        <p className="font-medium text-sm">Cảnh báo tồn kho</p>
                        <p className="text-xs text-blue-100">5 mã sản phẩm dưới định mức tối thiểu.</p>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

// --- SUB COMPONENTS (THÀNH PHẦN CON) ---

// 1. Thẻ chỉ số (Stats Card)
function StatsCard({ title, value, subtext, icon: Icon, trend }) {
  return (
    <Card className="shadow-sm hover:shadow-md transition-all duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
        <Icon className="h-4 w-4 text-slate-400" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        <p className={`text-xs mt-1 ${trend === 'up' ? 'text-green-600' : 'text-red-500'} flex items-center`}>
          {trend === 'up' ? <TrendingUp size={12} className="mr-1" /> : <Activity size={12} className="mr-1" />}
          {subtext}
        </p>
      </CardContent>
    </Card>
  );
}

// 2. Biểu đồ cột (Custom Bar Chart) - Không cần thư viện ngoài
function OverviewChart() {
    // Dữ liệu giả lập
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
                    {/* Tooltip giá trị */}
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 transition-opacity bg-slate-800 text-white text-[10px] py-1 px-2 rounded">
                        {item.total}tr
                    </div>
                    {/* Cột biểu đồ */}
                    <div 
                        className="w-full max-w-[40px] bg-slate-100 rounded-t-md relative overflow-hidden group-hover:bg-slate-200 transition-all cursor-pointer"
                        style={{ height: '200px' }} // Chiều cao khung chứa
                    >
                         <div 
                            className="absolute bottom-0 left-0 right-0 bg-blue-600 rounded-t-md transition-all duration-500 ease-out group-hover:bg-blue-500"
                            style={{ height: item.height }}
                         ></div>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">{item.name}</span>
                </div>
            ))}
        </div>
    )
}

// 3. Danh sách bán hàng gần đây
function RecentSales() {
  const sales = [
      { name: "Nguyễn Văn A", email: "nguyena@example.com", amount: "+1.200.000đ" },
      { name: "Trần Thị B", email: "tranb@gmail.com", amount: "+450.000đ" },
      { name: "Lê C", email: "lec@hotmail.com", amount: "+2.300.000đ" },
      { name: "Phạm D", email: "phamd@outlook.com", amount: "+850.000đ" },
      { name: "Hoàng E", email: "hoange@test.com", amount: "+150.000đ" },
  ];

  return (
    <div className="space-y-6">
      {sales.map((sale, i) => (
        <div key={i} className="flex items-center justify-between group cursor-pointer hover:bg-slate-50 p-2 -mx-2 rounded-lg transition-colors">
            <div className="flex items-center gap-4">
                 <div className="h-9 w-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
                    {sale.name.charAt(0)}
                 </div>
                 <div className="space-y-1">
                    <p className="text-sm font-medium leading-none text-slate-900">{sale.name}</p>
                    <p className="text-xs text-slate-500">{sale.email}</p>
                 </div>
            </div>
            <div className="font-bold text-sm text-slate-700 group-hover:text-blue-600 transition-colors">
                {sale.amount}
            </div>
        </div>
      ))}
    </div>
  );
}

// 4. Item sản phẩm (có thanh progress)
function ProductItem({ name, sales, percent }) {
    return (
        <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700">{name}</span>
                <span className="text-slate-500">{sales}</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-blue-500 rounded-full" 
                    style={{ width: `${percent}%` }}
                ></div>
            </div>
        </div>
    )
}