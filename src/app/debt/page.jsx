"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, ArrowUpCircle, ArrowDownCircle, Search, Plus, 
  RefreshCw, Wallet, Phone, Trash2, AlertCircle, TrendingUp, Banknote, CheckCircle2
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

export default function DebtPage() {
  const [activeTab, setActiveTab] = useState("receivables");
  const [data, setData] = useState(INITIAL_CUSTOMERS);
  const [searchTerm, setSearchTerm] = useState("");
  
  // States cho Modals
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");

  // --- HÀM XỬ LÝ THU NỢ / TRẢ NỢ ---
  const handlePayment = () => {
    const payValue = Number(paymentAmount);
    
    if (!payValue || payValue <= 0) {
      alert("Vui lòng nhập số tiền hợp lệ!");
      return;
    }

    const updatedData = data.map(item => {
      if (item.id === selectedPartner.id) {
        const newAmount = Math.max(0, item.amount - payValue);
        let newStatus = item.status;
        
        // Cập nhật trạng thái dựa trên số dư mới
        if (newAmount === 0) newStatus = "Đã xong";
        else if (newAmount < item.limit) newStatus = "Trong hạn";

        return { ...item, amount: newAmount, status: newStatus };
      }
      return item;
    });

    setData(updatedData);
    setIsPaymentOpen(false);
    setPaymentAmount("");
    // Trong thực tế bạn sẽ gọi API ở đây
  };

  const filteredData = data.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-8 p-6 bg-slate-50/50 min-h-screen font-sans">
      
      {/* 1. HEADER (Giữ phong cách đặc sắc) */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-[#0f172a] p-8 rounded-[2rem] shadow-2xl text-white gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight italic">FINANCE<span className="text-emerald-400">PRO</span></h1>
          <p className="text-slate-400 text-sm">Quản lý dòng tiền & Đối soát nợ</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-3 text-slate-500" size={20} />
          <Input 
            placeholder="Tìm kiếm nhanh..." 
            className="pl-12 bg-slate-800/50 border-none text-white rounded-2xl h-12 focus:ring-2 focus:ring-emerald-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* 2. MAIN TABLE AREA */}
      <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
          <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm">Danh sách đối tác</h3>
          <div className="flex p-1.5 bg-slate-100 rounded-2xl shadow-inner">
            <button onClick={() => setActiveTab("receivables")} className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${activeTab === "receivables" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400"}`}>PHẢI THU</button>
            <button onClick={() => setActiveTab("payables")} className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${activeTab === "payables" ? "bg-white text-rose-600 shadow-sm" : "text-slate-400"}`}>PHẢI TRẢ</button>
          </div>
        </div>

        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="border-none">
              <TableHead className="py-6 pl-10 font-bold text-slate-400">ĐỐI TÁC</TableHead>
              <TableHead className="text-right font-bold text-slate-400">SỐ DƯ NỢ</TableHead>
              <TableHead className="text-center font-bold text-slate-400">TÌNH TRẠNG</TableHead>
              <TableHead className="text-right pr-10 font-bold text-slate-400">HÀNH ĐỘNG</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((d) => (
              <TableRow key={d.id} className="group hover:bg-slate-50/50 transition-colors border-slate-50">
                <TableCell className="py-6 pl-10">
                  <div className="font-black text-slate-700">{d.name}</div>
                  <div className="text-[11px] text-slate-400 mt-1 font-bold tracking-tighter uppercase">{d.id} • {d.phone}</div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="font-black text-slate-900 text-lg">{d.amount.toLocaleString()}đ</div>
                  <div className="text-[10px] text-slate-400 font-bold">HM: {d.limit?.toLocaleString()}đ</div>
                </TableCell>
                <TableCell className="text-center">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black border-2 ${
                    d.status === "Quá hạn" ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"
                  }`}>
                    {d.status}
                  </span>
                </TableCell>
                <TableCell className="text-right pr-10">
                  <div className="flex justify-end gap-3">
                    <Button 
                      onClick={() => { setSelectedPartner(d); setIsPaymentOpen(true); }}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-100 h-9 px-5"
                    >
                      <Banknote size={16} className="mr-2"/> Thu nợ
                    </Button>
                    <Button variant="ghost" className="text-slate-300 hover:text-rose-500 transition-colors" onClick={() => { setSelectedPartner(d); setIsDeleteOpen(true); }}>
                      <Trash2 size={20}/>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* --- MODAL: THỰC HIỆN THU NỢ / TRẢ NỢ --- */}
      <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
        <DialogContent className="sm:max-w-[420px] rounded-[2.5rem] p-10 border-none shadow-3xl overflow-hidden relative">
          <div className="absolute top-0 right-0 p-12 bg-emerald-50 rounded-full -mr-16 -mt-16 opacity-50" />
          
          <DialogHeader className="relative z-10 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
              <Banknote size={32} />
            </div>
            <DialogTitle className="text-2xl font-black text-center text-slate-900 uppercase tracking-tight">Xác nhận thu nợ</DialogTitle>
            <DialogDescription className="text-center font-medium text-slate-500">
              Cập nhật số tiền thực tế khách hàng <b>{selectedPartner?.name}</b> đã thanh toán.
            </DialogDescription>
          </DialogHeader>

          <div className="py-8 space-y-6 relative z-10">
            <div className="bg-slate-50 p-5 rounded-2xl border border-dashed border-slate-200">
              <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                <span>Dư nợ hiện tại</span>
                <span className="text-emerald-600">Đối soát</span>
              </div>
              <div className="text-2xl font-black text-slate-800">{selectedPartner?.amount.toLocaleString()}đ</div>
            </div>

            <div className="space-y-3">
              <Label className="font-black text-[11px] text-slate-400 uppercase ml-1">Số tiền thanh toán (VNĐ)</Label>
              <Input 
                type="number" 
                placeholder="Nhập số tiền..." 
                className="rounded-2xl h-14 text-xl font-black bg-slate-50 border-none focus:ring-2 focus:ring-emerald-500 shadow-inner"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="relative z-10 sm:justify-center flex gap-3">
            <Button variant="ghost" className="rounded-2xl font-black h-14 px-8 text-slate-400" onClick={() => setIsPaymentOpen(false)}>HỦY</Button>
            <Button className="bg-slate-900 hover:bg-emerald-600 text-white rounded-2xl h-14 px-10 font-black shadow-2xl transition-all flex-1" onClick={handlePayment}>
              XÁC NHẬN THU TIỀN
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL: XÁC NHẬN XÓA (Giữ nguyên phong cách) */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-[2rem] p-8 border-none text-center">
          <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={40} />
          </div>
          <DialogTitle className="text-2xl font-black text-slate-900">Gỡ bỏ đối tác?</DialogTitle>
          <DialogDescription className="text-slate-500 font-medium py-2">
            Hành động này không thể hoàn tác. Bạn chắc chắn muốn xóa <b>{selectedPartner?.name}</b>?
          </DialogDescription>
          <div className="flex gap-4 mt-8">
            <Button variant="outline" className="flex-1 rounded-2xl font-bold h-12 border-slate-200" onClick={() => setIsDeleteOpen(false)}>QUAY LẠI</Button>
            <Button className="flex-1 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-bold h-12 shadow-lg shadow-rose-200" onClick={() => {
              setData(data.filter(i => i.id !== selectedPartner.id));
              setIsDeleteOpen(false);
            }}>XÓA NGAY</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}