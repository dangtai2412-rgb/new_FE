"use client";
import { useEffect, useState } from "react";
import { 
  DollarSign, Users, Package, ShoppingCart, 
  TrendingUp, Activity, Server, AlertCircle, 
  Clock, ArrowUpRight, History, ChevronRight,
  Plus, Calendar
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const formatMoney = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

export default function DashboardPage() {
  const [role, setRole] = useState("employee");
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    const storedRole = localStorage.getItem("role") || "employee";
    const storedName = localStorage.getItem("user_name") || "Thành viên";
    setRole(storedRole.toLowerCase());
    setUserName(storedName);
  }, []);

  return (
    <div className="min-h-screen bg-[#f1f5f9] p-4 md:p-8 space-y-8 relative overflow-hidden">
      
      {/* Nền Gradient mờ ảo */}
      <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-blue-200/30 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-indigo-200/30 rounded-full blur-[120px] -z-10 animate-pulse" />

      {/* HEADER: Chuyên nghiệp hơn */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/40 backdrop-blur-md p-6 rounded-[32px] border border-white/50 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="h-2 w-8 bg-blue-600 rounded-full" />
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-[3px]">Hệ thống BizFlow</span>
          </div>
          <h2 className="text-3xl font-black tracking-tighter text-slate-900 uppercase">
            {role === 'admin' ? 'Bảng điều khiển SaaS' : role === 'owner' ? 'Quản trị chi nhánh' : 'Khu vực làm việc'}
          </h2>
          <p className="text-slate-500 font-medium">Xin chào, <span className="text-slate-900 font-bold">{userName}</span></p>
        </div>
        
        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-inner border border-slate-100">
            <div className="text-right px-2">
                <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Trạng thái</span>
                <div className="flex items-center gap-2">
                    <span className="h-2 w-2 bg-emerald-500 rounded-full animate-ping" />
                    <span className="text-sm font-bold text-slate-700 capitalize">{role}</span>
                </div>
            </div>
            <div className="h-12 w-12 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
                <Activity size={24} />
            </div>
        </div>
      </div>

      {/* --- DASHBOARD ADMIN (SAAS) --- */}
      {role === "admin" && (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-700">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard title="Tổng doanh thu" value="452.0M" sub="+12.5% tháng này" icon={DollarSign} color="blue" />
            <StatsCard title="Khách hàng" value="1,280" sub="24 doanh nghiệp mới" icon={Users} color="purple" />
            <StatsCard title="Uptime" value="99.98%" sub="Hệ thống ổn định" icon={Server} color="emerald" />
            <StatsCard title="Yêu cầu hỗ trợ" value="12" sub="5 việc cần xử lý" icon={AlertCircle} color="red" />
          </div>

          <div className="grid gap-6 md:grid-cols-7">
            <Card className="md:col-span-4 border-none shadow-xl shadow-blue-900/5 bg-white/80 backdrop-blur-md rounded-[32px] overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-xl font-black">Tăng trưởng SaaS</CardTitle>
                        <CardDescription>Số lượng đăng ký mới hàng tuần</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-xl font-bold">Xuất CSV</Button>
                </CardHeader>
                <CardContent>
                    <div className="h-[220px] flex items-end gap-3 justify-between pt-8">
                        {[30, 60, 40, 85, 55, 75, 95].map((h, i) => (
                            <div key={i} className="flex-1 group relative">
                                <div className="absolute inset-x-0 bottom-0 bg-blue-100 rounded-t-xl h-full opacity-20" />
                                <div 
                                    className="w-full bg-gradient-to-t from-blue-600 to-indigo-500 rounded-t-xl transition-all duration-700 group-hover:from-blue-400 relative z-10" 
                                    style={{ height: `${h}%` }}
                                >
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all font-bold shadow-xl">
                                        {h}%
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card className="md:col-span-3 border-none shadow-xl shadow-blue-900/5 bg-slate-900 rounded-[32px] text-white">
                <CardHeader>
                    <CardTitle className="text-xl font-black">Nhật ký hệ thống</CardTitle>
                    <CardDescription className="text-slate-400">Hoạt động thời gian thực</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {[
                        { label: "Gia hạn", name: "Vinamilk", time: "2p", status: "success" },
                        { label: "Đăng ký", name: "The Coffee House", time: "15p", status: "new" },
                        { label: "Lỗi", name: "Cổng thanh toán", time: "1h", status: "error" },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                            <div className={`h-2 w-2 rounded-full ${item.status === 'error' ? 'bg-red-500 shadow-[0_0_10px_red]' : 'bg-emerald-500 shadow-[0_0_10px_emerald]'}`} />
                            <div className="flex-1 text-sm font-bold">{item.name}</div>
                            <div className="text-[10px] font-black text-slate-500 uppercase">{item.time} trước</div>
                        </div>
                    ))}
                </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* --- DASHBOARD OWNER (CHỦ SHOP) --- */}
      {role === "owner" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard title="Doanh số hôm nay" value={formatMoney(8450000)} sub="14 đơn hàng" icon={ShoppingCart} color="emerald" />
            <StatsCard title="Sản phẩm sắp hết" value="08" sub="Cần nhập thêm" icon={Package} color="red" />
            <StatsCard title="Khách hàng nợ" value={formatMoney(2400000)} sub="03 khách" icon={History} color="purple" />
            <StatsCard title="Lợi nhuận" value="+32%" sub="Tăng so với hôm qua" icon={TrendingUp} color="blue" />
          </div>

          <Card className="border-none shadow-xl shadow-slate-200 bg-white rounded-[32px]">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-6">
                <div>
                    <CardTitle className="text-xl font-black">Danh sách đơn hàng mới</CardTitle>
                    <CardDescription>Cập nhật tự động sau mỗi 30 giây</CardDescription>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 rounded-2xl font-bold gap-2">
                    <Plus size={18} /> Tạo đơn mới
                </Button>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-[10px] uppercase font-black text-slate-400 bg-slate-50/50">
                            <tr>
                                <th className="px-6 py-4 tracking-[2px]">Mã đơn</th>
                                <th className="px-6 py-4 tracking-[2px]">Khách hàng</th>
                                <th className="px-6 py-4 tracking-[2px]">Số tiền</th>
                                <th className="px-6 py-4 tracking-[2px]">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {[1, 2, 3].map((i) => (
                                <tr key={i} className="hover:bg-slate-50/50 transition-colors cursor-pointer group">
                                    <td className="px-6 py-5 font-bold text-blue-600">#ORD-902{i}</td>
                                    <td className="px-6 py-5 font-bold text-slate-700">Khách vãng lai {i}</td>
                                    <td className="px-6 py-5 font-black text-slate-900">{formatMoney(120000 * i)}</td>
                                    <td className="px-6 py-5">
                                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase">Hoàn thành</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* --- DASHBOARD NHÂN VIÊN --- */}
      {role === "employee" && (
        <div className="grid gap-6 md:grid-cols-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Card className="md:col-span-1 bg-blue-600 text-white rounded-[32px] border-none shadow-2xl shadow-blue-500/20">
                <CardHeader>
                    <CardTitle className="font-black text-2xl uppercase tracking-tighter">Ca làm việc</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="text-5xl font-black">08:00</div>
                    <p className="text-blue-100 font-medium">Bắt đầu lúc 07:55 AM</p>
                    <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 font-black h-14 rounded-2xl shadow-xl">KẾT THÚC CA</Button>
                </CardContent>
            </Card>
            
            <Card className="md:col-span-2 bg-white rounded-[32px] border-none shadow-xl shadow-slate-200 overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="font-black uppercase tracking-tighter">Việc cần làm hôm nay</CardTitle>
                    <Calendar className="text-slate-300" />
                </CardHeader>
                <CardContent className="space-y-4">
                    {["Kiểm kho cuối ngày", "Gửi báo cáo doanh thu", "Dọn dẹp quầy kệ"].map((task, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:border-blue-200 transition-all cursor-pointer group">
                            <div className="h-6 w-6 rounded-lg border-2 border-slate-200 group-hover:border-blue-500" />
                            <span className="font-bold text-slate-600 group-hover:text-slate-900">{task}</span>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}

function StatsCard({ title, value, sub, icon: Icon, color }) {
    const colors = {
        blue: "text-blue-600 bg-blue-50 border-blue-100 shadow-blue-500/10",
        purple: "text-purple-600 bg-purple-50 border-purple-100 shadow-purple-500/10",
        emerald: "text-emerald-600 bg-emerald-50 border-emerald-100 shadow-emerald-500/10",
        red: "text-red-600 bg-red-50 border-red-100 shadow-red-500/10",
    };

    return (
        <Card className="border-none shadow-xl shadow-slate-200 bg-white/70 backdrop-blur-md rounded-[32px] overflow-hidden group hover:bg-white transition-all duration-300">
            <CardContent className="p-6">
                <div className="flex justify-between items-start">
                    <div className={`p-4 rounded-2xl ${colors[color]} border transition-all duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                        <Icon size={24} />
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg text-slate-300">
                        <ArrowUpRight size={14} />
                    </div>
                </div>
                <div className="mt-6 space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[2px]">{title}</p>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tighter">{value}</h3>
                    <div className="flex items-center gap-1.5 mt-2">
                        <div className="h-1 w-1 rounded-full bg-slate-300" />
                        <p className="text-[11px] font-bold text-slate-500 italic">{sub}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}