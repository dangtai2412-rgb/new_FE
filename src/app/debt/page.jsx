"use client"

import { useEffect, useState, useMemo } from "react";
import { api_service } from "@/lib/api_service";
import { 
  Search, Users, Wallet, TrendingDown, 
  History, DollarSign, FileText, CheckCircle2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export default function DebtPage() {
  // --- STATE ---
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // State cho Modal Thu Nợ
  const [selectedDebtor, setSelectedDebtor] = useState(null); // Khách đang chọn để trả nợ
  const [paymentAmount, setPaymentAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // --- FETCH DATA ---
  const fetchDebtors = async () => {
    try {
      setLoading(true);
      // Lấy danh sách khách hàng. 
      // Giả định: Object khách hàng trả về có trường 'current_debt' hoặc 'debt_amount'
      const data = await api_service.get_customers().catch(() => []);
      
      // Lọc ra khách có nợ > 0 (Client-side filter)
      // Nếu Backend chưa có trường debt, ta giả lập dữ liệu test ở dưới để bạn thấy giao diện
      const debtors = data.map(c => ({
        ...c,
        current_debt: c.current_debt || 0 // Fallback nếu null
      })).filter(c => c.current_debt > 0);

      setCustomers(debtors);
    } catch (err) {
      console.error("Lỗi tải công nợ:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDebtors();
  }, []);

  // --- HANDLERS ---
  const handleOpenPayment = (customer) => {
    setSelectedDebtor(customer);
    setPaymentAmount(""); // Reset form
  };

  const handleConfirmPayment = async () => {
    if (!selectedDebtor || !paymentAmount) return;
    
    // Validate số tiền
    const amount = Number(paymentAmount);
    if (amount <= 0) {
      alert("Số tiền thu phải lớn hơn 0");
      return;
    }
    if (amount > selectedDebtor.current_debt) {
      alert("Không thể thu quá số tiền nợ hiện tại!");
      return;
    }

    setIsProcessing(true);
    try {
      // Gọi API Payment
      await api_service.create_payment({
        customer_id: selectedDebtor.customer_id,
        amount: amount,
        payment_method: "cash", // Mặc định tiền mặt
        note: "Thu nợ khách hàng",
        type: "debt_payment" // Đánh dấu là thanh toán nợ
      });

      alert(`Đã thu ${amount.toLocaleString()}đ thành công!`);
      setSelectedDebtor(null); // Đóng modal
      fetchDebtors(); // Tải lại bảng để cập nhật số nợ mới
    } catch (error) {
      alert("Lỗi khi thu nợ: " + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // --- FILTERS & STATS ---
  const filteredDebtors = useMemo(() => {
    return customers.filter(c => 
      (c.customer_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.phone_number || "").includes(searchTerm)
    );
  }, [customers, searchTerm]);

  const totalDebt = customers.reduce((sum, c) => sum + (c.current_debt || 0), 0);

  return (
    <div className="space-y-6 p-6 bg-slate-50 min-h-screen">
      {/* 1. Header & Stats */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Sổ Nợ</h2>
          <p className="text-slate-500 mt-1">Theo dõi và thu hồi công nợ khách hàng.</p>
        </div>
        
        {/* Thẻ tổng nợ nổi bật */}
        <Card className="bg-red-50 border-red-100 min-w-[300px]">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600 mb-1">Tổng tiền khách nợ</p>
              <h3 className="text-2xl font-bold text-red-700">
                {totalDebt.toLocaleString()} ₫
              </h3>
            </div>
            <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center text-red-600">
              <TrendingDown size={20} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 2. Controls */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input 
              placeholder="Tìm tên khách, số điện thoại..." 
              className="pl-10" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* 3. Debt Table */}
      <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="pl-6">Khách hàng</TableHead>
              <TableHead>Liên hệ</TableHead>
              <TableHead className="text-right">Dư nợ hiện tại</TableHead>
              <TableHead className="text-center w-[150px]">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={4} className="h-24 text-center">Đang tải dữ liệu...</TableCell></TableRow>
            ) : filteredDebtors.length > 0 ? (
              filteredDebtors.map((c) => (
                <TableRow key={c.customer_id} className="group hover:bg-slate-50">
                  <TableCell className="pl-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                        {c.customer_name ? c.customer_name[0].toUpperCase() : "K"}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{c.customer_name}</div>
                        <div className="text-xs text-slate-500">ID: {c.customer_id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-slate-600">{c.phone_number || "---"}</div>
                    <div className="text-xs text-slate-400">{c.address || "Chưa có địa chỉ"}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full text-sm">
                      {c.current_debt.toLocaleString()} ₫
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button 
                      size="sm" 
                      className="bg-blue-600 hover:bg-blue-700 shadow-sm"
                      onClick={() => handleOpenPayment(c)}
                    >
                      <DollarSign size={16} className="mr-1" />
                      Thu nợ
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-48 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <CheckCircle2 size={32} className="text-green-500 opacity-50" />
                    <p>Tuyệt vời! Hiện tại không có khách nào nợ tiền.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* --- MODAL THU NỢ --- */}
      {selectedDebtor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50">
              <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <Wallet size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Thu nợ khách hàng</h3>
                <p className="text-xs text-slate-500">{selectedDebtor.customer_name}</p>
              </div>
            </div>

            <div className="p-6 space-y-4">
               {/* Thông tin nợ */}
               <div className="bg-red-50 p-4 rounded-lg border border-red-100 flex justify-between items-center">
                  <span className="text-sm font-medium text-red-600">Đang nợ:</span>
                  <span className="text-xl font-bold text-red-700">{selectedDebtor.current_debt.toLocaleString()} ₫</span>
               </div>

               {/* Form nhập tiền */}
               <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Số tiền khách trả</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <Input 
                      type="number"
                      autoFocus
                      className="pl-9 h-12 text-lg font-bold text-blue-600 focus-visible:ring-blue-500"
                      placeholder="Nhập số tiền..."
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                    />
                  </div>
                  <p className="text-xs text-slate-400">
                    * Số tiền còn lại sau thanh toán: {
                      paymentAmount 
                      ? Math.max(0, selectedDebtor.current_debt - Number(paymentAmount)).toLocaleString() 
                      : selectedDebtor.current_debt.toLocaleString()
                    } ₫
                  </p>
               </div>
            </div>

            <div className="p-4 bg-slate-50 flex justify-end gap-3 border-t border-slate-100">
              <Button variant="ghost" onClick={() => setSelectedDebtor(null)}>Hủy bỏ</Button>
              <Button 
                className="bg-green-600 hover:bg-green-700 w-[120px]"
                onClick={handleConfirmPayment}
                disabled={!paymentAmount || isProcessing}
              >
                {isProcessing ? "Đang xử lý..." : "Xác nhận thu"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}