"use client";

import { useState, useEffect } from "react";
import {
  Plus, Search, Pencil, Trash2, Package,
  AlertTriangle, Filter, DollarSign, FileSpreadsheet,
  History
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api_service } from "@/lib/api_service"; // Đảm bảo import đúng đường dẫn

// Hàm format tiền an toàn (xử lý cả trường hợp null/undefined)
const formatMoney = (amount) => {
  if (amount === undefined || amount === null) return "0 ₫";
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

export default function InventoryPage() {
  const [products, setProducts] = useState([]); // Khởi tạo mảng rỗng
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // === PHẦN QUAN TRỌNG: GỌI API VÀ MAP DỮ LIỆU ===
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api_service.get_products();
        
        if (Array.isArray(data)) {
          // Ánh xạ dữ liệu từ Backend (selling_price) sang Frontend (price)
          const mappedData = data.map((item) => ({
            id: item.product_id || item.id,            // Ưu tiên product_id từ BE
            name: item.product_name || item.name,      // Ưu tiên product_name từ BE
            price: item.selling_price || item.price || 0, // MAP QUAN TRỌNG: selling_price -> price
            cost: item.cost_price || 0,                // Giá vốn (nếu BE chưa có thì để 0)
            stock: item.stock_quantity || item.stock || 0, // MAP QUAN TRỌNG: stock_quantity -> stock
            unit: item.unit || "Cái",                  // Đơn vị mặc định
            category: item.category || "general",
            origin: "Việt Nam",                        // Mặc định nếu chưa có
            image: "📦"                                // Icon mặc định
          }));
          setProducts(mappedData);
        }
      } catch (error) {
        console.error("Lỗi tải sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Logic lọc và tính toán
  const filteredProducts = products.filter(p =>
    (p.name && p.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (p.id && p.id.toString().includes(searchTerm))
  );

  const totalValue = products.reduce((acc, p) => acc + (p.stock * p.cost), 0);
  const lowStockCount = products.filter(p => p.stock < 10).length;

  return (
    <div className="space-y-6 p-2 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Kho & Sản phẩm</h2>
          <p className="text-slate-500 mt-1">
            {loading ? "Đang đồng bộ dữ liệu..." : `Đồng bộ dữ liệu với POS - ${products.length} mã hàng`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex gap-2 text-slate-700 border-slate-300">
            <FileSpreadsheet size={16} /> Xuất Excel
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 flex gap-2 shadow-sm">
            <Plus size={18} /> Thêm hàng mới
          </Button>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Tổng mã hàng</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-slate-800">{products.length}</div></CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Giá trị tồn kho</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{formatMoney(totalValue)}</div>
            <p className="text-xs text-slate-400 mt-1">Vốn đang lưu động</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Cảnh báo nhập</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{lowStockCount}</div>
            <p className="text-xs text-slate-400 mt-1">Sản phẩm dưới định mức</p>
          </CardContent>
        </Card>
      </div>

      {/* Bộ lọc */}
      <div className="flex gap-4 bg-white p-4 rounded-xl border shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
          <Input
            placeholder="Tìm theo tên, mã SKU..."
            className="pl-10 bg-slate-50 border-slate-200 focus:bg-white"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="text-slate-600"> <Filter size={16} className="mr-2" /> Bộ lọc </Button>
      </div>

      {/* Bảng dữ liệu */}
      <Card className="border-0 shadow-md overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-100/80">
              <TableRow>
                <TableHead className="w-[60px]"></TableHead>
                <TableHead className="font-semibold text-slate-700">Mã SP</TableHead>
                <TableHead className="font-semibold text-slate-700">Tên sản phẩm</TableHead>
                <TableHead className="font-semibold text-slate-700">Danh mục</TableHead>
                <TableHead className="text-center font-semibold text-slate-700">Tồn kho</TableHead>
                <TableHead className="text-right font-semibold text-slate-700">Giá vốn</TableHead>
                <TableHead className="text-right font-semibold text-slate-700">Giá bán</TableHead>
                <TableHead className="text-center font-semibold text-slate-700">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                 <TableRow>
                    <TableCell colSpan={8} className="text-center py-10 text-slate-500">
                        Đang tải dữ liệu...
                    </TableCell>
                 </TableRow>
              ) : filteredProducts.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={8} className="text-center py-10 text-slate-500">
                        Không tìm thấy sản phẩm nào.
                    </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((p) => (
                  <TableRow key={p.id} className="hover:bg-slate-50 cursor-pointer group">
                    <TableCell>
                      <div className="h-10 w-10 rounded bg-slate-100 flex items-center justify-center text-xl border border-slate-200 select-none">
                        {p.image}
                      </div>
                    </TableCell>

                    <TableCell className="font-medium text-slate-500 text-xs">#{p.id}</TableCell>

                    <TableCell>
                      <div className="font-semibold text-slate-800">{p.name}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                        <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">ĐVT: {p.unit}</span>
                        <span className="bg-slate-50 text-slate-500 px-1.5 py-0.5 rounded border border-slate-100 flex items-center gap-1">
                          {p.origin}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 uppercase">
                        {p.category}
                      </span>
                    </TableCell>

                    <TableCell className="text-center">
                      {p.stock < 10 ? (
                        <div className="flex flex-col items-center">
                          <span className="font-bold text-red-600">{p.stock}</span>
                          <span className="text-[10px] text-red-600 bg-red-50 px-1.5 py-0.5 rounded-full mt-1">Sắp hết</span>
                        </div>
                      ) : (
                        <span className="font-bold text-slate-700">{p.stock}</span>
                      )}
                    </TableCell>

                    <TableCell className="text-right text-slate-500">{formatMoney(p.cost)}</TableCell>
                    {/* Đây là chỗ hay gây lỗi nhất, giờ đã được formatMoney bảo vệ */}
                    <TableCell className="text-right font-bold text-slate-900">{formatMoney(p.price)}</TableCell>

                    <TableCell className="text-center">
                      <div className="flex justify-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50">
                          <History size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-orange-600 hover:bg-orange-50">
                          <Pencil size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50">
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Footer */}
      <div className="text-center text-xs text-slate-400 mt-8">
        Hệ thống BizFlow - Dữ liệu đã được đồng bộ hóa
      </div>
    </div>
  );
}