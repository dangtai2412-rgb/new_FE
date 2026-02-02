"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api_service } from "@/lib/api_service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Mail, Building2, ChevronDown, ShieldCheck, Eye, EyeOff, Fingerprint } from "lucide-react"; 

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "", role: "employee" });
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isError, setIsError] = useState(false);
  const router = useRouter();

  // 1. Tự động load email nếu đã "Ghi nhớ" lần trước
  useEffect(() => {
    const savedEmail = localStorage.getItem("bizflow_remembered_email");
    if (savedEmail) {
      setForm(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handle_submit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setIsError(false);
    
    try {
      const data = await api_service.login(form.email, form.password, form.role);
      
      if (data && data.token) {
        // 2. Xử lý ghi nhớ tài khoản
        if (rememberMe) {
          localStorage.setItem("bizflow_remembered_email", form.email);
        } else {
          localStorage.removeItem("bizflow_remembered_email");
        }

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

  const triggerError = () => {
    setIsError(true);
    setTimeout(() => setIsError(false), 500);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f8fafc] relative overflow-hidden p-4">
      
      {/* Background Decor */}
      <div className="absolute top-[-5%] left-[-5%] w-[30%] h-[30%] bg-blue-200/40 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-indigo-200/40 rounded-full blur-[100px] -z-10" />

      <Card className={`w-full max-w-[420px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border-white/60 bg-white/80 backdrop-blur-2xl rounded-[32px] overflow-hidden transition-all duration-300 ${isError ? 'translate-x-2 border-red-300 bg-red-50/50' : ''}`}>
        
        <div className="h-2 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600" />

        <CardHeader className="space-y-4 text-center pt-10 pb-6">
          <div className="flex justify-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-blue-600 rounded-3xl blur-2xl opacity-10 group-hover:opacity-30 transition-opacity duration-500" />
              <div className="relative w-20 h-20 bg-slate-950 rounded-[24px] flex items-center justify-center text-white shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:-rotate-3">
                <Fingerprint size={40} strokeWidth={1.5} />
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <CardTitle className="text-3xl font-black text-slate-900 tracking-tighter">BizFlow</CardTitle>
            <CardDescription className="text-slate-500 font-medium">Hệ thống xác thực tập trung</CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="px-10">
          <form onSubmit={handle_submit} className="space-y-6">
            
            {/* Input Groups */}
            <div className="space-y-4">
              {/* Quyền hạn */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] ml-1">Hệ thống</label>
                <div className="relative group">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                  <select 
                    className="w-full h-13 rounded-2xl border-slate-200 bg-white pl-12 pr-10 text-sm font-bold focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all appearance-none outline-none"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                  >
                    <option value="employee">Nhân viên chi nhánh</option>
                    <option value="owner">Chủ sở hữu hệ thống</option>
                    <option value="admin">Tổng quản trị viên</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] ml-1">Định danh (Email)</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                  <Input 
                    type="email" 
                    placeholder="manager@bizflow.vn" 
                    className="h-13 rounded-2xl border-slate-200 bg-white pl-12 focus-visible:ring-4 focus-visible:ring-blue-600/5 focus-visible:border-blue-600 transition-all font-bold"
                    value={form.email}
                    onChange={e => setForm({...form, email: e.target.value})} 
                    required
                  />
                </div>
              </div>

              {/* Mật khẩu */}
              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px]">Mã khóa</label>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    className="h-13 rounded-2xl border-slate-200 bg-white pl-12 pr-12 focus-visible:ring-4 focus-visible:ring-blue-600/5 focus-visible:border-blue-600 transition-all font-bold tracking-[2px]"
                    value={form.password}
                    onChange={e => setForm({...form, password: e.target.value})} 
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Tính năng mới: Remember Me */}
            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${rememberMe ? 'bg-blue-600 border-blue-600' : 'border-slate-300'}`}>
                  <input 
                    type="checkbox" 
                    className="hidden" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  {rememberMe && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                <span className="text-xs font-bold text-slate-500 group-hover:text-slate-700">Ghi nhớ tôi</span>
              </label>
              <button type="button" className="text-xs font-bold text-blue-600 hover:underline underline-offset-4">Quên mật khẩu?</button>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-slate-950 hover:bg-blue-700 text-white font-black h-14 rounded-2xl mt-4 shadow-xl shadow-blue-900/10 active:scale-[0.98] transition-all duration-300 group relative overflow-hidden"
              disabled={loading}
            >
              <div className="relative z-10 flex items-center justify-center gap-3">
                {loading ? "ĐANG XÁC THỰC..." : "ĐĂNG NHẬP NGAY"}
                {!loading && <ShieldCheck size={20} className="group-hover:rotate-12 transition-transform" />}
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Button>

          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 border-t border-slate-100/50 bg-slate-50/80 p-10 mt-6">
          <p className="text-[11px] text-slate-400 text-center font-bold leading-loose tracking-widest uppercase">
            Môi trường bảo mật cấp cao <br />
            <span className="text-slate-900">BizFlow Security Standard 2024</span>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}