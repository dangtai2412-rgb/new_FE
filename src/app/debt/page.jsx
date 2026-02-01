"use client";

import { useMemo, useState } from "react";
import {
  Users,
  ArrowUpCircle,
  ArrowDownCircle,
  Search,
  Plus,
  AlertTriangle
} from "lucide-react";

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
  TableRow
} from "@/components/ui/table";

/* =====================
   DATA MẪU
===================== */

const DEBT_DATA = [
  { id: 1, name: "Đại lý VLXD A", type: "Phải trả", amount: 45000000, status: "Đang nợ", due: "15/01/2026" },
  { id: 2, name: "Thầu Nguyễn Văn B", type: "Phải thu", amount: 12000000, status: "Quá hạn", due: "05/01/2026" },
  { id: 3, name: "Cửa hàng điện nước C", type: "Phải thu", amount: 5500000, status: "Trong hạn", due: "20/01/2026" },
  { id: 4, name: "Nhà cung cấp sơn D", type: "Phải trả", amount: 8200000, status: "Trong hạn", due: "25/01/2026" },
];

/* =====================
   PAGE
===================== */

export default function DebtPage() {

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("Tất cả");

  /* ===== Filter + Search ===== */

  const filteredData = useMemo(() => {
    return DEBT_DATA.filter(d => {

      const matchSearch =
        d.name.toLowerCase().includes(search.toLowerCase());

      const matchType =
        filterType === "Tất cả" || d.type === filterType;

      return matchSearch && matchType;
    });
  }, [search, filterType]);

  /* ===== Summary ===== */

  const summary = useMemo(() => {

    let totalReceivable = 0;
    let totalPayable = 0;
    let overdue = 0;

    DEBT_DATA.forEach(d => {
      if (d.type === "Phải thu") totalReceivable += d.amount;
      if (d.type === "Phải trả") totalPayable += d.amount;
      if (d.status === "Quá hạn") overdue += d.amount;
    });

    return {
      totalReceivable,
      totalPayable,
      overdue
    };

  }, []);

  return (
    <div className="space-y-6">

      {/* ================= HEADER ================= */}

      <div className="flex justify-between items-center">

        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Đối tác & Công nợ
          </h2>
          <p className="text-sm text-slate-500">
            Theo dõi các khoản phải thu – phải trả theo thời hạn
          </p>
        </div>

        <Button className="bg-blue-600 hover:bg-blue-700 flex gap-2">
          <Plus size={18} />
          Thêm công nợ
        </Button>

      </div>

      {/* ================= SUMMARY ================= */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <SummaryCard
          title="Tổng phải thu"
          value={summary.totalReceivable}
          color="emerald"
        />

        <SummaryCard
          title="Tổng phải trả"
          value={summary.totalPayable}
          color="red"
        />

        <SummaryCard
          title="Nợ quá hạn"
          value={summary.overdue}
          color="orange"
          icon={<AlertTriangle size={18} />}
        />

      </div>

      {/* ================= FILTER ================= */}

      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row gap-4">

          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-2.5 text-slate-400"
              size={18}
            />
            <Input
              className="pl-10"
              placeholder="Tìm theo tên đối tác..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <select
            className="border rounded-md px-3 py-2 text-sm"
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
          >
            <option>Tất cả</option>
            <option>Phải thu</option>
            <option>Phải trả</option>
          </select>

        </CardContent>
      </Card>

      {/* ================= TABLE ================= */}

      <Card>

        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users size={20} className="text-blue-600" />
            Danh sách công nợ chi tiết
          </CardTitle>
        </CardHeader>

        <CardContent>

          <Table>

            <TableHeader>
              <TableRow>
                <TableHead>Đối tác</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead className="text-right">Số tiền</TableHead>
                <TableHead className="text-center">Hạn thanh toán</TableHead>
                <TableHead className="text-center">Trạng thái</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>

              {filteredData.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-slate-400 italic"
                  >
                    Không có dữ liệu phù hợp
                  </TableCell>
                </TableRow>
              )}

              {filteredData.map(d => (

                <TableRow
                  key={d.id}
                  className="hover:bg-slate-50"
                >

                  <TableCell className="font-medium">
                    {d.name}
                  </TableCell>

                  <TableCell>

                    {d.type === "Phải thu" ? (
                      <span className="flex items-center gap-1 text-emerald-600 text-xs font-semibold">
                        <ArrowDownCircle size={14} /> Phải thu
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-600 text-xs font-semibold">
                        <ArrowUpCircle size={14} /> Phải trả
                      </span>
                    )}

                  </TableCell>

                  <TableCell
                    className="text-right font-bold"
                    suppressHydrationWarning
                  >
                    {d.amount.toLocaleString()}đ
                  </TableCell>

                  <TableCell className="text-center text-sm text-slate-600">
                    {d.due}
                  </TableCell>

                  <TableCell className="text-center">

                    <StatusBadge status={d.status} />

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

/* =====================
   COMPONENT PHỤ
===================== */

function SummaryCard({ title, value, color, icon }) {
  return (
    <Card className={`border-l-4 border-l-${color}-500 shadow-sm`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-slate-500 flex justify-between">
          {title}
          {icon}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p
          className={`text-2xl font-bold text-${color}-600`}
          suppressHydrationWarning
        >
          {value.toLocaleString()}đ
        </p>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }) {

  if (status === "Quá hạn") {
    return (
      <span className="bg-red-100 text-red-700 border border-red-200 px-2 py-1 rounded-full text-[10px] font-bold">
        Quá hạn
      </span>
    );
  }

  if (status === "Trong hạn") {
    return (
      <span className="bg-emerald-100 text-emerald-700 border border-emerald-200 px-2 py-1 rounded-full text-[10px] font-bold">
        Trong hạn
      </span>
    );
  }

  return (
    <span className="bg-blue-100 text-blue-700 border border-blue-200 px-2 py-1 rounded-full text-[10px] font-bold">
      Đang nợ
    </span>
  );
}
