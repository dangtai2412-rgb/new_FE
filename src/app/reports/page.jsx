"use client";

import { 
  FileText, 
  Download, 
  Printer, 
  Calendar as CalendarIcon,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

// Dữ liệu mẫu theo mẫu sổ S1-HKD (Thông tư 88)
const report_data = [
  { id: 1, date: "01/01/2026", invoice: "HD001", desc: "Bán vật liệu xây dựng cho Anh A", group_item: "Hàng hóa", amount: 5000000, tax_rate: "1%" },
  { id: 2, date: "02/01/2026", invoice: "HD002", desc: "Cung cấp dịch vụ vận chuyển", group_item: "Dịch vụ", amount: 1200000, tax_rate: "5%" },
  { id: 3, date: "03/01/2026", invoice: "HD003", desc: "Bán thép phi 10", group_item: "Hàng hóa", amount: 15000000, tax_rate: "1%" },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Báo cáo Thuế (Thông tư 88)</h2>
          <p className="text-sm text-slate-500">Mẫu sổ S1-HKD: Sổ chi tiết doanh thu bán hàng hóa, dịch vụ</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex gap-2">
            <Printer size={18} /> In báo cáo
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 flex gap-2 text-white">
            <Download size={18} /> Xuất Excel
          </Button>
        </div>
      </div>

      {/* Bộ lọc thời gian */}
      <Card>
        <CardContent className="p-4 flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
            <CalendarIcon size={18} />
            <span>Kỳ báo cáo:</span>
          </div>
          <select className="bg-white border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500">
            <option>Tháng 01/2026</option>
            <option>Quý 1/2026</option>
            <option>Cả năm 2026</option>
          </select>
          <Button variant="ghost" className="flex gap-2 text-slate-600">
            <Filter size={18} /> Lọc nâng cao
          </Button>
        </CardContent>
      </Card>

      {/* Nội dung sổ sách */}
      <Card>
        <CardHeader className="border-b bg-slate-50/50">
          <CardTitle className="text-center text-xl font-serif">SỔ CHI TIẾT DOANH THU BÁN HÀNG HÓA, DỊCH VỤ</CardTitle>
          <CardDescription className="text-center">Năm: 2026</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="border-r">Ngày tháng</TableHead>
                <TableHead className="border-r">Số hóa đơn</TableHead>
                <TableHead className="border-r w-[300px]">Diễn giải</TableHead>
                <TableHead className="border-r">Nhóm hàng hóa/DV</TableHead>
                <TableHead className="border-r text-right">Doanh thu</TableHead>
                <TableHead className="text-right">Thuế suất</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {report_data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="border-r">{item.date}</TableCell>
                  <TableCell className="border-r font-medium">{item.invoice}</TableCell>
                  <TableCell className="border-r">{item.desc}</TableCell>
                  <TableCell className="border-r">{item.group_item}</TableCell>
                  <TableCell suppressHydrationWarning className="border-r text-right font-bold">{item.amount.toLocaleString()}đ</TableCell>
                  <TableCell className="text-right">{item.tax_rate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Ghi chú pháp lý */}
      <div className="text-[10px] text-slate-400 italic">
        * Báo cáo được tự động tổng hợp dựa trên dữ liệu bán hàng thực tế. Đảm bảo tính chính xác theo quy định của Bộ Tài chính.
      </div>
    </div>
  );
}