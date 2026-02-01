"use client";
import { useEffect, useState } from "react";
import { 
  DollarSign, Users, Package, ShoppingCart, 
  TrendingUp, Activity, Server, AlertCircle 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Hàm format tiền tệ
const formatMoney = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

export default function DashboardPage() {
  const [role, setRole] = useState("employee");
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    // Lấy role từ localStorage (mặc định là employee để an toàn)
    const storedRole = localStorage.getItem("role") || "employee";
    const storedName = localStorage.getItem("user_name") || "Bạn";
    setRole(storedRole.toLowerCase());
    setUserName(storedName);
  }, []);

  return (
    <div className="space-y-6 p-4">
      {/* Lời chào chung */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Tổng quan</h2>
          <p className="text-slate-500">Xin chào, {userName}! Chúc một ngày làm việc hiệu quả.</p>
        </div>
        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-bold uppercase border border-blue-200">
          {role === 'admin' ? 'Quản trị viên' : role === 'owner' ? 'Chủ cửa hàng' : 'Nhân viên'}
        </span>
      </div>

      {/* --- PHẦN DASHBOARD CHO ADMIN (SAAS) --- */}
      {role === "admin" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-l-4 border-l-blue-600 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Tổng Doanh Thu (SaaS)</CardTitle>
                <DollarSign className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45.200.000 đ</div>
                <p className="text-xs text-green-600 flex items-center mt-1"><TrendingUp size={12} className="mr-1"/> +20.1% so với tháng trước</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-purple-600 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Cửa hàng hoạt động</CardTitle>
                <Users className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">128</div>
                <p className="text-xs text-slate-500 mt-1">+4 cửa hàng mới hôm nay</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-green-600 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Trạng thái Server</CardTitle>
                <Activity className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">Ổn định</div>
                <p className="text-xs text-slate-500 mt-1">CPU: 12% | RAM: 3.4GB</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-red-500 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Cảnh báo lỗi</CardTitle>
                <AlertCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">02</div>
                <p className="text-xs text-slate-500 mt-1">Lỗi thanh toán gateway (1h trước)</p>
              </CardContent>
            </Card>
          </div>

          {/* Biểu đồ giả lập (CSS thuần) */}
          <Card>
            <CardHeader><CardTitle>Biểu đồ đăng ký mới (7 ngày qua)</CardTitle></CardHeader>
            <CardContent>
              <div className="h-40 flex items-end gap-2 justify-between px-2">
                {[4, 7, 3, 8, 12, 9, 15].map((h, i) => (
                  <div key={i} className="w-full bg-blue-100 rounded-t-sm hover:bg-blue-200 transition-colors relative group" style={{ height: `${h * 10}%` }}>
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity">{h}</div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-slate-400 mt-2 px-2">
                <span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>T7</span><span>CN</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* --- PHẦN DASHBOARD CHO OWNER (CHỦ SHOP) --- */}
      {role === "owner" && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Doanh thu hôm nay</CardTitle>
              <DollarSign className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-700">{formatMoney(8500000)}</div>
              <p className="text-xs text-slate-500 mt-1">12 đơn hàng thành công</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Khách nợ</CardTitle>
              <Users className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-700">{formatMoney(3200000)}</div>
              <p className="text-xs text-slate-500 mt-1">Cần thu hồi sớm</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Tổng Tồn Kho</CardTitle>
              <Package className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,240</div>
              <p className="text-xs text-slate-500 mt-1">Sản phẩm các loại</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm hover:shadow-md transition-shadow bg-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">Lợi nhuận ròng</CardTitle>
              <TrendingUp className="h-4 w-4 text-white" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatMoney(2100000)}</div>
              <p className="text-xs text-blue-100 mt-1">Ước tính hôm nay</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* --- PHẦN DASHBOARD CHO NHÂN VIÊN --- */}
      {role === "employee" && (
        <div className="grid gap-4 md:grid-cols-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Ca làm việc</CardTitle></CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">08:00 - 17:00</div>
              <p className="text-xs text-slate-500">Đã chấm công lúc 07:55 ✅</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Doanh số cá nhân</CardTitle></CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatMoney(4500000)}</div>
              <p className="text-xs text-slate-500">Đã bán 5 đơn hôm nay</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}