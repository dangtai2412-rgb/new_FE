"use client";
import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  Wallet, 
  CreditCard, 
  Box, 
  ArrowUpRight,
  MoreHorizontal,
  User,
  Calendar
} from 'lucide-react';

// --- HELPER FUNCTIONS ---
const formatMoney = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

// Dữ liệu mẫu Fallback
const INITIAL_PRODUCTS = [
  { id: 1, name: "Máy bơm nước Panasonic", price: 3200000, cost: 2800000, stock: 15 },
  { id: 2, name: "Đá Marble Carrara", price: 4200000, cost: 3500000, stock: 43 },
  { id: 3, name: "Xi măng Hà Tiên", price: 92000, cost: 80000, stock: 120 },
  { id: 4, name: "Ống nhựa Bình Minh", price: 85000, cost: 60000, stock: 28 },
  { id: 5, name: "Sơn Dulux Trong Nhà", price: 1150000, cost: 950000, stock: 5 }, 
];
const INITIAL_SUPPLIERS = [
  { id: 1, name: "NCC A", debt: 15000000 },
  { id: 2, name: "NCC B", debt: 5000000 },
];

// --- COMPONENTS ---

const StatCard = ({ title, value, subValue, trend, trendValue, icon: Icon, colorClass, delay }) => (
  <div className={`bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up`} style={{ animationDelay: `${delay}ms` }}>
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${colorClass} bg-opacity-10`}>
        <Icon size={24} className={colorClass.replace('bg-', 'text-')} />
      </div>
      {trend && (
        <div className={`flex items-center space-x-1 text-xs font-semibold px-2 py-1 rounded-full ${trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          {trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          <span>{trendValue}</span>
        </div>
      )}
    </div>
    <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
    <div className="text-2xl font-bold text-slate-800 mb-1">{value}</div>
    <div className="text-xs text-slate-400">{subValue}</div>
  </div>
);

const TopProductItem = ({ rank, name, price, soldQty, trend }) => (
  <div className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-colors border-b border-slate-50 last:border-0">
    <div className="flex items-center space-x-4">
      <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm shadow-sm ${
        rank === 1 ? 'bg-yellow-100 text-yellow-700 ring-2 ring-yellow-200' : 
        rank === 2 ? 'bg-slate-200 text-slate-600' : 
        rank === 3 ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-500'
      }`}>
        #{rank}
      </div>
      <div>
        <h4 className="font-semibold text-slate-800 text-sm truncate max-w-[150px]" title={name}>{name}</h4>
        <p className="text-slate-500 text-xs">{price}</p>
      </div>
    </div>
    <div className="text-right">
      <div className="text-sm font-bold text-slate-700">{soldQty}</div>
      <div className={`text-xs flex items-center justify-end space-x-1 ${trend === 'up' ? 'text-emerald-500' : 'text-slate-400'}`}>
        {trend === 'up' && <ArrowUpRight size={12} />}
        <span>{trend === 'up' ? 'Tăng' : 'Ổn định'}</span>
      </div>
    </div>
  </div>
);

const SimpleBarChart = ({ data }) => {
  if (!data || data.length === 0) return <div className="h-64 flex items-center justify-center text-slate-400">Đang tải dữ liệu...</div>;

  const maxRevenue = Math.max(...data.map(d => d.revenue), 1000000); 
  const yAxisLabels = [1, 0.75, 0.5, 0.25, 0].map(ratio => Math.round(maxRevenue * ratio));

  const gradients = [
    'from-blue-500 to-blue-300 shadow-blue-200',
    'from-emerald-500 to-emerald-300 shadow-emerald-200',
    'from-amber-500 to-amber-300 shadow-amber-200',
    'from-rose-500 to-rose-300 shadow-rose-200',
    'from-purple-500 to-purple-300 shadow-purple-200',
    'from-cyan-500 to-cyan-300 shadow-cyan-200',
    'from-indigo-500 to-indigo-300 shadow-indigo-200'
  ];

  return (
    <div className="relative h-80 w-full pt-6 pb-2">
      <div className="absolute inset-0 flex flex-col justify-between text-xs text-slate-300 pointer-events-none pb-16 pl-1">
        {yAxisLabels.map((val, i) => (
          <div key={i} className="flex items-center w-full">
             <span className="w-12 text-right mr-3 font-medium text-slate-400 whitespace-nowrap">
               {(val / 1000000).toFixed(1)}tr
             </span>
             <div className={`flex-1 h-px ${val === 0 ? 'bg-slate-300' : 'bg-slate-50 border-t border-dashed border-slate-200'}`}></div>
          </div>
        ))}
      </div>

      <div className="absolute inset-0 flex items-end justify-between pl-16 pr-2 pb-16">
        {data.map((item, i) => {
          const heightPercent = (item.revenue / maxRevenue) * 100;
          return (
            <div key={i} className="flex flex-col items-center flex-1 group h-full justify-end z-10 relative px-1">
              <div className="relative w-full flex justify-center items-end h-full">
                <div className="absolute bottom-full mb-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 bg-slate-800 text-white text-xs font-semibold rounded-lg py-1.5 px-3 shadow-xl whitespace-nowrap z-20 pointer-events-none">
                  {formatMoney(item.revenue)}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
                </div>
                
                <div 
                  className={`w-full max-w-[40px] rounded-t-lg sm:rounded-t-xl transition-all duration-700 ease-out 
                  group-hover:scale-[1.05] group-hover:-translate-y-1 
                  shadow-[0_4px_10px_-2px_rgba(0,0,0,0.1)] group-hover:shadow-[0_0_20px_-5px_rgba(0,0,0,0.3)]
                  bg-gradient-to-t ${gradients[i % gradients.length]} opacity-90 group-hover:opacity-100`} 
                  style={{ height: `${heightPercent}%` }}
                ></div>
              </div>
              
              <div className="absolute -bottom-14 flex flex-col items-center transition-transform duration-300 group-hover:-translate-y-1 w-full">
                <span className="text-xs text-slate-500 font-medium mb-1 group-hover:text-blue-600 transition-colors truncate w-full text-center">
                  {item.day}
                </span>
                <div className="px-2 py-0.5 rounded-full bg-slate-50 border border-slate-100 group-hover:border-blue-100 group-hover:bg-blue-50 transition-colors hidden sm:block">
                  <span className="text-[10px] font-bold text-slate-600 group-hover:text-blue-600">
                    {(item.revenue / 1000000).toFixed(1)}tr
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- MAIN CONTENT COMPONENT ---

export default function DashboardContent() {
  const [role, setRole] = useState("owner"); 
  const [userName, setUserName] = useState("Bạn");

  const [stats, setStats] = useState({
    totalStockValue: 0,
    potentialRevenue: 0,
    supplierDebt: 0,
    lowStockCount: 0,
    weeklyRevenue: [], 
    topProducts: []
  });

  useEffect(() => {
    const loadRealData = () => {
      try {
        const storedRole = typeof localStorage !== 'undefined' ? localStorage.getItem("role") : null;
        const storedName = typeof localStorage !== 'undefined' ? localStorage.getItem("user_name") : null;
        
        if (storedRole) setRole(storedRole.toLowerCase());
        if (storedName) setUserName(storedName);

        const localProducts = typeof localStorage !== 'undefined' ? localStorage.getItem("bizflow_products") : null;
        let products = localProducts ? JSON.parse(localProducts) : [];
        if (products.length === 0) products = INITIAL_PRODUCTS;

        const localSuppliers = typeof localStorage !== 'undefined' ? localStorage.getItem("bizflow_suppliers") : null;
        let suppliers = localSuppliers ? JSON.parse(localSuppliers) : [];
        if (suppliers.length === 0) suppliers = INITIAL_SUPPLIERS; 

        const stockValue = products.reduce((acc, p) => acc + ((Number(p.cost) || 0) * (Number(p.stock) || 0)), 0);
        const revenuePotential = products.reduce((acc, p) => acc + ((Number(p.price) || 0) * (Number(p.stock) || 0)), 0);
        const debt = suppliers.reduce((acc, s) => acc + (Number(s.debt) || 0), 0);
        const lowStock = products.filter(p => (Number(p.stock) || 0) < 10).length;

        const days = ['Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7', 'CN'];
        const fakeWeeklyRevenue = days.map((day) => ({
            day,
            revenue: Math.floor(Math.random() * 5000000) + 2000000, 
        }));

        const shuffled = [...products].sort(() => 0.5 - Math.random());
        const fakeTopProducts = shuffled.slice(0, 5).map(p => ({
            ...p,
            sold_qty: Math.floor(Math.random() * 50) + 10,
            trend: Math.random() > 0.5 ? 'up' : 'down'
        })).sort((a, b) => b.sold_qty - a.sold_qty);

        setStats({
          totalStockValue: stockValue,
          potentialRevenue: revenuePotential,
          supplierDebt: debt,
          lowStockCount: lowStock,
          weeklyRevenue: fakeWeeklyRevenue,
          topProducts: fakeTopProducts
        });

      } catch (error) {
        console.error("Lỗi đọc dữ liệu Dashboard:", error);
      }
    };

    loadRealData();
    window.addEventListener('storage', loadRealData);
    return () => window.removeEventListener('storage', loadRealData);
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Page Header (Tích hợp vào nội dung để không bị trùng Layout) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Tổng quan kinh doanh</h2>
          <p className="text-slate-500 mt-1">Xin chào, {userName}! Báo cáo hoạt động hôm nay.</p>
        </div>
      </div>

      {/* --- CONTENT --- */}
      {role === 'owner' ? (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              title="Vốn Tồn Kho" 
              value={formatMoney(stats.totalStockValue)} 
              subValue={`${stats.topProducts.length + 5} mã sản phẩm`} 
              icon={Box} 
              colorClass="bg-blue-500 text-blue-600"
              delay={0}
            />
            <StatCard 
              title="Doanh Thu Dự Kiến" 
              value={formatMoney(stats.potentialRevenue)} 
              subValue="Tổng giá bán hàng tồn"
              trend="up"
              trendValue="12.5%"
              icon={Wallet} 
              colorClass="bg-emerald-500 text-emerald-600"
              delay={100}
            />
            <StatCard 
              title="Nợ Phải Trả" 
              value={formatMoney(stats.supplierDebt)} 
              subValue="Công nợ nhà cung cấp" 
              trend="down"
              trendValue="2.1%"
              icon={CreditCard} 
              colorClass="bg-orange-500 text-orange-600"
              delay={200}
            />
            <StatCard 
              title="Sắp Hết Hàng" 
              value={stats.lowStockCount} 
              subValue={`Sản phẩm dưới định mức`} 
              icon={AlertCircle} 
              colorClass="bg-rose-500 text-rose-600"
              delay={300}
            />
          </div>

          {/* Charts & Lists Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Chart */}
            <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-500"/>
                    Biểu đồ doanh thu 7 ngày
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">Số liệu cập nhật theo thời gian thực</p>
                </div>
                <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400">
                  <MoreHorizontal size={20} />
                </button>
              </div>
              <SimpleBarChart data={stats.weeklyRevenue} />
            </div>

            {/* Top Products */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <span>🏆</span> Top Bán Chạy
                </h3>
                <a href="#" className="text-xs font-semibold text-blue-600 hover:text-blue-700">Xem tất cả</a>
              </div>
              <div className="space-y-1 overflow-y-auto custom-scrollbar flex-1">
                {stats.topProducts.map((product, index) => (
                  <TopProductItem 
                    key={index}
                    rank={index + 1} 
                    name={product.name} 
                    price={formatMoney(product.price)} 
                    soldQty={product.sold_qty}
                    trend={product.trend} 
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        // --- VIEW CHO NHÂN VIÊN (EMPLOYEE) ---
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                <User size={48} className="text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Xin chào, {userName}!</h2>
            <p className="text-slate-500 max-w-md mb-8">
              Chúc bạn một ngày làm việc hiệu quả. Hãy sử dụng menu bên trái để truy cập màn hình Bán hàng (POS).
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg px-4">
               <div className="p-6 bg-slate-50 border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-all">
                  <h4 className="text-slate-500 text-sm font-medium mb-2">Ca làm việc</h4>
                  <p className="text-2xl font-bold text-slate-800">08:00 - 17:00</p>
               </div>
               <div className="p-6 bg-green-50 border border-green-100 rounded-xl shadow-sm hover:shadow-md transition-all">
                  <h4 className="text-green-600 text-sm font-medium mb-2">Doanh số hôm nay</h4>
                  <p className="text-2xl font-bold text-green-700">4.500.000 ₫</p>
               </div>
            </div>
        </div>
      )}
    </div>
  );
}