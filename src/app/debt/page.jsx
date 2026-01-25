"use client";

import { Users, ArrowUpCircle, ArrowDownCircle, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

const debt_data = [
  { id: 1, name: "Đại lý Vật liệu xây dựng A", type: "Phải trả", amount: 45000000, status: "Đang nợ" },
  { id: 2, name: "Thầu xây dựng Nguyễn Văn B", type: "Phải thu", amount: 12000000, status: "Quá hạn" },
  { id: 3, name: "Cửa hàng điện nước C", type: "Phải thu", amount: 5500000, status: "Trong hạn" },
];

export default function DebtPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Đối tác & Công nợ</h2>
          <p className="text-sm text-slate-500">Quản lý nợ phải thu và nợ phải trả</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus size={18} className="mr-2" /> Thêm đối tác
        </Button>
      </div>

      {/* Thống kê nhanh */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-l-4 border-l-emerald-500 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Tổng phải thu (Khách nợ)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-emerald-600" suppressHydrationWarning>17,500,000đ</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Tổng phải trả (Nợ NCC)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600" suppressHydrationWarning>45,000,000đ</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users size={20} className="text-blue-600" /> 
            Danh sách chi tiết công nợ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <Input placeholder="Tìm theo tên đối tác..." className="pl-10 h-10" />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên đối tác</TableHead>
                <TableHead>Loại công nợ</TableHead>
                <TableHead className="text-right">Số tiền</TableHead>
                <TableHead className="text-center">Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {debt_data.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-medium text-slate-700">{d.name}</TableCell>
                  <TableCell>
                    {d.type === "Phải thu" ? 
                      <span className="flex items-center gap-1 text-emerald-600 text-xs font-semibold">
                        <ArrowDownCircle size={14}/> {d.type}
                      </span> : 
                      <span className="flex items-center gap-1 text-red-600 text-xs font-semibold">
                        <ArrowUpCircle size={14}/> {d.type}
                      </span>
                    }
                  </TableCell>
                  <TableCell className="text-right font-bold" suppressHydrationWarning>
                    {d.amount.toLocaleString()}đ
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase shadow-sm ${
                      d.status === "Quá hạn" ? "bg-red-100 text-red-700 border border-red-200" : "bg-blue-100 text-blue-700 border border-blue-200"
                    }`}>
                      {d.status}
                    </span>
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