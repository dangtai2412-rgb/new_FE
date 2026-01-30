"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Package, Users, ShoppingCart } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [user, setUser] = useState({ name: "", role: "" });

  useEffect(() => {
    setUser({
      name: localStorage.getItem("user_name") || "Bạn",
      role: localStorage.getItem("role") || "employee"
    });
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header chào mừng */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="text-sm text-muted-foreground">
          Xin chào, <span className="font-bold text-black">{user.name}</span> ({user.role})
        </div>
      </div>

      {/* --- GIAO DIỆN CHO CHỦ CỬA HÀNG (OWNER) --- */}
      {user.role === "owner" && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Doanh thu hôm nay</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12,450,000 đ</div>
              <p className="text-xs text-muted-foreground">+20.1% so với hôm qua</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Khách nợ</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">5 Khách</div>
              <p className="text-xs text-muted-foreground">Tổng nợ: 45,000,000 đ</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sắp hết hàng</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">3 SP</div>
              <p className="text-xs text-muted-foreground">Cần nhập thêm: Xi măng</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* --- GIAO DIỆN CHO NHÂN VIÊN (EMPLOYEE) --- */}
      {user.role === "employee" && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle>Tạo đơn hàng mới</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Bắt đầu quy trình bán hàng ngay.</p>
              <Link href="/pos">
                <Button className="w-full">Đi tới máy POS</Button>
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Nhiệm vụ hôm nay</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                <li>Kiểm tra kho Xi măng</li>
                <li>Gọi điện cho khách A xác nhận giao hàng</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      )}

      {/* --- GIAO DIỆN CHO ADMIN --- */}
      {user.role === "admin" && (
        <div className="p-10 text-center border-2 border-dashed rounded-lg">
          <h2 className="text-xl font-semibold">Khu vực quản trị hệ thống</h2>
          <p>Quản lý các gói đăng ký (Subscription) và tài khoản chủ cửa hàng.</p>
        </div>
      )}
    </div>
  );
}