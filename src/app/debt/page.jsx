"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Users, ArrowUpCircle, ArrowDownCircle, Search, Plus, 
  Filter, RefreshCw, Wallet, Phone, Trash2, AlertCircle
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
  { id: "KH001", name: "Thầu XD Nguyễn Văn B", phone: "0909123456", type: "Phải thu", amount: 13500000, limit: 15000000, status: "Quá hạn" },
  { id: "KH002", name: "Cửa hàng Điện Nước C", phone: "0912345678", type: "Phải thu", amount: 4500000, limit: 10000000, status: "Trong hạn" },
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
  const [activeTab, setActiveTab] = useState("receivables");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [newPartner, setNewPartner] = useState({ name: "", phone: "", type: "receivables", limit: 0 });

  const loadData = async () => {
    setLoading(true);
    setTimeout(() => {
      setData(activeTab === "receivables" ? INITIAL_CUSTOMERS : INITIAL_SUPPLIERS);
      setLoading(false);
    }, 400);
  };

  useEffect(() => { loadData(); }, [activeTab]);

  const handleSavePartner = () => {
    alert(`Đã thêm đối tác ${newPartner.name}`);
    setIsModalOpen(false);
    setNewPartner({ name: "", phone: "", type: "receivables", limit: 0 });
  };

  const handleDeletePartner = () => {
    setData(data.filter(item => item.id !== selectedPartner.id));
    setIsDeleteOpen(false);
  };

  const filteredData = data.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Đối tác & Công nợ</h2>
          <p className="text-sm text-slate-500">Quản lý hạn mức và dòng tiền trực quan.</p>
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

      {/* 2. STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-emerald-500 shadow-sm"><CardContent className="pt-4"><p className="text-xs font-bold text-slate-500 uppercase">Phải thu (KH)</p><p className="text-2xl font-bold text-emerald-600">18.000.000đ</p></CardContent></Card>
        <Card className="border-l-4 border-l-red-500 shadow-sm"><CardContent className="pt-4"><p className="text-xs font-bold text-slate-500 uppercase">Phải trả (NCC)</p><p className="text-2xl font-bold text-red-600">45.000.000đ</p></CardContent></Card>
        <Card className="border-l-4 border-l-blue-500 shadow-sm bg-blue-50/30"><CardContent className="pt-4"><p className="text-xs font-bold text-slate-500 uppercase">Dòng tiền ròng</p><p className="text-2xl font-bold text-blue-600">-27.000.000đ</p></CardContent></Card>
      </div>

      {/* 3. MAIN TABLE */}
      <Card>
        <CardHeader className="pb-3 border-b">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex p-1 bg-slate-100 rounded-lg">
              <button onClick={() => setActiveTab("receivables")} className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === "receivables" ? "bg-white shadow text-blue-600" : "text-slate-500"}`}>Khách hàng</button>
              <button onClick={() => setActiveTab("payables")} className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === "payables" ? "bg-white shadow text-blue-600" : "text-slate-500"}`}>Nhà cung cấp</button>
            </div>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
              <Input placeholder="Tìm kiếm đối tác..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="w-[250px]">Đối tác</TableHead>
                <TableHead className="text-right">Công nợ & Hạn mức</TableHead>
                <TableHead className="text-center">Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((d) => (
                <TableRow key={d.id} className="hover:bg-slate-50/50">
                  <TableCell>
                    <div className="font-bold text-slate-700">{d.name}</div>
                    <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5"><Phone size={12}/> {d.phone}</div>
                  </TableCell>
                  
                  {/* CỘT CÔNG NỢ CÓ THANH PROGRESS BAR */}
                  <TableCell className="text-right w-[220px]">
                    <div className="flex flex-col items-end">
                      <div className="font-bold text-slate-900 text-base">{d.amount.toLocaleString()}đ</div>
                      {d.limit > 0 && (
                        <div className="w-full mt-1.5 max-w-[150px]">
                          <div className="flex justify-between text-[10px] mb-1 font-medium">
                            <span className="text-slate-400">HM: {d.limit.toLocaleString()}</span>
                            <span className={d.amount/d.limit > 0.8 ? "text-red-500" : "text-blue-600"}>
                              {Math.round((d.amount / d.limit) * 100)}%
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-500 ${d.amount / d.limit > 0.8 ? 'bg-red-500' : 'bg-blue-500'}`}
                              style={{ width: `${Math.min((d.amount / d.limit) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="text-center">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase border ${
                      d.status === "Quá hạn" ? "bg-red-50 text-red-600 border-red-100" : 
                      d.status === "Trong hạn" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : 
                      "bg-slate-50 text-slate-600 border-slate-100"
                    }`}>
                      {d.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => { setSelectedPartner(d); setIsDetailOpen(true); }} className="text-blue-600">Chi tiết</Button>
                      <Button variant="ghost" size="sm" onClick={() => { setSelectedPartner(d); setIsDeleteOpen(true); }} className="text-red-400 hover:text-red-600"><Trash2 size={16}/></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* --- MODALS --- */}
      
      {/* Thêm mới */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader><DialogTitle>Thêm đối tác mới</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4 italic text-sm">
            <div className="space-y-2"><Label>Tên đối tác *</Label><Input value={newPartner.name} onChange={(e) => setNewPartner({...newPartner, name: e.target.value})} /></div>
            <div className="space-y-2"><Label>Số điện thoại</Label><Input value={newPartner.phone} onChange={(e) => setNewPartner({...newPartner, phone: e.target.value})} /></div>
            <div className="space-y-2"><Label>Hạn mức nợ (VNĐ)</Label><Input type="number" value={newPartner.limit} onChange={(e) => setNewPartner({...newPartner, limit: e.target.value})} /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setIsModalOpen(false)}>Hủy</Button><Button className="bg-blue-600" onClick={handleSavePartner}>Lưu</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Chi tiết lịch sử */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader><DialogTitle>Đối soát công nợ: {selectedPartner?.name}</DialogTitle></DialogHeader>
          <div className="py-4 space-y-4">
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
              <div><p className="text-[10px] font-bold text-slate-500 uppercase">Dư nợ hiện tại</p><p className="text-xl font-black text-blue-600">{selectedPartner?.amount.toLocaleString()}đ</p></div>
              <div className="text-right"><p className="text-[10px] font-bold text-slate-500 uppercase">Liên lạc</p><p className="font-medium text-slate-700">{selectedPartner?.phone}</p></div>
            </div>
            <Table>
              <TableHeader><TableRow><TableHead>Ngày</TableHead><TableHead>Nội dung</TableHead><TableHead className="text-right">Số tiền</TableHead></TableRow></TableHeader>
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

      {/* Xác nhận xóa */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader><DialogTitle className="text-red-600 flex items-center gap-2"><AlertCircle size={20}/> Cảnh báo xóa</DialogTitle>
          <DialogDescription className="pt-2 text-slate-600 font-medium">Hành động này sẽ xóa vĩnh viễn đối tác <b>{selectedPartner?.name}</b> khỏi danh sách quản lý nợ.</DialogDescription></DialogHeader>
          <DialogFooter className="mt-4"><Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Hủy</Button><Button className="bg-red-600 hover:bg-red-700" onClick={handleDeletePartner}>Đồng ý xóa</Button></DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}