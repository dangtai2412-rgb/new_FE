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

// --- IMPORT THÊM CHO MODAL ---
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

// --- DỮ LIỆU MẪU ---
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
  const [activeTab, setActiveTab] = useState("receivables");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // --- STATE CHO MODAL ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPartner, setNewPartner] = useState({
    name: "",
    phone: "",
    type: "receivables",
    limit: 0
  });

  const loadData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setData(activeTab === "receivables" ? DEMO_CUSTOMERS : DEMO_SUPPLIERS);
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSearchTerm(""); // Reset tìm kiếm khi đổi tab
    loadData();
  }, [activeTab]);

  // Xử lý lưu đối tác mới
  const handleSavePartner = () => {
    console.log("Dữ liệu mới:", newPartner);
    // Giả lập lưu thành công
    alert(`Đã thêm: ${newPartner.name}`);
    setIsModalOpen(false);
    setNewPartner({ name: "", phone: "", type: "receivables", limit: 0 });
  };

  const totalReceivable = useMemo(() => DEMO_CUSTOMERS.reduce((sum, item) => sum + item.amount, 0), []);
  const totalPayable = useMemo(() => DEMO_SUPPLIERS.reduce((sum, item) => sum + item.amount, 0), []);

  const filteredData = data.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* 1. HEADER & ACTIONS */}
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

      {/* 2. DASHBOARD CARDS */}
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

      {/* 3. MAIN TABLE */}
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
                placeholder="Tìm kiếm..." 
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
                  <TableCell className="text-right font-bold text-base">
                    {d.amount.toLocaleString()}đ
                  </TableCell>
                  {activeTab === 'receivables' && (
                    <TableCell className="text-center px-6">
                       <span className="text-xs text-slate-500">{d.limit?.toLocaleString()}</span>
                    </TableCell>
                  )}
                  <TableCell className="text-center">
                    <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase border">
                      {d.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button variant="ghost" size="sm" className="text-blue-600">Chi tiết</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* --- MODAL THÊM ĐỐI TÁC --- */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-800">Thêm đối tác mới</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4 text-slate-700">
            <div className="grid gap-2 text-left">
              <Label htmlFor="name">Tên đối tác <span className="text-red-500">*</span></Label>
              <Input 
                id="name" 
                value={newPartner.name}
                onChange={(e) => setNewPartner({...newPartner, name: e.target.value})}
                placeholder="Nguyễn Văn A" 
              />
            </div>
            <div className="grid gap-2 text-left">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input 
                id="phone" 
                value={newPartner.phone}
                onChange={(e) => setNewPartner({...newPartner, phone: e.target.value})}
                placeholder="090..." 
              />
            </div>
            <div className="grid gap-2 text-left">
              <Label>Loại đối tác</Label>
              <select 
                className="w-full p-2 border rounded-md"
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
            <Button className="bg-blue-600" onClick={handleSavePartner}>Lưu thông tin</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}