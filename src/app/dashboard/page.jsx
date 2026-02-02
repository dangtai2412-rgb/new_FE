"use client";
import { useEffect, useState } from "react";
import { 
  DollarSign, Users, Package, ShoppingCart, 
  TrendingUp, Activity, Server, AlertCircle, 
  Clock, ArrowUpRight, History 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const formatMoney = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

export default function DashboardPage() {
  const [role, setRole] = useState("employee");
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    // Trong thực tế: Hãy fetch từ API thay vì localStorage
    const storedRole = localStorage.getItem("role") || "employee";
    const storedName = localStorage.getItem("user_name") || "Thành viên";
    setRole(storedRole.toLowerCase());
    setUserName(storedName);
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 space-y-8 relative overflow-hidden">
      
      {/* Background Decor (Đồng bộ với trang Login) */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-100/40 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-100/40 rounded-full blur-[100px] -z-10" />

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-black tracking-tighter text-slate-900 uppercase">Hệ thống BizFlow</h2>
          <p className="text-slate-500 font-medium">Chào mừng trở lại, <span className="text-blue-600 font-bold">{userName}</span></p>
        </div>
        
        <div className="flex items-center gap-3">
            <div className="flex flex-col items-end mr-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vai trò hiện tại</span>
                <span className={`text-sm font-bold ${role === 'admin' ? 'text-blue-600' : 'text-emerald-600'}`}>
                    {role === 'admin' ? 'TỔNG QUẢN TRỊ' : role === 'owner' ? 'CHỦ HỆ THỐNG' : 'NHÂN VIÊN VẬN HÀNH'}
                </span>
            </div>
            <div className="h-10 w-10 rounded-2xl bg-white shadow-sm border border-slate-200 flex items-center justify-center">
                <Activity size={20} className="text-blue-600" />
            </div>
        </div>
      </div>

      {/* --- DASHBOARD ADMIN (SAAS MANAGEMENT) --- */}
      {role === "admin" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard title="Doanh thu SaaS" value="45.2M" sub="+20% tháng này" icon={DollarSign} color="blue" />
            <StatsCard title="Doanh nghiệp" value="128" sub="4 shop mới hôm nay" icon={Users} color="purple" />
            <StatsCard title="Hệ thống" value="99.9%" sub="Uptime 30 ngày" icon={Server} color="emerald" />
            <StatsCard title="Sự cố" value="02" sub="Cần xử lý ngay" icon={AlertCircle} color="red" />
          </div>

          <div className="grid gap-6 md:grid-cols-7">
            <Card className="md:col-span-4 border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/70 backdrop-blur-xl rounded-[24px]">
                <CardHeader>
                    <CardTitle className="text-lg font-black tracking-tight">Tăng trưởng khách hàng</CardTitle>
                    <CardDescription>Dữ liệu đăng ký trong 7 ngày gần nhất</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[200px] flex items-end gap-3 justify-between">
                        {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
                            <div key={i} className="flex-1 group relative">
                                <div 
                                    className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all duration-500 group-hover:from-blue-500" 
                                    style={{ height: `${h}%` }}
                                >
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                                        {h} users
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                        <span>Thứ 2</span><span>Thứ 3</span><span>Thứ 4</span><span>Thứ 5</span><span>Thứ 6</span><span>Thứ 7</span><span>CN</span>
                    </div>
                </CardContent>
            </Card>

            <Card className="md:col-span-3 border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/70 backdrop-blur-xl rounded-[24px]">
                <CardHeader>
                    <CardTitle className="text-lg font-black tracking-tight">Hoạt động mới</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {[1, 2, 3].map((_, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                            <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs">
                                BK
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-slate-800">Bách Hóa Xanh</p>
                                <p className="text-[11px] text-slate-500">Vừa gia hạn gói Enterprise</p>
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 tracking-tighter uppercase">2p trước</span>
                        </div>
                    ))}
                </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Các phần Owner và Employee có thể nâng cấp tương tự card trên */}
    </div>
  );
}

// Component con để tái sử dụng
function StatsCard({ title, value, sub, icon: Icon, color }) {
    const colors = {
        blue: "text-blue-600 bg-blue-50 border-blue-100",
        purple: "text-purple-600 bg-purple-50 border-purple-100",
        emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
        red: "text-red-600 bg-red-50 border-red-100",
    };

    return (
        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/70 backdrop-blur-xl rounded-[24px] overflow-hidden group hover:scale-[1.02] transition-all duration-300">
            <CardContent className="p-6">
                <div className="flex justify-between items-start">
                    <div className={`p-3 rounded-2xl ${colors[color]} border transition-transform group-hover:rotate-6`}>
                        <Icon size={20} />
                    </div>
                    <ArrowUpRight size={16} className="text-slate-300" />
                </div>
                <div className="mt-4 space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
                    <h3 className="text-2xl font-black text-slate-900">{value}</h3>
                    <p className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                        <Clock size={10} /> {sub}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}