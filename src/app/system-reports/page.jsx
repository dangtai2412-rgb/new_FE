"use client";
import { Activity, Server, Database, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SystemReportsPage() {
  return (
    <div className="space-y-6 p-4">
      <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
        <Activity className="text-red-600" /> Báo cáo sức khỏe hệ thống
      </h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Server Uptime</CardTitle>
            <Server className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-green-600">99.9%</div><p className="text-xs text-slate-500">Liên tục 30 ngày</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">45%</div><p className="text-xs text-slate-500">Trung bình (4 Cores)</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Database</CardTitle>
            <Database className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">1.2 GB</div><p className="text-xs text-slate-500">Total Storage</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">API Requests</CardTitle>
            <ShieldAlert className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">24k</div><p className="text-xs text-slate-500">Requests/ngày</p></CardContent>
        </Card>
      </div>

      {/* Giả lập Log hệ thống */}
      <Card className="mt-6">
        <CardHeader><CardTitle>Nhật ký hệ thống (System Logs)</CardTitle></CardHeader>
        <CardContent>
          <div className="bg-slate-950 text-green-400 p-4 rounded-lg font-mono text-sm h-64 overflow-y-auto">
            <p>[INFO] 2026-02-01 23:45:12 - Auto-backup database completed successfully.</p>
            <p>[INFO] 2026-02-01 23:46:05 - New subscription created: ID #1024.</p>
            <p className="text-yellow-400">[WARN] 2026-02-01 23:50:00 - High latency detected on /api/reports (200ms).</p>
            <p>[INFO] 2026-02-01 23:55:10 - User ID 55 logged in from IP 192.168.1.1.</p>
            <p className="text-red-400">[ERR ] 2026-02-02 00:01:00 - Payment Gateway Timeout (Retry 1/3).</p>
            <p>[INFO] 2026-02-02 00:01:05 - Payment successful.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}