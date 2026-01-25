"use client"

import { useEffect, useState } from "react";
import { api_service } from "@/lib/api_service";
import { 
  Plus, 
  Search, 
  Pencil, 
  Trash2, 
  Package, 
  AlertTriangle 
} from "lucide-react";
import { Button } from "@/components/ui/button"; //
import { Input } from "@/components/ui/input"; //
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"; //
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; //

// Dữ liệu mẫu cho kho hàng
const initial_products = [
  { id: "SP001", name: "Xi măng Hà Tiên", category: "Vật liệu thô", stock: 150, unit: "Bao", cost_price: 82000, sale_price: 90000 },
  { id: "SP002", name: "Gạch ống 8x18", category: "Vật liệu thô", stock: 5000, unit: "Viên", cost_price: 1000, sale_price: 1200 },
  { id: "SP003", name: "Sắt phi 10", category: "Sắt thép", stock: 12, unit: "Cây", cost_price: 135000, sale_price: 150000 },
  { id: "SP004", name: "Sơn Dulux 5L", category: "Sơn", stock: 5, unit: "Thùng", cost_price: 450000, sale_price: 520000 },
];

export default function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api_service.get_products()
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  if (loading) return <div>Đang tải dữ liệu từ cổng 9999...</div>;

  return (
    <div className="space-y-6">
      {/* Tiêu đề và nút thêm mới */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Quản lý Kho hàng</h2>
          <p className="text-sm text-slate-500">Theo dõi tồn kho và giá vốn sản phẩm</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 flex gap-2">
          <Plus size={18} />
          Thêm sản phẩm
        </Button>
      </div>

      {/* Bộ lọc và tìm kiếm */}
      <Card>
        <CardContent className="p-4 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <Input placeholder="Tìm kiếm theo mã hoặc tên sản phẩm..." className="pl-10" />
          </div>
          <Button variant="outline">Lọc sản phẩm</Button>
        </CardContent>
      </Card>

      {/* Bảng danh sách sản phẩm */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Package size={20} className="text-blue-600" />
            Danh mục hàng hóa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Mã SP</TableHead>
                <TableHead>Tên sản phẩm</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead className="text-center">Tồn kho</TableHead>
                <TableHead>Đơn vị</TableHead>
                <TableHead className="text-right">Giá vốn</TableHead>
                <TableHead className="text-right">Giá bán</TableHead>
                <TableHead className="text-center">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium text-blue-600">{p.id}</TableCell>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>
                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-xs">
                      {p.category}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={p.stock < 10 ? "text-red-500 font-bold flex items-center justify-center gap-1" : ""}>
                      {p.stock < 10 && <AlertTriangle size={14} />}
                      <span suppressHydrationWarning>{p.stock.toLocaleString()}</span>
                    </span>
                  </TableCell>
                  <TableCell>{p.unit}</TableCell>
                  <TableCell className="text-right">{p.cost_price.toLocaleString()}đ</TableCell>
                  <TableCell suppressHydrationWarning className="text-right font-bold">{p.sale_price.toLocaleString()}đ</TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-2">
                      <Button variant="ghost" size="icon-sm" className="text-slate-500">
                        <Pencil size={16} />
                      </Button>
                      <Button variant="ghost" size="icon-sm" className="text-red-500">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}