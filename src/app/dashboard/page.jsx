"use client";
import { useEffect, useState } from "react";
import { 
  DollarSign, Users, Package, TrendingUp, 
  Activity, AlertCircle, Truck, Wallet
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Hàm format tiền tệ
const formatMoney = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

export default function DashboardPage() {
  const [role, setRole] = useState("employee");
  const [userName, setUserName] = useState("User");

  // State lưu trữ thống kê thực tế từ LocalStorage
  const [stats, setStats] = useState({
    totalStockValue: 0,       // Tổng vốn tồn kho (stock * cost)
    potentialRevenue: 0,      // Doanh thu dự kiến nếu bán hết (stock * price)
    supplierDebt: 0,          // Tổng nợ nhà cung cấp
    lowStockCount: 0,         // Số sản phẩm sắp hết (<10)
    totalProducts: 0,         // Tổng số sản phẩm
    totalQuantity: 0          // Tổng số lượng hàng hóa
  });

  useEffect(() => {
    // 1. Lấy thông tin User
    const storedRole = localStorage.getItem("role") || "employee";
    const storedName = localStorage.getItem("user_name") || "Bạn";
    setRole(storedRole.toLowerCase());
    setUserName(storedName);

    // 2. LOGIC QUAN TRỌNG: Đọc dữ liệu từ file inventory và pos đã lưu
    const loadRealData = () => {
      try {
        // Lấy dữ liệu từ key "bizflow_products" (Inventory & POS dùng chung)
        const localProducts = localStorage.getItem("bizflow_products");
        const products = localProducts ? JSON.parse(localProducts) : [];

        // Lấy dữ liệu từ key "bizflow_suppliers" (Inventory dùng)
        const localSuppliers = localStorage.getItem("bizflow_suppliers");
        const suppliers = localSuppliers ? JSON.parse(localSuppliers) : [];

        // --- TÍNH TOÁN ---
        
        // 1. Tổng giá trị vốn (Dùng cost từ Inventory)
        const stockValue = products.reduce((acc, p) => acc + ((Number(p.cost) || 0) * (Number(p.stock) || 0)), 0);

        // 2. Doanh thu tiềm năng (Dùng price từ POS/Inventory)
        const revenuePotential = products.reduce((acc, p) => acc + ((Number(p.price) || 0) * (Number(p.stock) || 0)), 0);

        // 3. Tổng nợ NCC
        const debt = suppliers.reduce((acc, s) => acc + (Number(s.debt) || 0), 0);

        // 4. Các chỉ số đếm
        const lowStock = products.filter(p => (Number(p.stock) || 0) < 10).length;
        const totalQty = products.reduce((acc, p) => acc + (Number(p.stock) || 0), 0);

        setStats({
          totalStockValue: stockValue,
          potentialRevenue: revenuePotential,
          supplierDebt: debt,
          lowStockCount: lowStock,
          totalProducts: products.length,
          totalQuantity: totalQty
        });

      } catch (error) {
        console.error("Lỗi đọc dữ liệu Dashboard:", error);
      }
    };

    loadRealData();
    // Lắng nghe sự thay đổi nếu mở 2 tab
    window.addEventListener('storage', loadRealData);
    return () => window.removeEventListener('storage', loadRealData);

  }, []);

  return (
    <div className="space-y-6 p-4">
      {/* Header Chào mừng */}
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Tổng quan</h2>
          <p className="text-slate-500">Xin chào, {userName}! Dữ liệu được đồng bộ từ Kho & POS.</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-bold uppercase border ${
          role === 'admin' ? 'bg-purple-100 text-purple-700 border-purple-200' : 
          role === 'owner' ? 'bg-blue-100 text-blue-700 border-blue-200' : 
          'bg-green-100 text-green-700 border-green-200'
        }`}>
          {role === 'admin' ? 'Quản trị viên' : role === 'owner' ? 'Chủ cửa hàng' : 'Nhân viên'}
        </span>
      </div>

      {/* --- DASHBOARD CHO CHỦ SHOP (OWNER) - DÙNG DỮ LIỆU THẬT --- */}
      {role === "owner" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Card 1: Tài sản kho (Vốn) */}
            <Card className="border-l-4 border-l-blue-600 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Vốn Tồn Kho</CardTitle>
                <Package className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">{formatMoney(stats.totalStockValue)}</div>
                <p className="text-xs text-slate-500 mt-1">Tổng giá trị nhập hàng hiện tại</p>
              </CardContent>
            </Card>

            {/* Card 2: Công nợ phải trả */}
            <Card className="border-l-4 border-l-red-500 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Nợ Nhà Cung Cấp</CardTitle>
                <Truck className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{formatMoney(stats.supplierDebt)}</div>
                <p className="text-xs text-slate-500 mt-1">Cần thanh toán cho đối tác</p>
              </CardContent>
            </Card>

            {/* Card 3: Lợi nhuận dự kiến (Giá bán - Giá vốn của hàng tồn) */}
            <Card className="border-l-4 border-l-green-600 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Lợi Nhuận Tiềm Năng</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-700">
                  {formatMoney(stats.potentialRevenue - stats.totalStockValue)}
                </div>
                <p className="text-xs text-slate-500 mt-1">Nếu bán hết kho hàng hiện tại</p>
              </CardContent>
            </Card>

            {/* Card 4: Cảnh báo nhập hàng */}
            <Card className="border-l-4 border-l-orange-500 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Cần Nhập Thêm</CardTitle>
                <AlertCircle className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-700">{stats.lowStockCount} <span className="text-sm font-normal text-slate-500">mã hàng</span></div>
                <p className="text-xs text-slate-500 mt-1">Đang dưới định mức tồn kho (10)</p>
              </CardContent>
            </Card>
          </div>

          {/* Biểu đồ nhanh & Thông tin thêm */}
          <div className="grid gap-4 md:grid-cols-2">
             <Card>
                <CardHeader><CardTitle className="text-base">Tình trạng kho hàng</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Tổng số lượng sản phẩm:</span>
                      <span className="font-bold">{stats.totalQuantity}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Số mã hàng (SKU):</span>
                      <span className="font-bold">{stats.totalProducts}</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden flex mt-2">
                      <div className="bg-blue-500 h-full" style={{ width: '70%' }} title="Hàng có sẵn"></div>
                      <div className="bg-orange-500 h-full" style={{ width: '30%' }} title="Sắp hết"></div>
                    </div>
                    <p className="text-xs text-slate-400 text-center">Tỷ lệ hàng hóa (Xanh: Ổn định | Cam: Sắp hết)</p>
                  </div>
                </CardContent>
             </Card>
             
             <Card className="bg-blue-600 text-white">
                <CardHeader><CardTitle className="text-white">Dòng tiền dự kiến</CardTitle></CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">{formatMoney(stats.potentialRevenue)}</div>
                  <p className="text-blue-100 text-sm">Đây là tổng số tiền thu về nếu bán hết toàn bộ hàng trong kho với giá hiện tại.</p>
                  <div className="mt-4 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                    <Wallet className="inline-block mr-2 w-4 h-4"/>
                    <span className="text-sm font-medium">Hãy đẩy mạnh bán hàng tồn kho!</span>
                  </div>
                </CardContent>
             </Card>
          </div>
        </div>
      )}

      {/* --- DASHBOARD CHO NHÂN VIÊN --- */}
      {role === "employee" && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Sản phẩm có thể bán</CardTitle></CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.totalProducts}</div>
              <p className="text-xs text-slate-500">Mã hàng đang kinh doanh</p>
            </CardContent>
          </Card>
          <Card>
             <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Cảnh báo tồn kho</CardTitle></CardHeader>
             <CardContent>
               <div className="text-2xl font-bold text-orange-600">{stats.lowStockCount}</div>
               <p className="text-xs text-slate-500">Mã hàng cần báo quản lý nhập thêm</p>
             </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Ca làm việc</CardTitle></CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">08:00 - 17:00</div>
              <p className="text-xs text-slate-500">Trạng thái: Đang hoạt động 🟢</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* --- DASHBOARD ADMIN (SAAS) - GIỮ NGUYÊN MOCKUP VÌ KHÔNG CÓ DATA --- */}
      {role === "admin" && (
        <div className="p-10 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
          <h3 className="text-lg font-medium text-slate-600">Khu vực Quản Trị Hệ Thống (SaaS)</h3>
          <p className="text-slate-500">Dữ liệu này được quản lý riêng biệt tại database tổng.</p>
        </div>
      )}
    </div>
  );
}