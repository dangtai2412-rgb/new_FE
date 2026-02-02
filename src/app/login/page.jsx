"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api_service } from "@/lib/api_service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Lock, Mail, Building2, ChevronDown } from "lucide-react"; 

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "", role: "employee" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handle_submit = async (e) => {
    e.preventDefault();
    if (loading) return; // Chống double-click
    setLoading(true);
    
    try {
      const data = await api_service.login(form.email, form.password, form.role);
      
      if (data && data.token) {
        // Lưu token vào localStorage hoặc cookie tùy api_service
        window.location.href = "/dashboard"; 
      } else {
        // Thay vì alert, có thể dùng toast nếu đã cài sonner/toast
        alert(data.error || "Tài khoản hoặc mật khẩu không đúng!");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Không thể kết nối đến máy chủ. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 relative overflow-hidden p-4">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] -z-10" />
      
      <Card className="w-full max-w-[400px] shadow-2xl border-slate-200 bg-white/90 backdrop-blur-md">
        <CardHeader className="space-y-2 text-center pb-6">
          <div className="flex justify-center mb-2">
            <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-3xl shadow-xl transform hover:rotate-12 transition-transform cursor-default">
              B
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">BizFlow Portal</CardTitle>
          <CardDescription>Đăng nhập để quản lý doanh nghiệp của bạn</CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handle_submit} className="space-y-4">
            
            {/* Vai trò */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Building2 size={16} className="text-blue-500" /> Vai trò
              </label>
              <div className="relative group">
                <select 
                  className="w-full h-11 rounded-lg border border-slate-200 bg-white pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="employee">Nhân viên (Employee)</option>
                  <option value="owner">Chủ cửa hàng (Owner)</option>
                  <option value="admin">Quản trị viên (Admin)</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-slate-600 transition-colors">
                  <ChevronDown size={18} />
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Mail size={16} className="text-blue-500" /> Email
              </label>
              <Input 
                type="email" 
                placeholder="email@example.com" 
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})} 
                required
                className="h-11 focus-visible:ring-blue-500/20 focus-visible:border-blue-500"
              />
            </div>

            {/* Mật khẩu */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Lock size={16} className="text-blue-500" /> Mật khẩu
              </label>
              <Input 
                type="password" 
                placeholder="••••••••" 
                value={form.password}
                onChange={e => setForm({...form, password: e.target.value})} 
                required
                className="h-11 focus-visible:ring-blue-500/20 focus-visible:border-blue-500"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 mt-2 shadow-lg shadow-blue-200 active:scale-[0.98] transition-all"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Đang xác thực...
                </div>
              ) : "Đăng nhập ngay"}
            </Button>

          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 border-t bg-slate-50/50 p-6 rounded-b-xl">
          <p className="text-xs text-slate-500 text-center leading-relaxed">
            Bạn gặp sự cố khi đăng nhập? <br /> 
            Vui lòng liên hệ <span className="text-blue-600 font-bold hover:underline cursor-pointer">Bộ phận IT</span> để được hỗ trợ.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}