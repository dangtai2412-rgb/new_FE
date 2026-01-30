"use client";

import React, { useState, useEffect } from "react";
// Thêm Toaster và hàm toast từ sonner
import { Toaster, toast } from "sonner";
import { 
  Search, Plus, RefreshCw, Trash2, AlertCircle, 
  Banknote, FileSpreadsheet, FileText, CheckCircle2, Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const INITIAL_DATA = [
  { id: "KH001", name: "Thầu XD Nguyễn Văn B", phone: "0909123456", amount: 13500000, limit: 15000000, status: "Quá hạn", type: "receivables" },
  { id: "KH002", name: "Cửa hàng Điện Nước C", phone: "0912345678", amount: 4500000, limit: 10000000, status: "Trong hạn", type: "receivables" },
  { id: "NCC01", name: "Đại lý VLXD A", phone: "0283888999", amount: 45000000, limit: 0, status: "Đang nợ", type: "payables" },
];

export default function DebtPage() {
  const [activeTab, setActiveTab] = useState("receivables");
  const [data, setData] = useState(INITIAL_DATA);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");

  // --- HÀM THU NỢ CÓ TOAST ---
  const handlePayment = () => {
    const payValue = Number(paymentAmount);
    if (!payValue || payValue <= 0) {
      toast.error("Số tiền nhập không hợp lệ!", {
        description: "Vui lòng kiểm tra lại con số bạn vừa nhập.",
      });
      return;
    }

    setData(data.map(item => {
      if (item.id === selectedPartner.id) {
        const newAmount = Math.max(0, item.amount - payValue);
        return { ...item, amount: newAmount, status: newAmount === 0 ? "Hoàn thành" : item.status };
      }
      return item;
    }));

    setIsPaymentOpen(false);
    setPaymentAmount("");
    
    // Hiển thị toast thành công
    toast.success("Cập nhật thanh toán thành công", {
      description: `Đã thu ${payValue.toLocaleString()}đ từ ${selectedPartner.name}`,
      icon: <CheckCircle2 className="text-emerald-500" size={18} />,
    });
  };

  // --- HÀM XÓA CÓ TOAST ---
  const handleDelete = () => {
    setData(data.filter(i => i.id !== selectedPartner.id));
    setIsDeleteOpen(false);
    toast.warning(`Đã xóa đối tác ${selectedPartner.name}`, {
      description: "Dữ liệu đã được gỡ khỏi hệ thống tạm thời.",
    });
  };

  // --- HÀM TẢI LẠI DỮ LIỆU ---
  const handleRefresh = () => {
    toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
      loading: 'Đang đồng bộ dữ liệu...',
      success: 'Dữ liệu đã được cập nhật mới nhất!',
      error: 'Lỗi kết nối máy chủ',
    });
  };

  const filteredData = data.filter(item => 
    item.type === activeTab && 
    (item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.phone.includes(searchTerm))
  );

  return (
    <div className="space-y-6 p-6 bg-slate-50 min-h-screen font-sans">
      {/* Cần có component Toaster này để hiện thông báo */}
      <Toaster position="top-right" richColors closeButton />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-[#111827] p-8 rounded-[2rem] shadow-2xl text-white gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-emerald-400">DEBT<span className="text-white">MANAGER</span></h1>
          <p className="text-slate-400 text-sm">Hệ thống thông báo & Đối soát tự động</p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl border-slate-700 bg-slate-800 text-white hover:bg-slate-700" onClick={handleRefresh}>
            <RefreshCw size={18} />
          </Button>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-500" size={18} />
            <Input 
              placeholder="Tìm nhanh..." 
              className="pl-10 bg-slate-800 border-none rounded-xl text-white w-64 focus:ring-2 focus:ring-emerald-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* TABLE */}
      <Card className="border-none shadow-2xl rounded-[2rem] overflow-hidden bg-white">
        <div className="p-6 border-b flex justify-between bg-white items-center">
           <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl">
              <button onClick={() => setActiveTab("receivables")} className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${activeTab === "receivables" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400"}`}>KHÁCH HÀNG</button>
              <button onClick={() => setActiveTab("payables")} className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${activeTab === "payables" ? "bg-white text-rose-600 shadow-sm" : "text-slate-400"}`}>NHÀ CUNG CẤP</button>
           </div>
        </div>

        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="pl-10 font-bold text-slate-400 py-5 uppercase text-[11px] tracking-widest">Thông tin</TableHead>
              <TableHead className="text-right font-bold text-slate-400 py-5 uppercase text-[11px] tracking-widest">Nợ hiện tại</TableHead>
              <TableHead className="text-center font-bold text-slate-400 py-5 uppercase text-[11px] tracking-widest">Trạng thái</TableHead>
              <TableHead className="text-right pr-10 font-bold text-slate-400 py-5 uppercase text-[11px] tracking-widest">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((d) => (
              <TableRow key={d.id} className="hover:bg-slate-50/50 transition-all border-slate-50">
                <TableCell className="pl-10 py-5">
                  <div className="font-black text-slate-700">{d.name}</div>
                  <div className="text-[10px] font-bold text-slate-400">{d.phone}</div>
                </TableCell>
                <TableCell className="text-right font-black text-lg text-slate-900">
                  {d.amount.toLocaleString()}đ
                </TableCell>
                <TableCell className="text-center">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black border ${d.status === 'Quá hạn' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                    {d.status}
                  </span>
                </TableCell>
                <TableCell className="text-right pr-10">
                  <div className="flex justify-end gap-2">
                    <Button 
                      size="sm" 
                      className="bg-emerald-500 hover:bg-emerald-600 rounded-xl shadow-lg shadow-emerald-100"
                      onClick={() => { setSelectedPartner(d); setIsPaymentOpen(true); }}
                    >
                      <Banknote size={16} className="mr-2" /> Thu nợ
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-slate-300 hover:text-rose-600"
                      onClick={() => { setSelectedPartner(d); setIsDeleteOpen(true); }}
                    >
                      <Trash2 size={20} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* MODAL THU NỢ */}
      <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
        <DialogContent className="rounded-[2.5rem] p-10 border-none shadow-3xl">
          <DialogHeader className="text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner"><Banknote size={32}/></div>
            <DialogTitle className="text-2xl font-black uppercase tracking-tighter">Thu Tiền Nợ</DialogTitle>
          </DialogHeader>
          <div className="py-6 space-y-4">
             <div className="bg-slate-50 p-5 rounded-2xl border border-dashed border-slate-200 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nợ cũ:</span>
                <span className="text-xl font-black text-slate-800">{selectedPartner?.amount.toLocaleString()}đ</span>
             </div>
             <div className="space-y-2">
                <Label className="text-[11px] font-black text-slate-400 uppercase ml-1">Số tiền thu thực tế</Label>
                <Input 
                    type="number" 
                    placeholder="0.000" 
                    className="rounded-2xl h-14 text-2xl font-black bg-slate-50 border-none shadow-inner text-emerald-600"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                />
             </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="ghost" className="rounded-2xl font-black h-12 flex-1" onClick={() => setIsPaymentOpen(false)}>HỦY</Button>
            <Button className="bg-slate-900 text-white hover:bg-emerald-600 rounded-2xl h-12 flex-1 font-black shadow-2xl transition-all" onClick={handlePayment}>XÁC NHẬN THU</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL XÓA */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="rounded-[2rem] p-8 border-none text-center">
          <AlertCircle className="mx-auto text-rose-500 mb-4" size={48} />
          <DialogTitle className="text-2xl font-black">Xác nhận xóa?</DialogTitle>
          <DialogDescription className="font-medium text-slate-500 py-2">Bạn có chắc chắn muốn gỡ bỏ <b>{selectedPartner?.name}</b> khỏi danh sách?</DialogDescription>
          <div className="flex gap-3 mt-6">
            <Button variant="outline" className="flex-1 rounded-2xl font-bold h-12" onClick={() => setIsDeleteOpen(false)}>HỦY</Button>
            <Button className="bg-rose-600 hover:bg-rose-700 text-white rounded-2xl flex-1 font-bold shadow-lg shadow-rose-200" onClick={handleDelete}>XÓA NGAY</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}