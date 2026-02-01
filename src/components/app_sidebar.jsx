// File: src/components/app_sidebar.jsx
"use client";
import { useEffect, useState } from "react"; 
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { 
  LayoutDashboard, ShoppingCart, Package, Users, FileText, LogOut, ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

const MENU_ITEMS = [
  { title: "Tổng quan", icon: LayoutDashboard, href: "/dashboard", roles: ["admin", "owner", "employee"] },
  { title: "Bán hàng (POS)", icon: ShoppingCart, href: "/pos", roles: ["owner", "employee"] },
  { title: "Kho & Sản phẩm", icon: Package, href: "/inventory", roles: ["owner", "employee"] },
  { title: "Đối tác & Công nợ", icon: Users, href: "/debt", roles: ["owner"] },
  { title: "Báo cáo doanh thu", icon: FileText, href: "/reports", roles: ["owner", "admin"] },
  { title: "Quản trị hệ thống", icon: ShieldCheck, href: "/admin", roles: ["admin"] },
  { title: "Trợ lý AI", icon: Sparkles, href: "/ai", roles: ["owner", "admin"] },
];

export function AppSidebar() {
  const path_name = usePathname();
  const router = useRouter();
  const [userRole, setUserRole] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const role = localStorage.getItem("role") || "employee";
    setUserRole(role.toLowerCase());
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  if (!isMounted) return null;
  
  // Logic lọc menu theo quyền
  const filteredMenu = MENU_ITEMS.filter(item => item.roles.includes(userRole));

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-0 border-r border-slate-800 z-50">
      <div className="p-6 border-b border-slate-800 flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold">B</div>
        <span className="text-xl font-bold">BizFlow</span>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {filteredMenu.map((item) => (
          <Link key={item.href} href={item.href} className={cn("flex items-center gap-3 px-4 py-3 rounded-lg transition-colors", path_name === item.href ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white")}>
            <item.icon size={20} />
            <span className="text-sm font-medium">{item.title}</span>
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-800">
        <div className="mb-4 px-4 text-xs text-slate-500 uppercase">Tài khoản: {userRole}</div>
        <button onClick={handleLogout} className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors">
          <LogOut size={20} />
          <span className="text-sm font-medium">Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
}