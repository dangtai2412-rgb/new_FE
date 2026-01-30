"use client"

import { useEffect, useMemo, useState } from "react";
import { api_service } from "@/lib/api_service";
import { 
  Plus, 
  Search, 
  Pencil, 
  Trash2, 
  Package, 
  AlertTriangle,
  Layers,
  DollarSign 
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

// ===== Helpers =====
const formatMoney = (num) => num.toLocaleString("vi-VN") + "đ";

// ===== Loading skeleton =====
const LoadingBox = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-6 bg-slate-200 rounded w-1/3"></div>
    <div className="h-32 bg-slate-200 rounded"></div>
    <div className="h-64 bg-slate-200 rounded"></div>
  </div>
);

export default function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // ===== Fetch data =====
  useEffect(() => {
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

  // ===== Filter search =====
  const filteredProducts = useMemo(() => {
    return products.filter(p =>
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  // ===== Stats =====
  const totalProducts = products.length;

  const totalStock = products.reduce(
    (sum, p) => sum + p.stock,
    0
  );

  const totalValue = products.reduce(
    (sum, p) => sum + p.stock * p.cost_price,
    0
  );

  const lowStockCount = products.filter(p => p.stock < 10).length;

  if (loading) {
    return <LoadingBox />;
  }

  return (
    <div className="space-y-6">

      {/* ===== Header ===== */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Quản lý Kho hàng</h2>
          <p className="text-slate-500 mt-1">
            Theo dõi tồn kho, giá vốn và cảnh báo thiếu hàng
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 flex gap-2">
          <Plus size={18} />
          Thêm sản phẩm
        </Button>
      </div>

      {/* ===== Stats cards ===== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <Package className="text-blue-600" />
            <div>
              <p className="text-sm text-slate-500">Số sản phẩm</p>
              <p className="text-xl font-bold">{totalProducts}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <Layers className="text-green-600" />
            <div>
              <p className="text-sm text-slate-500">Tổng tồn kho</p>
              <p className="text-xl font-bold">{totalStock.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <DollarSign className="text-purple-600" />
            <div>
              <p className="text-sm text-slate-500">Giá trị kho</p>
              <p className="text-xl font-bold">{formatMoney(totalValue)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <AlertTriangle className="text-red-500" />
            <div>
              <p className="text-sm text-slate-500">Sắp hết hàng</p>
              <p className="text-xl font-bold text-red-500">{lowStockCount}</p>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* ===== Search ===== */}
      <Card>
        <CardContent className="p-4 flex gap-4">
          <div className="relative flex-1">
            <Search 
              className="absolute left-3 top-2.5 text-slate-400" 
              size={18} 
            />
            <Input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo mã hoặc tên sản phẩm..." 
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* ===== Product table ===== */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Package className="text-blue-600" size={20} />
            Danh sách sản phẩm
          </CardTitle>
        </CardHeader>

        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã SP</TableHead>
                <TableHead>Tên</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead className="text-center">Tồn kho</TableHead>
                <TableHead>Đơn vị</TableHead>
                <TableHead className="text-right">Giá vốn</TableHead>
                <TableHead className="text-right">Giá bán</TableHead>
                <TableHead className="text-center">Thao tác</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredProducts.map(p => (
                <TableRow key={p.id} className="hover:bg-slate-50">

                  <TableCell className="font-medium text-blue-600">
                    {p.id}
                  </TableCell>

                  <TableCell className="font-medium">
                    {p.name}
                  </TableCell>

                  <TableCell>
                    <span className="bg-slate-100 px-2 py-1 rounded text-xs">
                      {p.category}
                    </span>
                  </TableCell>

                  <TableCell className="text-center">
                    <span className={`flex justify-center items-center gap-1
                      ${p.stock < 10 ? "text-red-500 font-bold" : ""}`}>
                      {p.stock < 10 && <AlertTriangle size={14} />}
                      {p.stock.toLocaleString()}
                    </span>
                  </TableCell>

                  <TableCell>{p.unit}</TableCell>

                  <TableCell className="text-right">
                    {formatMoney(p.cost_price)}
                  </TableCell>

                  <TableCell className="text-right font-bold">
                    {formatMoney(p.sale_price)}
                  </TableCell>

                  <TableCell className="text-center">
                    <div className="flex justify-center gap-2">
                      <Button variant="ghost" size="icon-sm">
                        <Pencil size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon-sm" 
                        className="text-red-500"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>

                </TableRow>
              ))}

              {filteredProducts.length === 0 && (
                <TableRow>
                  <TableCell 
                    colSpan={8} 
                    className="text-center py-8 text-slate-400"
                  >
                    Không tìm thấy sản phẩm nào
                  </TableCell>
                </TableRow>
              )}

            </TableBody>
          </Table>
        </CardContent>
      </Card>

    </div>
  );
}
