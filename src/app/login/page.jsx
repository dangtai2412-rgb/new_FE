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
    try {
      const data = await api_service.login(form.email, form.password);
      
      // Sửa ở đây: Kiểm tra 'data.token' thay vì 'data.access_token'
      if (data.token) {
        console.log("Đăng nhập thành công, token:", data.token);
        router.push("/"); // Hoặc chuyển hướng sang trang bạn muốn
      } else {
        // Nếu có lỗi trả về từ BE thì hiện lỗi đó, không thì hiện mặc định
        alert(data.error || "Sai tài khoản hoặc mật khẩu!");
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
      alert("Không thể kết nối đến server Backend!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <Card className="w-[350px]">
        <CardHeader><CardTitle className="text-center">BizFlow Login</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handle_submit} className="space-y-4">
            <Input placeholder="Email" onChange={e => setForm({...form, email: e.target.value})} />
            <Input type="password" placeholder="Mật khẩu" onChange={e => setForm({...form, password: e.target.value})} />
            <Button type="submit" className="w-full">Đăng nhập</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}