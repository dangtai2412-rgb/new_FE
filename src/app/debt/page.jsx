"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, ArrowUpCircle, ArrowDownCircle, Search, Plus, 
  RefreshCw, Wallet, Phone, Trash2, AlertCircle, TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

// --- DỮ LIỆU MẪU ---
const INITIAL_CUSTOMERS = [
  { id: "KH001", name: "Thầu XD Nguyễn Văn B", phone: "0909123456", amount: 13500000, limit: 15000000, status: "Quá hạn" },
  { id: "KH002", name: "Cửa hàng Điện Nước C", phone: "0912345678", amount: 4500000, limit: 10000000, status: "Trong hạn" },
  { id: "KH003", name: "Anh Tâm (Khách lẻ)", phone: "0987654321", amount: 0, limit: 5000000, status: "Không nợ" },
];

const INITIAL_SUPPLIERS = [
  { id: "NCC01", name: "Đại lý VLXD A", phone: "0283888999", amount: 45000000, status: "Đang nợ" },
  { id: "NCC02", name: "Kho Thép Hòa Phát", phone: "0274111222", amount: 0, status: "Đã thanh toán" },
];

export default function DebtPage() {
  const [activeTab, setActiveTab] = useState("receivables");
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);

  useEffect(() => {
    setData(activeTab === "receivables" ? INITIAL_CUSTOMERS : INITIAL_SUPPLIERS);
  }, [activeTab]);

  return (
    <div className="space-y-8 p-4 md:p-8 bg-slate-50/50 min-h-screen">
      
      {/* 1. TOP HEADER - DARK STYLE */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-slate-900 p-6 rounded-2xl shadow-2xl text-white gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
            Đối tác <span className="text-teal-400">&</span> Công nợ
          </h1>
          <p className="text-slate-400 mt-1 font-medium">Quản lý tài chính doanh nghiệp thông minh</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-2.5 text-slate-500" size={18} />
            <Input 
              placeholder="Tìm nhanh..." 
              className="pl-10 bg-slate-800 border-none text-white focus-visible:ring-teal-500 rounded-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button className="bg-teal-500 hover:bg-teal-600 rounded-xl px-6 font-bold" onClick={() => setIsModalOpen(true)}>
            <Plus size={20} className="mr-1" /> Thêm mới
          </Button>
        </div>
      </div>

      {/* 2. DASHBOARD CARDS - GRADIENT & GLOSSY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-xl bg-white overflow-hidden group">
          <div className="h-2 bg-emerald-400 w-full" />
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600 group-hover:scale-110 transition-transform">
                <ArrowDownCircle size={28} />
              </div>
              <TrendingUp className="text-emerald-400 opacity-20" size={48} />
            </div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Tổng Phải Thu</p>
            <p className="text-3xl font-black text-slate-800 mt-1">18,000,000đ</p>
            <div className="mt-4 flex items-center text-xs text-emerald-600 font-bold bg-emerald-50 w-fit px-2 py-1 rounded-md">
              + 12.5% so với tháng trước
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl bg-white overflow-hidden group">
          <div className="h-2 bg-rose-400 w-full" />
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-rose-50 rounded-2xl text-rose-600 group-hover:scale-110 transition-transform">
                <ArrowUpCircle size={28} />
              </div>
              <Wallet className="text-rose-400 opacity-20" size={48} />
            </div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Tổng Phải Trả</p>
            <p className="text-3xl font-black text-slate-800 mt-1">45,000,000đ</p>
            <div className="mt-4 flex items-center text-xs text-rose-600 font-bold bg-rose-50 w-fit px-2 py-1 rounded-md">
              Cần thanh toán sớm
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl bg-teal-600 overflow-hidden relative">
          <CardContent className="p-6 text-white relative z-10">
            <div className="p-3 bg-white/20 rounded-2xl w-fit mb-4">
              <RefreshCw size={28} />
            </div>
            <p className="text-sm font-bold text-teal-100 uppercase tracking-wider">Dòng Tiền Ròng</p>
            <p className="text-3xl font-black mt-1">-27,000,000đ</p>
            <p className="mt-4 text-xs text-teal-100/80">Cập nhật lúc: 15:30 hôm nay</p>
          </CardContent>
          <div className="absolute -right-8 -bottom-8 bg-white/10 w-32 h-32 rounded-full blur-2xl" />
        </Card>
      </div>

      {/* 3. MAIN CONTENT - MODERN TABLE */}
      <Card className="border-none shadow-2xl rounded-3xl overflow-hidden bg-white/80 backdrop-blur-md">
        <CardHeader className="bg-white p-6 border-b border-slate-100">
          <div className="flex p-1.5 bg-slate-100 rounded-2xl w-fit">
            <button 
              onClick={() => setActiveTab("receivables")} 
              className={`px-8 py-2.5 text-sm font-bold rounded-xl transition-all ${activeTab === "receivables" ? "bg-white text-teal-600 shadow-md" : "text-slate-500 hover:text-slate-700"}`}
            >
              Khách hàng
            </button>
            <button 
              onClick={() => setActiveTab("payables")} 
              className={`px-8 py-2.5 text-sm font-bold rounded-xl transition-all ${activeTab === "payables" ? "bg-white text-rose-600 shadow-md" : "text-slate-500 hover:text-slate-700"}`}
            >
              Nhà cung cấp
            </button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-none">
                <TableHead className="py-5 pl-8 font-bold text-slate-600">THÔNG TIN ĐỐI TÁC</TableHead>
                <TableHead className="text-right font-bold text-slate-600">CÔNG NỢ & HẠN MỨC</TableHead>
                <TableHead className="text-center font-bold text-slate-600">TRẠNG THÁI</TableHead>
                <TableHead className="text-right pr-8 font-bold text-slate-600">HÀNH ĐỘNG</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((d) => (
                <TableRow key={d.id} className="group hover:bg-slate-50 transition-colors border-slate-50">
                  <TableCell className="py-5 pl-8">
                    <div className="font-extrabold text-slate-700 group-hover:text-teal-600 transition-colors">{d.name}</div>
                    <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5 font-medium italic"><Phone size={12}/> {d.phone}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="font-black text-slate-800 text-lg">{d.amount.toLocaleString()}đ</div>
                    {d.limit && (
                      <div className="mt-2 w-48 ml-auto">
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${d.amount/d.limit > 0.8 ? 'bg-rose-500' : 'bg-teal-500'}`}
                            style={{ width: `${Math.min((d.amount / d.limit) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 ${
                      d.status === "Quá hạn" ? "bg-rose-50 text-rose-600 border-rose-100" : 
                      d.status === "Trong hạn" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : 
                      "bg-slate-50 text-slate-600 border-slate-100"
                    }`}>
                      {d.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" className="rounded-xl font-bold border-slate-200 hover:bg-teal-50 hover:text-teal-600 hover:border-teal-200">
                        Chi tiết
                      </Button>
                      <Button size="sm" variant="ghost" className="rounded-xl text-rose-400 hover:text-rose-600 hover:bg-rose-50">
                        <Trash2 size={18}/>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* --- CÁC THÀNH PHẦN MODAL GIỮ NGUYÊN NHƯNG NÂNG CẤP STYLE --- */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-3xl border-none shadow-2xl bg-white p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-slate-800 uppercase tracking-tight">Thêm Đối Tác</DialogTitle>
            <DialogDescription className="text-slate-500 font-medium italic">Vui lòng điền thông tin chính xác</DialogDescription>
          </DialogHeader>
          {/* Form inputs... */}
          <DialogFooter className="mt-6 flex gap-2">
            <Button variant="ghost" className="rounded-xl font-bold" onClick={() => setIsModalOpen(false)}>Hủy</Button>
            <Button className="bg-teal-500 hover:bg-teal-600 rounded-xl px-8 font-black shadow-lg shadow-teal-200">Xác Nhận</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}