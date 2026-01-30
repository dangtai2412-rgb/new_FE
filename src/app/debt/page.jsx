"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, ArrowUpCircle, ArrowDownCircle, Search, Plus, 
  RefreshCw, Wallet, Phone, Trash2, AlertCircle, TrendingUp, Banknote
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
  const [activeTab, setActiveTab] = useState("receivables");
  const [data, setData] = useState(INITIAL_CUSTOMERS);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modals States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [newPartner, setNewPartner] = useState({ name: "", phone: "", limit: 0 });

  useEffect(() => {
    setData(activeTab === "receivables" ? INITIAL_CUSTOMERS : INITIAL_SUPPLIERS);
  }, [activeTab]);

  // --- HÀM XỬ LÝ THANH TOÁN (THU/TRẢ NỢ) ---
  const handlePayment = () => {
    const amountToPay = Number(paymentAmount);
    if (!amountToPay || amountToPay <= 0) return alert("Vui lòng nhập số tiền hợp lệ");

    const updatedData = data.map(item => {
      if (item.id === selectedPartner.id) {
        const newAmount = item.amount - amountToPay;
        return { 
          ...item, 
          amount: newAmount < 0 ? 0 : newAmount, // Không cho nợ âm
          status: newAmount <= 0 ? (activeTab === "receivables" ? "Không nợ" : "Đã thanh toán") : item.status
        };
      }
      return item;
    });

    setData(updatedData);
    setIsPaymentOpen(false);
    setPaymentAmount("");
    alert(`Đã cập nhật thanh toán cho ${selectedPartner.name}`);
  };

  const filteredData = data.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-8 p-4 md:p-8 bg-slate-50/30 min-h-screen">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-[#1e293b] p-6 rounded-3xl shadow-2xl text-white gap-6">
        <div>
          <h1 className="text-3xl font-black flex items-center gap-3">
            Quản lý <span className="text-emerald-400">Dòng tiền</span>
          </h1>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Input 
            placeholder="Tìm đối tác..." 
            className="bg-slate-800 border-none text-white rounded-2xl h-11"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button className="bg-emerald-500 hover:bg-emerald-600 rounded-2xl h-11 px-6 font-bold" onClick={() => setIsModalOpen(true)}>
            <Plus size={20} />
          </Button>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-3xl shadow-xl border-none"><CardContent className="p-6">
          <ArrowDownCircle className="text-emerald-500 mb-2" size={32} />
          <p className="text-xs font-bold text-slate-400 uppercase">Phải thu</p>
          <p className="text-2xl font-black text-slate-800">18.000.000đ</p>
        </CardContent></Card>
        <Card className="rounded-3xl shadow-xl border-none"><CardContent className="p-6">
          <ArrowUpCircle className="text-rose-500 mb-2" size={32} />
          <p className="text-xs font-bold text-slate-400 uppercase">Phải trả</p>
          <p className="text-2xl font-black text-slate-800">45.000.000đ</p>
        </CardContent></Card>
        <Card className="rounded-3xl shadow-xl border-none bg-emerald-600 text-white"><CardContent className="p-6">
          <Wallet className="mb-2" size={32} />
          <p className="text-xs font-bold opacity-80 uppercase">Số dư ròng</p>
          <p className="text-2xl font-black">-27.000.000đ</p>
        </CardContent></Card>
      </div>

      {/* TABLE SECTION */}
      <Card className="border-none shadow-2xl rounded-[2rem] overflow-hidden bg-white">
        <div className="p-6 border-b flex justify-between items-center">
          <div className="flex p-1 bg-slate-100 rounded-2xl">
            <button onClick={() => setActiveTab("receivables")} className={`px-6 py-2 rounded-xl text-sm font-bold ${activeTab === "receivables" ? "bg-white shadow text-emerald-600" : "text-slate-500"}`}>Khách hàng</button>
            <button onClick={() => setActiveTab("payables")} className={`px-6 py-2 rounded-xl text-sm font-bold ${activeTab === "payables" ? "bg-white shadow text-rose-600" : "text-slate-500"}`}>Nhà cung cấp</button>
          </div>
        </div>

        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="pl-8 py-4 font-bold">ĐỐI TÁC</TableHead>
              <TableHead className="text-right font-bold">CÔNG NỢ</TableHead>
              <TableHead className="text-center font-bold">TRẠNG THÁI</TableHead>
              <TableHead className="text-right pr-8 font-bold">THAO TÁC</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((d) => (
              <TableRow key={d.id} className="group hover:bg-slate-50 transition-all">
                <TableCell className="pl-8 py-5">
                  <div className="font-bold text-slate-800">{d.name}</div>
                  <div className="text-xs text-slate-400 flex items-center gap-1"><Phone size={12}/> {d.phone}</div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="font-black text-slate-900">{d.amount.toLocaleString()}đ</div>
                  {d.limit > 0 && (
                    <div className="w-32 ml-auto bg-slate-100 h-1 rounded-full mt-2 overflow-hidden">
                      <div className="bg-emerald-500 h-full" style={{ width: `${(d.amount/d.limit)*100}%` }} />
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${d.status === 'Quá hạn' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                    {d.status}
                  </span>
                </TableCell>
                <TableCell className="text-right pr-8">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="rounded-xl border-emerald-200 text-emerald-600 hover:bg-emerald-50 font-bold"
                      onClick={() => { setSelectedPartner(d); setIsPaymentOpen(true); }}
                    >
                      <Banknote size={16} className="mr-1" /> Thu nợ
                    </Button>
                    <Button variant="ghost" size="sm" className="rounded-xl text-slate-300 hover:text-rose-500" onClick={() => { setSelectedPartner(d); setIsDeleteOpen(true); }}>
                      <Trash2 size={18}/>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* --- MODAL THANH TOÁN (THU NỢ) --- */}
      <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-[2rem] p-8">
          <DialogHeader className="text-center">
            <div className="mx-auto bg-emerald-100 text-emerald-600 w-16 h-16 rounded-3xl flex items-center justify-center mb-4"><Banknote size={32}/></div>
            <DialogTitle className="text-2xl font-black text-slate-900">Thu nợ khách hàng</DialogTitle>
            <DialogDescription className="font-medium">Nhập số tiền {selectedPartner?.name} đã thanh toán.</DialogDescription>
          </DialogHeader>
          <div className="py-6 space-y-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-dashed border-slate-200 flex justify-between items-center">
              <span className="text-sm font-bold text-slate-500">Nợ hiện tại:</span>
              <span className="text-lg font-black text-slate-800">{selectedPartner?.amount.toLocaleString()}đ</span>
            </div>
            <div className="space-y-2">
              <Label className="font-bold text-xs uppercase tracking-widest text-slate-400">Số tiền thu thực tế</Label>
              <Input 
                type="number" 
                placeholder="Nhập số tiền..." 
                className="rounded-2xl h-14 text-xl font-bold bg-slate-50 border-none focus:ring-emerald-500"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="flex gap-3 sm:justify-center">
            <Button variant="ghost" className="rounded-2xl font-bold h-12 flex-1" onClick={() => setIsPaymentOpen(false)}>Hủy</Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl h-12 flex-1 font-black shadow-lg shadow-emerald-100" onClick={handlePayment}>XÁC NHẬN THU</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL XÓA (Xác nhận) */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[350px] rounded-[2rem] p-8">
           <DialogHeader className="text-center">
             <AlertCircle className="mx-auto text-rose-500 mb-4" size={48} />
             <DialogTitle className="text-xl font-black">Xóa đối tác này?</DialogTitle>
           </DialogHeader>
           <DialogFooter className="mt-4 flex gap-2">
             <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setIsDeleteOpen(false)}>Hủy</Button>
             <Button className="bg-rose-500 flex-1 rounded-xl" onClick={() => {
               setData(data.filter(i => i.id !== selectedPartner.id));
               setIsDeleteOpen(false);
             }}>Xóa</Button>
           </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}