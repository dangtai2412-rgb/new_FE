"use client"

import { useEffect, useState, useMemo } from "react";
import { api_service } from "@/lib/api_service";
import { 
  Plus, Search, Pencil, Trash2, 
  Package, AlertTriangle, ArrowUpDown, 
  ChevronLeft, ChevronRight, Filter, MoreHorizontal 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

// --- Helper Components ---

// 1. Avatar tạo từ tên sản phẩm
const ProductAvatar = ({ name }) => {
  const initials = name
    ? name.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase()
    : "SP";
  
  // Mảng màu pastel đẹp mắt
  const colors = [
    "bg-red-100 text-red-600", "bg-orange-100 text-orange-600", 
    "bg-amber-100 text-amber-600", "bg-green-100 text-green-600", 
    "bg-emerald-100 text-emerald-600", "bg-teal-100 text-teal-600",
    "bg-cyan-100 text-cyan-600", "bg-blue-100 text-blue-600", 
    "bg-indigo-100 text-indigo-600", "bg-violet-100 text-violet-600",
    "bg-purple-100 text-purple-600", "bg-fuchsia-100 text-fuchsia-600", 
    "bg-pink-100 text-pink-600", "bg-rose-100 text-rose-600"
  ];
  
  // Chọn màu cố định dựa trên độ dài tên (để không bị đổi màu khi render lại)
  const colorClass = colors[name.length % colors.length];

  return (
    <div className={`h-10 w-10 rounded-lg flex items-center justify-center font-bold text-xs shadow-sm ${colorClass}`}>
      {initials}
    </div>
  );
};

// 2. Thanh hiển thị mức tồn kho
const StockBar = ({ stock, max = 100 }) => {
  const percentage = Math.min((stock / max) * 100, 100);
  let color = "bg-green-500";
  if (stock === 0) color = "bg-slate-300";
  else if (stock < 10) color = "bg-red-500";
  else if (stock < 30) color = "bg-yellow-500";

  return (
    <div className="w-full h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
      <div 
        className={`h-full rounded-full transition-all duration-500 ${color}`} 
        style={{ width: `${percentage}%` }} 
      />
    </div>
  );
};

export default function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7; // Số lượng hiển thị mỗi trang

  useEffect(() => {
    // Giả lập delay một chút để thấy hiệu ứng skeleton đẹp
    api_service.get_products()
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Xử lý sắp xếp
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Xử lý dữ liệu: Lọc -> Sắp xếp -> Phân trang
  const processedProducts = useMemo(() => {
    let data = [...products];

    // 1. Lọc
    if (searchTerm) {
      data = data.filter(p => 
        (p.product_name || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
        (p.sku || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 2. Sắp xếp
    if (sortConfig.key) {
      data.sort((a, b) => {
        // Mapping key model
        const valA = sortConfig.key === 'price' ? Number(a.selling_price) : 
                     sortConfig.key === 'stock' ? (a.stock_quantity || 0) : 
                     a[sortConfig.key];
        const valB = sortConfig.key === 'price' ? Number(b.selling_price) : 
                     sortConfig.key === 'stock' ? (b.stock_quantity || 0) : 
                     b[sortConfig.key];

        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return data;
  }, [products, searchTerm, sortConfig]);

  // 3. Phân trang
  const totalPages = Math.ceil(processedProducts.length / itemsPerPage);
  const paginatedProducts = processedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // --- Skeleton Loading View ---
  if (loading) return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
       <div className="flex justify-between">
          <div className="h-8 w-48 bg-slate-200 rounded animate-pulse" />
          <div className="h-10 w-32 bg-slate-200 rounded animate-pulse" />
       </div>
       <div className="h-12 w-full bg-slate-200 rounded animate-pulse" />
       <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 w-full bg-white border rounded-lg p-4 flex gap-4 animate-pulse">
              <div className="h-12 w-12 bg-slate-100 rounded" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/3 bg-slate-100 rounded" />
                <div className="h-3 w-1/4 bg-slate-50 rounded" />
              </div>
            </div>
          ))}
       </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Kho Hàng</h1>
          <p className="text-slate-500 mt-1 font-medium">
            Quản lý {products.length} mặt hàng trong hệ thống
          </p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
            <Button variant="outline" className="bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-sm">
                Xuất Excel
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 transition-all active:scale-95 flex-1 md:flex-none">
            <Plus className="mr-2 h-4 w-4" /> Thêm mới
            </Button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input 
            placeholder="Tìm tên sản phẩm, mã SKU..." 
            className="pl-10 h-11 bg-white border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="h-11 border-dashed border-slate-300 text-slate-600 bg-white hover:bg-slate-50">
          <Filter className="mr-2 h-4 w-4" /> Bộ lọc nâng cao
        </Button>
      </div>

      {/* Main Table Card */}
      <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/80">
              <TableRow className="hover:bg-slate-50/80">
                <TableHead className="w-[350px] pl-6 cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => handleSort('product_name')}>
                  <div className="flex items-center gap-1">
                    Sản phẩm <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead className="w-[150px]">Danh mục</TableHead>
                <TableHead className="text-center cursor-pointer hover:text-indigo-600" onClick={() => handleSort('stock')}>
                    <div className="flex items-center justify-center gap-1">
                        Tồn kho <ArrowUpDown className="h-3 w-3" />
                    </div>
                </TableHead>
                <TableHead className="text-right cursor-pointer hover:text-indigo-600" onClick={() => handleSort('price')}>
                    <div className="flex items-center justify-end gap-1">
                        Giá bán <ArrowUpDown className="h-3 w-3" />
                    </div>
                </TableHead>
                <TableHead className="text-center w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((p) => {
                    const stock = p.stock_quantity || 0;
                    return (
                        <TableRow key={p.product_id} className="group hover:bg-indigo-50/30 transition-colors border-b border-slate-100 last:border-0">
                        {/* Column: Product Info */}
                        <TableCell className="pl-6 py-4">
                            <div className="flex items-center gap-4">
                                <ProductAvatar name={p.product_name} />
                                <div>
                                    <div className="font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors">
                                        {p.product_name}
                                    </div>
                                    <div className="text-xs text-slate-500 font-mono mt-0.5 flex items-center gap-2">
                                        <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 border border-slate-200">
                                            {p.sku || "NO-SKU"}
                                        </span>
                                        {p.unit_id && <span>| Đơn vị: {p.unit_id}</span>} 
                                    </div>
                                </div>
                            </div>
                        </TableCell>

                        {/* Column: Category */}
                        <TableCell>
                            <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                {p.category_id ? `Danh mục ${p.category_id}` : "Chung"}
                            </span>
                        </TableCell>

                        {/* Column: Stock with Visual Bar */}
                        <TableCell className="text-center w-[180px]">
                            <div className="w-full max-w-[120px] mx-auto">
                                <div className="flex justify-between text-xs mb-1">
                                    <span className={`font-bold ${stock < 10 ? 'text-red-600' : 'text-slate-700'}`}>
                                        {stock.toLocaleString()}
                                    </span>
                                    <span className="text-slate-400 text-[10px] uppercase">
                                        {stock === 0 ? 'Hết hàng' : stock < 10 ? 'Sắp hết' : 'Có sẵn'}
                                    </span>
                                </div>
                                <StockBar stock={stock} max={100} />
                            </div>
                        </TableCell>

                        {/* Column: Price */}
                        <TableCell className="text-right">
                            <div className="font-bold text-slate-900">
                                {Number(p.selling_price).toLocaleString('vi-VN')} ₫
                            </div>
                            {Number(p.cost_price) > 0 && (
                                <div className="text-xs text-slate-400 mt-0.5">
                                    Vốn: {Number(p.cost_price).toLocaleString('vi-VN')}
                                </div>
                            )}
                        </TableCell>

                        {/* Column: Actions (Dropdown) */}
                        <TableCell>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-indigo-600">
                                        <span className="sr-only">Open menu</span>
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-[160px]">
                                    <DropdownMenuItem className="cursor-pointer group-hover:text-indigo-600">
                                        <Pencil className="mr-2 h-4 w-4" /> Chỉnh sửa
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
                                        <Trash2 className="mr-2 h-4 w-4" /> Xóa bỏ
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                        </TableRow>
                    );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-500">
                        <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                            <Package className="h-8 w-8 text-slate-300" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900">Không tìm thấy sản phẩm</h3>
                        <p className="text-sm text-slate-500 mt-1 max-w-xs mx-auto">
                            Thử tìm kiếm với từ khóa khác hoặc thêm sản phẩm mới.
                        </p>
                        <Button variant="link" className="text-indigo-600 mt-2" onClick={() => setSearchTerm("")}>
                            Xóa bộ lọc tìm kiếm
                        </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination Footer */}
        {totalPages > 1 && (
            <div className="border-t border-slate-100 p-4 flex items-center justify-between bg-slate-50/50">
                <div className="text-xs text-slate-500">
                    Trang <strong>{currentPage}</strong> / {totalPages}
                </div>
                <div className="flex gap-2">
                    <Button 
                        variant="outline" size="sm" 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="h-8 w-8 p-0"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button 
                        variant="outline" size="sm"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="h-8 w-8 p-0"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        )}
      </Card>
    </div>
  );
}