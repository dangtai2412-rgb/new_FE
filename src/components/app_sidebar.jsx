"use client";
// 1. IMPORT CÁC HOOK CẦN THIẾT TỪ REACT
import { useEffect, useState } from "react"; 

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; // Import thêm useRouter để dùng nút Đăng xuất
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Users, 
  FileText, 
  LogOut,
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

// CẤU HÌNH MENU VÀ PHÂN QUYỀN
const MENU_ITEMS = [
  { 
    title: "Tổng quan", 
    icon: LayoutDashboard, 
    href: "/dashboard", 
    roles: ["admin", "owner", "employee"] 
  },
  { 
    title: "Bán hàng (POS)", 
    icon: ShoppingCart, 
    href: "/pos", 
    roles: ["owner", "employee"] 
  },
  { 
    title: "Kho & Sản phẩm", 
    icon: Package, 
    href: "/inventory", 
    roles: ["owner", "employee"] 
  },
  { 
    title: "Đối tác & Công nợ", 
    icon: Users, 
    href: "/debt", 
    roles: ["owner"] 
  },
  { 
    title: "Báo cáo doanh thu", 
    icon: FileText, 
    href: "/reports", 
    roles: ["owner", "admin"] 
  },
  { 
    title: "Quản trị hệ thống", 
    icon: ShieldCheck, 
    href: "/admin", 
    roles: ["admin"] 
  },
];

export function AppSidebar() {
  const path_name = usePathname();
  const router = useRouter(); // Hook để chuyển trang
  const [userRole, setUserRole] = useState(""); // Hook quản lý trạng thái Role
  const [isMounted, setIsMounted] = useState(false); // Hook kiểm tra render client

  // Lấy Role từ LocalStorage khi trang vừa load
  useEffect(() => {
    setIsMounted(true);
    const role = localStorage.getItem("role") || "employee";
    setUserRole(role.toLowerCase());
  }, []);

  // Hàm đăng xuất
  const handleLogout = () => {
    // Xóa hết dữ liệu trong LocalStorage
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user_name");
    
    // Chuyển về trang Login
    router.push("/login");
  };

  // Tránh lỗi hydration của Next.js
  if (!isMounted) return null;

  // Lọc menu dựa trên Role hiện tại
  const filteredMenu = MENU_ITEMS.filter(item => item.roles.includes(userRole));

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-0 border-r border-slate-800 z-50">
      {/* Header Sidebar */}
      <div className="p-6 border-b border-slate-800 flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold">B</div>
        <span className="text-xl font-bold">BizFlow</span>
      </div>

      {/* Danh sách Menu động */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {filteredMenu.map((item) => {
          const is_active = path_name === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                is_active 
                  ? "bg-blue-600 text-white" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}
            >
              <item.icon size={20} />
              <span className="text-sm font-medium">{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Sidebar - Nút Đăng xuất */}
      <div className="p-4 border-t border-slate-800">
        <div className="mb-4 px-4 text-xs text-slate-500 uppercase">
          Tài khoản: {userRole}
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors"
        >
          <LogOut size={20} />
          <span className="text-sm font-medium">Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
}