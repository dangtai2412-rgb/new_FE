"use client";

import React, { useState, useMemo } from "react";

/* ======================
   ICON
====================== */
import {
  FileText,
  Download,
  Printer,
  Search,
  BarChart3
} from "lucide-react";

/* ======================
   UI COMPONENT
====================== */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter
} from "@/components/ui/table";

/* ======================
   DATA DEMO (SAU NÀY ĐỔI API)
====================== */

const REPORT_DATA = [
  {
    id: 1,
    date: "2026-01-01",
    invoice: "HD001",
    customer: "Nguyễn Văn A",
    description: "Cát xây dựng",
    group: "Phân phối hàng hóa",
    revenue: 5000000,
    vat_rate: 1,
    pit_rate: 0.5
  },
  {
    id: 2,
    date: "2026-01-02",
    invoice: "HD002",
    customer: "Công ty Xây Dựng B",
    description: "Vận chuyển xà bần",
    group: "Dịch vụ không bao thầu",
    revenue: 1200000,
    vat_rate: 5,
    pit_rate: 2
  },
  {
    id: 3,
    date: "2026-01-03",
    invoice: "HD003",
    customer: "Khách lẻ",
    description: "Thép xây dựng",
    group: "Phân phối hàng hóa",
    revenue: 15000000,
    vat_rate: 1,
    pit_rate: 0.5
  }
];

/* ======================
   HÀM TÍNH THUẾ RIÊNG (RÕ RÀNG)
====================== */

function calculateTax(item) {

  const vat = item.revenue * item.vat_rate / 100;
  const pit = item.revenue * item.pit_rate / 100;

  return {
    vat,
    pit,
    totalTax: vat + pit,
    afterTax: item.revenue - (vat + pit)
  };
}

/* ======================
   COMPONENT CHÍNH
====================== */

export default function ReportsPage() {

  /* ========= STATE ========= */

  const [search, setSearch] = useState("");

  /* ========= FILTER ========= */

  const filteredData = useMemo(() => {

    if (!search) return REPORT_DATA;

    return REPORT_DATA.filter(row => {

      const text = `
        ${row.invoice}
        ${row.customer}
        ${row.description}
        ${row.group}
      `.toLowerCase();

      return text.includes(search.toLowerCase());

    });

  }, [search]);

  /* ========= TỔNG HỢP CHUNG ========= */

  const summary = useMemo(() => {

    return filteredData.reduce((total, row) => {

      const tax = calculateTax(row);

      total.revenue += row.revenue;
      total.vat += tax.vat;
      total.pit += tax.pit;
      total.totalTax += tax.totalTax;
      total.afterTax += tax.afterTax;

      return total;

    }, {
      revenue: 0,
      vat: 0,
      pit: 0,
      totalTax: 0,
      afterTax: 0
    });

  }, [filteredData]);

  /* ========= TỔNG THEO NHÓM ========= */

  const groupSummary = useMemo(() => {

    const result = {};

    filteredData.forEach(row => {

      if (!result[row.group]) {
        result[row.group] = {
          revenue: 0,
          tax: 0
        };
      }

      const tax = calculateTax(row);

      result[row.group].revenue += row.revenue;
      result[row.group].tax += tax.totalTax;

    });

    return result;

  }, [filteredData]);

  /* ======================
     RENDER
  ===================== */

  return (
    <div className="space-y-8 p-4">

      {/* ===== TITLE ===== */}
      <div className="flex justify-between items-center">

        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="text-blue-600"/>
          Báo cáo thuế chi tiết
        </h1>

        <div className="flex gap-2">
          <Button variant="outline">
            <Printer size={16}/> In
          </Button>
          <Button className="bg-emerald-600 text-white">
            <Download size={16}/> Xuất Excel
          </Button>
        </div>

      </div>

      {/* ===== DASHBOARD ===== */}

      <div className="grid md:grid-cols-5 gap-4">

        <StatBox title="Tổng doanh thu" value={summary.revenue}/>
        <StatBox title="Thuế GTGT" value={summary.vat}/>
        <StatBox title="Thuế TNCN" value={summary.pit}/>
        <StatBox title="Tổng thuế" value={summary.totalTax}/>
        <StatBox title="Sau thuế" value={summary.afterTax}/>

      </div>

      {/* ===== SEARCH ===== */}

      <Card>
        <CardContent className="p-4 flex justify-end">

          <div className="relative w-96">

            <Search
              size={18}
              className="absolute left-3 top-2.5 text-gray-400"
            />

            <Input
              placeholder="Tìm hóa đơn, khách hàng, nhóm..."
              className="pl-10"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />

          </div>

        </CardContent>
      </Card>

      {/* ===== TABLE ===== */}

      <Card className="overflow-hidden">

        <Table>

          <TableHeader>
            <TableRow>
              <TableHead>Ngày</TableHead>
              <TableHead>Số CT</TableHead>
              <TableHead>Khách</TableHead>
              <TableHead>Nhóm</TableHead>
              <TableHead className="text-right">Doanh thu</TableHead>
              <TableHead className="text-right">GTGT</TableHead>
              <TableHead className="text-right">TNCN</TableHead>
              <TableHead className="text-right">Tổng thuế</TableHead>
              <TableHead className="text-right">Sau thuế</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>

            {filteredData.map(row => {

              const tax = calculateTax(row);

              return (
                <TableRow key={row.id}>

                  <TableCell>{row.date}</TableCell>

                  <TableCell className="font-semibold text-blue-600">
                    {row.invoice}
                  </TableCell>

                  <TableCell>{row.customer}</TableCell>

                  <TableCell>{row.group}</TableCell>

                  <TableCell className="text-right">
                    {row.revenue.toLocaleString()}đ
                  </TableCell>

                  <TableCell className="text-right">
                    {tax.vat.toLocaleString()}đ
                  </TableCell>

                  <TableCell className="text-right">
                    {tax.pit.toLocaleString()}đ
                  </TableCell>

                  <TableCell className="text-right font-bold">
                    {tax.totalTax.toLocaleString()}đ
                  </TableCell>

                  <TableCell className="text-right text-emerald-700 font-bold">
                    {tax.afterTax.toLocaleString()}đ
                  </TableCell>

                </TableRow>
              );

            })}

          </TableBody>

          <TableFooter>
            <TableRow>
              <TableCell colSpan={4} className="text-right font-bold">
                TỔNG
              </TableCell>

              <TableCell className="text-right font-bold">
                {summary.revenue.toLocaleString()}đ
              </TableCell>

              <TableCell className="text-right">
                {summary.vat.toLocaleString()}đ
              </TableCell>

              <TableCell className="text-right">
                {summary.pit.toLocaleString()}đ
              </TableCell>

              <TableCell className="text-right font-bold">
                {summary.totalTax.toLocaleString()}đ
              </TableCell>

              <TableCell className="text-right font-bold text-emerald-700">
                {summary.afterTax.toLocaleString()}đ
              </TableCell>
            </TableRow>
          </TableFooter>

        </Table>

      </Card>

      {/* ===== GROUP SUMMARY ===== */}

      <Card>

        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="text-indigo-600"/>
            Tổng theo ngành nghề
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-2">

          {Object.entries(groupSummary).map(([group, data]) => (
            <div
              key={group}
              className="flex justify-between border-b py-2"
            >
              <span className="font-medium">{group}</span>
              <span>
                {data.revenue.toLocaleString()}đ —
                Thuế: {data.tax.toLocaleString()}đ
              </span>
            </div>
          ))}

        </CardContent>

      </Card>

    </div>
  );
}

/* ======================
   COMPONENT THỐNG KÊ
====================== */

function StatBox({ title, value }) {

  return (
    <Card>

      <CardContent className="p-4">

        <p className="text-xs text-gray-500">
          {title}
        </p>

        <p className="text-xl font-bold">
          {value.toLocaleString()}đ
        </p>

      </CardContent>

    </Card>
  );
}
