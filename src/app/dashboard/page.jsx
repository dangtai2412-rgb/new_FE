"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { 
  TrendingUp, TrendingDown, AlertCircle, Wallet, CreditCard, Box, 
  ArrowUpRight, MoreHorizontal, User, Calendar, FileText, Download, 
  RefreshCcw, X, CheckCircle2, ShoppingCart, Users, Server, 
  Activity, Globe, ShieldCheck, Clock, Target, LogOut, Terminal, 
  Cpu, Radio, BarChart3, Database, Lock, Zap
} from 'lucide-react';

// --- HELPER FUNCTIONS ---
const formatMoney = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
const formatNumber = (num) => new Intl.NumberFormat('vi-VN').format(num);

// --- MOCK DATA ---
const DATA_OWNER = {
  products: [
    { id: 1, name: "Máy bơm nước Panasonic", price: 3200000, stock: 15, sold: 120 },
    { id: 2, name: "Đá Marble Carrara", price: 4200000, stock: 43, sold: 85 },
    { id: 3, name: "Xi măng Hà Tiên", price: 92000, stock: 120, sold: 450 },
    { id: 4, name: "Ống nhựa Bình Minh", price: 85000, stock: 28, sold: 210 },
    { id: 5, name: "Sơn Dulux Trong Nhà", price: 1150000, stock: 5, sold: 65 },
  ],
  revenue: [
    { day: 'Th 2', revenue: 4200000 }, { day: 'Th 3', revenue: 3800000 },
    { day: 'Th 4', revenue: 6500000 }, { day: 'Th 5', revenue: 4900000 },
    { day: 'Th 6', revenue: 7200000 }, { day: 'Th 7', revenue: 8900000 },
    { day: 'CN', revenue: 9500000 },
  ]
};

const DATA_EMPLOYEE = {
  shifts: "08:00 - 17:00",
  target: 10000000,
  currentSales: 6450000,
  ordersCount: 12,
  recentOrders: [
    { id: "ORD-001", time: "10:30", customer: "Khách lẻ", total: 1250000, status: "completed" },
    { id: "ORD-002", time: "11:15", customer: "Anh Minh", total: 450000, status: "completed" },
    { id: "ORD-003", time: "13:45", customer: "Chị Lan", total: 2100000, status: "pending" },
    { id: "ORD-004", time: "14:20", customer: "Khách lẻ", total: 890000, status: "completed" },
  ]
};

const DATA_ADMIN = {
  totalShops: 1240,
  activeUsers: 8500,
  monthlyRevenue: 450000000,
  serverStatus: "99.9%",
  recentSignups: [
    { name: "Cửa hàng VLXD An Phú", plan: "Pro", date: "Vừa xong" },
    { name: "Shop Thời trang Bee", plan: "Basic", date: "15 phút trước" },
    { name: "Tạp hóa Minh Tâm", plan: "Free", date: "1 giờ trước" },
    { name: "Siêu thị Mini Mart", plan: "Enterprise", date: "2 giờ trước" },
  ]
};

// --- SHARED TECH COMPONENTS ---

const TechStatCard = ({ title, value, subValue, trend, trendValue, icon: Icon, colorTheme = "blue", delay }) => {
    // Theme configurations
    const themes = {
        blue: { border: "border-blue-100", shadow: "shadow-[0_0_15px_rgba(59,130,246,0.15)]", iconBg: "bg-blue-50", iconColor: "text-blue-600", accent: "border-blue-400" },
        emerald: { border: "border-emerald-100", shadow: "shadow-[0_0_15px_rgba(16,185,129,0.15)]", iconBg: "bg-emerald-50", iconColor: "text-emerald-600", accent: "border-emerald-400" },
        orange: { border: "border-orange-100", shadow: "shadow-[0_0_15px_rgba(249,115,22,0.15)]", iconBg: "bg-orange-50", iconColor: "text-orange-600", accent: "border-orange-400" },
        purple: { border: "border-purple-100", shadow: "shadow-[0_0_15px_rgba(168,85,247,0.15)]", iconBg: "bg-purple-50", iconColor: "text-purple-600", accent: "border-purple-400" },
        rose: { border: "border-rose-100", shadow: "shadow-[0_0_15px_rgba(244,63,94,0.15)]", iconBg: "bg-rose-50", iconColor: "text-rose-600", accent: "border-rose-400" },
        indigo: { border: "border-indigo-100", shadow: "shadow-[0_0_15px_rgba(99,102,241,0.15)]", iconBg: "bg-indigo-50", iconColor: "text-indigo-600", accent: "border-indigo-400" },
    };
    const t = themes[colorTheme] || themes.blue;

    return (
        <div className={`relative bg-white p-6 rounded-xl border ${t.border} ${t.shadow} overflow-hidden group hover:-translate-y-1 transition-transform duration-300 animate-in fade-in zoom-in-95`} style={{ animationDelay: `${delay}ms` }}>
             {/* Tech Corners */}
            <div className={`absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 ${t.accent} opacity-50`}></div>
            <div className={`absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 ${t.accent} opacity-50`}></div>
            
            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={`p-3 rounded-lg ${t.iconBg} ${t.iconColor} border border-${colorTheme}-100`}>
                    <Icon size={24} />
                </div>
                {trend && (
                    <div className={`flex items-center space-x-1 text-[10px] font-mono font-bold px-2 py-1 rounded bg-slate-50 border border-slate-100 ${trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        <span>{trendValue}</span>
                    </div>
                )}
            </div>
            
            <div className="relative z-10">
                <h3 className="text-slate-500 text-xs font-mono uppercase tracking-widest mb-1">{title}</h3>
                <div className="text-2xl font-bold font-mono text-slate-800 tracking-tight">{value}</div>
                <div className="text-[10px] text-slate-400 mt-1 font-mono flex items-center gap-1">
                    <Activity size={10} className="animate-pulse"/> {subValue}
                </div>
            </div>
            {/* Background Decorative Element */}
            <div className={`absolute -right-4 -bottom-4 opacity-5 ${t.iconColor}`}>
                <Icon size={80} />
            </div>
        </div>
    );
};

const TechChartBar = ({ data, isLoading, colorTheme = "blue", title, subtitle }) => {
  if (isLoading) return (
      <div className="h-80 w-full flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 rounded-xl border border-slate-100">
          <RefreshCcw className={`animate-spin mb-3 text-${colorTheme}-500`} size={32} />
          <span className="text-sm font-medium animate-pulse font-mono">SYNCING DATA...</span>
      </div>
  );

  const maxVal = Math.max(...data.map(d => d.value), 100); 
  
  // Theme colors for title and borders
  const themes = {
    blue: ['text-blue-600', 'border-blue-400'],
    purple: ['text-purple-600', 'border-purple-400'],
    green: ['text-emerald-600', 'border-emerald-400'],
    indigo: ['text-indigo-600', 'border-indigo-400'],
  };
  const [textColor, borderColor] = themes[colorTheme] || themes.blue;

  // Rainbow gradients for columns
  const rainbowGradients = [
    'from-red-500 to-orange-400',
    'from-orange-500 to-amber-400',
    'from-amber-500 to-yellow-400',
    'from-green-500 to-emerald-400',
    'from-teal-500 to-cyan-400',
    'from-blue-500 to-indigo-400',
    'from-violet-500 to-purple-400',
  ];

  return (
    <div className="relative h-80 w-full p-6 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-500">
       {/* Tech decorative corners */}
       <div className={`absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 ${borderColor} opacity-40 rounded-tl-lg`}></div>
       <div className={`absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 ${borderColor} opacity-40 rounded-br-lg`}></div>

       {/* Header */}
       <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4 relative z-10">
            <div>
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <BarChart3 className={`w-5 h-5 ${textColor}`}/> 
                    <span className="font-mono tracking-tight uppercase text-sm">{title}</span>
                </h3>
                <p className="text-[10px] text-slate-400 font-mono mt-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                    {subtitle}
                </p>
            </div>
            {/* Tech Dots */}
            <div className="flex gap-1">
                <div className={`w-1.5 h-1.5 rounded-full bg-slate-200`}></div>
                <div className={`w-1.5 h-1.5 rounded-full bg-slate-200`}></div>
                <div className={`w-1.5 h-1.5 rounded-full ${textColor.replace('text', 'bg')} animate-pulse`}></div>
            </div>
       </div>

       {/* Chart Area */}
       <div className="relative h-48 w-full z-10">
            {/* Grid */}
            <div className="absolute inset-0 flex flex-col justify-between text-xs text-slate-300 pointer-events-none">
                {[1, 0.5, 0].map((r, i) => (
                <div key={i} className="flex items-center w-full">
                    <div className="w-8 text-right mr-2 font-mono text-[9px] text-slate-400">{(maxVal * r / 1000000).toFixed(1)}M</div>
                    <div className={`flex-1 h-[1px] ${r === 0 ? 'bg-slate-300' : 'bg-slate-100 border-t border-dashed border-slate-200'}`}></div>
                </div>
                ))}
            </div>
            {/* Columns */}
            <div className="absolute inset-0 flex items-end justify-between pl-10 pr-2 pt-2 gap-2">
                {data.map((item, i) => {
                const heightPercent = (item.value / maxVal) * 100;
                const gradient = rainbowGradients[i % rainbowGradients.length];
                
                return (
                    <div key={i} className="flex flex-col items-center flex-1 group h-full justify-end relative">
                        {/* Tooltip HUD */}
                        <div className="absolute bottom-full mb-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-20 pointer-events-none">
                            <div className="bg-slate-800 text-cyan-400 text-xs font-mono py-1 px-2 rounded border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.3)] whitespace-nowrap">
                                {item.tooltip || item.value}
                            </div>
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 border-r border-b border-cyan-500/30 rotate-45"></div>
                        </div>

                        {/* Bar with Rainbow Gradient */}
                        <div className="relative w-full flex justify-center items-end h-full">
                            <div 
                                className={`w-full max-w-[24px] md:max-w-[40px] rounded-t-sm bg-gradient-to-t ${gradient} opacity-80 group-hover:opacity-100 transition-all duration-500 hover:scale-y-105 origin-bottom shadow-lg`} 
                                style={{ height: `${heightPercent}%` }}
                            >
                                <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/50"></div>
                            </div>
                        </div>
                        <span className="text-[10px] font-mono font-medium text-slate-500 mt-3 group-hover:text-blue-600 transition-colors">{item.label}</span>
                    </div>
                );
                })}
            </div>
       </div>
    </div>
  );
};

// --- SUB-DASHBOARDS (UNIFIED TECH STYLE) ---

// 1. DASHBOARD: OWNER
const OwnerDashboard = ({ stats, isLoading, onRefresh }) => {
    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            {/* Tech Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <TechStatCard 
                    title="Vốn Tồn Kho" value={formatMoney(806150000)} subValue="18 mã sản phẩm" 
                    icon={Box} colorTheme="blue" delay={0} 
                />
                <TechStatCard 
                    title="Doanh Thu Dự Kiến" value={formatMoney(stats.revenue.reduce((a,b)=>a+b.revenue,0))} 
                    subValue="Tổng giá trị tuần" trend="up" trendValue="12.5%" 
                    icon={Wallet} colorTheme="emerald" delay={100} 
                />
                <TechStatCard 
                    title="Nợ Phải Trả" value={formatMoney(278200000)} subValue="Công nợ NCC" 
                    trend="down" trendValue="2.1%" icon={CreditCard} colorTheme="orange" delay={200} 
                />
                <TechStatCard 
                    title="Sắp Hết Hàng" value="05" subValue="Cảnh báo nhập hàng" 
                    icon={AlertCircle} colorTheme="rose" delay={300} 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Chart */}
                <div className="lg:col-span-2">
                    <TechChartBar 
                        title="Doanh thu 7 ngày"
                        subtitle="Dữ liệu thời gian thực"
                        data={stats.revenue.map(r => ({ label: r.day, value: r.revenue, tooltip: formatMoney(r.revenue) }))} 
                        isLoading={isLoading} 
                        colorTheme="blue"
                    />
                </div>

                {/* Top Products - Tech List */}
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-inner flex flex-col h-80 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-2 relative z-10">
                        <h3 className="text-xs font-bold font-mono text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <Database size={14}/> Kho hàng Top
                        </h3>
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_5px_rgba(16,185,129,0.6)]"></div>
                    </div>
                    
                    <div className="space-y-3 overflow-y-auto custom-scrollbar pr-2 relative z-10 flex-1">
                        {stats.products.sort((a,b) => b.sold - a.sold).map((p, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded shadow-sm hover:border-blue-300 transition-all group relative overflow-hidden">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-200 group-hover:bg-blue-400 transition-colors"></div>
                                <div className="pl-2 flex items-center gap-3">
                                    <div className={`w-6 h-6 rounded flex items-center justify-center font-mono font-bold text-xs ${i===0?'bg-yellow-400 text-yellow-900': 'bg-slate-100 text-slate-600'}`}>
                                        {i+1}
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-700 font-mono truncate max-w-[100px]">{p.name}</p>
                                        <p className="text-[10px] text-slate-400 font-mono">{formatMoney(p.price)}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold font-mono text-slate-800">{p.sold}</p>
                                    <p className="text-[9px] text-slate-400 uppercase tracking-wider">SOLD</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// 2. DASHBOARD: EMPLOYEE
const EmployeeDashboard = ({ data }) => {
    const percentage = Math.min((data.currentSales / data.target) * 100, 100);

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            {/* Tech Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <TechStatCard 
                    title="Ca làm việc" value={data.shifts} subValue="Status: Active" 
                    icon={Clock} colorTheme="indigo" delay={0} 
                />
                
                 {/* KPI Target - Special Tech Card */}
                 <div className="relative bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-lg overflow-hidden text-white group">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:15px_15px]"></div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-emerald-400 text-xs font-mono uppercase tracking-widest flex items-center gap-2">
                                    <Target size={14}/> Target
                                </p>
                                <p className="text-2xl font-bold font-mono mt-1 tracking-tight">{formatMoney(data.currentSales)}</p>
                            </div>
                            <span className="text-3xl font-bold font-mono text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">
                                {percentage.toFixed(0)}%
                            </span>
                        </div>
                        <div className="w-full h-2 bg-slate-800 rounded-sm flex gap-0.5 overflow-hidden border border-slate-700">
                             <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-1000" style={{ width: `${percentage}%` }}></div>
                        </div>
                    </div>
                    {/* Decorative Corner */}
                    <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-emerald-500/30 rounded-tr-xl"></div>
                </div>

                <TechStatCard 
                    title="Đơn hàng" value={data.ordersCount} subValue="Đã xử lý hôm nay" 
                    icon={ShoppingCart} colorTheme="purple" delay={200} 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <TechChartBar 
                        title="Hiệu suất theo giờ"
                        subtitle="Doanh số cá nhân trong ca làm việc"
                        data={[
                            { label: '08:00', value: 500000, tooltip: '500k' },
                            { label: '09:00', value: 1200000, tooltip: '1.2tr' },
                            { label: '10:00', value: 2500000, tooltip: '2.5tr' },
                            { label: '11:00', value: 800000, tooltip: '800k' },
                            { label: '12:00', value: 200000, tooltip: '200k' },
                            { label: '13:00', value: 1500000, tooltip: '1.5tr' },
                            { label: '14:00', value: 3000000, tooltip: '3tr' },
                        ]} 
                        colorTheme="green"
                    />
                </div>

                {/* Tech Log List */}
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-inner flex flex-col h-80 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-2 relative z-10">
                        <h3 className="text-xs font-bold text-slate-500 font-mono uppercase tracking-widest flex items-center gap-2">
                            <Terminal size={14}/> Nhật ký giao dịch
                        </h3>
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_5px_rgba(59,130,246,0.6)]"></div>
                    </div>
                    
                    <div className="space-y-3 font-mono text-sm flex-1 overflow-y-auto custom-scrollbar relative z-10">
                        {data.recentOrders.map((order, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded shadow-sm hover:border-blue-300 transition-all cursor-default group relative overflow-hidden">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-200 group-hover:bg-blue-400 transition-colors"></div>
                                <div className="pl-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-blue-600 font-bold text-xs">{order.id}</span>
                                        <span className="text-slate-300 text-[10px]">|</span>
                                        <span className="text-slate-700 text-xs truncate max-w-[80px]">{order.customer}</span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-0.5">{order.time} • {formatMoney(order.total)}</p>
                                </div>
                                <div className={`w-2 h-2 rounded-full ${order.status === 'completed' ? 'bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]' : 'bg-amber-400 animate-pulse'}`}></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// 3. DASHBOARD: ADMIN
const AdminDashboard = ({ data }) => {
    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
             {/* Tech Stats Grid */}
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <TechStatCard 
                    title="Tổng Cửa Hàng" value={formatNumber(data.totalShops)} subValue="+12 Registered" 
                    icon={Globe} colorTheme="indigo" delay={0} 
                />
                <TechStatCard 
                    title="Active Users" value={formatNumber(data.activeUsers)} subValue="Online: 450" 
                    icon={Users} colorTheme="purple" delay={100} 
                />
                <TechStatCard 
                    title="MRR (Doanh thu)" value={formatMoney(data.monthlyRevenue)} trend="up" trendValue="8.5%"
                    subValue="Monthly Recurring" icon={Wallet} colorTheme="rose" delay={200} 
                />
                <TechStatCard 
                    title="Server Uptime" value={data.serverStatus} subValue="Last 30 days" 
                    icon={Server} colorTheme="emerald" delay={300} 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Admin Chart */}
                <div className="lg:col-span-2">
                    <TechChartBar 
                        title="Tăng trưởng hệ thống"
                        subtitle="New users per week"
                        data={[
                            { label: 'MON', value: 450, tooltip: '450 Users' },
                            { label: 'TUE', value: 600, tooltip: '600 Users' },
                            { label: 'WED', value: 750, tooltip: '750 Users' },
                            { label: 'THU', value: 500, tooltip: '500 Users' },
                            { label: 'FRI', value: 800, tooltip: '800 Users' },
                            { label: 'SAT', value: 950, tooltip: '950 Users' },
                            { label: 'SUN', value: 1000, tooltip: '1000 Users' },
                        ]} 
                        colorTheme="indigo"
                    />
                </div>

                {/* Recent Signups - Tech List */}
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-inner flex flex-col h-80 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-2 relative z-10">
                        <h3 className="text-xs font-bold font-mono text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <Lock size={14}/> Truy cập gần đây
                        </h3>
                        <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse shadow-[0_0_5px_rgba(168,85,247,0.6)]"></div>
                    </div>
                    
                    <div className="space-y-3 relative z-10 overflow-y-auto h-full custom-scrollbar">
                        {data.recentSignups.map((shop, i) => (
                            <div key={i} className="flex items-center gap-3 p-2 bg-white rounded border border-slate-200 shadow-sm hover:border-indigo-300 transition-colors group">
                                <div className="w-8 h-8 rounded bg-indigo-50 flex items-center justify-center font-mono font-bold text-indigo-600 text-xs border border-indigo-100">
                                    {shop.name.substring(0,1)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-slate-700 text-xs font-mono truncate">{shop.name}</p>
                                    <p className="text-[10px] text-slate-400 font-mono">{shop.date}</p>
                                </div>
                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono uppercase border ${
                                    shop.plan === 'Pro' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                                    shop.plan === 'Enterprise' ? 'bg-slate-800 text-white border-slate-700' :
                                    'bg-slate-50 text-slate-500 border-slate-100'
                                }`}>
                                    {shop.plan}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- MAIN PAGE COMPONENT ---

export default function DashboardPage() {
    const [role, setRole] = useState("owner");
    const [userName, setUserName] = useState("User");
    const [isLoading, setIsLoading] = useState(false);
    
    const [ownerData, setOwnerData] = useState(DATA_OWNER);

    useEffect(() => {
        const storedRole = typeof localStorage !== 'undefined' ? localStorage.getItem("role") : null;
        const storedName = typeof localStorage !== 'undefined' ? localStorage.getItem("user_name") : null;
        
        if (storedRole) setRole(storedRole.toLowerCase());
        if (storedName) setUserName(storedName);
    }, []);

    const handleRefresh = useCallback(() => {
        setIsLoading(true);
        setTimeout(() => {
            const newRevenue = DATA_OWNER.revenue.map(d => ({ ...d, revenue: Math.floor(Math.random() * 5000000) + 2000000 }));
            setOwnerData({ ...DATA_OWNER, revenue: newRevenue });
            setIsLoading(false);
        }, 1200);
    }, []);

    return (
        <div className="space-y-8 p-1">
             {/* Page Header - Tech Style */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Terminal size={20} className="text-blue-600" />
                        <h2 className="text-2xl font-bold font-mono tracking-tight text-slate-900 uppercase">Dashboard</h2>
                    </div>
                    <p className="text-slate-500 text-sm font-mono flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                        Xin chào, {userName}! System Ready.
                    </p>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-mono text-slate-500">
                        <Zap size={12} className="text-yellow-500"/> v2.4.0-stable
                    </div>
                    <span className={`px-4 py-1.5 rounded text-xs font-bold font-mono uppercase border shadow-sm flex items-center gap-2 ${
                        role === 'admin' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 
                        role === 'owner' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                        'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                        <User size={14} />
                        {role === 'admin' ? 'ADMIN_ACCESS' : role === 'owner' ? 'OWNER_ACCESS' : 'STAFF_ACCESS'}
                    </span>
                </div>
            </div>

            {/* Render Dashboard based on Role */}
            {role === 'owner' && (
                <OwnerDashboard stats={ownerData} isLoading={isLoading} onRefresh={handleRefresh} />
            )}

            {role === 'employee' && (
                <EmployeeDashboard data={DATA_EMPLOYEE} />
            )}

            {role === 'admin' && (
                <AdminDashboard data={DATA_ADMIN} />
            )}
        </div>
    );
}