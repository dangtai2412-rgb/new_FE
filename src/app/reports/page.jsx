"use client";

import React, { useState, useMemo } from "react";
import { 
  FileText, Download, Printer, Calendar as CalendarIcon, 
  Filter, Search, TrendingUp, Wallet, Receipt 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter 
} from "@/components/ui/table";

// Dữ liệu giả lập (Sau này sẽ lấy từ API Backend của bạn)
const REPORT_DATA = [
  { id: 1, date: "01/01/2026", invoice: "HD001", customer: "Anh Nguyễn Văn A", desc: "Bán vật liệu xây dựng (Cát, Đá)", group: "Phân phối hàng hóa", revenue: 5000000, vat_rate: 1, pit_rate: 0.5 },
  { id: 2, date: "02/01/2026", invoice: "HD002", customer: "Cty Xây Dựng B", desc: "Dịch vụ vận chuyển xà bần", group: "Dịch vụ không bao thầu", revenue: 1200000, vat_rate: 5, pit_rate: 2 },
  { id: 3, date: "03/01/2026", invoice: "HD003", customer: "Khách lẻ", desc: "Bán thép phi 10", group: "Phân phối hàng hóa", revenue: 15000000, vat_rate: 1, pit_rate: 0.5 },
  { id: 4, date: "05/01/2026", invoice: "HD004", customer: "Chị Lan (Q.7)", desc: "Thi công lắp đặt điện nước", group: "Dịch vụ xây dựng", revenue: 3500000, vat_rate: 5, pit_rate: 2 },
  { id: 5, date: "06/01/2026", invoice: "HD005", customer: "Cửa hàng Tạp hóa C", desc: "Sơn nước Dulux (10 thùng)", group: "Phân phối hàng hóa", revenue: 8500000, vat_rate: 1, pit_rate: 0.5 },
];

export default function ReportsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Lọc dữ liệu theo từ khóa tìm kiếm
  const filteredData = REPORT_DATA.filter(item => 
    item.invoice.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 2. Tự động tính toán tổng doanh thu và thuế
  const summary = useMemo(() => {
    return filteredData.reduce((acc, item) => {
      const taxAmount = item.revenue * ((item.vat_rate + item.pit_rate) / 100);
      return {
        totalRevenue: acc.totalRevenue + item.revenue,
        totalTax: acc.totalTax + taxAmount,
        count: acc.count + 1
      };
    }, { totalRevenue: 0, totalTax: 0, count: 0 });
  }, [filteredData]);

  return (
    <div className="space-y-6">
      
      {/* HEADER TRANG */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="text-blue-600" /> Báo cáo Thuế (Thông tư 88)
          </h2>
          <p className="text-sm text-slate-500 mt-1">Sổ chi tiết doanh thu bán hàng hóa, dịch vụ (Mẫu S1-HKD)</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 bg-white hover:bg-slate-50 text-slate-700">
            <Printer size={16} /> In sổ sách
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 gap-2 text-white shadow-md shadow-emerald-100">
            <Download size={16} /> Xuất Excel XML
          </Button>
        </div>
      </div>

      {/* DASHBOARD TỔNG QUAN (Phần mới thêm) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Tổng Doanh Thu */}
        <Card className="border-l-4 border-l-blue-500 shadow-sm bg-blue-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex justify-between">
              Tổng Doanh Thu (Kỳ này)
              <TrendingUp className="text-blue-500 h-4 w-4" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700" suppressHydrationWarning>
              {summary.totalRevenue.toLocaleString()}đ
            </div>
            <p className="text-xs text-slate-400 mt-1">Doanh thu chịu thuế thực tế</p>
          </CardContent>
        </Card>

        {/* Card 2: Thuế Phải Nộp */}
        <Card className="border-l-4 border-l-orange-500 shadow-sm bg-orange-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex justify-between">
              Thuế Phải Nộp (Dự tính)
              <Wallet className="text-orange-500 h-4 w-4" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700" suppressHydrationWarning>
              {summary.totalTax.toLocaleString()}đ
            </div>
            <p className="text-xs text-slate-400 mt-1">Bao gồm thuế GTGT & TNCN</p>
          </CardContent>
        </Card>

        {/* Card 3: Số Lượng Hóa Đơn */}
        <Card className="border-l-4 border-l-slate-500 shadow-sm bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex justify-between">
              Tổng Chứng Từ
              <Receipt className="text-slate-500 h-4 w-4" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-700">
              {summary.count} <span className="text-sm font-normal text-slate-400">hóa đơn</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Số lượng giao dịch đã ghi sổ</p>
          </CardContent>
        </Card>
      </div>

      {/* CÔNG CỤ LỌC & TÌM KIẾM */}
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 border rounded-md px-3 py-2 bg-white shadow-sm w-full md:w-auto">
              <CalendarIcon size={16} className="text-slate-400" />
              <select className="bg-transparent outline-none text-sm font-medium text-slate-700 min-w-[140px] cursor-pointer">
                <option>Tháng 01/2026</option>
                <option>Quý 1/2026</option>
                <option>Cả năm 2026</option>
              </select>
            </div>
            <Button variant="outline" size="icon" title="Lọc nâng cao"><Filter size={16} /></Button>
          </div>

          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <Input 
              placeholder="Tìm số hóa đơn, tên khách hàng..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* BẢNG SỔ SÁCH CHI TIẾT */}
      <Card className="overflow-hidden border-slate-200 shadow-md">
        <CardHeader className="bg-slate-50 border-b py-4">
          <div className="text-center">
            <CardTitle className="uppercase text-lg font-bold text-slate-800 tracking-wide">
              Sổ Chi Tiết Doanh Thu Bán Hàng Hóa, Dịch Vụ
            </CardTitle>
            <CardDescription>(Mẫu S1-HKD ban hành kèm theo Thông tư 88/2021/TT-BTC)</CardDescription>
          </div>
        </CardHeader>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-100 border-b-2 border-slate-200">
              <TableRow>
                <TableHead className="w-[100px] font-bold border-r">Ngày CT</TableHead>
                <TableHead className="w-[100px] font-bold border-r">Số CT</TableHead>
                <TableHead className="min-w-[250px] font-bold border-r">Diễn giải nội dung</TableHead>
                <TableHead className="min-w-[150px] font-bold border-r">Nhóm ngành nghề</TableHead>
                <TableHead className="text-right font-bold border-r min-w-[120px]">Doanh thu</TableHead>
                <TableHead className="text-center font-bold w-[120px]">Thuế suất<br/><span className="text-[10px] font-normal text-slate-500">(GTGT / TNCN)</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-slate-400 italic">
                    Không tìm thấy dữ liệu phù hợp.
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item, index) => (
                  <TableRow key={item.id} className={`hover:bg-slate-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-slate-50/30"}`}>
                    <TableCell className="border-r font-mono text-slate-600 text-xs">{item.date}</TableCell>
                    <TableCell className="border-r font-bold text-blue-600 text-xs">{item.invoice}</TableCell>
                    <TableCell className="border-r">
                      <div className="font-semibold text-slate-800 text-sm">{item.customer}</div>
                      <div className="text-xs text-slate-500 italic mt-0.5">{item.desc}</div>
                    </TableCell>
                    <TableCell className="border-r text-xs text-slate-600">{item.group}</TableCell>
                    <TableCell className="border-r text-right font-bold text-slate-800 text-sm" suppressHydrationWarning>
                      {item.revenue.toLocaleString()}đ
                    </TableCell>
                    <TableCell className="text-center">
                       <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border shadow-sm
                        ${item.vat_rate === 1 
                          ? 'bg-green-50 text-green-700 border-green-200' 
                          : 'bg-orange-50 text-orange-700 border-orange-200'}`}>
                        {item.vat_rate}% / {item.pit_rate}%
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
            {/* FOOTER: Tổng cộng (Quan trọng nhất của báo cáo) */}
            <TableFooter className="bg-slate-100 border-t-2 border-slate-300">
              <TableRow>
                <TableCell colSpan={4} className="text-right font-bold text-slate-700 uppercase pr-6 text-sm">
                  Tổng cộng doanh thu:
                </TableCell>
                <TableCell className="text-right font-extrabold text-blue-800 text-base border-r border-slate-300" suppressHydrationWarning>
                  {summary.totalRevenue.toLocaleString()}đ
                </TableCell>
                <TableCell className="text-center text-[10px] text-slate-500 italic bg-slate-50">
                  Đã kiểm tra
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </Card>

      {/* Footer Chữ Ký */}
      <div className="flex justify-end pt-4 pb-8 px-8">
        <div className="text-center">
          <p className="text-xs font-bold text-slate-800 uppercase">Người lập biểu</p>
          <p className="text-[10px] text-slate-500 italic">(Ký, họ tên)</p>
          <div className="h-16"></div>
          <p className="text-sm font-semibold text-slate-800">Nguyễn Hữu Nghĩa</p>
        </div>
      </div>
    </div>
  );
}