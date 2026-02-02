"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api_service } from "@/lib/api_service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Mail, Building2, ChevronDown, ShieldCheck } from "lucide-react"; 

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "", role: "employee" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handle_submit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    
    try {
      const data = await api_service.login(form.email, form.password, form.role);
      if (data && data.token) {
        window.location.href = "/dashboard"; 
      } else {
        alert(data.error || "Tài khoản hoặc mật khẩu không đúng!");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Không thể kết nối đến máy chủ!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f8fafc] relative overflow-hidden p-4">
      
      {/* 1. Nền trang trí hiện đại hơn với các đốm màu (Blobs) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-60 -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[120px] opacity-60 -z-10" />
      
      {/* 2. Hiệu ứng lưới Grid mờ */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 pointer-events-none -z-10" />

      <Card className="w-full max-w-[420px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border-white/50 bg-white/70 backdrop-blur-xl rounded-[24px] overflow-hidden">
        
        {/* Thanh trang trí phía trên cùng Card */}
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

        <CardHeader className="space-y-3 text-center pt-8 pb-6">
          <div className="flex justify-center mb-1">
            <div className="relative group">
              {/* Hiệu ứng hào quang sau Logo */}
              <div className="absolute inset-0 bg-blue-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-3xl shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-300">
                B
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <CardTitle className="text-2xl font-extrabold text-slate-900 tracking-tight">BizFlow Portal</CardTitle>
            <CardDescription className="text-slate-500 font-medium">Hệ thống quản trị doanh nghiệp thông minh</CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="px-8">
          <form onSubmit={handle_submit} className="space-y-5">
            
            {/* Vai trò - Custom UI */}
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-slate-600 uppercase tracking-wider ml-1">Vai trò</label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <Building2 size={18} />
                </div>
                <select 
                  className="w-full h-12 rounded-xl border-slate-200 bg-white/50 pl-10 pr-10 text-sm font-medium focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all appearance-none cursor-pointer outline-none shadow-sm"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="employee">Nhân viên (Employee)</option>
                  <option value="owner">Chủ cửa hàng (Owner)</option>
                  <option value="admin">Quản trị viên (Admin)</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-slate-600 uppercase tracking-wider ml-1">Email</label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <Mail size={18} />
                </div>
                <Input 
                  type="email" 
                  placeholder="name@company.com" 
                  className="h-12 rounded-xl border-slate-200 bg-white/50 pl-10 focus-visible:ring-4 focus-visible:ring-blue-500/10 focus-visible:border-blue-500 transition-all shadow-sm font-medium"
                  value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})} 
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[13px] font-bold text-slate-600 uppercase tracking-wider">Mật khẩu</label>
                <span className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer">Quên mật khẩu?</span>
              </div>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <Lock size={18} />
                </div>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  className="h-12 rounded-xl border-slate-200 bg-white/50 pl-10 focus-visible:ring-4 focus-visible:ring-blue-500/10 focus-visible:border-blue-500 transition-all shadow-sm font-medium"
                  value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})} 
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-slate-900 hover:bg-black text-white font-bold h-12 rounded-xl mt-2 shadow-xl shadow-slate-200 active:scale-[0.97] transition-all duration-200 overflow-hidden relative group"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Đang xác thực...
                </div>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Đăng nhập <ShieldCheck size={18} />
                </span>
              )}
              {/* Hiệu ứng lướt sáng trên nút khi hover */}
              <div className="absolute inset-0 w-1/2 h-full bg-white/10 skew-x-[-20deg] group-hover:left-full -left-full transition-all duration-500 pointer-events-none" />
            </Button>

          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 border-t border-slate-100 bg-slate-50/30 p-8 mt-6">
          <div className="flex items-center gap-2 text-slate-400">
            <div className="h-[1px] flex-1 bg-slate-200" />
            <span className="text-[10px] font-bold uppercase tracking-[2px]">Hỗ trợ kỹ thuật</span>
            <div className="h-[1px] flex-1 bg-slate-200" />
          </div>
          <p className="text-xs text-slate-500 text-center font-medium">
            Liên hệ <span className="text-slate-900 font-bold hover:underline cursor-pointer">Admin BizFlow</span> để cấp lại tài khoản
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}