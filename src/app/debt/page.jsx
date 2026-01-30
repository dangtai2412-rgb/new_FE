"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Users, ArrowUpCircle, ArrowDownCircle, Search, Plus, 
  Filter, RefreshCw, Wallet, Phone, Trash2, MoreHorizontal
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

// --- 1. DỮ LIỆU MẪU ---
const INITIAL_CUSTOMERS = [
  { id: "KH001", name: "Thầu XD Nguyễn Văn B", phone: "0909123456", type: "Phải thu", amount: 12000000, limit: 15000000, status: "Quá hạn" },
  { id: "KH002", name: "Cửa hàng Điện Nước C", phone: "0912345678", type: "Phải thu", amount: 5500000, limit: 10000000, status: "Trong hạn" },
  { id: "KH003", name: "Anh Tâm (Khách lẻ)", phone: "0987654321", type: "Phải thu", amount: 0, limit: 5000000, status: "Không nợ" },
];

const INITIAL_SUPPLIERS = [
  { id: "NCC01", name: "Đại lý VLXD A", phone: "0283888999", type: "Phải trả", amount: 45000000, status: "Đang nợ" },
  { id: "NCC02", name: "Kho Thép Hòa Phát", phone: "0274111222", type: "Phải trả", amount: 0, status: "Đã thanh toán" },
];

const DEMO_HISTORY = [
  { id: "HD001", date: "2024-03-20", type: "Hóa đơn bán", amount: 5000000, balance: 5000000 },
  { id: "PT001", date: "2024-03-21", type: "Thu tiền khách trả", amount: -2000000, balance: 3000000 },
];

export default function DebtPage() {
  // --- 2. STATES ---
  const [activeTab, setActiveTab] = useState("receivables");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Modals States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [newPartner, setNewPartner] = useState({ name: "", phone: "", type: "receivables", limit: 0 });

  // --- 3. LOGIC XỬ LÝ ---
  const loadData = async () => {
    setLoading(true);
    setTimeout(() => {
      setData(activeTab === "receivables" ? INITIAL_CUSTOMERS : INITIAL_SUPPLIERS);
      setLoading(false);
    }, 400);
  };

  useEffect(() => { loadData(); }, [activeTab]);

  const handleSavePartner = () => {
    alert(`Đã thêm đối tác ${newPartner.name} vào hệ thống.`);
    setIsModalOpen(false);
    setNewPartner({ name: "", phone: "", type: "receivables", limit: 0 });
  };

  const handleDeletePartner = () => {
    setData(data.filter(item => item.id !== selectedPartner.id));
    setIsDeleteOpen(false);
    // Chỗ này thực tế sẽ gọi API xóa
  };

  const filteredData = data.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.phone.includes(searchTerm)
  );

  // --- 4. HELPER UI ---
  const getStatusColor = (status) => {
    switch(status) {
      case "Quá hạn": return "bg-red-100 text-red-700 border-red-200";
      case "Trong hạn": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Đang nợ": return "bg-amber-100 text-amber-700 border-amber-200";
      default: return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  return (
    <div className="space-y-6 p-2 md:p-0">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Đối tác & Công nợ</h2>
          <p className="text-sm text-slate-500">Quản lý và đối soát công nợ khách hàng, nhà cung cấp.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadData} className="gap-2">
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Tải lại
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 gap-2" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Thêm Đối tác
          </Button>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-emerald-500"><CardContent className="pt-4"><p className="text-xs font-bold text-slate-500 uppercase">Phải thu (KH)</p><p className="text-2xl font-bold text-emerald-600">17.500.000đ</p></CardContent></Card>
        <Card className="border-l-4 border-l-red-500"><CardContent className="pt-4"><p className="text-xs font-bold text-slate-500 uppercase">Phải trả (NCC)</p><p className="text-2xl font-bold text-red-600">45.000.000đ</p></CardContent></Card>
        <Card className="border-l-4 border-l-blue-500"><CardContent className="pt-4"><p className="text-xs font-bold text-slate-500 uppercase">Dòng tiền ròng</p><p className="text-2xl font-bold text-blue-600">-27.500.000đ</p></CardContent></Card>
      </div>

      {/* MAIN TABLE AREA */}
      <Card>
        <CardHeader className="pb-3 border-b">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex p-1 bg-slate-100 rounded-lg">
              <button onClick={() => setActiveTab("receivables")} className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === "receivables" ? "bg-white shadow text-blue-600" : "text-slate-500"}`}>Khách hàng</button>
              <button onClick={() => setActiveTab("payables")} className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === "payables" ? "bg-white shadow text-blue-600" : "text-slate-500"}`}>Nhà cung cấp</button>
            </div>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
              <Input placeholder="Tìm kiếm tên, SĐT..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead>Đối tác</TableHead>
                <TableHead className="text-right">Công nợ</TableHead>
                <TableHead className="text-center">Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>
                    <div className="font-bold text-slate-700">{d.name}</div>
                    <div className="text-xs text-slate-400 flex items-center gap-1"><Phone size={10}/> {d.phone}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="font-bold">{d.amount.toLocaleString()}đ</div>
                    {d.limit > 0 && <div className="text-[10px] text-slate-400 font-medium italic">Hạn mức: {d.limit.toLocaleString()}đ</div>}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusColor(d.status)}`}>
                      {d.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => { setSelectedPartner(d); setIsDetailOpen(true); }} className="text-blue-600 h-8">Chi tiết</Button>
                      <Button variant="ghost" size="sm" onClick={() => { setSelectedPartner(d); setIsDeleteOpen(true); }} className="text-red-500 h-8"><Trash2 size={14}/></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* --- MODALS SECTION --- */}

      {/* Modal 1: Thêm đối tác */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader><DialogTitle>Thêm đối tác mới</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2"><Label>Tên đối tác *</Label><Input value={newPartner.name} onChange={(e) => setNewPartner({...newPartner, name: e.target.value})} placeholder="Nguyễn Văn A" /></div>
            <div className="space-y-2"><Label>Số điện thoại</Label><Input value={newPartner.phone} onChange={(e) => setNewPartner({...newPartner, phone: e.target.value})} placeholder="090..." /></div>
            <div className="space-y-2">
              <Label>Loại</Label>
              <select className="w-full p-2 border rounded-md text-sm" value={newPartner.type} onChange={(e) => setNewPartner({...newPartner, type: e.target.value})}>
                <option value="receivables">Khách hàng</option><option value="payables">Nhà cung cấp</option>
              </select>
            </div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setIsModalOpen(false)}>Hủy</Button><Button className="bg-blue-600" onClick={handleSavePartner} disabled={!newPartner.name}>Lưu</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal 2: Chi tiết lịch sử */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader><DialogTitle>Lịch sử giao dịch: {selectedPartner?.name}</DialogTitle></DialogHeader>
          <div className="py-4 space-y-4">
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-md border text-sm">
              <div><p className="text-slate-500 uppercase text-[10px] font-bold">Số dư hiện tại</p><p className="text-lg font-bold text-blue-600">{selectedPartner?.amount.toLocaleString()}đ</p></div>
              <div className="text-right"><p className="text-slate-500 uppercase text-[10px] font-bold">SĐT liên hệ</p><p className="font-medium">{selectedPartner?.phone}</p></div>
            </div>
            <Table>
              <TableHeader><TableRow><TableHead>Ngày</TableHead><TableHead>Loại</TableHead><TableHead className="text-right">Số tiền</TableHead></TableRow></TableHeader>
              <TableBody>
                {DEMO_HISTORY.map((h) => (
                  <TableRow key={h.id} className="text-xs">
                    <TableCell>{h.date}</TableCell><TableCell className="font-medium">{h.type}</TableCell>
                    <TableCell className={`text-right font-bold ${h.amount > 0 ? 'text-red-500' : 'text-emerald-500'}`}>{h.amount > 0 ? "+" : ""}{h.amount.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setIsDetailOpen(false)} className="w-full">Đóng</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal 3: Xác nhận xóa */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader><DialogTitle className="text-red-600 flex items-center gap-2"><AlertCircle size={20}/> Xác nhận xóa</DialogTitle>
          <DialogDescription className="pt-2">Bạn có chắc chắn muốn xóa đối tác <b>{selectedPartner?.name}</b>? Dữ liệu công nợ liên quan sẽ không thể phục hồi.</DialogDescription></DialogHeader>
          <DialogFooter className="mt-4"><Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Hủy</Button><Button className="bg-red-600 hover:bg-red-700" onClick={handleDeletePartner}>Đồng ý xóa</Button></DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}