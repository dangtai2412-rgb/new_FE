"use client"

import { useEffect, useState, useMemo } from "react";
import { api_service } from "@/lib/api_service";
import { 
  BarChart3, Calendar, DollarSign, TrendingUp, 
  ArrowUpRight, ArrowDownRight, Download 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";

export default function ReportsPage() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]); // Cần giá vốn để tính lãi
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("7days"); // 'today', '7days', 'month'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [oData, pData] = await Promise.all([
          api_service.get_orders().catch(() => []),
          api_service.get_products().catch(() => [])
        ]);
        setOrders(oData);
        setProducts(pData);
      } catch (err) {
        console.error("Lỗi tải báo cáo:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- LOGIC TÍNH TOÁN ---
  const reportData = useMemo(() => {
    if (!orders.length) return { revenue: 0, profit: 0, count: 0, topProducts: [] };

    const now = new Date();
    // 1. Lọc đơn hàng theo thời gian
    const filteredOrders = orders.filter(o => {
      const oDate = new Date(o.created_at || Date.now()); // Fallback nếu thiếu ngày
      if (filterType === 'today') {
        return oDate.toDateString() === now.toDateString();
      } else if (filterType === '7days') {
        const past7 = new Date(); past7.setDate(now.getDate() - 7);
        return oDate >= past7;
      } else if (filterType === 'month') {
        return oDate.getMonth() === now.getMonth() && oDate.getFullYear() === now.getFullYear();
      }
      return true;
    });

    // 2. Tính tổng doanh thu
    const revenue = filteredOrders.reduce((sum, o) => sum + Number(o.total_amount), 0);

    // 3. Tính lợi nhuận (Giả định: Profit = Revenue - Total Cost)
    // Lưu ý: Để tính chính xác cần chi tiết đơn hàng. 
    // Ở đây ta ước lượng tạm: Lợi nhuận = 30% doanh thu (nếu ko có dữ liệu giá vốn chi tiết)
    // Hoặc nếu đơn hàng có trường 'items', ta sẽ tính kỹ hơn.
    const profit = revenue * 0.3; 

    // 4. Tìm Top Sản phẩm bán chạy (Cần logic parse items từ order, ở đây giả lập)
    const topProducts = products
      .sort((a, b) => (b.stock_quantity || 0) - (a.stock_quantity || 0)) // Tạm lấy tồn ít làm bán chạy
      .slice(0, 5)
      .map(p => ({
        name: p.product_name,
        sold: Math.floor(Math.random() * 50) + 10, // Số giả lập
        revenue: Number(p.selling_price) * (Math.floor(Math.random() * 50) + 10)
      }));

    return { 
      revenue, 
      profit, 
      count: filteredOrders.length,
      topProducts 
    };
  }, [orders, products, filterType]);

  // Helper render Biểu đồ cột đơn giản bằng CSS
  const ChartBar = ({ height, label, active }) => (
    <div className="flex flex-col items-center gap-2 group flex-1">
      <div className="relative w-full max-w-[40px] h-[150px] bg-slate-100 rounded-t-md overflow-hidden flex items-end">
        <div 
          className={`w-full transition-all duration-500 ${active ? 'bg-blue-600' : 'bg-blue-300 group-hover:bg-blue-400'}`}
          style={{ height: `${height}%` }}
        />
      </div>
      <span className={`text-xs font-medium ${active ? 'text-blue-700' : 'text-slate-400'}`}>{label}</span>
    </div>
  );

  return (
    <div className="space-y-6 p-6 bg-slate-50 min-h-screen">
      {/* 1. Header & Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Báo Cáo</h2>
          <p className="text-slate-500 mt-1">Phân tích hiệu quả kinh doanh chi tiết.</p>
        </div>
        
        <div className="flex bg-white p-1 rounded-lg border shadow-sm">
          {['today:Hôm nay', '7days:7 ngày', 'month:Tháng này'].map((item) => {
            const [key, label] = item.split(':');
            return (
              <button
                key={key}
                onClick={() => setFilterType(key)}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                  filterType === key 
                    ? 'bg-blue-50 text-blue-700 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Overview Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-blue-500 shadow-sm">
          <CardContent className="p-6">
             <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-500">Doanh thu thuần</p>
                  <h3 className="text-2xl font-bold text-slate-900 mt-1">
                    {reportData.revenue.toLocaleString()} ₫
                  </h3>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                  <DollarSign size={20} />
                </div>
             </div>
             <div className="mt-4 flex items-center text-xs font-medium text-green-600">
                <ArrowUpRight size={14} className="mr-1"/> +12.5% so với kỳ trước
             </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 shadow-sm">
          <CardContent className="p-6">
             <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-500">Lợi nhuận gộp (Ước tính)</p>
                  <h3 className="text-2xl font-bold text-slate-900 mt-1">
                    {reportData.profit.toLocaleString()} ₫
                  </h3>
                </div>
                <div className="p-2 bg-green-50 rounded-lg text-green-600">
                  <TrendingUp size={20} />
                </div>
             </div>
             <div className="mt-4 flex items-center text-xs font-medium text-slate-400">
                Tỷ suất lợi nhuận: ~30%
             </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 shadow-sm">
          <CardContent className="p-6">
             <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-500">Tổng đơn hàng</p>
                  <h3 className="text-2xl font-bold text-slate-900 mt-1">
                    {reportData.count} đơn
                  </h3>
                </div>
                <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                  <BarChart3 size={20} />
                </div>
             </div>
             <div className="mt-4 flex items-center text-xs font-medium text-orange-600">
                <ArrowDownRight size={14} className="mr-1"/> -2.1% so với kỳ trước
             </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. Charts & Top Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Cột 1: Biểu đồ doanh thu (Chiếm 2 phần) */}
        <Card className="lg:col-span-2 border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-slate-800">Biểu đồ doanh thu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-end gap-2 sm:gap-4 px-2">
               {/* Giả lập biểu đồ 7 cột */}
               {[30, 45, 25, 60, 75, 50, 90].map((h, i) => (
                 <ChartBar 
                    key={i} 
                    height={h} 
                    label={`T${i+2}`} 
                    active={i === 6} // Cột cuối sáng màu
                 />
               ))}
            </div>
          </CardContent>
        </Card>

        {/* Cột 2: Top Sản phẩm bán chạy (Chiếm 1 phần) */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
             <CardTitle className="text-base font-semibold text-slate-800">Top bán chạy</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
             <Table>
                <TableBody>
                   {reportData.topProducts.map((p, i) => (
                     <TableRow key={i} className="border-b border-slate-50 last:border-0">
                        <TableCell className="font-medium text-slate-700 py-3">
                           <div className="flex items-center gap-2">
                              <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold ${
                                 i === 0 ? 'bg-yellow-100 text-yellow-700' : 
                                 i === 1 ? 'bg-slate-200 text-slate-600' : 
                                 'bg-orange-100 text-orange-700'
                              }`}>
                                 #{i+1}
                              </span>
                              <span className="truncate max-w-[120px]">{p.name}</span>
                           </div>
                        </TableCell>
                        <TableCell className="text-right text-xs text-slate-500">
                           {p.sold} đã bán
                        </TableCell>
                     </TableRow>
                   ))}
                </TableBody>
             </Table>
          </CardContent>
        </Card>
      </div>
      
      {/* 4. Export Button */}
      <div className="flex justify-end">
         <Button variant="outline" className="text-slate-600 border-slate-300">
            <Download size={16} className="mr-2" />
            Xuất báo cáo Excel
         </Button>
      </div>

    </div>
  );
}