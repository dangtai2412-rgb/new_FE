"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, ArrowUpCircle, ArrowDownCircle, Search, Plus, 
  Filter, RefreshCw, Wallet, Phone, MapPin, AlertCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { api_service } from "@/lib/api_service"; // Import service API

// --- DỮ LIỆU MẪU (Dùng khi chưa có API) ---
const DEMO_CUSTOMERS = [
  { id: "KH001", name: "Thầu XD Nguyễn Văn B", phone: "0909123456", type: "Phải thu", amount: 12000000, limit: 15000000, status: "Quá hạn" },
  { id: "KH002", name: "Cửa hàng Điện Nước C", phone: "0912345678", type: "Phải thu", amount: 5500000, limit: 10000000, status: "Trong hạn" },
  { id: "KH003", name: "Anh Tâm (Khách lẻ)", phone: "0987654321", type: "Phải thu", amount: 0, limit: 5000000, status: "Không nợ" },
];

const DEMO_SUPPLIERS = [
  { id: "NCC01", name: "Đại lý VLXD A", phone: "0283888999", type: "Phải trả", amount: 45000000, status: "Đang nợ" },
  { id: "NCC02", name: "Kho Thép Hòa Phát", phone: "0274111222", type: "Phải trả", amount: 0, status: "Đã thanh toán" },
];

export default function DebtPage() {
  const [activeTab, setActiveTab] = useState("receivables"); // 'receivables' (Phải thu) hoặc 'payables' (Phải trả)
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Hàm load dữ liệu giả lập (hoặc gọi API sau này)
  const loadData = async () => {
    setLoading(true);
    try {
      // Sau này bạn có thể thay bằng: await api_service.get_customers() hoặc get_suppliers()
      // Hiện tại mình dùng setTimeout để giả lập việc tải dữ liệu
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (activeTab === "receivables") {
        setData(DEMO_CUSTOMERS);
      } else {
        setData(DEMO_SUPPLIERS);
      }
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  // Tính toán tổng quan
  const totalReceivable = DEMO_CUSTOMERS.reduce((sum, item) => sum + item.amount, 0);
  const totalPayable = DEMO_SUPPLIERS.reduce((sum, item) => sum + item.amount, 0);

  // Lọc dữ liệu theo từ khóa tìm kiếm
  const filteredData = data.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      
      {/* 1. HEADER & ACTIONS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            Đối tác & Công nợ
          </h2>
          <p className="text-sm text-slate-500 mt-1">Quản lý dòng tiền phải thu và phải trả.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadData} className="gap-2">
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Tải lại
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
            <Plus size={18} /> Thêm Đối tác
          </Button>
        </div>
      </div>

      {/* 2. DASHBOARD CARDS (Thống kê tiền) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card Phải Thu */}
        <Card className={`border-l-4 border-l-emerald-500 shadow-sm transition-all ${activeTab === 'receivables' ? 'ring-2 ring-emerald-200' : 'opacity-80'}`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex justify-between">
              Phải Thu (Khách nợ mình)
              <ArrowDownCircle className="text-emerald-500 h-5 w-5" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-emerald-700">{totalReceivable.toLocaleString()}đ</p>
          </CardContent>
        </Card>

        {/* Card Phải Trả */}
        <Card className={`border-l-4 border-l-red-500 shadow-sm transition-all ${activeTab === 'payables' ? 'ring-2 ring-red-200' : 'opacity-80'}`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex justify-between">
              Phải Trả (Nợ nhà cung cấp)
              <ArrowUpCircle className="text-red-500 h-5 w-5" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-700">{totalPayable.toLocaleString()}đ</p>
          </CardContent>
        </Card>

        {/* Card Dòng tiền ròng */}
        <Card className="border-l-4 border-l-blue-500 shadow-sm bg-blue-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex justify-between">
              Dòng tiền ròng
              <Wallet className="text-blue-500 h-5 w-5" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-700">{(totalReceivable - totalPayable).toLocaleString()}đ</p>
          </CardContent>
        </Card>
      </div>

      {/* 3. MAIN CONTENT */}
      <Card className="min-h-[500px]">
        <CardHeader className="pb-3 border-b border-slate-100">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            
            {/* Bộ chuyển Tab thủ công (Custom Tabs) */}
            <div className="flex p-1 bg-slate-100 rounded-lg w-full md:w-auto">
              <button 
                onClick={() => setActiveTab("receivables")}
                className={`flex-1 md:flex-none px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${activeTab === "receivables" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              >
                <Users size={16} /> Khách hàng
              </button>
              <button 
                onClick={() => setActiveTab("payables")}
                className={`flex-1 md:flex-none px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${activeTab === "payables" ? "bg-white text-red-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              >
                <Filter size={16} /> Nhà cung cấp
              </button>
            </div>

            {/* Ô tìm kiếm */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
              <Input 
                placeholder={`Tìm ${activeTab === 'receivables' ? 'khách hàng' : 'nhà cung cấp'}...`} 
                className="pl-10 h-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} 
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="w-[250px]">Tên đối tác</TableHead>
                <TableHead>Liên hệ</TableHead>
                <TableHead className="text-right">Công nợ hiện tại</TableHead>
                {activeTab === 'receivables' && <TableHead className="text-center w-[200px]">Hạn mức nợ</TableHead>}
                <TableHead className="text-center">Trạng thái</TableHead>
                <TableHead className="text-center">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-slate-400">
                    Không tìm thấy dữ liệu.
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((d) => (
                  <TableRow key={d.id} className="hover:bg-slate-50 transition-colors">
                    <TableCell>
                      <div className="font-semibold text-slate-700">{d.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{d.id}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Phone size={14} className="text-slate-400" /> {d.phone}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={`font-bold text-base ${d.amount > 0 ? (activeTab === 'receivables' ? 'text-emerald-600' : 'text-red-600') : 'text-slate-400'}`}>
                        {d.amount.toLocaleString()}đ
                      </span>
                    </TableCell>
                    
                    {/* Cột Hạn mức nợ (Chỉ hiện cho khách hàng) */}
                    {activeTab === 'receivables' && (
                      <TableCell className="text-center px-6">
                         {d.limit > 0 ? (
                           <div className="w-full">
                             <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                               <span>{Math.round((d.amount/d.limit)*100)}%</span>
                               <span>{d.limit.toLocaleString()}</span>
                             </div>
                             <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                               <div 
                                 className={`h-full ${d.amount > d.limit ? 'bg-red-500' : (d.amount > d.limit * 0.8 ? 'bg-orange-400' : 'bg-blue-400')}`} 
                                 style={{ width: `${Math.min((d.amount/d.limit)*100, 100)}%` }}
                               ></div>
                             </div>
                           </div>
                         ) : <span className="text-xs text-slate-400">Không giới hạn</span>}
                      </TableCell>
                    )}

                    <TableCell className="text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border shadow-sm inline-flex items-center gap-1
                        ${d.status === "Quá hạn" ? "bg-red-50 text-red-700 border-red-200" : 
                          d.status === "Đang nợ" ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                          d.status === "Trong hạn" ? "bg-blue-50 text-blue-700 border-blue-200" :
                          "bg-slate-100 text-slate-600 border-slate-200"
                        }`}>
                        {d.status === "Quá hạn" && <AlertCircle size={10} />}
                        {d.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium h-8">
                        Chi tiết
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}