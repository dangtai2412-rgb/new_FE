"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Users, ArrowUpCircle, ArrowDownCircle, Search, Plus, 
  Filter, RefreshCw, Wallet, Phone, AlertCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

// --- 1. DỮ LIỆU MẪU (DEMO DATA) ---
const DEMO_CUSTOMERS = [
  { id: "KH001", name: "Thầu XD Nguyễn Văn B", phone: "0909123456", type: "Phải thu", amount: 12000000, limit: 15000000, status: "Quá hạn" },
  { id: "KH002", name: "Cửa hàng Điện Nước C", phone: "0912345678", type: "Phải thu", amount: 5500000, limit: 10000000, status: "Trong hạn" },
  { id: "KH003", name: "Anh Tâm (Khách lẻ)", phone: "0987654321", type: "Phải thu", amount: 0, limit: 5000000, status: "Không nợ" },
];

const DEMO_SUPPLIERS = [
  { id: "NCC01", name: "Đại lý VLXD A", phone: "0283888999", type: "Phải trả", amount: 45000000, status: "Đang nợ" },
  { id: "NCC02", name: "Kho Thép Hòa Phát", phone: "0274111222", type: "Phải trả", amount: 0, status: "Đã thanh toán" },
];

const DEMO_HISTORY = [
  { id: "HD001", date: "2024-03-20", type: "Hóa đơn bán", amount: 5000000, balance: 5000000 },
  { id: "PT001", date: "2024-03-21", type: "Thu tiền khách trả", amount: -2000000, balance: 3000000 },
  { id: "HD002", date: "2024-03-25", type: "Hóa đơn bán", amount: 9000000, balance: 12000000 },
];

export default function DebtPage() {
  // --- 2. STATES ---
  const [activeTab, setActiveTab] = useState("receivables");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // State cho Modal Thêm mới
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPartner, setNewPartner] = useState({ name: "", phone: "", type: "receivables", limit: 0 });

  // State cho Modal Chi tiết
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // --- 3. LOGIC XỬ LÝ ---
  const loadData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Giả lập load
      setData(activeTab === "receivables" ? DEMO_CUSTOMERS : DEMO_SUPPLIERS);
    } catch (error) {
      console.error("Lỗi:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSearchTerm("");
    loadData();
  }, [activeTab]);

  const handleSavePartner = () => {
    alert(`Đã lưu đối tác: ${newPartner.name}`);
    setIsModalOpen(false);
    setNewPartner({ name: "", phone: "", type: "receivables", limit: 0 });
  };

  const totalReceivable = useMemo(() => DEMO_CUSTOMERS.reduce((sum, item) => sum + item.amount, 0), []);
  const totalPayable = useMemo(() => DEMO_SUPPLIERS.reduce((sum, item) => sum + item.amount, 0), []);

  const filteredData = data.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">Đối tác & Công nợ</h2>
          <p className="text-sm text-slate-500 mt-1">Quản lý dòng tiền phải thu và phải trả.</p>
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

      {/* DASHBOARD CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className={`border-l-4 border-l-emerald-500 shadow-sm ${activeTab === 'receivables' ? 'ring-2 ring-emerald-200' : ''}`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex justify-between">
              Phải Thu <ArrowDownCircle className="text-emerald-500 h-5 w-5" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-emerald-700">{totalReceivable.toLocaleString()}đ</p>
          </CardContent>
        </Card>

        <Card className={`border-l-4 border-l-red-500 shadow-sm ${activeTab === 'payables' ? 'ring-2 ring-red-200' : ''}`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex justify-between">
              Phải Trả <ArrowUpCircle className="text-red-500 h-5 w-5" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-700">{totalPayable.toLocaleString()}đ</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 shadow-sm bg-blue-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex justify-between">
              Dòng tiền ròng <Wallet className="text-blue-500 h-5 w-5" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-700">{(totalReceivable - totalPayable).toLocaleString()}đ</p>
          </CardContent>
        </Card>
      </div>

      {/* MAIN CONTENT TABLE */}
      <Card className="min-h-[500px]">
        <CardHeader className="pb-3 border-b border-slate-100">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex p-1 bg-slate-100 rounded-lg w-full md:w-auto">
              <button 
                onClick={() => setActiveTab("receivables")}
                className={`flex-1 md:flex-none px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${activeTab === "receivables" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500"}`}
              >
                <Users size={16} /> Khách hàng
              </button>
              <button 
                onClick={() => setActiveTab("payables")}
                className={`flex-1 md:flex-none px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${activeTab === "payables" ? "bg-white text-red-700 shadow-sm" : "text-slate-500"}`}
              >
                <Filter size={16} /> Nhà cung cấp
              </button>
            </div>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
              <Input 
                placeholder="Tìm kiếm đối tác..." 
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
                <TableHead>Tên đối tác</TableHead>
                <TableHead>Liên hệ</TableHead>
                <TableHead className="text-right">Công nợ hiện tại</TableHead>
                {activeTab === 'receivables' && <TableHead className="text-center">Hạn mức</TableHead>}
                <TableHead className="text-center">Trạng thái</TableHead>
                <TableHead className="text-center">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((d) => (
                <TableRow key={d.id} className="hover:bg-slate-50">
                  <TableCell>
                    <div className="font-semibold text-slate-700">{d.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{d.id}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Phone size={14} /> {d.phone}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    {d.amount.toLocaleString()}đ
                  </TableCell>
                  {activeTab === 'receivables' && (
                    <TableCell className="text-center text-xs text-slate-500">
                       {d.limit?.toLocaleString()}
                    </TableCell>
                  )}
                  <TableCell className="text-center">
                    <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase border bg-white shadow-sm">
                      {d.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-blue-600 hover:bg-blue-50"
                      onClick={() => {
                        setSelectedPartner(d);
                        setIsDetailOpen(true);
                      }}
                    >
                      Chi tiết
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* MODAL 1: THÊM ĐỐI TÁC */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-800">Thêm đối tác mới</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Tên đối tác *</Label>
              <Input 
                value={newPartner.name}
                onChange={(e) => setNewPartner({...newPartner, name: e.target.value})}
                placeholder="VD: Nguyễn Văn A" 
              />
            </div>
            <div className="grid gap-2">
              <Label>Số điện thoại</Label>
              <Input 
                value={newPartner.phone}
                onChange={(e) => setNewPartner({...newPartner, phone: e.target.value})}
                placeholder="090..." 
              />
            </div>
            <div className="grid gap-2">
              <Label>Loại đối tác</Label>
              <select 
                className="w-full p-2 border rounded-md text-sm"
                value={newPartner.type}
                onChange={(e) => setNewPartner({...newPartner, type: e.target.value})}
              >
                <option value="receivables">Khách hàng (Phải thu)</option>
                <option value="payables">Nhà cung cấp (Phải trả)</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Hủy</Button>
            <Button className="bg-blue-600" onClick={handleSavePartner} disabled={!newPartner.name}>Lưu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: CHI TIẾT CÔNG NỢ */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Lịch sử công nợ: {selectedPartner?.name}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="flex justify-between mb-4 p-3 bg-slate-50 rounded-lg border border-slate-100 text-sm">
              <div>
                <p className="text-slate-500 font-bold uppercase text-[10px]">Tổng dư nợ</p>
                <p className="text-xl font-bold text-blue-600">{selectedPartner?.amount.toLocaleString()}đ</p>
              </div>
              <div className="text-right">
                <p className="text-slate-500 font-bold uppercase text-[10px]">Liên hệ</p>
                <p className="font-medium text-slate-700">{selectedPartner?.phone}</p>
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ngày</TableHead>
                  <TableHead>Nội dung</TableHead>
                  <TableHead className="text-right">Số tiền</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {DEMO_HISTORY.map((h) => (
                  <TableRow key={h.id}>
                    <TableCell className="text-xs">{h.date}</TableCell>
                    <TableCell className="text-sm font-medium">{h.type}</TableCell>
                    <TableCell className={`text-right font-bold ${h.amount > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                      {h.amount > 0 ? "+" : ""}{h.amount.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailOpen(false)}>Đóng</Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700">Xuất PDF</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}