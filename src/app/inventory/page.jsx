"use client"

import { useEffect, useState, useMemo } from "react";
import { api_service } from "@/lib/api_service";
import { 
  Plus, Search, Pencil, Trash2, 
  Package, AlertTriangle, X, Save, Loader2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";

export default function InventoryPage() {
  // --- STATE ---
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // Dữ liệu danh mục
  const [units, setUnits] = useState([]);           // Dữ liệu đơn vị tính
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // State cho Modal (Form Thêm/Sửa)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null = Thêm mới, object = Đang sửa
  
  // Form Data
  const [formData, setFormData] = useState({
    product_name: "",
    sku: "",
    category_id: "",
    unit_id: "",
    cost_price: 0,
    selling_price: 0,
    stock_quantity: 0
  });

  // --- FETCH DATA ---
  const fetchData = async () => {
    try {
      setLoading(true);
      const [pData, cData, uData] = await Promise.all([
        api_service.get_products(),
        api_service.get_categories().catch(() => []), // Tránh lỗi nếu chưa có API category
        api_service.get_units().catch(() => [])       // Tránh lỗi nếu chưa có API unit
      ]);
      setProducts(pData || []);
      setCategories(cData || []);
      setUnits(uData || []);
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- HANDLERS ---

  // 1. Mở Modal Thêm mới
  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormData({
      product_name: "", sku: "", category_id: "", unit_id: "",
      cost_price: 0, selling_price: 0, stock_quantity: 0
    });
    setIsModalOpen(true);
  };

  // 2. Mở Modal Sửa
  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      product_name: product.product_name,
      sku: product.sku || "",
      category_id: product.category_id || "",
      unit_id: product.unit_id || "",
      cost_price: Number(product.cost_price),
      selling_price: Number(product.selling_price),
      stock_quantity: product.stock_quantity || 0
    });
    setIsModalOpen(true);
  };

  // 3. Lưu (Tạo mới hoặc Update)
  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // Convert dữ liệu số cho đúng format Backend
      const payload = {
        ...formData,
        category_id: formData.category_id ? parseInt(formData.category_id) : null,
        unit_id: formData.unit_id ? parseInt(formData.unit_id) : null,
        cost_price: parseFloat(formData.cost_price),
        selling_price: parseFloat(formData.selling_price),
        stock_quantity: parseInt(formData.stock_quantity),
        owner_id: 1 // TODO: Backend nên tự lấy từ Token, tạm thời hardcode nếu cần
      };

      if (editingProduct) {
        await api_service.update_product(editingProduct.product_id, payload);
      } else {
        await api_service.create_product(payload);
      }
      
      setIsModalOpen(false);
      fetchData(); // Tải lại bảng
    } catch (error) {
      alert("Lỗi khi lưu: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  // 4. Xóa sản phẩm
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) return;
    try {
      await api_service.delete_product(id);
      fetchData(); // Tải lại bảng sau khi xóa
    } catch (error) {
      alert("Không thể xóa: " + error.message);
    }
  };

  // --- RENDER HELPERS ---
  const filteredProducts = products.filter(p => 
    (p.product_name || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.sku || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper lấy tên Danh mục từ ID
  const getCategoryName = (id) => {
    const cat = categories.find(c => c.category_id === id);
    return cat ? cat.category_name : "Chưa phân loại";
  };

  return (
    <div className="space-y-6 p-6 bg-slate-50 min-h-screen relative">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Kho Hàng</h2>
          <p className="text-slate-500 mt-1">Quản lý nhập xuất tồn và giá cả.</p>
        </div>
        <Button onClick={handleOpenCreate} className="bg-blue-600 hover:bg-blue-700 shadow-md">
          <Plus size={18} className="mr-2" />
          Thêm sản phẩm
        </Button>
      </div>

      {/* SEARCH */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input 
              placeholder="Tìm kiếm..." 
              className="pl-10" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* TABLE */}
      <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="pl-6">Sản phẩm / SKU</TableHead>
              <TableHead>Danh mục</TableHead>
              <TableHead className="text-center">Tồn kho</TableHead>
              <TableHead className="text-right">Giá bán</TableHead>
              <TableHead className="text-center">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
               <TableRow><TableCell colSpan={5} className="text-center py-8">Đang tải dữ liệu...</TableCell></TableRow>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((p) => (
                <TableRow key={p.product_id} className="group hover:bg-blue-50/50">
                  <TableCell className="pl-6 font-medium">
                    <div className="flex flex-col">
                      <span className="text-slate-900">{p.product_name}</span>
                      <span className="text-xs text-slate-400 font-mono">{p.sku || "NO-SKU"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs">
                      {getCategoryName(p.category_id)}
                    </span>
                  </TableCell>
                  <TableCell className="text-center font-bold text-slate-700">
                    {p.stock_quantity}
                  </TableCell>
                  <TableCell className="text-right font-semibold text-blue-600">
                    {Number(p.selling_price).toLocaleString()}đ
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(p)} className="text-slate-500 hover:text-blue-600">
                        <Pencil size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(p.product_id)} className="text-slate-500 hover:text-red-600">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-slate-500">Không tìm thấy sản phẩm</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* --- MODAL (POPUP) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800">
                {editingProduct ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Tên sản phẩm <span className="text-red-500">*</span></label>
                <Input 
                  required 
                  value={formData.product_name}
                  onChange={e => setFormData({...formData, product_name: e.target.value})}
                  placeholder="Nhập tên sản phẩm..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Mã SKU</label>
                  <Input 
                    value={formData.sku}
                    onChange={e => setFormData({...formData, sku: e.target.value})}
                    placeholder="VD: SP001"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Tồn kho</label>
                  <Input 
                    type="number"
                    value={formData.stock_quantity}
                    onChange={e => setFormData({...formData, stock_quantity: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Giá vốn</label>
                  <Input 
                    type="number"
                    value={formData.cost_price}
                    onChange={e => setFormData({...formData, cost_price: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Giá bán <span className="text-red-500">*</span></label>
                  <Input 
                    required type="number"
                    value={formData.selling_price}
                    onChange={e => setFormData({...formData, selling_price: e.target.value})}
                    className="font-bold text-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Danh mục</label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={formData.category_id}
                    onChange={e => setFormData({...formData, category_id: e.target.value})}
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map(c => (
                      <option key={c.category_id} value={c.category_id}>{c.category_name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Đơn vị</label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={formData.unit_id}
                    onChange={e => setFormData({...formData, unit_id: e.target.value})}
                  >
                    <option value="">-- Chọn đơn vị --</option>
                    {units.map(u => (
                      <option key={u.unit_id} value={u.unit_id}>{u.unit_name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Hủy bỏ
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 min-w-[100px]" disabled={isSaving}>
                  {isSaving ? <Loader2 className="animate-spin" /> : <><Save size={16} className="mr-2"/> Lưu</>}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}