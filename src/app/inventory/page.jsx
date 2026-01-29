"use client"

import { useEffect, useState } from "react";
import { api_service } from "@/lib/api_service";
import { 
  Plus, 
  Search, 
  Pencil, 
  Trash2, 
  Package, 
  AlertCircle,
  CheckCircle2,
  Box,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    api_service.get_products()
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  // Hàm helper để xác định trạng thái tồn kho
  const getStockStatus = (stock) => {
    if (stock === 0) return { label: "Hết hàng", color: "bg-red-100 text-red-700 border-red-200", icon: AlertCircle };
    if (stock < 10) return { label: "Sắp hết", color: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: AlertCircle };
    return { label: "Có sẵn", color: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle2 };
  };

  // Lọc sản phẩm client-side (cho demo mượt hơn)
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex h-screen items-center justify-center space-x-2">
      <div className="h-4 w-4 animate-bounce rounded-full bg-blue-600 delay-100"></div>
      <div className="h-4 w-4 animate-bounce rounded-full bg-blue-600 delay-200"></div>
      <div className="h-4 w-4 animate-bounce rounded-full bg-blue-600 delay-300"></div>
    </div>
  );

  return (
    <div className="space-y-6 p-2 md:p-6 bg-slate-50 min-h-screen">
      {/* 1. Header Section đẹp hơn */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Kho Hàng</h2>
          <p className="text-slate-500 mt-1">Quản lý danh sách sản phẩm, giá vốn và tồn kho hiện tại.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95">
          <Plus size={18} className="mr-2" />
          Thêm sản phẩm mới
        </Button>
      </div>

      {/* 2. Thanh công cụ tìm kiếm & lọc */}
      <Card className="border-none shadow-sm bg-white">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input 
              placeholder="Tìm kiếm theo tên, mã SKU..." 
              className="pl-10 border-slate-200 focus-visible:ring-blue-500" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="border-slate-200 text-slate-600 hover:bg-slate-50 w-full md:w-auto">
            <Filter size={16} className="mr-2" />
            Bộ lọc
          </Button>
        </CardContent>
      </Card>

      {/* 3. Bảng dữ liệu chính */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4">
          <CardTitle className="text-base font-semibold text-slate-700 flex items-center gap-2">
            <Package size={18} className="text-blue-500" />
            Danh sách sản phẩm ({filteredProducts.length})
          </CardTitle>
        </CardHeader>
        
        <div className="relative">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="w-[300px] pl-6">Sản phẩm</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead className="text-center">Trạng thái kho</TableHead>
                <TableHead className="text-right">Giá bán / Giá vốn</TableHead>
                <TableHead className="text-center w-[120px]">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((p) => {
                  const status = getStockStatus(p.stock);
                  const StatusIcon = status.icon;

                  return (
                    <TableRow key={p.id} className="group hover:bg-blue-50/30 transition-colors cursor-pointer">
                      {/* Cột Sản phẩm: Gộp Tên và Mã */}
                      <TableCell className="pl-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">
                            {p.name}
                          </span>
                          <span className="text-xs text-slate-400 font-mono mt-0.5 flex items-center gap-1">
                            <Box size={10} /> SKU: {p.id}
                          </span>
                        </div>
                      </TableCell>

                      {/* Cột Danh mục: Badge bo tròn */}
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                          {p.category}
                        </span>
                      </TableCell>

                      {/* Cột Tồn kho: Thiết kế Badge trạng thái */}
                      <TableCell className="text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${status.color}`}>
                            <StatusIcon size={12} />
                            {status.label}
                          </span>
                          <span className="text-xs text-slate-500 font-medium">
                            {p.stock.toLocaleString()} {p.unit}
                          </span>
                        </div>
                      </TableCell>

                      {/* Cột Giá: Gộp Giá bán và Giá vốn */}
                      <TableCell className="text-right">
                        <div className="flex flex-col items-end">
                          <span className="font-bold text-slate-900" suppressHydrationWarning>
                            {p.sale_price.toLocaleString()}đ
                          </span>
                          <span className="text-xs text-slate-400" suppressHydrationWarning>
                            Vốn: {p.cost_price.toLocaleString()}đ
                          </span>
                        </div>
                      </TableCell>

                      {/* Cột Thao tác: Nút bấm đẹp hơn */}
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50">
                            <Pencil size={16} />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50">
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                /* Empty State đẹp mắt */
                <TableRow>
                  <TableCell colSpan={5} className="h-[300px] text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400 space-y-3">
                      <div className="p-4 bg-slate-50 rounded-full">
                        <Package size={40} className="text-slate-300" />
                      </div>
                      <p className="text-lg font-medium text-slate-600">Không tìm thấy sản phẩm nào</p>
                      <p className="text-sm max-w-xs mx-auto">
                        Thử thay đổi từ khóa tìm kiếm hoặc thêm sản phẩm mới vào kho hàng.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
