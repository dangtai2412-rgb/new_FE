"use client";

import React, { useMemo, useState } from "react";
import {
  TrendingUp,
  Users,
  FileText,
  Wallet,
  ArrowUpDown,
} from "lucide-react";

/* =====================
   DATA GIẢ LẬP
===================== */

const SAMPLE_TRANSACTIONS = [
  { id: 1, customer: "Nguyễn Văn A", amount: 5000000, date: "2026-01-01", status: "Hoàn tất" },
  { id: 2, customer: "Cty Xây Dựng B", amount: 1200000, date: "2026-01-02", status: "Hoàn tất" },
  { id: 3, customer: "Chị Lan", amount: 3500000, date: "2026-01-05", status: "Đang xử lý" },
  { id: 4, customer: "Cửa hàng C", amount: 8500000, date: "2026-01-06", status: "Hoàn tất" },
  { id: 5, customer: "Anh Phúc", amount: 2400000, date: "2026-01-07", status: "Đang xử lý" },
  { id: 6, customer: "Cty Nội Thất D", amount: 9800000, date: "2026-01-08", status: "Hoàn tất" },
];

/* =====================
   DASHBOARD
===================== */

export default function Dashboard() {

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tất cả");
  const [sortType, setSortType] = useState("none");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  /* =====================
     LỌC + SORT
  ===================== */

  const filteredTransactions = useMemo(() => {

    let data = [...SAMPLE_TRANSACTIONS];

    // Search
    data = data.filter(t =>
      t.customer.toLowerCase().includes(search.toLowerCase())
    );

    // Status
    if (statusFilter !== "Tất cả") {
      data = data.filter(t => t.status === statusFilter);
    }

    // Date range
    if (fromDate) {
      data = data.filter(t => t.date >= fromDate);
    }

    if (toDate) {
      data = data.filter(t => t.date <= toDate);
    }

    // Sort
    if (sortType === "asc") {
      data.sort((a, b) => a.amount - b.amount);
    }

    if (sortType === "desc") {
      data.sort((a, b) => b.amount - a.amount);
    }

    return data;

  }, [search, statusFilter, sortType, fromDate, toDate]);

  /* =====================
     TỔNG HỢP
  ===================== */

  const summary = useMemo(() => {

    const totalRevenue = filteredTransactions.reduce(
      (sum, t) => sum + t.amount,
      0
    );

    const completed = filteredTransactions.filter(t => t.status === "Hoàn tất").length;

    const pending = filteredTransactions.filter(t => t.status === "Đang xử lý").length;

    return {
      totalRevenue,
      totalOrders: filteredTransactions.length,
      customers: new Set(filteredTransactions.map(t => t.customer)).size,
      completed,
      pending,
      taxEstimate: totalRevenue * 0.06,
    };

  }, [filteredTransactions]);

  const progress = Math.min((summary.totalRevenue / 20000000) * 100, 100);

  /* =====================
     UI
  ===================== */

  return (
    <div className="p-8 space-y-8 bg-slate-50 min-h-screen">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Dashboard BizFlow nâng cao
        </h1>
        <p className="text-slate-500 mt-1">
          Thống kê doanh thu, lọc realtime, sort thông minh
        </p>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        <StatCard
          title="Doanh thu"
          value={`${summary.totalRevenue.toLocaleString()}đ`}
          icon={<TrendingUp className="text-blue-600" />}
          bg="bg-blue-50"
        />

        <StatCard
          title="Tổng đơn"
          value={summary.totalOrders}
          icon={<FileText className="text-emerald-600" />}
          bg="bg-emerald-50"
        />

        <StatCard
          title="Hoàn tất"
          value={summary.completed}
          icon={<Users className="text-indigo-600" />}
          bg="bg-indigo-50"
        />

        <StatCard
          title="Đang xử lý"
          value={summary.pending}
          icon={<Wallet className="text-orange-600" />}
          bg="bg-orange-50"
        />

      </div>

      {/* PROGRESS */}
      <div className="bg-white rounded-lg shadow p-4 space-y-2">
        <p className="font-semibold text-slate-700">
          Tiến độ doanh thu tháng (mục tiêu 20tr)
        </p>

        <div className="w-full bg-slate-200 h-3 rounded overflow-hidden">
          <div
            style={{ width: `${progress}%` }}
            className="h-full bg-blue-600 transition-all"
          />
        </div>

        <p className="text-sm text-slate-500">
          {progress.toFixed(1)}%
        </p>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white shadow rounded-lg p-4 grid grid-cols-1 md:grid-cols-5 gap-4">

        <input
          className="border rounded px-3 py-2"
          placeholder="Tìm khách hàng..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <select
          className="border rounded px-3 py-2"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option>Tất cả</option>
          <option>Hoàn tất</option>
          <option>Đang xử lý</option>
        </select>

        <input
          type="date"
          className="border rounded px-3 py-2"
          value={fromDate}
          onChange={e => setFromDate(e.target.value)}
        />

        <input
          type="date"
          className="border rounded px-3 py-2"
          value={toDate}
          onChange={e => setToDate(e.target.value)}
        />

        <button
          onClick={() =>
            setSortType(sortType === "asc" ? "desc" : "asc")
          }
          className="border rounded px-3 py-2 flex items-center justify-center gap-2 hover:bg-slate-100"
        >
          <ArrowUpDown size={16} />
          Sort tiền
        </button>

      </div>

      {/* TABLE */}
      <div className="bg-white shadow rounded-lg overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-slate-100">
            <tr>
              <th className="p-3 text-left">Khách hàng</th>
              <th className="p-3 text-right">Số tiền</th>
              <th className="p-3 text-center">Ngày</th>
              <th className="p-3 text-center">Trạng thái</th>
            </tr>
          </thead>

          <tbody>

            {filteredTransactions.length === 0 && (
              <tr>
                <td colSpan="4" className="p-6 text-center text-slate-400">
                  Không có dữ liệu
                </td>
              </tr>
            )}

            {filteredTransactions.map(t => (
              <tr key={t.id} className="border-t hover:bg-slate-50">

                <td className="p-3">{t.customer}</td>

                <td className="p-3 text-right font-semibold">
                  {t.amount.toLocaleString()}đ
                </td>

                <td className="p-3 text-center">{t.date}</td>

                <td className="p-3 text-center">
                  <span className={`px-2 py-1 rounded text-xs font-bold
                    ${t.status === "Hoàn tất"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"}`}>
                    {t.status}
                  </span>
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

/* =====================
   COMPONENT PHỤ
===================== */

function StatCard({ title, value, icon, bg }) {
  return (
    <div className={`p-4 rounded-xl shadow-sm ${bg}`}>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">
            {value}
          </p>
        </div>
        <div className="p-3 bg-white rounded-full shadow">
          {icon}
        </div>
      </div>
    </div>
  );
}
