"use client";
import { useState, useEffect } from "react";
import { Search, Phone, MapPin, FileText, DollarSign, History, CheckCircle2, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const formatMoney = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

// Dữ liệu mẫu mở rộng
const INITIAL_DEBTORS = [
  { id: 1, name: "Anh Hùng (Thầu Xây Dựng)", phone: "0909123456", address: "Q.12, TP.HCM", totalDebt: 15500000, limit: 50000000, lastPay: "20/01/2026", status: "bad" },
  { id: 2, name: "Cty XD Kiến Vàng", phone: "0918888999", address: "Bình Dương", totalDebt: 82000000, limit: 100000000, lastPay: "01/02/2026", status: "good" },
  { id: 3, name: "Chú Tư (Điện nước)", phone: "0909888777", address: "Hóc Môn", totalDebt: 2500000, limit: 10000000, lastPay: "15/01/2026", status: "normal" },
];

export default function DebtPage() {
  const [debtors, setDebtors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDebtor, setSelectedDebtor] = useState(null); // Để hiện Popup chi tiết
  const [payAmount, setPayAmount] = useState("");

  useEffect(() => {
    // Load data
    const saved = localStorage.getItem("bizflow_debtors");
    if (saved) setDebtors(JSON.parse(saved));
    else setDebtors(INITIAL_DEBTORS);
  }, []);

  // Hàm xử lý thanh toán nợ
  const handlePayment = () => {
    if (!payAmount || parseInt(payAmount) <= 0) return alert("Vui lòng nhập số tiền hợp lệ");
    
    const amount = parseInt(payAmount);
    if (amount > selectedDebtor.totalDebt) return alert("Số tiền trả vượt quá nợ hiện tại!");

    const updatedDebtors = debtors.map(d => {
      if (d.id === selectedDebtor.id) {
        return { ...d, totalDebt: d.totalDebt - amount, lastPay: new Date().toLocaleDateString('vi-VN') };
      }
      return d;
    });

    setDebtors(updatedDebtors);
    localStorage.setItem("bizflow_debtors", JSON.stringify(updatedDebtors));
    alert(`Đã thu ${formatMoney(amount)} từ khách hàng ${selectedDebtor.name}`);
    setSelectedDebtor(null); // Đóng popup
    setPayAmount("");
  };

  const filtered = debtors.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const totalReceivable = debtors.reduce((sum, d) => sum + d.totalDebt, 0);

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Quản lý Công Nợ</h2>
          <p className="text-slate-500">Theo dõi nợ phải thu của khách hàng</p>
        </div>
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-full text-orange-600"><DollarSign size={24}/></div>
            <div>
              <p className="text-sm text-slate-500">Tổng nợ phải thu</p>
              <p className="text-2xl font-bold text-orange-700">{formatMoney(totalReceivable)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4 bg-white p-4 rounded-xl border shadow-sm">
        <Search className="text-slate-400" />
        <Input placeholder="Tìm tên khách, số điện thoại..." onChange={(e) => setSearchTerm(e.target.value)} className="border-none shadow-none focus-visible:ring-0"/>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map(d => (
          <Card key={d.id} className="hover:shadow-md transition-all cursor-pointer group" onClick={() => setSelectedDebtor(d)}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg text-blue-700 group-hover:underline">{d.name}</CardTitle>
                {d.totalDebt > d.limit * 0.8 && <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-bold">Cảnh báo</span>}
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex gap-2 text-slate-600"><Phone size={16}/> {d.phone}</div>
              <div className="flex gap-2 text-slate-600"><MapPin size={16}/> {d.address}</div>
              <div className="pt-3 border-t flex justify-between items-center">
                <span className="text-slate-500">Dư nợ hiện tại:</span>
                <span className="text-xl font-bold text-red-600">{formatMoney(d.totalDebt)}</span>
              </div>
              <div className="text-xs text-slate-400 text-right">Trả gần nhất: {d.lastPay}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* --- POPUP CHI TIẾT & THANH TOÁN --- */}
      {selectedDebtor && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-bold text-slate-800">Chi tiết công nợ</h3>
              <Button variant="ghost" size="icon" onClick={() => setSelectedDebtor(null)}><X size={20}/></Button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 text-blue-600 font-bold text-2xl">
                  {selectedDebtor.name.charAt(0)}
                </div>
                <h4 className="text-xl font-bold">{selectedDebtor.name}</h4>
                <p className="text-slate-500">{selectedDebtor.phone}</p>
                <div className="mt-4 text-3xl font-extrabold text-red-600">{formatMoney(selectedDebtor.totalDebt)}</div>
                <p className="text-xs text-slate-400">Hạn mức cho phép: {formatMoney(selectedDebtor.limit)}</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl space-y-3">
                <label className="text-sm font-bold text-slate-700 block">Thu nợ khách hàng</label>
                <div className="flex gap-2">
                  <Input 
                    type="number" 
                    placeholder="Nhập số tiền khách trả..." 
                    className="bg-white"
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                  />
                  <Button onClick={handlePayment} className="bg-green-600 hover:bg-green-700"><CheckCircle2 className="mr-2 h-4 w-4"/> Xác nhận</Button>
                </div>
              </div>

              {/* Lịch sử giả định */}
              <div>
                <h5 className="font-bold text-sm text-slate-700 mb-2 flex items-center gap-2"><History size={16}/> Lịch sử gần đây</h5>
                <div className="border rounded-lg overflow-hidden text-sm">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100">
                      <tr>
                        <th className="p-2">Ngày</th>
                        <th className="p-2">Hành động</th>
                        <th className="p-2 text-right">Số tiền</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr>
                        <td className="p-2 text-slate-500">Hôm nay</td>
                        <td className="p-2">Mua hàng (POS)</td>
                        <td className="p-2 text-right text-orange-600 font-medium">+ 2.500.000</td>
                      </tr>
                      <tr>
                        <td className="p-2 text-slate-500">{selectedDebtor.lastPay}</td>
                        <td className="p-2">Thanh toán tiền mặt</td>
                        <td className="p-2 text-right text-green-600 font-medium">- 5.000.000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}