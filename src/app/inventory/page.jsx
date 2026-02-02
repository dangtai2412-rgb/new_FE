"use client";
import { useState, useEffect } from "react";
import { 
  Plus, Search, Pencil, Trash2, Package, 
  AlertTriangle, DollarSign, FileSpreadsheet, 
  Truck, ArrowDownCircle, Users, Phone, MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { INITIAL_PRODUCTS, INITIAL_SUPPLIERS } from "@/lib/mock_data"; // Import cả Suppliers

const formatMoney = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

export default function InventoryPage() {
  // State quản lý tab đang xem
  const [activeTab, setActiveTab] = useState("products"); // 'products' hoặc 'suppliers'
  
  // Dữ liệu
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Load dữ liệu từ LocalStorage (giả lập DB)
  useEffect(() => {
    // 1. Load Sản phẩm
    const savedProds = localStorage.getItem("bizflow_products");
    if (savedProds) setProducts(JSON.parse(savedProds));
    else setProducts(INITIAL_PRODUCTS);

    // 2. Load Nhà cung cấp
    const savedSupps = localStorage.getItem("bizflow_suppliers");
    if (savedSupps) setSuppliers(JSON.parse(savedSupps));
    else setSuppliers(INITIAL_SUPPLIERS);
  }, []);

  // Lưu lại mỗi khi thay đổi
  useEffect(() => {
    if (products.length > 0) localStorage.setItem("bizflow_products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    if (suppliers.length > 0) localStorage.setItem("bizflow_suppliers", JSON.stringify(suppliers));
  }, [suppliers]);

  // --- CÁC CHỨC NĂNG HÀNH ĐỘNG ---

  // 1. Nhập kho nhanh (Tăng số lượng tồn)
  const handleImportStock = (id, currentStock, name) => {
    const qtyStr = prompt(`Nhập số lượng muốn nhập thêm cho "${name}":`);
    const qty = parseInt(qtyStr);
    if (qty && qty > 0) {
      setProducts(products.map(p => 
        p.id === id ? { ...p, stock: p.stock + qty } : p
      ));
      alert(`Đã nhập thêm ${qty} đơn vị vào kho!`);
    }
  };

  // 2. Thêm Nhà cung cấp mới
  const handleAddSupplier = () => {
    const name = prompt("Tên nhà cung cấp:");
    if (!name) return;
    const phone = prompt("Số điện thoại:");
    
    const newSup = {
      id: Date.now(),
      name,
      phone: phone || "Chưa có",
      address: "Đang cập nhật",
      contact: "Quản lý",
      debt: 0
    };
    setSuppliers([...suppliers, newSup]);
  };

  // 3. Xóa
  const handleDeleteProduct = (id) => {
    if (confirm("Xóa sản phẩm này?")) setProducts(products.filter(p => p.id !== id));
  };
  const handleDeleteSupplier = (id) => {
    if (confirm("Xóa nhà cung cấp này?")) setSuppliers(suppliers.filter(s => s.id !== id));
  };

  // Logic lọc và tính toán
  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredSuppliers = suppliers.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
  
  const totalStockValue = products.reduce((acc, p) => acc + (p.stock * p.cost), 0);
  const totalDebt = suppliers.reduce((acc, s) => acc + (s.debt || 0), 0);

  return (
    <div className="space-y-6 p-4 pb-10 font-sans">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b pb-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Quản lý Kho & Nguồn hàng</h2>
          <p className="text-slate-500 text-sm">Theo dõi tồn kho, nhập hàng và công nợ nhà cung cấp</p>
        </div>
        
        {/* Nút chuyển Tab */}
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab("products")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "products" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            <Package className="inline mr-2 w-4 h-4"/> Kho hàng
          </button>
          <button 
            onClick={() => setActiveTab("suppliers")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "suppliers" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            <Truck className="inline mr-2 w-4 h-4"/> Nhà cung cấp
          </button>
        </div>
      </div>

      {/* --- NỘI DUNG TAB SẢN PHẨM --- */}
      {activeTab === "products" && (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-500">Tổng mã hàng</CardTitle></CardHeader>
              <CardContent><div className="text-2xl font-bold">{products.length}</div></CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-500">Giá trị tồn kho</CardTitle></CardHeader>
              <CardContent><div className="text-2xl font-bold text-green-600">{formatMoney(totalStockValue)}</div></CardContent>
            </Card>
            <Card className="border-l-4 border-l-orange-500">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-500">Cần nhập thêm</CardTitle></CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{products.filter(p => p.stock < 10).length}</div>
                <p className="text-xs text-slate-400">Sản phẩm sắp hết</p>
              </CardContent>
            </Card>
          </div>

          {/* Search & Actions */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
              <Input placeholder="Tìm kiếm sản phẩm..." className="pl-10" onChange={e => setSearchTerm(e.target.value)}/>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700"><Plus size={18} className="mr-2"/> Thêm mới</Button>
          </div>

          {/* Table Products */}
          <Card className="shadow-sm">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead>Mã</TableHead>
                  <TableHead>Tên sản phẩm</TableHead>
                  <TableHead className="text-center">Tồn kho</TableHead>
                  <TableHead className="text-right">Giá vốn</TableHead>
                  <TableHead className="text-right">Giá bán</TableHead>
                  <TableHead className="text-center">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono text-xs">#{p.id}</TableCell>
                    <TableCell>
                      <div className="font-medium flex items-center gap-2">
                        <span>{p.image}</span> {p.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {p.stock < 10 ? (
                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">{p.stock}</span>
                      ) : (
                        <span className="font-bold text-slate-700">{p.stock}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right text-slate-500">{formatMoney(p.cost)}</TableCell>
                    <TableCell className="text-right font-bold">{formatMoney(p.price)}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-2">
                        {/* Nút Nhập Kho */}
                        <Button 
                          variant="outline" size="sm" 
                          className="h-8 text-green-600 border-green-200 hover:bg-green-50"
                          title="Nhập thêm hàng"
                          onClick={() => handleImportStock(p.id, p.stock, p.name)}
                        >
                          <ArrowDownCircle size={16} /> Nhập
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-400 hover:bg-red-50" onClick={() => handleDeleteProduct(p.id)}>
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      )}

      {/* --- NỘI DUNG TAB NHÀ CUNG CẤP --- */}
      {activeTab === "suppliers" && (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-700">Danh sách đối tác</h3>
            <Button onClick={handleAddSupplier} className="bg-indigo-600 hover:bg-indigo-700"><Users size={18} className="mr-2"/> Thêm Nhà Cung Cấp</Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredSuppliers.map((s) => (
              <Card key={s.id} className="hover:shadow-md transition-shadow border-l-4 border-l-indigo-500">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base font-bold text-slate-800">{s.name}</CardTitle>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-red-500" onClick={() => handleDeleteSupplier(s.id)}><Trash2 size={14}/></Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-slate-600"><Users size={14}/> <span>LH: {s.contact}</span></div>
                  <div className="flex items-center gap-2 text-slate-600"><Phone size={14}/> <span>{s.phone}</span></div>
                  <div className="flex items-center gap-2 text-slate-600"><MapPin size={14}/> <span className="truncate">{s.address}</span></div>
                  
                  <div className="pt-3 mt-3 border-t flex justify-between items-center">
                    <span className="text-xs text-slate-500">Nợ phải trả:</span>
                    <span className="font-bold text-red-600">{formatMoney(s.debt || 0)}</span>
                  </div>
                  <Button variant="outline" className="w-full mt-2 text-xs h-8">Lịch sử nhập hàng</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}