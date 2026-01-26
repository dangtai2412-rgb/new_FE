"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Users, 
  FileText, 
  LogOut 
} from "lucide-react";
import { cn } from "@/lib/utils";

const menu_items = [
  { title: "Tổng quan", icon: LayoutDashboard, href: "/dashboard" },
  { title: "Bán hàng (POS)", icon: ShoppingCart, href: "/pos" },
  { title: "Kho & Sản phẩm", icon: Package, href: "/inventory" },
  { title: "Đối tác & Công nợ", icon: Users, href: "/debt" },
  { title: "Báo cáo Thuế (TT88)", icon: FileText, href: "/reports" },
];

export function AppSidebar() {
  const path_name = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-0 border-r border-slate-800">
      <div className="p-6 border-b border-slate-800 flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold">B</div>
        <span className="text-xl font-bold">BizFlow</span>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menu_items.map((item) => {
          const is_active = path_name === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                is_active ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}
            >
              <item.icon size={20} />
              <span className="text-sm font-medium">{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button className="flex items-center gap-3 text-red-400 p-2 w-full hover:bg-red-900/20 rounded">
          <LogOut size={18} />
          <span className="text-sm">Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
}