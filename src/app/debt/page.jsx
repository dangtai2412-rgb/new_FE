"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, Plus, RefreshCw, Trash2, AlertCircle, 
  Banknote, Download, FileSpreadsheet, FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

// Import thư viện xuất file
import md5 from "md5"; // Nếu bạn muốn hash ID, không thì bỏ qua
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

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

  // --- LOGIC XUẤT EXCEL ---
  const exportToExcel = () => {
    const exportData = data.filter(item => item.type === activeTab).map(item => ({
      "Mã ĐT": item.id,
      "Tên Đối Tác": item.name,
      "Số Điện Thoại": item.phone,
      "Công Nợ (VNĐ)": item.amount,
      "Trạng Thái": item.status
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "CongNo");
    XLSX.writeFile(wb, `Bao_Cao_Cong_No_${activeTab}.xlsx`);
  };

  // --- LOGIC XUẤT PDF ---
  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["Ma DT", "Ten Doi Tac", "SDT", "Cong No (VND)", "Trang Thai"];
    const tableRows = data
      .filter(item => item.type === activeTab)
      .map(item => [item.id, item.name, item.phone, item.amount.toLocaleString(), item.status]);

    doc.text(`BAO CAO CONG NO - ${activeTab.toUpperCase()}`, 14, 15);
    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    doc.save(`Bao_Cao_${activeTab}.pdf`);
  };

  // --- HÀM THU NỢ ---
  const handlePayment = () => {
    const payValue = Number(paymentAmount);
    if (!payValue || payValue <= 0) return alert("Số tiền không hợp lệ");

    setData(data.map(item => {
      if (item.id === selectedPartner.id) {
        const newAmount = Math.max(0, item.amount - payValue);
        return { ...item, amount: newAmount, status: newAmount === 0 ? "Hoàn thành" : item.status };
      }
      return item;
    }));
    setIsPaymentOpen(false);
    setPaymentAmount("");
  };

  const filteredData = data.filter(item => 
    item.type === activeTab && 
    (item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.phone.includes(searchTerm))
  );

  return (
    <div className="space-y-6 p-6 bg-slate-50 min-h-screen">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-[#0f172a] p-8 rounded-[2rem] shadow-2xl text-white gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
            <TrendingUp className="text-emerald-400" /> BÁO CÁO <span className="text-emerald-400">TÀI CHÍNH</span>
          </h1>
          <p className="text-slate-400 text-sm italic">Xuất dữ liệu và quản lý công nợ tập trung</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button onClick={exportToExcel} className="bg-emerald-600 hover:bg-emerald-700 rounded-xl gap-2">
            <FileSpreadsheet size={18} /> Excel
          </Button>
          <Button onClick={exportToPDF} className="bg-rose-600 hover:bg-rose-700 rounded-xl gap-2">
            <FileText size={18} /> PDF
          </Button>
          <div className="relative ml-2">
            <Search className="absolute left-3 top-2.5 text-slate-500" size={18} />
            <Input 
              placeholder="Tìm kiếm..." 
              className="pl-10 bg-slate-800 border-none rounded-xl text-white w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <Card className="border-none shadow-2xl rounded-[2rem] overflow-hidden bg-white">
        <div className="p-6 border-b flex justify-between items-center bg-white/50 backdrop-blur-md">
           <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl">
              <button onClick={() => setActiveTab("receivables")} className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${activeTab === "receivables" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400"}`}>KHÁCH HÀNG</button>
              <button onClick={() => setActiveTab("payables")} className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${activeTab === "payables" ? "bg-white text-rose-600 shadow-sm" : "text-slate-400"}`}>NHÀ CUNG CẤP</button>
           </div>
        </div>

        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="pl-10 font-bold">ĐỐI TÁC</TableHead>
              <TableHead className="text-right font-bold">CÔNG NỢ</TableHead>
              <TableHead className="text-center font-bold">TRẠNG THÁI</TableHead>
              <TableHead className="text-right pr-10 font-bold">THAO TÁC</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((d) => (
              <TableRow key={d.id} className="hover:bg-slate-50/80 transition-all group">
                <TableCell className="pl-10 py-5">
                  <div className="font-black text-slate-700">{d.name}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{d.phone}</div>
                </TableCell>
                <TableCell className="text-right font-black text-lg text-slate-900">
                  {d.amount.toLocaleString()}đ
                </TableCell>
                <TableCell className="text-center">
                  <span className={`px-4 py-1 rounded-full text-[10px] font-black border-2 ${d.status === 'Quá hạn' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                    {d.status}
                  </span>
                </TableCell>
                <TableCell className="text-right pr-10">
                  <div className="flex justify-end gap-2">
                    <Button 
                      size="sm" 
                      className="bg-emerald-500 hover:bg-emerald-600 rounded-xl"
                      onClick={() => { setSelectedPartner(d); setIsPaymentOpen(true); }}
                    >
                      <Banknote size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-slate-300 hover:text-rose-600 rounded-xl"
                      onClick={() => { setSelectedPartner(d); setIsDeleteOpen(true); }}
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* MODAL THU NỢ (GIỮ NGUYÊN PHONG CÁCH ĐẶC SẮC) */}
      <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
        <DialogContent className="rounded-[2.5rem] p-10 border-none shadow-3xl">
          <DialogHeader className="text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto"><Banknote size={32}/></div>
            <DialogTitle className="text-2xl font-black uppercase italic">Thu Nợ Đối Tác</DialogTitle>
            <DialogDescription className="font-medium italic">Khách hàng: <b>{selectedPartner?.name}</b></DialogDescription>
          </DialogHeader>
          <div className="py-6 space-y-4">
             <div className="bg-slate-50 p-4 rounded-2xl border border-dashed border-slate-200 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 uppercase">Dư nợ hiện tại:</span>
                <span className="text-xl font-black text-slate-800">{selectedPartner?.amount.toLocaleString()}đ</span>
             </div>
             <Input 
                type="number" 
                placeholder="Số tiền khách trả..." 
                className="rounded-2xl h-14 text-xl font-black bg-slate-50 border-none shadow-inner"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
             />
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="ghost" className="rounded-2xl font-black flex-1" onClick={() => setIsPaymentOpen(false)}>HỦY</Button>
            <Button className="bg-slate-900 text-white rounded-2xl h-12 flex-1 font-black shadow-2xl" onClick={handlePayment}>XÁC NHẬN</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Icon hỗ trợ thêm
function TrendingUp(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
  );
}