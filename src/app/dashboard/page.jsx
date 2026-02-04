"use client";
import { useEffect, useState } from "react";
import { 
  DollarSign, Users, Package, ShoppingCart, 
  TrendingUp, Activity, Server, AlertCircle 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formatMoney = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

export default function DashboardPage() {
  const [role, setRole] = useState("owner"); 
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    // Lấy role thật từ lúc đăng nhập
    const r = localStorage.getItem("role");
    const u = localStorage.getItem("user_name");
    if (r) setRole(r.toLowerCase());
    if (u) setUserName(u);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Tổng quan</h2>
          <p className="text-slate-500">Xin chào, {userName}! ({role === 'admin' ? 'Quản trị viên' : role === 'owner' ? 'Chủ cửa hàng' : 'Nhân viên'})</p>
        </div>
      </div>

      {/* --- GIAO DIỆN ADMIN (QUẢN TRỊ HỆ THỐNG SAAS) --- */}
      {role === "admin" && (
        <div className="grid gap-4 md:grid-cols-4 animate-in fade-in slide-in-from-bottom-4">
          <Card className="border-l-4 border-blue-600 shadow-sm"><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-500">Doanh thu SaaS</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold text-slate-800">45.2 Tr</div><p className="text-xs text-green-600">+12% tháng này</p></CardContent></Card>
          <Card className="border-l-4 border-purple-600 shadow-sm"><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-500">Shop hoạt động</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold text-slate-800">128</div><p className="text-xs text-slate-400">Active shops</p></CardContent></Card>
          <Card className="border-l-4 border-green-600 shadow-sm"><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-500">Server Uptime</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold text-green-600">99.9%</div><p className="text-xs text-slate-400">Stable</p></CardContent></Card>
          <Card className="border-l-4 border-red-500 shadow-sm"><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-500">Cảnh báo lỗi</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold text-red-600">0</div><p className="text-xs text-slate-400">Hệ thống an toàn</p></CardContent></Card>
        </div>
      )}

      {/* --- GIAO DIỆN OWNER (CHỦ CỬA HÀNG VLXD) --- */}
      {role === "owner" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="shadow-sm hover:shadow-md transition-all"><CardHeader className="pb-2 flex flex-row justify-between"><CardTitle className="text-sm text-slate-500">Doanh thu ngày</CardTitle><DollarSign className="w-4 h-4 text-green-600"/></CardHeader>
              <CardContent><div className="text-2xl font-bold text-green-700">{formatMoney(8500000)}</div><p className="text-xs text-slate-400 mt-1">15 đơn hàng</p></CardContent></Card>
            <Card className="shadow-sm hover:shadow-md transition-all"><CardHeader className="pb-2 flex flex-row justify-between"><CardTitle className="text-sm text-slate-500">Khách nợ</CardTitle><Users className="w-4 h-4 text-orange-600"/></CardHeader>
              <CardContent><div className="text-2xl font-bold text-orange-700">{formatMoney(3200000)}</div><p className="text-xs text-slate-400 mt-1">Cần thu hồi</p></CardContent></Card>
            <Card className="shadow-sm hover:shadow-md transition-all"><CardHeader className="pb-2 flex flex-row justify-between"><CardTitle className="text-sm text-slate-500">Tồn kho</CardTitle><Package className="w-4 h-4 text-blue-600"/></CardHeader>
              <CardContent><div className="text-2xl font-bold text-slate-800">1,240</div><p className="text-xs text-slate-400 mt-1">Sản phẩm</p></CardContent></Card>
            <Card className="bg-blue-600 text-white shadow-lg"><CardHeader className="pb-2"><CardTitle className="text-sm text-blue-100">Lợi nhuận ròng</CardTitle></CardHeader>
              <CardContent><div className="text-2xl font-bold">{formatMoney(2100000)}</div><p className="text-xs text-blue-200 mt-1">Hôm nay</p></CardContent></Card>
          </div>
          
          <Card className="shadow-sm">
            <CardHeader><CardTitle>Biểu đồ doanh thu tuần qua</CardTitle></CardHeader>
            <CardContent className="h-48 flex items-end justify-between gap-2 px-4 pb-0">
              {[45, 72, 38, 95, 52, 88, 65].map((h,i) => (
                <div key={i} className="flex flex-col items-center flex-1 gap-2 group">
                  <div className="w-full bg-blue-100 rounded-t-sm hover:bg-blue-500 transition-colors relative" style={{height: `${h}%`}}>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-bold opacity-0 group-hover:opacity-100 bg-black text-white px-2 py-1 rounded transition-opacity">{h}%</div>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">T{i+2}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* --- GIAO DIỆN EMPLOYEE (NHÂN VIÊN) --- */}
      {role === "employee" && (
        <div className="grid gap-4 md:grid-cols-2 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-blue-50 border-blue-100"><CardHeader className="pb-2"><CardTitle className="text-sm text-blue-700">Ca làm việc</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold text-blue-900">Ca Sáng (8h-12h)</div><p className="text-xs text-blue-600 mt-1">Đã chấm công lúc 07:55 ✅</p></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-slate-500">Doanh số cá nhân</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold text-green-600">{formatMoney(1500000)}</div><p className="text-xs text-slate-400 mt-1">3 đơn hàng thành công</p></CardContent></Card>
        </div>
      )}
    </div>
  );
}