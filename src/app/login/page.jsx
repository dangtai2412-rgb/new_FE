"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api_service } from "@/lib/api_service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
//import { Label } from "@/components/ui/label"; // Nếu báo lỗi thiếu Label, hãy xóa dòng này và dùng thẻ <label> thường
import { Users, Lock, Mail, Building2 } from "lucide-react"; // Icon cho đẹp

export default function LoginPage() {
  // 1. Giữ nguyên State của bạn (bao gồm cả role)
  const [form, setForm] = useState({ email: "", password: "", role: "employee" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 2. Giữ nguyên Logic xử lý đăng nhập của bạn
  const handle_submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Gọi API với đủ 3 tham số: email, password, role
      const data = await api_service.login(form.email, form.password, form.role);
      
      if (data && data.token) {
        // Đăng nhập thành công -> Chuyển hướng
        // Dùng window.location để đảm bảo load lại Sidebar đúng quyền
        window.location.href = "/dashboard"; 
      } else {
        alert(data.error || "Sai tài khoản hoặc mật khẩu!");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Lỗi kết nối hệ thống!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Background trang trí (giống phong cách bạn Tam) */}
      <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
      
      <Card className="w-[400px] shadow-2xl border-slate-200 bg-white/80 backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center pb-8">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-2xl shadow-lg">
              B
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-slate-800">Chào mừng trở lại</CardTitle>
          <CardDescription>Đăng nhập vào hệ thống BizFlow</CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handle_submit} className="space-y-4">
            
            {/* 3. Phần chọn Vai Trò (Được thiết kế lại cho đẹp hơn) */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Building2 size={16} /> Vai trò đăng nhập
              </label>
              <div className="relative">
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 appearance-none"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="employee">Nhân viên (Employee)</option>
                  <option value="owner">Chủ cửa hàng (Owner)</option>
                  <option value="admin">Quản trị viên (Admin)</option>
                </select>
                {/* Mũi tên tùy chỉnh cho đẹp */}
                <div className="absolute right-3 top-3 pointer-events-none">
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L5 5L9 1" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Mail size={16} /> Email
              </label>
              <Input 
                type="email" 
                placeholder="name@example.com" 
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})} 
                required
                className="bg-white"
              />
            </div>

            {/* Mật khẩu */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Lock size={16} /> Mật khẩu
              </label>
              <Input 
                type="password" 
                placeholder="••••••••" 
                value={form.password}
                onChange={e => setForm({...form, password: e.target.value})} 
                required
                className="bg-white"
              />
            </div>

            {/* Nút Submit */}
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 mt-4 shadow-md hover:shadow-lg transition-all"
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "Đăng nhập ngay"}
            </Button>

          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t p-6 mt-2">
          <p className="text-xs text-slate-500 text-center">
            Quên mật khẩu? Vui lòng liên hệ <span className="text-blue-600 font-medium cursor-pointer">Admin</span>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}