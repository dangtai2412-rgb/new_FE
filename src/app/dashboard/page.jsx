"use client";

import React, { useMemo, useState } from "react";
import {
  TrendingUp,
  Users,
  FileText,
  Wallet,
} from "lucide-react";

/* =====================
   DATA GIẢ LẬP
===================== */

const SAMPLE_TRANSACTIONS = [
  { id: 1, customer: "Nguyễn Văn A", amount: 5000000, date: "01/01/2026", status: "Hoàn tất" },
  { id: 2, customer: "Cty Xây Dựng B", amount: 1200000, date: "02/01/2026", status: "Hoàn tất" },
  { id: 3, customer: "Chị Lan", amount: 3500000, date: "05/01/2026", status: "Đang xử lý" },
  { id: 4, customer: "Cửa hàng C", amount: 8500000, date: "06/01/2026", status: "Hoàn tất" },
  { id: 5, customer: "Anh Phúc", amount: 2400000, date: "07/01/2026", status: "Đang xử lý" },
  { id: 6, customer: "Cty Nội Thất D", amount: 9800000, date: "08/01/2026", status: "Hoàn tất" },
];

/* =====================
   DASHBOARD
===================== */

export default function Dashboard() {

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tất cả");

  /* ===== LỌC DỮ LIỆU ===== */

  const filteredTransactions = useMemo(() => {
    return SAMPLE_TRANSACTIONS.filter(t => {

      const matchSearch = t.customer.toLowerCase().includes(search.toLowerCase());

      const matchStatus =
        statusFilter === "Tất cả" || t.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [search, statusFilter]);

  /* ===== TÍNH TỔNG ===== */

  const summary = useMemo(() => {

    const totalRevenue = filteredTransactions.reduce(
      (sum, t) => sum + t.amount,
      0
    );

    return {
      totalRevenue,
      totalOrders: filteredTransactions.length,
      customers: new Set(filteredTransactions.map(t => t.customer)).size,
      taxEstimate: totalRevenue * 0.06,
    };

  }, [filteredTransactions]);

  /* ===== CLICK CARD ===== */

  const handleCardClick = (type) => {
    if (type === "all") setStatusFilter("Tất cả");
    if (type === "done") setStatusFilter("Hoàn tất");
    if (type === "pending") setStatusFilter("Đang xử lý");
  };

  return (
    <div className="p-8 space-y-8 bg-slate-50 min-h-screen">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Dashboard tương tác BizFlow
        </h1>
        <p className="text-slate-500 mt-1">
          Click card để lọc dữ liệu, tìm kiếm giao dịch realtime
        </p>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        <StatCard
          title="Tổng doanh thu"
          value={`${summary.totalRevenue.toLocaleString()}đ`}
          icon={<TrendingUp className="text-blue-600" />}
          bg="bg-blue-50"
          onClick={() => handleCardClick("all")}
        />

        <StatCard
          title="Tổng đơn"
          value={summary.totalOrders}
          icon={<FileText className="text-emerald-600" />}
          bg="bg-emerald-50"
          onClick={() => handleCardClick("all")}
        />

        <StatCard
          title="Hoàn tất"
          value={SAMPLE_TRANSACTIONS.filter(t => t.status === "Hoàn tất").length}
          icon={<Users className="text-indigo-600" />}
          bg="bg-indigo-50"
          onClick={() => handleCardClick("done")}
        />

        <StatCard
          title="Đang xử lý"
          value={SAMPLE_TRANSACTIONS.filter(t => t.status === "Đang xử lý").length}
          icon={<Wallet className="text-orange-600" />}
          bg="bg-orange-50"
          onClick={() => handleCardClick("pending")}
        />

      </div>

      {/* FILTER BAR */}
      <div className="bg-white shadow rounded-lg p-4 flex flex-col md:flex-row gap-4 justify-between">

        <input
          className="border rounded px-3 py-2 w-full md:w-80"
          placeholder="Tìm theo tên khách hàng..."
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
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-6 text-center text-slate-400">
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              filteredTransactions.map(t => (
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
              ))
            )}
          </tbody>

        </table>

      </div>

    </div>
  );
}

/* =====================
   COMPONENT PHỤ
===================== */

function StatCard({ title, value, icon, bg, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-xl shadow-sm cursor-pointer hover:scale-[1.02] transition ${bg}`}
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
        </div>
        <div className="p-3 bg-white rounded-full shadow">
          {icon}
        </div>
      </div>
    </div>
  );
}