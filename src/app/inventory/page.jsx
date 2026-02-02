"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  Plus, Search, Trash2, Package, 
  Truck, ArrowDownCircle, Users, Phone, MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { INITIAL_PRODUCTS, INITIAL_SUPPLIERS } from "@/lib/mock_data";

// Helper định dạng tiền tệ
const formatMoney = (amount) => 
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

export default function InventoryPage() {
  // --- STATES ---
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  // --- LÓGIC LOAD & SAVE DATA ---
  
  // Khởi tạo dữ liệu
  useEffect(() => {
    const savedProds = localStorage.getItem("bizflow_products");
    const savedSupps = localStorage.getItem("bizflow_suppliers");
    
    setProducts(savedProds ? JSON.parse(savedProds) : INITIAL_PRODUCTS);
    setSuppliers(savedSupps ? JSON.parse(savedSupps) : INITIAL_SUPPLIERS);
    setIsMounted(true);
  }, []);

  // Tự động lưu khi có thay đổi (chỉ lưu sau khi đã Mount)
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("bizflow_products", JSON.stringify(products));
    }
  }, [products, isMounted]);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("bizflow_suppliers", JSON.stringify(suppliers));
    }
  }, [suppliers, isMounted]);

  // Reset tìm kiếm khi đổi Tab để tránh bị trống danh sách
  useEffect(() => {
    setSearchTerm("");
  }, [activeTab]);

  // --- LÓGIC TÍNH TOÁN (Tối ưu bằng useMemo) ---
  
  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toString().includes(searchTerm)
    );
  }, [products, searchTerm]);

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(s => 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.phone.includes(searchTerm)
    );
  }, [suppliers, searchTerm]);

  const stats = useMemo(() => ({
    totalStockValue: products.reduce((acc, p) => acc + (p.stock * p.cost), 0),
    lowStockCount: products.filter(p => p.stock < 10).length,
    totalDebt: suppliers.reduce((acc, s) => acc + (s.debt || 0), 0)
  }), [products, suppliers]);

  // --- HÀNH ĐỘNG (ACTIONS) ---

  const handleImportStock = (id, name) => {
    const qtyStr = prompt(`Nhập số lượng nhập thêm cho "${name}":`);
    const qty = parseInt(qtyStr);
    
    if (isNaN(qty) || qty <= 0) {
      if (qtyStr !== null) alert("Vui lòng nhập số nguyên dương hợp lệ!");
      return;
    }

    setProducts(prev => prev.map(p => 
      p.id === id ? { ...p, stock: p.stock + qty } : p
    ));
  };

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
    setSuppliers(prev => [...prev, newSup]);
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này khỏi kho?")) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleDeleteSupplier = (id) => {
    if (window.confirm("Xóa nhà cung cấp này sẽ mất dữ liệu công nợ. Tiếp tục?")) {
      setSuppliers(prev => prev.filter(s => s.id !== id));
    }
  };

  // Tránh lỗi Hydration (Server side render)
  if (!isMounted) return <div className="p-10 text-center text-slate-500">Đang tải ứng dụng...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 pb-20 font-sans">
      
      {/* 1. Header & Tab Switcher */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Quản lý Kho & Đối tác</h2>
          <p className="text-slate-500 text-sm">Hệ thống theo dõi tồn kho và công nợ nhà cung cấp</p>
        </div>
        
        <div className="flex bg-slate-100 p-1.5 rounded-xl border">
          <button 
            onClick={() => setActiveTab("products")}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === "products" ? "bg-white text-blue-600 shadow-md" : "text-slate-500 hover:text-slate-800"}`}
          >
            <Package size={18}/> Kho hàng
          </button>
          <button 
            onClick={() => setActiveTab("suppliers")}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === "suppliers" ? "bg-white text-blue-600 shadow-md" : "text-slate-500 hover:text-slate-800"}`}
          >
            <Truck size={18}/> Nhà cung cấp
          </button>
        </div>
      </div>

      {/* 2. Search Bar chung */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20}/>
          <Input 
            placeholder={activeTab === "products" ? "Tìm mã hàng, tên sản phẩm..." : "Tìm tên, số điện thoại nhà cung cấp..."} 
            className="pl-10 h-11"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        {activeTab === "products" ? (
          <Button className="bg-blue-600 hover:bg-blue-700 h-11 px-6"><Plus className="mr-2 w-5 h-5"/> Thêm hàng</Button>
        ) : (
          <Button onClick={handleAddSupplier} className="bg-indigo-600 hover:bg-indigo-700 h-11 px-6"><Plus className="mr-2 w-5 h-5"/> Thêm đối tác</Button>
        )}
      </div>

      {/* 3. Render Tab Content */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        {activeTab === "products" ? (
          <div className="space-y-6">
            {/* Stats Kho */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="bg-blue-50/50 border-blue-100">
                <CardHeader className="pb-2"><CardTitle className="text-xs uppercase text-blue-600 font-bold tracking-wider">Tổng mã hàng</CardTitle></CardHeader>
                <CardContent><div className="text-3xl font-black text-blue-900">{products.length}</div></CardContent>
              </Card>
              <Card className="bg-green-50/50 border-green-100">
                <CardHeader className="pb-2"><CardTitle className="text-xs uppercase text-green-600 font-bold tracking-wider">Giá trị tồn kho</CardTitle></CardHeader>
                <CardContent><div className="text-3xl font-black text-green-700">{formatMoney(stats.totalStockValue)}</div></CardContent>
              </Card>
              <Card className={`border-l-4 ${stats.lowStockCount > 0 ? "border-l-orange-500 bg-orange-50/30" : "border-l-slate-200"}`}>
                <CardHeader className="pb-2"><CardTitle className="text-xs uppercase text-slate-500 font-bold tracking-wider">Cảnh báo nhập hàng</CardTitle></CardHeader>
                <CardContent>
                  <div className={`text-3xl font-black ${stats.lowStockCount > 0 ? "text-orange-600" : "text-slate-400"}`}>{stats.lowStockCount}</div>
                  <p className="text-xs text-slate-400 mt-1">Sản phẩm dưới định mức 10</p>
                </CardContent>
              </Card>
            </div>

            {/* Bảng sản phẩm */}
            <Card className="overflow-hidden border-slate-200 shadow-xl shadow-slate-200/50">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="w-[80px]">Mã</TableHead>
                    <TableHead>Sản phẩm</TableHead>
                    <TableHead className="text-center">Tồn kho</TableHead>
                    <TableHead className="text-right">Giá vốn</TableHead>
                    <TableHead className="text-right">Giá bán</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((p) => (
                    <TableRow key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <TableCell className="font-mono text-[10px] text-slate-400">#{p.id.toString().slice(-5)}</TableCell>
                      <TableCell>
                        <div className="font-semibold text-slate-800 flex items-center gap-2">
                          <span className="text-xl">{p.image || "📦"}</span> {p.name}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${p.stock < 10 ? "bg-red-100 text-red-600" : "bg-slate-100 text-slate-700"}`}>
                          {p.stock}
                        </span>
                      </TableCell>
                      <TableCell className="text-right text-slate-500 font-medium">{formatMoney(p.cost)}</TableCell>
                      <TableCell className="text-right font-bold text-blue-600">{formatMoney(p.price)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" size="sm" 
                            className="h-8 border-green-200 text-green-600 hover:bg-green-50"
                            onClick={() => handleImportStock(p.id, p.name)}
                          >
                            <ArrowDownCircle size={14} className="mr-1.5"/> Nhập
                          </Button>
                          <Button 
                            variant="ghost" size="icon" 
                            className="h-8 w-8 text-slate-300 hover:text-red-600 hover:bg-red-50"
                            onClick={() => handleDeleteProduct(p.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredProducts.length === 0 && (
                <div className="p-20 text-center text-slate-400">Không tìm thấy sản phẩm nào...</div>
              )}
            </Card>
          </div>
        ) : (
          /* Tab Nhà Cung Cấp */
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredSuppliers.map((s) => (
              <Card key={s.id} className="group hover:border-indigo-300 hover:shadow-lg transition-all border-l-4 border-l-indigo-500">
                <CardHeader className="pb-3 border-b border-slate-50">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-bold text-slate-800">{s.name}</CardTitle>
                    <Button 
                      variant="ghost" size="icon" 
                      className="h-8 w-8 text-slate-300 group-hover:text-red-500"
                      onClick={() => handleDeleteSupplier(s.id)}
                    >
                      <Trash2 size={16}/>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-3">
                  <div className="grid grid-cols-1 gap-2 text-sm text-slate-600">
                    <div className="flex items-center gap-3"><Users size={16} className="text-slate-400"/> {s.contact}</div>
                    <div className="flex items-center gap-3"><Phone size={16} className="text-slate-400"/> {s.phone}</div>
                    <div className="flex items-center gap-3"><MapPin size={16} className="text-slate-400"/> <span className="truncate">{s.address}</span></div>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-dashed flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Công nợ hiện tại:</span>
                    <span className={`text-lg font-black ${s.debt > 0 ? "text-red-600" : "text-green-600"}`}>
                      {formatMoney(s.debt || 0)}
                    </span>
                  </div>
                  <Button variant="secondary" className="w-full text-xs font-bold hover:bg-indigo-50 hover:text-indigo-600">
                    XEM LỊCH SỬ NHẬP HÀNG
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}