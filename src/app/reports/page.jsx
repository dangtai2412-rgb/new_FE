"use client";

import React, { useState, useMemo } from "react";
import {
  FileText,
  Download,
  Printer,
  Search,
  BarChart3,
  Calendar,
  ArrowUpDown
} from "lucide-react";

/* ======================
   UI
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
   DATA DEMO
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
  },
  {
    id: 4,
    date: "2026-01-04",
    invoice: "HD004",
    customer: "Công ty C",
    description: "Thi công móng",
    group: "Dịch vụ bao thầu",
    revenue: 22000000,
    vat_rate: 5,
    pit_rate: 2
  }
];

/* ======================
   HÀM TÍNH THUẾ
====================== */

function calculateTax(row) {

  const vat = row.revenue * row.vat_rate / 100;
  const pit = row.revenue * row.pit_rate / 100;

  return {
    vat,
    pit,
    totalTax: vat + pit,
    afterTax: row.revenue - vat - pit
  };
}

/* ======================
   PAGE
====================== */

export default function ReportsPage() {

  /* ===== STATE ===== */

  const [search, setSearch] = useState("");
  const [groupFilter, setGroupFilter] = useState("Tất cả");
  const [sortRevenue, setSortRevenue] = useState("none");

  /* ======================
     LẤY DANH SÁCH NHÓM
  ====================== */

  const groups = useMemo(() => {

    const set = new Set(REPORT_DATA.map(r => r.group));
    return ["Tất cả", ...Array.from(set)];

  }, []);

  /* ======================
     FILTER + SORT
  ====================== */

  const processedData = useMemo(() => {

    let data = [...REPORT_DATA];

    // SEARCH
    if (search) {
      data = data.filter(row => {

        const text = `
          ${row.invoice}
          ${row.customer}
          ${row.description}
          ${row.group}
        `.toLowerCase();

        return text.includes(search.toLowerCase());
      });
    }

    // GROUP FILTER
    if (groupFilter !== "Tất cả") {
      data = data.filter(row => row.group === groupFilter);
    }

    // SORT
    if (sortRevenue !== "none") {
      data.sort((a, b) =>
        sortRevenue === "asc"
          ? a.revenue - b.revenue
          : b.revenue - a.revenue
      );
    }

    return data;

  }, [search, groupFilter, sortRevenue]);

  /* ======================
     SUMMARY
  ====================== */

  const summary = useMemo(() => {

    return processedData.reduce((total, row) => {

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

  }, [processedData]);

  /* ======================
     GROUP SUMMARY
  ====================== */

  const groupSummary = useMemo(() => {

    const map = {};

    processedData.forEach(row => {

      if (!map[row.group]) {
        map[row.group] = { revenue: 0, tax: 0 };
      }

      const tax = calculateTax(row);

      map[row.group].revenue += row.revenue;
      map[row.group].tax += tax.totalTax;

    });

    return map;

  }, [processedData]);

  /* ======================
     RENDER
  ====================== */

  return (
    <div className="space-y-10 p-6 bg-slate-50 min-h-screen">

      {/* HEADER */}

      <div className="flex justify-between items-center">

        <h1 className="text-3xl font-bold flex items-center gap-2">
          <FileText className="text-blue-600"/>
          Báo cáo thuế TT88
        </h1>

        <div className="flex gap-3">

          <Button variant="outline">
            <Printer size={16}/> In báo cáo
          </Button>

          <Button className="bg-emerald-600 text-white">
            <Download size={16}/> Xuất Excel
          </Button>

        </div>

      </div>

      {/* FILTER BAR */}

      <Card>
        <CardContent className="p-4 flex flex-wrap gap-4 justify-between">

          <div className="relative w-80">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18}/>
            <Input
              placeholder="Tìm kiếm..."
              className="pl-10"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <select
            className="border rounded px-3 py-2"
            value={groupFilter}
            onChange={e => setGroupFilter(e.target.value)}
          >
            {groups.map(g => (
              <option key={g}>{g}</option>
            ))}
          </select>

          <Button
            variant="outline"
            onClick={() =>
              setSortRevenue(
                sortRevenue === "asc" ? "desc" : "asc"
              )
            }
          >
            <ArrowUpDown size={16}/>
            Sắp xếp doanh thu
          </Button>

        </CardContent>
      </Card>

      {/* STAT BOX */}

      <div className="grid md:grid-cols-5 gap-4">

        <StatBox title="Doanh thu" value={summary.revenue}/>
        <StatBox title="GTGT" value={summary.vat}/>
        <StatBox title="TNCN" value={summary.pit}/>
        <StatBox title="Tổng thuế" value={summary.totalTax}/>
        <StatBox title="Sau thuế" value={summary.afterTax}/>

      </div>

      {/* TABLE */}

      <Card className="overflow-hidden">

        <Table>

          <TableHeader>
            <TableRow>
              <TableHead>Ngày</TableHead>
              <TableHead>Hóa đơn</TableHead>
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

            {processedData.map(row => {

              const tax = calculateTax(row);

              return (
                <TableRow key={row.id}>

                  <TableCell>{row.date}</TableCell>
                  <TableCell className="text-blue-600 font-semibold">
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

      {/* GROUP SUMMARY */}

      <Card>

        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="text-indigo-600"/>
            Tổng hợp theo ngành
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-2">

          {Object.entries(groupSummary).map(([group, data]) => (
            <div
              key={group}
              className="flex justify-between border-b py-2 text-sm"
            >
              <span className="font-medium">{group}</span>
              <span>
                {data.revenue.toLocaleString()}đ | Thuế: {data.tax.toLocaleString()}đ
              </span>
            </div>
          ))}

        </CardContent>

      </Card>

    </div>
  );
}

/* ======================
   STAT BOX
====================== */

function StatBox({ title, value }) {

  return (
    <Card className="shadow-sm">

      <CardContent className="p-4">

        <p className="text-xs text-slate-500">
          {title}
        </p>

        <p className="text-xl font-bold text-slate-800">
          {value.toLocaleString()}đ
        </p>

      </CardContent>

    </Card>
  );
}