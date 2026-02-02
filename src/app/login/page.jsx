"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api_service } from "@/lib/api_service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Mail, Building2, ChevronDown, ShieldCheck, Eye, EyeOff, Fingerprint, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "", role: "employee" });
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const router = useRouter();

  // 1. Hiệu ứng đốm sáng đuổi theo chuột & Load email ghi nhớ
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    
    const savedEmail = localStorage.getItem("bizflow_remembered_email");
    if (savedEmail) {
      setForm(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // 2. Hàm xử lý đăng nhập
  const handle_submit = async (e) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    setIsError(false);
    setErrorMessage("");

    try {
      const data = await api_service.login(form.email, form.password, form.role);
      
      if (data && data.token) {
        if (rememberMe) {
          localStorage.setItem("bizflow_remembered_email", form.email);
        } else {
          localStorage.removeItem("bizflow_remembered_email");
        }
        // Chuyển hướng
        router.push("/dashboard");
      } else {
        setErrorMessage(data.error || "Thông tin đăng nhập không chính xác.");
        triggerError();
      }
    } catch (error) {
      setErrorMessage("Không thể kết nối tới máy chủ bảo mật.");
      triggerError();
    } finally {
      setLoading(false);
    }
  };

  const triggerError = () => {
    setIsError(true);
    // Rung card trong 500ms
    setTimeout(() => setIsError(false), 500);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#020617] relative overflow-hidden p-4">
      
      {/* --- LỚP NỀN NGHỆ THUẬT --- */}
      {/* Quầng sáng theo chuột */}
      <div 
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-500 opacity-40"
        style={{
          background: `radial-gradient(600px at ${mousePos.x}px ${mousePos.y}px, rgba(37, 99, 235, 0.15), transparent 80%)`,
        }}
      />

      {/* Ambient Blobs (Đốm màu cố định) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px] -z-10 animate-pulse" style={{ animationDelay: '2s' }} />
      
      {/* Grid & Noise Texture */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] -z-10" />
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none -z-10" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} 
      />

      {/* --- LOGIN CARD --- */}
      <Card className={`w-full max-w-[420px] border-white/10 bg-white/[0.02] backdrop-blur-3xl rounded-[32px] overflow-hidden transition-all duration-300 shadow-2xl z-10 ${isError ? 'animate-shake border-red-500/50' : ''}`}>
        
        {/* Thanh trang trí trên cùng */}
        <div className="h-[1.5px] w-full bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

        <CardHeader className="space-y-4 text-center pt-10 pb-6">
          <div className="flex justify-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-blue-500 rounded-[24px] blur-2xl opacity-20 group-hover:opacity-40 transition-all duration-500" />
              <div className="relative w-20 h-20 bg-slate-900 border border-white/10 rounded-[24px] flex items-center justify-center text-white shadow-2xl transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-3">
                <Fingerprint size={42} strokeWidth={1.2} className="text-blue-400" />
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <CardTitle className="text-3xl font-black text-white tracking-tighter">BizFlow</CardTitle>
            <CardDescription className="text-slate-500 font-medium">Hệ thống quản trị tập trung</CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="px-10">
          <form onSubmit={handle_submit} className="space-y-5">
            
            {/* Vai trò */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[2px] ml-1">Hệ thống</label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <select 
                  className="w-full h-13 rounded-2xl border border-white/5 bg-white/5 pl-12 pr-10 text-sm font-bold text-white focus:ring-2 focus:ring-blue-500/40 transition-all appearance-none outline-none cursor-pointer"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option className="bg-[#020617]" value="employee">Nhân viên chi nhánh</option>
                  <option className="bg-[#020617]" value="owner">Chủ sở hữu hệ thống</option>
                  <option className="bg-[#020617]" value="admin">Quản trị viên</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[2px] ml-1">Định danh</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                <Input 
                  type="email" 
                  placeholder="name@company.vn" 
                  className="h-13 rounded-2xl border-white/5 bg-white/5 pl-12 text-white placeholder:text-slate-700 focus-visible:ring-2 focus-visible:ring-blue-500/40 transition-all font-bold"
                  value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})} 
                  required
                />
              </div>
            </div>

            {/* Mật mã */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[2px] ml-1">Mật mã</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                <Input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  className="h-13 rounded-2xl border-white/5 bg-white/5 pl-12 pr-12 text-white placeholder:text-slate-700 focus-visible:ring-2 focus-visible:ring-blue-500/40 transition-all font-bold tracking-[2px]"
                  value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})} 
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between px-1 pt-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className={`w-5 h-5 rounded-lg border transition-all flex items-center justify-center ${rememberMe ? 'bg-blue-600 border-blue-600' : 'border-white/10 bg-white/5'}`}>
                  <input type="checkbox" className="hidden" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                  {rememberMe && <div className="w-1.5 h-1.5 bg-white rounded-full shadow-sm" />}
                </div>
                <span className="text-[11px] font-bold text-slate-500 group-hover:text-slate-300 transition-colors">Ghi nhớ tôi</span>
              </label>
              <button type="button" className="text-[11px] font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-widest">Quên?</button>
            </div>

            {/* THÔNG BÁO LỖI UI */}
            {errorMessage && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 animate-in fade-in slide-in-from-top-2 duration-300">
                <AlertCircle className="text-red-500 shrink-0" size={16} />
                <p className="text-[12px] font-bold text-red-400 leading-none">{errorMessage}</p>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black h-14 rounded-2xl mt-2 shadow-xl shadow-blue-600/10 active:scale-[0.98] transition-all duration-300 relative overflow-hidden group"
              disabled={loading}
            >
              <div className="relative z-10 flex items-center justify-center gap-3">
                {loading ? "ĐANG XÁC THỰC..." : "VÀO HỆ THỐNG"}
                {!loading && <ShieldCheck size={20} className="group-hover:translate-x-1 transition-transform" />}
              </div>
              <div className="absolute inset-0 w-1/2 h-full bg-white/10 skew-x-[-25deg] group-hover:left-full -left-full transition-all duration-1000 pointer-events-none" />
            </Button>

          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 border-t border-white/5 bg-white/[0.01] p-10 mt-6">
          <p className="text-[10px] text-slate-600 text-center font-bold tracking-[4px] uppercase opacity-60">
            Secure Gateway v2.0
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}