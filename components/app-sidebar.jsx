"use client"; // Bắt buộc dòng này vì Next.js mặc định là Server Component

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Users, 
  FileText, 
  Settings, 
  LogOut 
} from "lucide-react";
import { cn } from "@/lib/utils"; // Hàm tiện ích của Shadcn

const menuItems = [
  { title: "Tổng quan", icon: LayoutDashboard, href: "/" },
  { title: "Bán hàng (POS)", icon: ShoppingCart, href: "/pos" },
  { title: "Kho & Sản phẩm", icon: Package, href: "/inventory" },
  { title: "Đối tác & Công nợ", icon: Users, href: "/debt" },
  { title: "Báo cáo Thuế (TT88)", icon: FileText, href: "/reports" },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-0 border-r border-slate-800">
      {/* Logo */}
      <div className="p-6 border-b border-slate-800 flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">
          B
        </div>
        <span className="text-xl font-bold tracking-tight">BizFlow</span>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                isActive 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}
            >
              <item.icon size={20} className={cn(isActive ? "text-white" : "text-slate-400 group-hover:text-white")} />
              <span className="font-medium text-sm">{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Sidebar */}
      <div className="p-4 border-t border-slate-800">
        <button className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-950/30 rounded-lg transition-colors text-sm font-medium">
          <LogOut size={18} />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}