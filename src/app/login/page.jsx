"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api_service } from "@/lib/api_service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const router = useRouter();

  const handle_submit = async (e) => {
    e.preventDefault();
    
    // Gọi API đăng nhập
    const data = await api_service.login(form.email, form.password);
    
    // --- ĐOẠN SỬA QUAN TRỌNG ---
    // Kiểm tra đúng biến 'token'
    if (data && data.token) {
      console.log("Đăng nhập thành công! Token:", data.token);
      alert("Đăng nhập thành công!");
      
      // Chuyển hướng sang trang Dashboard hoặc Inventory
      router.push("/dashboard"); 
    } else {
      // Hiển thị lỗi từ Backend hoặc lỗi mặc định
      console.error("Lỗi đăng nhập:", data);
      alert(data.error || "Sai tài khoản hoặc mật khẩu!");
    }
    // ----------------------------
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-center">BizFlow Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handle_submit} className="space-y-4">
            <Input 
              placeholder="Email" 
              value={form.email}
              onChange={e => setForm({...form, email: e.target.value})} 
            />
            <Input 
              type="password" 
              placeholder="Mật khẩu" 
              value={form.password}
              onChange={e => setForm({...form, password: e.target.value})} 
            />
            <Button type="submit" className="w-full">
              Đăng nhập
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}