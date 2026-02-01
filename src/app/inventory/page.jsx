"use client";
import { useState } from "react";
import { Plus, Search, Pencil, Trash2, Package, AlertTriangle, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { INITIAL_PRODUCTS } from "@/lib/mock_data"; // Import dữ liệu giả

// Hàm format tiền
const formatMoney = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

export default function InventoryPage() {
  // Dùng INITIAL_PRODUCTS làm giá trị khởi tạo cho state
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Chức năng XÓA GIẢ (Chỉ xóa trên giao diện)
  const handleDelete = (id) => {
    if (confirm("Xóa sản phẩm này? (Demo: Dữ liệu sẽ hồi phục khi F5)")) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  // 2. Chức năng THÊM MỚI GIẢ
  const handleQuickAdd = () => {
    const name = prompt("Tên sản phẩm mới:");
    const price = prompt("Giá bán:");
    if (name && price) {
      const newProduct = {
        id: Date.now(), // Tạo ID ngẫu nhiên
        name: name,
        price: parseInt(price),
        cost: parseInt(price) * 0.7,
        stock: 100,
        unit: "Cái",
        category: "Mới nhập",
        image: "🆕"
      };
      setProducts([newProduct, ...products]); // Thêm vào đầu danh sách
    }
  };

  // Logic lọc và tính toán (Giữ nguyên)
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalValue = products.reduce((acc, p) => acc + (p.stock * p.cost), 0);
  const lowStockCount = products.filter(p => p.stock < 10).length;

  return (
    <div className="space-y-6 p-2 pb-10">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <h2 className="text-3xl font-bold">Kho Hàng (Chế độ Demo)</h2>
        <Button onClick={handleQuickAdd} className="bg-blue-600 gap-2"><Plus size={18}/> Thêm hàng</Button>
      </div>

      {/* Cards thống kê */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardHeader><CardTitle className="text-sm">Tổng mã hàng</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{products.length}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Giá trị kho</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold text-green-700">{formatMoney(totalValue)}</div></CardContent></Card>
        <Card className="border-l-4 border-l-orange-500"><CardHeader><CardTitle className="text-sm">Cảnh báo nhập</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold text-orange-600">{lowStockCount}</div></CardContent></Card>
      </div>

      {/* Tìm kiếm */}
      <div className="flex gap-4 bg-white p-4 rounded border">
        <Search className="text-slate-400" />
        <Input placeholder="Tìm tên sản phẩm..." onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      {/* Bảng */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã</TableHead>
                <TableHead>Tên sản phẩm</TableHead>
                <TableHead>Tồn kho</TableHead>
                <TableHead className="text-right">Giá vốn</TableHead>
                <TableHead className="text-right">Giá bán</TableHead>
                <TableHead className="text-center">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>#{p.id}</TableCell>
                  <TableCell className="font-medium">{p.image} {p.name}</TableCell>
                  <TableCell>{p.stock < 10 ? <span className="text-red-600 font-bold">{p.stock} (Thấp)</span> : p.stock}</TableCell>
                  <TableCell className="text-right">{formatMoney(p.cost)}</TableCell>
                  <TableCell className="text-right font-bold">{formatMoney(p.price)}</TableCell>
                  <TableCell className="text-center flex justify-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)} className="text-red-500 hover:bg-red-50">
                      <Trash2 size={16} />
                    </Button>
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