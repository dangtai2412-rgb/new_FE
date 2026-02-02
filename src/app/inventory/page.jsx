"use client";

import React, { useState, useEffect } from "react";
import { api_service } from "@/lib/api_service";
import { 
  Search, Plus, Filter, RefreshCw, Trash2, Pencil, 
  Package, AlertTriangle, TrendingUp 
} from "lucide-react";

// Import các component giao diện (Shadcn UI) từ code gốc của bạn
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

// Dữ liệu mẫu (Dùng khi API bị lỗi hoặc chưa có Backend)
const DEMO_PRODUCTS = [
  { id: "SP001", name: "Xi măng Hà Tiên Đa Dụng", category: "Vật liệu thô", stock: 150, unit: "Bao", cost_price: 82000, sale_price: 90000 },
  { id: "SP002", name: "Gạch ống Tuynel 8x18", category: "Gạch xây", stock: 5000, unit: "Viên", cost_price: 1100, sale_price: 1350 },
  { id: "SP003", name: "Thép vằn Hòa Phát Ø10", category: "Sắt thép", stock: 8, unit: "Cây", cost_price: 115000, sale_price: 125000 },
  { id: "SP004", name: "Sơn Dulux 5L Nội Thất", category: "Sơn", stock: 5, unit: "Thùng", cost_price: 450000, sale_price: 520000 },
  { id: "SP005", name: "Cát vàng bê tông (Sông Lô)", category: "Vật liệu thô", stock: 0, unit: "m3", cost_price: 420000, sale_price: 550000 },
];

export default function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Hàm load dữ liệu
  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Gọi API thật
      const data = await api_service.get_products();
      
      if (Array.isArray(data) && data.length > 0) {
        setProducts(data);
      } else {
        console.warn("⚠️ API rỗng hoặc lỗi, hiển thị dữ liệu mẫu.");
        setProducts(DEMO_PRODUCTS);
      }
    } catch (error) {
      console.error("Lỗi tải trang kho:", error);
      setProducts(DEMO_PRODUCTS); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Xử lý tìm kiếm
  const filteredProducts = products.filter((p) =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* 1. HEADER: Tiêu đề & Nút thêm mới */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            Quản lý Kho hàng
          </h2>
          <p className="text-sm text-slate-500 mt-1">Theo dõi tồn kho, giá vốn và hiệu quả kinh doanh.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" onClick={fetchProducts} className="gap-2">
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Tải lại
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
            <Plus size={18} /> Thêm sản phẩm
          </Button>
        </div>
      </div>

      {/* 2. CÔNG CỤ: Tìm kiếm & Lọc */}
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <Input 
                placeholder="Tìm kiếm theo mã hoặc tên sản phẩm..." 
                className="pl-10" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            </div>
            <Button variant="outline" className="gap-2">
                <Filter size={16} /> Bộ lọc
            </Button>
        </CardContent>
      </Card>

      {/* 3. BẢNG DỮ LIỆU (Dùng Component Table của Shadcn) */}
      <Card>
        <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
            <Package size={20} className="text-blue-600" />
            Danh sách hàng hóa
            </CardTitle>
        </CardHeader>
        <CardContent>
            <div className="rounded-md border">
                <Table>
                    <TableHeader className="bg-slate-50">
                    <TableRow>
                        <TableHead className="w-[100px]">Mã SP</TableHead>
                        <TableHead>Tên sản phẩm</TableHead>
                        <TableHead>Danh mục</TableHead>
                        <TableHead className="text-center">Tồn kho</TableHead>
                        <TableHead className="text-right">Giá vốn</TableHead>
                        <TableHead className="text-right">Giá bán</TableHead>
                        <TableHead className="text-right text-emerald-600">Lãi gộp</TableHead>
                        <TableHead className="text-center">Thao tác</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {loading ? (
                        // Skeleton loading đơn giản
                        [...Array(5)].map((_, i) => (
                        <TableRow key={i}>
                            <TableCell colSpan={8} className="h-12 animate-pulse bg-slate-50/50" />
                        </TableRow>
                        ))
                    ) : filteredProducts.length === 0 ? (
                        <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-slate-500">
                            Không tìm thấy sản phẩm nào.
                        </TableCell>
                        </TableRow>
                    ) : (
                        filteredProducts.map((p) => {
                        const profit = (p.sale_price || 0) - (p.cost_price || 0);
                        const stock = p.stock ?? 0;

                        return (
                            <TableRow key={p.id} className="hover:bg-slate-50">
                            <TableCell className="font-medium text-slate-500 text-xs">
                                {p.id}
                            </TableCell>
                            <TableCell className="font-semibold text-slate-800">
                                <div>{p.name}</div>
                                {/* Dùng div bên trong TableCell là hợp lệ */}
                                <div className="text-[11px] font-normal text-slate-400 md:hidden">{p.unit}</div>
                            </TableCell>
                            <TableCell>
                                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-slate-100 text-slate-600">
                                {p.category}
                                </span>
                            </TableCell>
                            <TableCell className="text-center">
                                <div className={`flex items-center justify-center font-bold ${stock < 10 ? 'text-red-600' : 'text-slate-700'}`}>
                                    {stock < 10 && <AlertTriangle size={14} className="mr-1.5 animate-pulse" />}
                                    {stock.toLocaleString()} <span className="text-[10px] font-normal text-slate-400 ml-1">{p.unit}</span>
                                </div>
                            </TableCell>
                            <TableCell className="text-right text-slate-500">
                                {(p.cost_price || 0).toLocaleString()}đ
                            </TableCell>
                            <TableCell className="text-right font-bold text-blue-700">
                                {(p.sale_price || 0).toLocaleString()}đ
                            </TableCell>
                            <TableCell className="text-right font-medium text-emerald-600">
                                <div className="flex items-center justify-end gap-1">
                                <TrendingUp size={14} />
                                {profit.toLocaleString()}đ
                                </div>
                            </TableCell>
                            <TableCell className="text-center">
                                <div className="flex justify-center gap-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50">
                                    <Pencil size={16} />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50">
                                    <Trash2 size={16} />
                                </Button>
                                </div>
                            </TableCell>
                            </TableRow>
                        );
                        })
                    )}
                    </TableBody>
                </Table>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}