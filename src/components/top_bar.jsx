"use client";

import { usePathname } from "next/navigation";
import { Bell, Search, ChevronRight } from "lucide-react";

const pageNames = {
  "/": "Tổng quan",
  "/pos": "Bán hàng (POS)",
  "/inventory": "Kho & Sản phẩm",
  "/debt": "Đối tác & Công nợ",
  "/reports": "Báo cáo Thuế (TT88)",
  "/settings": "Cài đặt hệ thống"
};

export function TopBar() {
  const pathname = usePathname();
  const currentPage = pageNames[pathname] || "Trang quản lý";

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
      <div className="flex items-center justify-between px-8 py-4">
        
        {/* Breadcrumbs & Title */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>BizFlow</span>
            <ChevronRight size={14} />
            <span className="text-blue-600">{currentPage}</span>
          </div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            {currentPage}
          </h1>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-lg border-transparent focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all border">
            <Search size={18} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Tìm kiếm..." 
              className="bg-transparent text-sm outline-none w-48 text-slate-700 placeholder:text-slate-400"
            />
          </div>

          <button className="relative p-2 rounded-full hover:bg-slate-100 transition-colors">
            <Bell size={20} className="text-slate-600" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white"></span>
          </button>

          <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-700 leading-none">Admin Nhóm 7</p>
              <p className="text-[11px] text-slate-500 font-medium mt-1">Quản trị viên</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30 cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-blue-500 transition-all">
              <span className="text-sm font-bold text-white">AD</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}