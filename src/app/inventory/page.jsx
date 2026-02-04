"use client";
import { useState, useEffect } from "react";
import { 
  Plus, Search, Pencil, Trash2, Package, 
  AlertTriangle, ArrowDownCircle, Users, Phone, MapPin, Truck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { INITIAL_PRODUCTS, INITIAL_SUPPLIERS } from "@/lib/mock_data";

const formatMoney = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Load Product từ localStorage hoặc Mock
    const savedProds = localStorage.getItem("bizflow_products");
    if (savedProds) setProducts(JSON.parse(savedProds));
    else setProducts(INITIAL_PRODUCTS);

    // Load Supplier từ localStorage hoặc Mock
    const savedSupps = localStorage.getItem("bizflow_suppliers");
    if (savedSupps) setSuppliers(JSON.parse(savedSupps));
    else setSuppliers(INITIAL_SUPPLIERS);
  }, []);

  // Tự động lưu khi có thay đổi
  useEffect(() => {
    if (products.length > 0) localStorage.setItem("bizflow_products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    if (suppliers.length > 0) localStorage.setItem("bizflow_suppliers", JSON.stringify(suppliers));
  }, [suppliers]);

  // --- ACTIONS ---
  const handleImportStock = (id, name) => {
    const qty = parseInt(prompt(`Nhập số lượng nhập thêm cho "${name}":`));
    if (qty > 0) {
      setProducts(products.map(p => p.id === id ? { ...p, stock: p.stock + qty } : p));
      alert("Nhập kho thành công!");
    }
  };

  const handleDelete = (id) => {
    if(confirm("Bạn có chắc muốn xóa mục này?")) setProducts(products.filter(p => p.id !== id));
  };

  const handleAddSupplier = () => {
    const name = prompt("Tên nhà cung cấp mới:");
    if(name) setSuppliers([...suppliers, { id: Date.now(), name, phone: "Đang cập nhật", address: "VN", contact: "Admin", debt: 0 }]);
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const totalValue = products.reduce((acc, p) => acc + (p.stock * p.cost), 0);

  return (
    <div className="space-y-6 p-4 pb-10">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <h2 className="text-3xl font-bold text-slate-900">Quản lý Kho & Đối tác</h2>
        <div className="flex bg-slate-100 p-1 rounded-lg self-start">
          <button onClick={() => setActiveTab("products")} className={`px-4 py-2 rounded font-medium transition-all ${activeTab==="products" ? "bg-white shadow text-blue-600" : "text-slate-500"}`}>Kho hàng</button>
          <button onClick={() => setActiveTab("suppliers")} className={`px-4 py-2 rounded font-medium transition-all ${activeTab==="suppliers" ? "bg-white shadow text-blue-600" : "text-slate-500"}`}>Nhà cung cấp</button>
        </div>
      </div>

      {activeTab === "products" ? (
        <div className="space-y-4 animate-in fade-in">
          <div className="grid gap-4 md:grid-cols-3">
            <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Tổng mã hàng</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">{products.length}</div></CardContent></Card>
            <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Giá trị kho</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold text-green-600">{formatMoney(totalValue)}</div></CardContent></Card>
            <Card className="border-l-4 border-orange-500"><CardHeader className="pb-2"><CardTitle className="text-sm">Sắp hết</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold text-orange-600">{products.filter(p=>p.stock<10).length}</div></CardContent></Card>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="text-slate-400 mt-2.5 absolute ml-3" size={18}/>
              <Input className="pl-10" placeholder="Tìm sản phẩm..." onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700"><Plus size={18} className="mr-2"/> Thêm SP</Button>
          </div>

          <Card className="overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead>Tên SP</TableHead>
                  <TableHead className="text-center">Tồn</TableHead>
                  <TableHead className="text-right">Giá vốn</TableHead>
                  <TableHead className="text-right">Giá bán</TableHead>
                  <TableHead className="text-center">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map(p => (
                  <TableRow key={p.id} className="hover:bg-slate-50">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2"><span className="text-xl">{p.image}</span> {p.name}</div>
                    </TableCell>
                    <TableCell className="text-center">{p.stock < 10 ? <span className="text-red-600 font-bold bg-red-50 px-2 py-1 rounded">{p.stock}</span> : p.stock}</TableCell>
                    <TableCell className="text-right text-slate-500">{formatMoney(p.cost)}</TableCell>
                    <TableCell className="text-right font-bold">{formatMoney(p.price)}</TableCell>
                    <TableCell className="flex justify-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleImportStock(p.id, p.name)} className="h-8 text-green-600 hover:bg-green-50"><ArrowDownCircle size={14} className="mr-1"/> Nhập</Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-400 hover:bg-red-50 hover:text-red-600" onClick={() => handleDelete(p.id)}><Trash2 size={14}/></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex justify-end"><Button onClick={handleAddSupplier} className="bg-indigo-600 hover:bg-indigo-700"><Plus size={18} className="mr-2"/> Thêm đối tác</Button></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {suppliers.map(s => (
              <Card key={s.id} className="hover:shadow-md transition-shadow border-l-4 border-indigo-500">
                <CardHeader className="pb-2 flex flex-row justify-between items-start">
                  <CardTitle className="text-base">{s.name}</CardTitle>
                  <Truck size={18} className="text-indigo-400"/>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <div className="flex gap-2 text-slate-600"><Users size={14}/> {s.contact}</div>
                  <div className="flex gap-2 text-slate-600"><Phone size={14}/> {s.phone}</div>
                  <div className="flex gap-2 text-slate-600"><MapPin size={14}/> {s.address}</div>
                  <div className="border-t pt-2 font-bold text-red-600 flex justify-between">
                    <span>Nợ phải trả:</span> <span>{formatMoney(s.debt)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}