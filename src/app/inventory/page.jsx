"use client"

import { useEffect, useState } from "react";
import { api_service } from "@/lib/api_service";
import { 
  Plus, Search, Pencil, Trash2, 
  Package, X, Save, Loader2, AlertCircle, Box
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";

export default function InventoryPage() {
  // --- STATE QUẢN LÝ DỮ LIỆU ---
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // --- STATE QUẢN LÝ MODAL (POPUP) ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form Data (Khởi tạo giá trị mặc định)
  const [formData, setFormData] = useState({
    product_name: "",
    sku: "",
    category_id: "",
    unit_id: "",
    cost_price: 0,
    selling_price: 0,
    stock_quantity: 0
  });

  // --- 1. TẢI DỮ LIỆU TỪ SERVER ---
  const fetchData = async () => {
    try {
      // Gọi song song 3 API để tiết kiệm thời gian
      const [pData, cData, uData] = await Promise.all([
        api_service.get_products().catch(err => {
            console.error("Lỗi tải SP:", err);
            return [];
        }),
        api_service.get_categories(),
        api_service.get_units()
      ]);
      
      setProducts(pData || []);
      setCategories(cData || []);
      setUnits(uData || []);
    } catch (error) {
      console.error("Lỗi hệ thống:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- 2. XỬ LÝ FORM (MỞ/ĐÓNG/LƯU) ---
  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormData({
      product_name: "", sku: "", category_id: "", unit_id: "",
      cost_price: 0, selling_price: 0, stock_quantity: 0
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setEditingProduct(p);
    // Fill dữ liệu cũ vào form
    setFormData({
      product_name: p.product_name,
      sku: p.sku || "",
      category_id: p.category_id || "",
      unit_id: p.unit_id || "",
      cost_price: Number(p.cost_price),
      selling_price: Number(p.selling_price),
      stock_quantity: p.stock_quantity || 0
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault(); // Chặn reload trang
    setIsSaving(true);
    
    try {
      // Chuẩn bị dữ liệu gửi lên Server
      const payload = {
        ...formData,
        // Convert string sang number cho đúng chuẩn DB
        category_id: formData.category_id ? parseInt(formData.category_id) : null,
        unit_id: formData.unit_id ? parseInt(formData.unit_id) : null,
        cost_price: parseFloat(formData.cost_price),
        selling_price: parseFloat(formData.selling_price),
        stock_quantity: parseInt(formData.stock_quantity),
        
        // QUAN TRỌNG: Backend yêu cầu owner_id (không null). 
        // Vì ta chỉ sửa FE, ta hardcode tạm là 1 để API không bị lỗi.
        owner_id: 1 
      };

      if (editingProduct) {
        await api_service.update_product(editingProduct.product_id, payload);
      } else {
        await api_service.create_product(payload);
      }
      
      // Thành công thì tắt modal và tải lại bảng
      setIsModalOpen(false);
      fetchData(); 
      
    } catch (error) {
      alert("Lỗi khi lưu: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa sản phẩm này? Hành động này không thể hoàn tác.")) return;
    try {
      await api_service.delete_product(id);
      fetchData();
    } catch (error) {
      alert("Không thể xóa: " + error.message);
    }
  };

  // --- 3. HELPERS HIỂN THỊ ---
  // Tìm kiếm sản phẩm
  const filteredProducts = products.filter(p => 
    (p.product_name || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.sku || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Lấy tên danh mục từ ID
  const getCategoryName = (id) => {
    if (!id) return "Chưa phân loại";
    const cat = categories.find(c => c.category_id === id);
    return cat ? cat.category_name : `Mục ${id}`;
  };

  return (
    <div className="space-y-6 p-6 bg-slate-50 min-h-screen">
      {/* HEADER & BUTTON THÊM */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Kho Hàng</h2>
          <p className="text-slate-500 mt-1">Quản lý danh mục sản phẩm và tồn kho.</p>
        </div>
        <Button onClick={handleOpenCreate} className="bg-blue-600 hover:bg-blue-700 shadow-md transition-all active:scale-95">
          <Plus size={18} className="mr-2" /> Thêm mới
        </Button>
      </div>

      {/* THANH TÌM KIẾM */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input 
              placeholder="Tìm tên sản phẩm, mã SKU..." 
              className="pl-10 h-11 focus-visible:ring-blue-500" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* BẢNG DỮ LIỆU */}
      <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
        <Table>
          <TableHeader className="bg-slate-50/80">
            <TableRow>
              <TableHead className="w-[300px] pl-6">Sản phẩm</TableHead>
              <TableHead>Danh mục</TableHead>
              <TableHead className="text-center">Tồn kho</TableHead>
              <TableHead className="text-right">Giá bán</TableHead>
              <TableHead className="text-center w-[100px]">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="h-32 text-center text-slate-500">Đang tải dữ liệu...</TableCell></TableRow>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((p) => (
                <TableRow key={p.product_id} className="group hover:bg-blue-50/30 transition-colors">
                  <TableCell className="pl-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900">{p.product_name}</span>
                      <span className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        <Box size={12} /> SKU: {p.sku || "N/A"}
                      </span>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-full text-xs font-medium">
                      {getCategoryName(p.category_id)}
                    </span>
                  </TableCell>
                  
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center">
                      <span className={`font-bold ${p.stock_quantity < 10 ? 'text-red-600' : 'text-slate-700'}`}>
                        {p.stock_quantity}
                      </span>
                      {p.stock_quantity < 10 && (
                        <span className="text-[10px] text-red-500 flex items-center gap-0.5">
                          <AlertCircle size={10} /> Sắp hết
                        </span>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-right">
                    <div className="font-bold text-slate-900">
                      {Number(p.selling_price).toLocaleString('vi-VN')} ₫
                    </div>
                    {Number(p.cost_price) > 0 && (
                      <div className="text-xs text-slate-400">
                        Vốn: {Number(p.cost_price).toLocaleString('vi-VN')}
                      </div>
                    )}
                  </TableCell>
                  
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(p)} className="h-8 w-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50">
                        <Pencil size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(p.product_id)} className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-500 gap-2">
                    <Package size={32} className="text-slate-300" />
                    <p>Không tìm thấy sản phẩm nào</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* --- MODAL FORM --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-800">
                {editingProduct ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 rounded-full p-1 hover:bg-slate-100 transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Tên sản phẩm <span className="text-red-500">*</span></label>
                <Input 
                  required 
                  value={formData.product_name}
                  onChange={e => setFormData({...formData, product_name: e.target.value})}
                  placeholder="VD: Xi măng Hà Tiên"
                  className="focus-visible:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-600">Mã SKU</label>
                  <Input 
                    value={formData.sku}
                    onChange={e => setFormData({...formData, sku: e.target.value})}
                    placeholder="VD: SP001"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-600">Số lượng tồn</label>
                  <Input 
                    type="number" min="0"
                    value={formData.stock_quantity}
                    onChange={e => setFormData({...formData, stock_quantity: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-600">Giá vốn</label>
                  <Input 
                    type="number" min="0"
                    value={formData.cost_price}
                    onChange={e => setFormData({...formData, cost_price: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-600">Giá bán <span className="text-red-500">*</span></label>
                  <Input 
                    required type="number" min="0"
                    value={formData.selling_price}
                    onChange={e => setFormData({...formData, selling_price: e.target.value})}
                    className="font-bold text-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-600">Danh mục</label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    value={formData.category_id}
                    onChange={e => setFormData({...formData, category_id: e.target.value})}
                  >
                    <option value="">-- Chọn --</option>
                    {categories.length > 0 ? (
                      categories.map(c => (
                        <option key={c.category_id} value={c.category_id}>{c.category_name}</option>
                      ))
                    ) : (
                      <option disabled>Không có danh mục</option>
                    )}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-600">Đơn vị tính</label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    value={formData.unit_id}
                    onChange={e => setFormData({...formData, unit_id: e.target.value})}
                  >
                    <option value="">-- Chọn --</option>
                    {units.length > 0 ? (
                      units.map(u => (
                        <option key={u.unit_id} value={u.unit_id}>{u.unit_name}</option>
                      ))
                    ) : (
                       <option disabled>Không có ĐVT</option>
                    )}
                  </select>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="pt-4 flex justify-end gap-3 border-t border-slate-50 mt-2">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Hủy bỏ
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 min-w-[120px]" disabled={isSaving}>
                  {isSaving ? <Loader2 className="animate-spin" /> : <><Save size={16} className="mr-2"/> Lưu lại</>}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}