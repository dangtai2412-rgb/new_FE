"use client";

import { useMemo, useState } from "react";
import {
  Users,
  ArrowUpCircle,
  ArrowDownCircle,
  Search,
  Plus,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff
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
  { id: 1, name: "Đại lý VLXD A", type: "Phải trả", amount: 45000000, status: "Đang nợ", due: "2026-01-15" },
  { id: 2, name: "Thầu Nguyễn Văn B", type: "Phải thu", amount: 12000000, status: "Quá hạn", due: "2026-01-05" },
  { id: 3, name: "Cửa hàng điện nước C", type: "Phải thu", amount: 5500000, status: "Trong hạn", due: "2026-01-20" },
  { id: 4, name: "Nhà cung cấp sơn D", type: "Phải trả", amount: 8200000, status: "Trong hạn", due: "2026-01-25" },
];

/* =====================
   HELPERS
===================== */

const formatMoney = (num) =>
  num.toLocaleString("vi-VN") + "đ";

const daysLeft = (dateStr) => {
  const today = new Date();
  const due = new Date(dateStr);
  return Math.ceil((due - today) / (1000 * 60 * 60 * 24));
};

/* =====================
   PAGE
===================== */

export default function DebtPage() {

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("Tất cả");
  const [sortByAmount, setSortByAmount] = useState(null);
  const [hideOverdue, setHideOverdue] = useState(false);

  /* ===== FILTER + SORT ===== */

  const filteredData = useMemo(() => {

    let data = [...DEBT_DATA];

    // Search
    data = data.filter(d =>
      d.name.toLowerCase().includes(search.toLowerCase())
    );

    // Type filter
    if (filterType !== "Tất cả") {
      data = data.filter(d => d.type === filterType);
    }

    // Hide overdue
    if (hideOverdue) {
      data = data.filter(d => d.status !== "Quá hạn");
    }

    // Sort
    if (sortByAmount === "asc") {
      data.sort((a, b) => a.amount - b.amount);
    }

    if (sortByAmount === "desc") {
      data.sort((a, b) => b.amount - a.amount);
    }

    return data;

  }, [search, filterType, sortByAmount, hideOverdue]);

  /* ===== SUMMARY REALTIME ===== */

  const summary = useMemo(() => {

    let receivable = 0;
    let payable = 0;
    let overdue = 0;

    filteredData.forEach(d => {
      if (d.type === "Phải thu") receivable += d.amount;
      if (d.type === "Phải trả") payable += d.amount;
      if (d.status === "Quá hạn") overdue += d.amount;
    });

    const total = receivable + payable;

    return {
      receivable,
      payable,
      overdue,
      overduePercent: total ? Math.round((overdue / total) * 100) : 0
    };

  }, [filteredData]);

  return (
    <div className="space-y-6">

      {/* ===== HEADER ===== */}

      <div className="flex flex-col md:flex-row justify-between gap-4">

        <div>
          <h2 className="text-3xl font-bold text-slate-800">
            Quản lý Công nợ
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Theo dõi thu – chi, hạn thanh toán và cảnh báo quá hạn
          </p>
        </div>

        <Button className="bg-blue-600 hover:bg-blue-700 flex gap-2">
          <Plus size={18} />
          Thêm công nợ mới
        </Button>

      </div>

      {/* ===== SUMMARY ===== */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        <SummaryCard 
          title="Tổng phải thu"
          value={summary.receivable}
          color="emerald"
        />

        <SummaryCard 
          title="Tổng phải trả"
          value={summary.payable}
          color="red"
        />

        <SummaryCard 
          title="Nợ quá hạn"
          value={summary.overdue}
          color="orange"
          icon={<AlertTriangle size={16}/>}
        />

        <SummaryCard 
          title="Tỷ lệ quá hạn"
          value={summary.overduePercent + "%"}
          color="purple"
          isPercent
        />

      </div>

      {/* ===== FILTER BAR ===== */}

      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row gap-4">

          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <Input
              className="pl-10"
              placeholder="Tìm theo đối tác..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <select
            className="border rounded px-3 py-2 text-sm"
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
          >
            <option>Tất cả</option>
            <option>Phải thu</option>
            <option>Phải trả</option>
          </select>

          <Button
            variant="outline"
            onClick={() =>
              setSortByAmount(
                sortByAmount === "asc" ? "desc" : "asc"
              )
            }
            className="flex gap-2"
          >
            Sắp xếp tiền
            {sortByAmount === "asc" && <ArrowUp size={14}/>}
            {sortByAmount === "desc" && <ArrowDown size={14}/>}
          </Button>

          <Button
            variant="outline"
            onClick={() => setHideOverdue(!hideOverdue)}
            className="flex gap-2"
          >
            {hideOverdue ? <Eye size={16}/> : <EyeOff size={16}/>}
            {hideOverdue ? "Hiện quá hạn" : "Ẩn quá hạn"}
          </Button>

        </CardContent>
      </Card>

      {/* ===== TABLE ===== */}

      <Card>

        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="text-blue-600" size={20}/>
            Danh sách công nợ chi tiết
          </CardTitle>
        </CardHeader>

        <CardContent className="overflow-x-auto">

          <Table>

            <TableHeader>
              <TableRow>
                <TableHead>Đối tác</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead className="text-right">Số tiền</TableHead>
                <TableHead className="text-center">Hạn</TableHead>
                <TableHead className="text-center">Còn lại</TableHead>
                <TableHead className="text-center">Trạng thái</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>

              {filteredData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-slate-400">
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              )}

              {filteredData.map(d => {

                const remainDays = daysLeft(d.due);

                return (
                  <TableRow key={d.id} className="hover:bg-slate-50">

                    <TableCell className="font-medium">
                      {d.name}
                    </TableCell>

                    <TableCell>
                      {d.type === "Phải thu" ? (
                        <span className="flex gap-1 text-emerald-600 text-xs font-semibold">
                          <ArrowDownCircle size={14}/> Phải thu
                        </span>
                      ) : (
                        <span className="flex gap-1 text-red-600 text-xs font-semibold">
                          <ArrowUpCircle size={14}/> Phải trả
                        </span>
                      )}
                    </TableCell>

                    <TableCell className="text-right font-bold">
                      {formatMoney(d.amount)}
                    </TableCell>

                    <TableCell className="text-center text-sm">
                      {d.due}
                    </TableCell>

                    <TableCell className="text-center text-sm">

                      {remainDays < 0 ? (
                        <span className="text-red-600 font-bold">
                          Quá {Math.abs(remainDays)} ngày
                        </span>
                      ) : (
                        <span className="text-slate-600">
                          {remainDays} ngày
                        </span>
                      )}

                    </TableCell>

                    <TableCell className="text-center">
                      <StatusBadge status={d.status} />
                    </TableCell>

                  </TableRow>
                );

              })}

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

function SummaryCard({ title, value, color, icon, isPercent }) {

  const colorMap = {
    emerald: "text-emerald-600 border-emerald-500",
    red: "text-red-600 border-red-500",
    orange: "text-orange-600 border-orange-500",
    purple: "text-purple-600 border-purple-500",
  };

  return (
    <Card className={`border-l-4 ${colorMap[color]} shadow-sm`}>
      <CardHeader className="pb-1">
        <CardTitle className="text-sm text-slate-500 flex justify-between">
          {title}
          {icon}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className={`text-2xl font-bold ${colorMap[color].split(" ")[0]}`}>
          {isPercent ? value : formatMoney(value)}
        </p>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }) {

  const map = {
    "Quá hạn": "bg-red-100 text-red-700 border-red-200",
    "Trong hạn": "bg-emerald-100 text-emerald-700 border-emerald-200",
    "Đang nợ": "bg-blue-100 text-blue-700 border-blue-200",
  };

  return (
    <span
      className={`px-2 py-1 rounded-full border text-[10px] font-bold ${map[status]}`}
    >
      {status}
    </span>
  );
}