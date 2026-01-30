"use client";

import React, { useMemo } from "react";
import {
  TrendingUp,
  Users,
  FileText,
  Wallet,
} from "lucide-react";

const SAMPLE_TRANSACTIONS = [
  { id: 1, customer: "Nguyễn Văn A", amount: 5000000, date: "01/01/2026", status: "Hoàn tất" },
  { id: 2, customer: "Cty Xây Dựng B", amount: 1200000, date: "02/01/2026", status: "Hoàn tất" },
  { id: 3, customer: "Chị Lan", amount: 3500000, date: "05/01/2026", status: "Đang xử lý" },
  { id: 4, customer: "Cửa hàng C", amount: 8500000, date: "06/01/2026", status: "Hoàn tất" },
];

export default function Dashboard() {

  const summary = useMemo(() => {
    const totalRevenue = SAMPLE_TRANSACTIONS.reduce((sum, t) => sum + t.amount, 0);
    return {
      totalRevenue,
      totalOrders: SAMPLE_TRANSACTIONS.length,
      customers: new Set(SAMPLE_TRANSACTIONS.map(t => t.customer)).size,
      taxEstimate: totalRevenue * 0.06,
    };
  }, []);

  return (
    <div className="p-8 space-y-8 bg-slate-50 min-h-screen">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Dashboard tổng quan</h1>
        <p className="text-slate-500 mt-1">
          Theo dõi hoạt động kinh doanh BizFlow theo thời gian thực
        </p>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        <StatCard 
          title="Tổng doanh thu"
          value={`${summary.totalRevenue.toLocaleString()}đ`}
          icon={<TrendingUp className="text-blue-600" />}
          bg="bg-blue-50"
        />

        <StatCard 
          title="Số đơn hàng"
          value={summary.totalOrders}
          icon={<FileText className="text-emerald-600" />}
          bg="bg-emerald-50"
        />

        <StatCard 
          title="Khách hàng"
          value={summary.customers}
          icon={<Users className="text-indigo-600" />}
          bg="bg-indigo-50"
        />

        <StatCard 
          title="Thuế dự tính"
          value={`${summary.taxEstimate.toLocaleString()}đ`}
          icon={<Wallet className="text-orange-600" />}
          bg="bg-orange-50"
        />

      </div>

      {/* RECENT ACTIVITY */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* TRANSACTIONS */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-4 border-b font-semibold text-slate-700">
            Giao dịch gần đây
          </div>

          <table className="w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="text-left p-3">Khách hàng</th>
                <th className="text-right p-3">Số tiền</th>
                <th className="text-center p-3">Ngày</th>
                <th className="text-center p-3">Trạng thái</th>
              </tr>
            </thead>

            <tbody>
              {SAMPLE_TRANSACTIONS.map(t => (
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

        {/* QUICK INFO */}
        <div className="bg-white shadow rounded-lg p-6 space-y-4">

          <h3 className="font-semibold text-slate-700 text-lg">
            Thông tin nhanh
          </h3>

          <InfoRow label="Doanh thu hôm nay" value="3,200,000đ" />
          <InfoRow label="Hóa đơn mới" value="5" />
          <InfoRow label="Khách hàng mới" value="2" />
          <InfoRow label="Công nợ đang chờ" value="1,500,000đ" />

          <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition">
            Xem báo cáo chi tiết
          </button>

        </div>

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
          <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
        </div>
        <div className="p-3 bg-white rounded-full shadow">
          {icon}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between border-b pb-2 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="font-semibold text-slate-800">{value}</span>
    </div>
  );
}
