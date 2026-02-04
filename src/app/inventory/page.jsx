"use client";
import { useState, useEffect } from "react";
import { 
  Plus, Search, Pencil, Trash2, Package, 
  AlertTriangle, DollarSign, FileSpreadsheet, 
  Truck, ArrowDownCircle, Users, Phone, MapPin, 
  RefreshCcw, RotateCcw
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

  // --- 1. LOAD DỮ LIỆU AN TOÀN HƠN ---
  useEffect(() => {
    // Load Sản phẩm
    const savedProds = localStorage.getItem("bizflow_products");
    if (savedProds) {
        const parsed = JSON.parse(savedProds);
        // Nếu localStorage có mảng rỗng (bị lỗi cũ), thì nạp lại từ Mock Data luôn
        if (parsed.length === 0) {
            setProducts(INITIAL_PRODUCTS);
        } else {
            setProducts(parsed);
        }
    } else {
        setProducts(INITIAL_PRODUCTS);
    }

    // Load Nhà cung cấp
    const savedSupps = localStorage.getItem("bizflow_suppliers");
    if (savedSupps) {
        setSuppliers(JSON.parse(savedSupps));
    } else {
        setSuppliers(INITIAL_SUPPLIERS);
    }
  }, []);

  // --- 2. LƯU DỮ LIỆU (CHỈ LƯU KHI CÓ DỮ LIỆU ĐỂ TRÁNH LỖI MẤT HẾT) ---
  useEffect(() => {
    if (products.length > 0) {
        localStorage.setItem("bizflow_products", JSON.stringify(products));
    }
  }, [products]);

  useEffect(() => {
    if (suppliers.length > 0) {
        localStorage.setItem("bizflow_suppliers", JSON.stringify(suppliers));
    }
  }, [suppliers]);

  // --- 3. CÁC CHỨC NĂNG ---

  // NÚT CỨU HỘ: KHÔI PHỤC DỮ LIỆU GỐC
  const handleResetData = () => {
    if (confirm("Bạn có chắc muốn khôi phục lại dữ liệu mẫu ban đầu? Dữ liệu hiện tại sẽ bị mất.")) {
        setProducts(INITIAL_PRODUCTS);
        setSuppliers(INITIAL_SUPPLIERS);
        localStorage.setItem("bizflow_products", JSON.stringify(INITIAL_PRODUCTS));
        localStorage.setItem("bizflow_suppliers", JSON.stringify(INITIAL_SUPPLIERS));
        // Xóa luôn lịch sử đơn hàng bên Dashboard để đồng bộ lại từ đầu
        localStorage.removeItem("bizflow_orders");
        alert("Đã khôi phục dữ liệu thành công! Hãy tải lại trang.");
        window.location.reload();
    }
  };

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

  const handleDeleteProduct = (id) => {
    if (confirm("Xóa sản phẩm này?")) {
        const newProducts = products.filter(p => p.id !== id);
        setProducts(newProducts);
        // Nếu xóa hết sạch thì phải lưu mảng rỗng
        if (newProducts.length === 0) localStorage.setItem("bizflow_products", "[]");
    }
  };

  const handleDeleteSupplier = (id) => {
    if (confirm("Xóa nhà cung cấp này?")) setSuppliers(suppliers.filter(s => s.id !== id));
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredSuppliers = suppliers.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
  
  const totalStockValue = products.reduce((acc, p) => acc + (p.stock * p.cost), 0);

  return (
    <div className="space-y-6 p-4 pb-10 font-sans bg-slate-50 min-h-screen">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Package className="text-blue-600"/> Quản lý Kho
          </h2>
          <p className="text-slate-500 text-sm">Quản lý nhập xuất tồn và đối tác cung ứng</p>
        </div>
        
        <div className="flex items-center gap-2">
            {/* Nút Khôi phục dữ liệu (CỨU TINH) */}
            <Button 
                variant="outline" 
                onClick={handleResetData}
                className="text-red-600 border-red-200 hover:bg-red-50"
                title="Bấm vào đây nếu bị mất dữ liệu"
            >
                <RotateCcw size={16} className="mr-2"/> Reset Dữ liệu
            </Button>

            <div className="flex bg-slate-100 p-1 rounded-lg">
            <button 
                onClick={() => setActiveTab("products")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "products" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
                Kho hàng
            </button>
            <button 
                onClick={() => setActiveTab("suppliers")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "suppliers" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
                Nhà cung cấp
            </button>
            </div>
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
            <Card className="border-l-4 border-l-orange-500 shadow-sm">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-500">Cần nhập thêm</CardTitle></CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{products.filter(p => p.stock < 10).length}</div>
                <p className="text-xs text-slate-400">Sản phẩm sắp hết hàng</p>
              </CardContent>
            </Card>
          </div>

          {/* Search & Actions */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
              <Input 
                placeholder="Tìm kiếm sản phẩm..." 
                className="pl-10 bg-white" 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200">
                <Plus size={18} className="mr-2"/> Thêm mới
            </Button>
          </div>

          {/* Table Products */}
          <Card className="shadow-sm border border-slate-200 overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="w-[80px]">Mã</TableHead>
                  <TableHead>Tên sản phẩm</TableHead>
                  <TableHead className="text-center">Tồn kho</TableHead>
                  <TableHead className="text-right">Giá vốn</TableHead>
                  <TableHead className="text-right">Giá bán</TableHead>
                  <TableHead className="text-center">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((p) => (
                    <TableRow key={p.id} className="hover:bg-slate-50">
                        <TableCell className="font-mono text-xs text-slate-500">#{p.id}</TableCell>
                        <TableCell>
                        <div className="font-medium flex items-center gap-3">
                            <span className="text-xl">{p.image || "📦"}</span> 
                            <span>{p.name}</span>
                        </div>
                        <div className="text-xs text-slate-400 pl-8">{p.category} • ĐVT: {p.unit}</div>
                        </TableCell>
                        <TableCell className="text-center">
                        {p.stock < 10 ? (
                            <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold animate-pulse">
                                {p.stock}
                            </span>
                        ) : (
                            <span className="font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded text-xs">
                                {p.stock}
                            </span>
                        )}
                        </TableCell>
                        <TableCell className="text-right text-slate-500">{formatMoney(p.cost)}</TableCell>
                        <TableCell className="text-right font-bold text-blue-700">{formatMoney(p.price)}</TableCell>
                        <TableCell className="text-center">
                        <div className="flex justify-center gap-2">
                            <Button 
                            variant="outline" size="sm" 
                            className="h-8 text-green-600 border-green-200 hover:bg-green-50"
                            title="Nhập thêm hàng"
                            onClick={() => handleImportStock(p.id, p.stock, p.name)}
                            >
                            <ArrowDownCircle size={14} className="mr-1" /> Nhập
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-400 hover:bg-red-50 hover:text-red-600" onClick={() => handleDeleteProduct(p.id)}>
                            <Trash2 size={16} />
                            </Button>
                        </div>
                        </TableCell>
                    </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={6} className="text-center py-10 text-slate-400">
                            Không tìm thấy sản phẩm nào.
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </div>
      )}

      {/* --- NỘI DUNG TAB NHÀ CUNG CẤP (GIỮ NGUYÊN UI) --- */}
      {activeTab === "suppliers" && (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-700">Danh sách đối tác</h3>
            <Button onClick={handleAddSupplier} className="bg-indigo-600 hover:bg-indigo-700"><Users size={18} className="mr-2"/> Thêm Nhà Cung Cấp</Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredSuppliers.map((s) => (
              <Card key={s.id} className="hover:shadow-md transition-shadow border-l-4 border-l-indigo-500 bg-white">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base font-bold text-slate-800">{s.name}</CardTitle>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-red-500" onClick={() => handleDeleteSupplier(s.id)}><Trash2 size={14}/></Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-slate-600"><Users size={14}/> <span>LH: {s.contact}</span></div>
                  <div className="flex items-center gap-2 text-slate-600"><Phone size={14}/> <span>{s.phone}</span></div>
                  <div className="flex items-center gap-2 text-slate-600"><MapPin size={14}/> <span className="truncate">{s.address}</span></div>
                  
                  <div className="pt-3 border-t flex justify-between items-center">
                    <span className="text-xs text-slate-500">Nợ phải trả:</span>
                    <span className="font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">{formatMoney(s.debt || 0)}</span>
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