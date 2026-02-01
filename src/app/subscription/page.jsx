"use client";
import { BadgeCheck, CreditCard, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function SubscriptionPage() {
  // Dữ liệu giả lập các Shop đang thuê phần mềm
  const subscriptions = [
    { id: 1, shop: "Vật liệu Xây dựng Tám Toàn", plan: "Enterprise", price: "5.000.000đ/năm", status: "Active", expire: "25/12/2026" },
    { id: 2, shop: "Sắt thép Hùng Cường", plan: "Basic", price: "200.000đ/tháng", status: "Active", expire: "01/03/2026" },
    { id: 3, shop: "Điện nước Anh Ba", plan: "Trial", price: "Miễn phí", status: "Expired", expire: "30/01/2026" },
    { id: 4, shop: "Gạch men Minh Long", plan: "Pro", price: "500.000đ/tháng", status: "Active", expire: "15/06/2026" },
  ];

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
        <CreditCard className="text-blue-600" /> Quản lý Gói đăng ký (SaaS)
      </h2>

      {/* Thống kê nhanh */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-blue-700">Doanh thu tháng này</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold text-blue-900">12.500.000 đ</div></CardContent>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-green-700">Đang hoạt động</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold text-green-900">156 Shops</div></CardContent>
        </Card>
        <Card className="bg-purple-50 border-purple-200">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-purple-700">Đăng ký mới</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold text-purple-900">+12</div></CardContent>
        </Card>
      </div>

      {/* Bảng dữ liệu */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên cửa hàng</TableHead>
                <TableHead>Gói dịch vụ</TableHead>
                <TableHead>Giá cước</TableHead>
                <TableHead>Ngày hết hạn</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center"><User size={16}/></div>
                    {sub.shop}
                  </TableCell>
                  <TableCell><span className="font-bold text-blue-600">{sub.plan}</span></TableCell>
                  <TableCell>{sub.price}</TableCell>
                  <TableCell>{sub.expire}</TableCell>
                  <TableCell>
                    {sub.status === "Active" ? (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs flex w-fit items-center gap-1"><BadgeCheck size={12}/> Hoạt động</span>
                    ) : (
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs">Hết hạn</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}