"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api_service } from "@/lib/api_service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "", role: "employee" });
  const router = useRouter();

  const handle_submit = async (e) => {
    e.preventDefault();
    try {
      // SỬA: Truyền form.role vào hàm login
      const data = await api_service.login(form.email, form.password, form.role);
      
      if (data && data.token) {
        console.log("Đăng nhập thành công:", data);
        router.push("/dashboard"); 
      } else {
        alert(data.error || "Đăng nhập thất bại!");
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Lỗi hệ thống!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      <Card className="w-[400px] shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-blue-700">BizFlow Login</CardTitle>
          <p className="text-center text-sm text-gray-500">Quản lý vật liệu xây dựng</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handle_submit} className="space-y-4">
            
            {/* 1. Chọn Vai Trò */}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Vai trò đăng nhập
              </label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="employee">Nhân viên (Employee)</option>
                <option value="owner">Chủ cửa hàng (Owner)</option>
                <option value="admin">Quản trị viên (Admin)</option>
              </select>
            </div>

            {/* 2. Email */}
            <div className="space-y-2">
              <Input 
                placeholder="Email đăng nhập" 
                type="email"
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})} 
                required
              />
            </div>

            {/* 3. Mật khẩu */}
            <div className="space-y-2">
              <Input 
                type="password" 
                placeholder="Mật khẩu" 
                value={form.password}
                onChange={e => setForm({...form, password: e.target.value})} 
                required
              />
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              Đăng nhập
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}