"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, ArrowUpCircle, ArrowDownCircle, Search, Plus, 
  RefreshCw, Wallet, Phone, Trash2, AlertCircle, TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
  { id: "NCC01", name: "Đại lý VLXD A", phone: "0283888999", amount: 45000000, limit: 0, status: "Đang nợ" },
  { id: "NCC02", name: "Kho Thép Hòa Phát", phone: "0274111222", amount: 0, limit: 0, status: "Đã thanh toán" },
];

export default function DebtPage() {
  // --- STATES ---
  const [activeTab, setActiveTab] = useState("receivables");
  const [data, setData] = useState(INITIAL_CUSTOMERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  
  // State cho Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [newPartner, setNewPartner] = useState({ name: "", phone: "", limit: 0 });

  // --- EFFECT ---
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setData(activeTab === "receivables" ? INITIAL_CUSTOMERS : INITIAL_SUPPLIERS);
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [activeTab]);

  // --- HANDLERS ---
  const handleAddPartner = () => {
    console.log("Adding:", newPartner);
    setIsModalOpen(false);
    setNewPartner({ name: "", phone: "", limit: 0 });
  };

  const confirmDelete = (partner) => {
    setSelectedPartner(partner);
    setIsDeleteOpen(true);
  };

  const handleDelete = () => {
    setData(data.filter(item => item.id !== selectedPartner.id));
    setIsDeleteOpen(false);
  };

  const filteredData = data.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-8 p-4 md:p-8 bg-slate-50/30 min-h-screen font-sans">
      
      {/* 1. TOP HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-[#1e293b] p-6 rounded-3xl shadow-2xl text-white gap-6">
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-black tracking-tight flex items-center justify-center md:justify-start gap-3">
            Hệ thống <span className="text-emerald-400">Công nợ</span>
          </h1>
          <p className="text-slate-400 mt-1 font-medium">Báo cáo tài chính & Đối soát tức thời</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <Input 
              placeholder="Tìm tên hoặc SĐT..." 
              className="pl-10 bg-slate-800/50 border-slate-700 text-white rounded-2xl h-11 focus:ring-emerald-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl px-6 h-11 font-bold shadow-lg shadow-emerald-900/20 w-full sm:w-auto" onClick={() => setIsModalOpen(true)}>
            <Plus size={20} className="mr-2" /> Thêm đối tác
          </Button>
        </div>
      </div>

      {/* 2. DASHBOARD CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Phải Thu", val: "18.0M", color: "emerald", icon: ArrowDownCircle, desc: "Tăng 12% tháng này" },
          { label: "Phải Trả", val: "45.0M", color: "rose", icon: ArrowUpCircle, desc: "3 nhà cung cấp chờ" },
          { label: "Dòng tiền", val: "-27.0M", color: "blue", icon: Wallet, desc: "Cần tối ưu chi phí" }
        ].map((card, i) => (
          <Card key={i} className="border-none shadow-xl bg-white rounded-3xl overflow-hidden hover:translate-y-[-4px] transition-all">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className={`p-3 bg-${card.color}-50 rounded-2xl text-${card.color}-600`}>
                  <card.icon size={28} />
                </div>
                <div className={`text-[10px] font-bold px-2 py-1 rounded-lg bg-${card.color}-50 text-${card.color}-600 uppercase`}>Live</div>
              </div>
              <p className="text-sm font-bold text-slate-400 mt-4 uppercase tracking-widest">{card.label}</p>
              <p className="text-3xl font-black text-slate-800 mt-1">{card.val}</p>
              <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1 font-medium italic">
                <TrendingUp size={12}/> {card.desc}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 3. MAIN TABLE SECTION */}
      <Card className="border-none shadow-2xl rounded-[2rem] overflow-hidden bg-white/90 backdrop-blur-xl">
        <div className="p-6 border-b border-slate-100 flex flex-wrap justify-between items-center gap-4">
          <div className="flex p-1 bg-slate-100 rounded-2xl shadow-inner">
            <button 
              onClick={() => setActiveTab("receivables")} 
              className={`px-8 py-2.5 text-sm font-bold rounded-xl transition-all ${activeTab === "receivables" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500"}`}
            >
              Khách hàng
            </button>
            <button 
              onClick={() => setActiveTab("payables")} 
              className={`px-8 py-2.5 text-sm font-bold rounded-xl transition-all ${activeTab === "payables" ? "bg-white text-rose-600 shadow-sm" : "text-slate-500"}`}
            >
              Nhà cung cấp
            </button>
          </div>
          <Button variant="ghost" className="text-slate-400" onClick={loadData}>
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-none">
                <TableHead className="py-5 pl-8 font-bold text-slate-500 uppercase text-[11px] tracking-widest">Đối tác</TableHead>
                <TableHead className="text-right font-bold text-slate-500 uppercase text-[11px] tracking-widest">Dư nợ & Hạn mức</TableHead>
                <TableHead className="text-center font-bold text-slate-500 uppercase text-[11px] tracking-widest">Trạng thái</TableHead>
                <TableHead className="text-right pr-8 font-bold text-slate-500 uppercase text-[11px] tracking-widest">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((d) => (
                <TableRow key={d.id} className="group hover:bg-slate-50/80 transition-all border-slate-50">
                  <TableCell className="py-6 pl-8">
                    <div className="font-bold text-slate-800 text-base">{d.name}</div>
                    <div className="text-xs text-slate-400 mt-1 font-medium flex items-center gap-2"><Phone size={12} className="text-slate-300"/> {d.phone}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="font-black text-slate-900 text-lg">{d.amount.toLocaleString()}đ</div>
                    {d.limit > 0 && (
                      <div className="mt-2 w-40 ml-auto">
                        <div className="flex justify-between text-[10px] mb-1 font-bold">
                          <span className="text-slate-400 italic">Hạn mức: {d.limit/1000000}M</span>
                          <span className={d.amount/d.limit > 0.8 ? "text-rose-500" : "text-emerald-500"}>{Math.round((d.amount/d.limit)*100)}%</span>
                        </div>
                        <div className="bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200/50">
                          <div className={`h-full ${d.amount/d.limit > 0.8 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min((d.amount/d.limit)*100, 100)}%` }} />
                        </div>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={`px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-tighter border-2 ${
                      d.status === "Quá hạn" ? "bg-rose-50 text-rose-600 border-rose-100" : 
                      d.status === "Trong hạn" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : 
                      "bg-slate-50 text-slate-600 border-slate-100"
                    }`}>
                      {d.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="outline" size="sm" className="rounded-xl font-bold border-slate-200 text-slate-600 hover:bg-white hover:shadow-md h-9 px-4">Chi tiết</Button>
                      <Button size="sm" variant="ghost" className="rounded-xl text-slate-300 hover:text-rose-600 hover:bg-rose-50 h-9 px-3" onClick={() => confirmDelete(d)}>
                        <Trash2 size={18}/>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* MODAL: THÊM ĐỐI TÁC */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[450px] rounded-[2.5rem] p-10 border-none shadow-3xl">
          <DialogHeader className="space-y-3 text-center">
            <DialogTitle className="text-3xl font-black text-slate-900">THÊM ĐỐI TÁC</DialogTitle>
            <DialogDescription className="font-medium text-slate-500 italic">Nhập thông tin đối tác công nợ mới vào hệ thống</DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-6 font-bold text-slate-700 uppercase text-xs tracking-widest">
            <div className="space-y-3"><Label>Tên đầy đủ</Label><Input className="rounded-2xl bg-slate-50 border-none h-12" value={newPartner.name} onChange={(e) => setNewPartner({...newPartner, name: e.target.value})} /></div>
            <div className="space-y-3"><Label>Số điện thoại</Label><Input className="rounded-2xl bg-slate-50 border-none h-12" value={newPartner.phone} onChange={(e) => setNewPartner({...newPartner, phone: e.target.value})} /></div>
            <div className="space-y-3"><Label>Hạn mức nợ</Label><Input type="number" className="rounded-2xl bg-slate-50 border-none h-12" value={newPartner.limit} onChange={(e) => setNewPartner({...newPartner, limit: e.target.value})} /></div>
          </div>
          <DialogFooter className="flex gap-3 sm:justify-center">
            <Button variant="ghost" className="rounded-2xl font-black px-8 h-12" onClick={() => setIsModalOpen(false)}>HỦY BỎ</Button>
            <Button className="bg-slate-900 text-white hover:bg-emerald-600 rounded-2xl px-10 h-12 font-black shadow-xl transition-all" onClick={handleAddPartner}>LƯU THÔNG TIN</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL: XÁC NHẬN XÓA */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-[2rem] p-8 border-none">
          <DialogHeader className="text-center">
            <div className="mx-auto bg-rose-50 text-rose-500 w-16 h-16 rounded-3xl flex items-center justify-center mb-4"><AlertCircle size={32}/></div>
            <DialogTitle className="text-2xl font-black text-slate-900">Xác nhận xóa?</DialogTitle>
            <DialogDescription className="pt-2 text-slate-500 font-medium">Bạn có chắc muốn xóa <b>{selectedPartner?.name}</b>? Thao tác này không thể hoàn tác.</DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-6">
            <Button variant="outline" className="flex-1 rounded-2xl font-bold h-12" onClick={() => setIsDeleteOpen(false)}>Hủy</Button>
            <Button className="flex-1 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-bold h-12 shadow-lg shadow-rose-200" onClick={handleDelete}>Xóa ngay</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}