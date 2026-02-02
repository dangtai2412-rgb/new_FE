"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api_service } from "@/lib/api_service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Mail, Building2, ChevronDown, ShieldCheck, Eye, EyeOff } from "lucide-react"; 

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "", role: "employee" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isError, setIsError] = useState(false); // Trạng thái để rung lắc form

  const handle_submit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setIsError(false);
    
    try {
      const data = await api_service.login(form.email, form.password, form.role);
      if (data && data.token) {
        window.location.href = "/dashboard"; 
      } else {
        triggerError();
        alert(data.error || "Tài khoản hoặc mật khẩu không đúng!");
      }
    } catch (error) {
      triggerError();
      alert("Không thể kết nối đến máy chủ!");
    } finally {
      setLoading(false);
    }
  };

  // Hàm tạo hiệu ứng rung khi lỗi
  const triggerError = () => {
    setIsError(true);
    setTimeout(() => setIsError(false), 500);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f8fafc] relative overflow-hidden p-4">
      
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-60 -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[120px] opacity-60 -z-10" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 -z-10" />

      {/* Thêm class 'animate-shake' nếu có lỗi */}
      <Card className={`w-full max-w-[420px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border-white/50 bg-white/70 backdrop-blur-xl rounded-[24px] overflow-hidden transition-transform duration-300 ${isError ? 'animate-bounce border-red-200' : ''}`}>
        
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

        <CardHeader className="space-y-3 text-center pt-8 pb-6">
          <div className="flex justify-center mb-1">
            <div className="relative group cursor-pointer">
              <div className="absolute inset-0 bg-blue-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-3xl shadow-2xl rotate-3 group-hover:rotate-0 transition-all duration-500">
                B
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <CardTitle className="text-2xl font-extrabold text-slate-900 tracking-tight">BizFlow Portal</CardTitle>
            <CardDescription className="text-slate-500 font-medium">Đăng nhập hệ thống quản trị</CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="px-8">
          <form onSubmit={handle_submit} className="space-y-5">
            
            {/* Vai trò */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[1.5px] ml-1">Quyền hạn</label>
              <div className="relative group">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                <select 
                  className="w-full h-12 rounded-xl border border-slate-200 bg-white/50 pl-10 pr-10 text-sm font-semibold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all appearance-none cursor-pointer outline-none shadow-sm"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="employee">Nhân viên</option>
                  <option value="owner">Chủ cửa hàng</option>
                  <option value="admin">Quản trị viên</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" size={16} />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[1.5px] ml-1">Tài khoản</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                <Input 
                  type="email" 
                  placeholder="email@company.com" 
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
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[1.5px]">Mật khẩu</label>
                <button type="button" className="text-[11px] font-bold text-blue-600 hover:text-indigo-600 transition-colors uppercase tracking-wider">Quên?</button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                <Input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  className="h-12 rounded-xl border-slate-200 bg-white/50 pl-10 pr-10 focus-visible:ring-4 focus-visible:ring-blue-500/10 focus-visible:border-blue-500 transition-all shadow-sm font-medium"
                  value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})} 
                  required
                />
                {/* Nút Ẩn/Hiện mật khẩu */}
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-slate-950 hover:bg-black text-white font-bold h-12 rounded-xl mt-2 shadow-2xl shadow-blue-200/20 active:scale-[0.97] transition-all duration-200 relative group overflow-hidden"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Xác thực tài khoản...
                </div>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Vào hệ thống <ShieldCheck size={18} className="group-hover:translate-x-1 transition-transform" />
                </span>
              )}
              <div className="absolute inset-0 w-1/2 h-full bg-white/5 skew-x-[-20deg] group-hover:left-full -left-full transition-all duration-700 pointer-events-none" />
            </Button>

          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 border-t border-slate-100 bg-slate-50/50 p-8 mt-6">
          <div className="flex items-center gap-2 text-slate-300 w-full">
            <div className="h-[1px] flex-1 bg-current" />
            <span className="text-[9px] font-black uppercase tracking-[3px]">Security Verified</span>
            <div className="h-[1px] flex-1 bg-current" />
          </div>
          <p className="text-[11px] text-slate-500 text-center font-medium">
            Copyright © 2024 BizFlow Inc. <br />
            Hỗ trợ kỹ thuật: <span className="text-slate-900 font-bold cursor-pointer hover:underline">090xxxxxxx</span>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}