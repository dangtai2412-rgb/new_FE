"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Users, 
  FileText, 
  LogOut,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
// Cấu trúc Menu được phân nhóm lại cho chuyên nghiệp
const menuGroups = [
  {
    groupLabel: "TỔNG QUAN",
    items: [
      { title: "Bảng điều khiển", icon: LayoutDashboard, href: "/" },
    ]
  },
  {
    groupLabel: "QUẢN LÝ NGHIỆP VỤ",
    items: [
      { title: "Bán hàng (POS)", icon: ShoppingCart, href: "/pos" },
      { title: "Kho & Sản phẩm", icon: Package, href: "/inventory" },
      { title: "Đối tác & Công nợ", icon: Users, href: "/debt" },
    ]
  },
  {
    groupLabel: "DỮ LIỆU & THUẾ",
    items: [
      { title: "Báo cáo Thuế (TT88)", icon: FileText, href: "/reports" },
    ]
  }
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-0 border-r border-slate-800 z-50">
      {/* 1. Logo cải tiến với Gradient */}
      <div className="p-6 flex items-center gap-3 group cursor-pointer">
        <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center font-bold shadow-lg shadow-blue-500/20 transition-transform group-hover:scale-105">
          <span className="text-xl text-white">B</span>
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold tracking-tight leading-tight">BizFlow</span>
          <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Logistics AI</span>
        </div>
      </div>

      {/* 2. Danh sách Menu theo nhóm */}
      <nav className="flex-1 px-4 py-4 space-y-6 overflow-y-auto custom-scrollbar">
        {menuGroups.map((group, idx) => (
          <div key={idx} className="space-y-2">
            {/* Nhãn của nhóm menu */}
            <h3 className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-[2px]">
              {group.groupLabel}
            </h3>
            
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group relative flex items-center justify-between px-4 py-2.5 rounded-lg transition-all duration-200",
                      isActive 
                        ? "bg-blue-600/10 text-blue-400" 
                        : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className={cn(
                        "transition-colors",
                        isActive ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300"
                      )} size={20} />
                      <span className="text-sm font-medium">{item.title}</span>
                    </div>

                    {/* Hiệu ứng Active: Đường kẻ dọc bên trái */}
                    {isActive && (
                      <div className="absolute left-0 top-2 bottom-2 w-1 bg-blue-500 rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                    )}
                    
                    {/* Icon mũi tên hiện ra khi hover item chưa active */}
                    {!isActive && (
                      <ChevronRight className="h-4 w-4 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0 text-slate-600" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* 3. Footer Sidebar (Đăng xuất) */}
      <div className="p-4 border-t border-slate-800">
        <button className="flex items-center gap-3 text-slate-400 px-4 py-3 w-full hover:bg-red-500/10 hover:text-red-400 transition-colors rounded-xl group">
          <LogOut size={18} className="group-hover:rotate-12 transition-transform" />
          <span className="text-sm font-medium">Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
}