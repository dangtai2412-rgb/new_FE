"use client";

import React, { useState, useMemo } from "react";
import {
  FileText, Download, Printer, Calendar as CalendarIcon,
  Filter, Search, TrendingUp, Wallet, Receipt, BarChart3
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter
} from "@/components/ui/table";

/* =======================
   DATA MỞ RỘNG (DÀI HƠN)
======================= */

const REPORT_DATA = [
  { id: 1, date: "01/01/2026", invoice: "HD001", customer: "Anh Nguyễn Văn A", desc: "Cát xây dựng", group: "Phân phối hàng hóa", revenue: 5000000, vat_rate: 1, pit_rate: 0.5 },
  { id: 2, date: "02/01/2026", invoice: "HD002", customer: "Cty Xây Dựng B", desc: "Vận chuyển xà bần", group: "Dịch vụ không bao thầu", revenue: 1200000, vat_rate: 5, pit_rate: 2 },
  { id: 3, date: "03/01/2026", invoice: "HD003", customer: "Khách lẻ", desc: "Thép phi 10", group: "Phân phối hàng hóa", revenue: 15000000, vat_rate: 1, pit_rate: 0.5 },
  { id: 4, date: "05/01/2026", invoice: "HD004", customer: "Chị Lan", desc: "Thi công điện nước", group: "Dịch vụ xây dựng", revenue: 3500000, vat_rate: 5, pit_rate: 2 },
  { id: 5, date: "06/01/2026", invoice: "HD005", customer: "Cửa hàng C", desc: "Sơn nước", group: "Phân phối hàng hóa", revenue: 8500000, vat_rate: 1, pit_rate: 0.5 },
  { id: 6, date: "07/01/2026", invoice: "HD006", customer: "Anh Tùng", desc: "Gạch men", group: "Phân phối hàng hóa", revenue: 6200000, vat_rate: 1, pit_rate: 0.5 },
  { id: 7, date: "08/01/2026", invoice: "HD007", customer: "Cty Nội Thất D", desc: "Thi công trần thạch cao", group: "Dịch vụ xây dựng", revenue: 9800000, vat_rate: 5, pit_rate: 2 },
  { id: 8, date: "10/01/2026", invoice: "HD008", customer: "Anh Phúc", desc: "Ống nước PVC", group: "Phân phối hàng hóa", revenue: 2700000, vat_rate: 1, pit_rate: 0.5 },
  { id: 9, date: "12/01/2026", invoice: "HD009", customer: "Cty Thiết Kế E", desc: "Thi công cải tạo văn phòng", group: "Dịch vụ xây dựng", revenue: 18000000, vat_rate: 5, pit_rate: 2 },
  { id: 10, date: "15/01/2026", invoice: "HD010", customer: "Khách lẻ", desc: "Xi măng Holcim", group: "Phân phối hàng hóa", revenue: 4200000, vat_rate: 1, pit_rate: 0.5 },
];

/* =======================
   COMPONENT
======================= */

export default function ReportsPage() {

  const [searchTerm, setSearchTerm] = useState("");

  /* ===== FILTER ===== */

  const filteredData = REPORT_DATA.filter(item =>
    `${item.invoice} ${item.customer} ${item.desc}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  /* ===== TÍNH TOÁN CHI TIẾT ===== */

  const summary = useMemo(() => {
    return filteredData.reduce((acc, item) => {

      const vat = item.revenue * item.vat_rate / 100;
      const pit = item.revenue * item.pit_rate / 100;
      const totalTax = vat + pit;

      acc.totalRevenue += item.revenue;
      acc.totalVAT += vat;
      acc.totalPIT += pit;
      acc.totalTax += totalTax;
      acc.afterTax += (item.revenue - totalTax);
      acc.count++;

      return acc;

    }, {
      totalRevenue: 0,
      totalVAT: 0,
      totalPIT: 0,
      totalTax: 0,
      afterTax: 0,
      count: 0
    });
  }, [filteredData]);

  /* ===== TỔNG THEO NHÓM ===== */

  const groupSummary = useMemo(() => {
    const map = {};

    filteredData.forEach(item => {
      if (!map[item.group]) {
        map[item.group] = { revenue: 0, tax: 0 };
      }
      const tax = item.revenue * ((item.vat_rate + item.pit_rate) / 100);

      map[item.group].revenue += item.revenue;
      map[item.group].tax += tax;
    });

    return map;
  }, [filteredData]);

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex gap-2 text-slate-800">
          <FileText className="text-blue-600" />
          Báo cáo thuế chi tiết mở rộng
        </h2>
        <div className="flex gap-2">
          <Button variant="outline"><Printer size={16}/> In</Button>
          <Button className="bg-emerald-600 text-white"><Download size={16}/> Xuất Excel</Button>
        </div>
      </div>

      {/* DASHBOARD */}
      <div className="grid md:grid-cols-5 gap-4">

        <Stat title="Tổng doanh thu" value={summary.totalRevenue}/>
        <Stat title="Thuế GTGT" value={summary.totalVAT}/>
        <Stat title="Thuế TNCN" value={summary.totalPIT}/>
        <Stat title="Tổng thuế" value={summary.totalTax}/>
        <Stat title="Sau thuế" value={summary.afterTax}/>

      </div>

      {/* SEARCH */}
      <Card>
        <CardContent className="p-4 flex justify-end">
          <div className="relative w-96">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18}/>
            <Input
              className="pl-10"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* TABLE CHI TIẾT */}
      <Card className="overflow-hidden">

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ngày</TableHead>
              <TableHead>Số CT</TableHead>
              <TableHead>Khách hàng</TableHead>
              <TableHead>Nhóm</TableHead>
              <TableHead className="text-right">Doanh thu</TableHead>
              <TableHead className="text-right">GTGT</TableHead>
              <TableHead className="text-right">TNCN</TableHead>
              <TableHead className="text-right">Tổng thuế</TableHead>
              <TableHead className="text-right">Sau thuế</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredData.map(item => {

              const vat = item.revenue * item.vat_rate / 100;
              const pit = item.revenue * item.pit_rate / 100;
              const totalTax = vat + pit;

              return (
                <TableRow key={item.id}>
                  <TableCell>{item.date}</TableCell>
                  <TableCell className="font-bold text-blue-600">{item.invoice}</TableCell>
                  <TableCell>{item.customer}</TableCell>
                  <TableCell>{item.group}</TableCell>
                  <TableCell className="text-right">{item.revenue.toLocaleString()}đ</TableCell>
                  <TableCell className="text-right">{vat.toLocaleString()}đ</TableCell>
                  <TableCell className="text-right">{pit.toLocaleString()}đ</TableCell>
                  <TableCell className="text-right font-bold">{totalTax.toLocaleString()}đ</TableCell>
                  <TableCell className="text-right text-emerald-700 font-bold">
                    {(item.revenue - totalTax).toLocaleString()}đ
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TableCell colSpan={4} className="text-right font-bold">TỔNG CỘNG</TableCell>
              <TableCell className="text-right font-bold">{summary.totalRevenue.toLocaleString()}đ</TableCell>
              <TableCell className="text-right">{summary.totalVAT.toLocaleString()}đ</TableCell>
              <TableCell className="text-right">{summary.totalPIT.toLocaleString()}đ</TableCell>
              <TableCell className="text-right font-bold">{summary.totalTax.toLocaleString()}đ</TableCell>
              <TableCell className="text-right font-bold text-emerald-700">{summary.afterTax.toLocaleString()}đ</TableCell>
            </TableRow>
          </TableFooter>

        </Table>
      </Card>

      {/* TỔNG THEO NHÓM */}
      <Card>
        <CardHeader>
          <CardTitle className="flex gap-2">
            <BarChart3 className="text-indigo-600"/>
            Tổng hợp theo nhóm ngành nghề
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-2">
          {Object.entries(groupSummary).map(([group, data]) => (
            <div key={group} className="flex justify-between border-b py-2">
              <span className="font-medium">{group}</span>
              <span>
                {data.revenue.toLocaleString()}đ — Thuế: {data.tax.toLocaleString()}đ
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

    </div>
  );
}

/* =======================
   COMPONENT THỐNG KÊ
======================= */

function Stat({ title, value }) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-4">
        <p className="text-xs text-slate-500">{title}</p>
        <p className="text-xl font-bold text-slate-800">
          {value.toLocaleString()}đ
        </p>
      </CardContent>
    </Card>
  );
}
