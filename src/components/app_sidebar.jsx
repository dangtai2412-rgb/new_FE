"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, ShoppingCart, Package, 
  Users, BarChart3, LogOut, Settings 
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function AppSidebar() {
  const pathname = usePathname();

  // Danh sách menu chính
  const menuItems = [
    { 
      name: "Tổng Quan", 
      path: "/dashboard", 
      icon: LayoutDashboard 
    },
    { 
      name: "Bán Hàng (POS)", 
      path: "/pos", 
      icon: ShoppingCart,
      highlight: true // Đánh dấu để làm nổi bật
    },
    { 
      name: "Kho Hàng", 
      path: "/inventory", 
      icon: Package 
    },
    { 
      name: "Công Nợ", 
      path: "/debt", 
      icon: Users 
    },
    { 
      name: "Báo Cáo", 
      path: "/reports", 
      icon: BarChart3 
    },
  ];

  const handleLogout = () => {
    if (confirm("Bạn có chắc muốn đăng xuất?")) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  };

  return (
    <div className="w-64 h-screen bg-slate-900 text-white flex flex-col fixed left-0 top-0 border-r border-slate-800 shadow-2xl z-50">
      
      {/* 1. Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950">
        <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3 font-bold text-xl shadow-lg shadow-blue-900/50">
          S
        </div>
        <span className="font-bold text-lg tracking-wide text-slate-100">SaleManager</span>
      </div>

      {/* 2. Menu Items */}
      <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Quản lý
        </p>
        
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link key={item.path} href={item.path}>
              <div 
                className={`
                  flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group relative
                  ${isActive 
                    ? "bg-blue-600 text-white shadow-md shadow-blue-900/20" 
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }
                  ${item.highlight && !isActive ? "bg-slate-800/50 border border-slate-700/50" : ""}
                `}
              >
                <Icon size={20} className={`mr-3 ${isActive ? "text-white" : "text-slate-500 group-hover:text-white"}`} />
                <span className="font-medium text-sm">{item.name}</span>
                
                {/* Dấu chấm báo hiệu active */}
                {isActive && (
                   <div className="absolute right-2 w-1.5 h-1.5 bg-white rounded-full opacity-50"></div>
                )}
              </div>
            </Link>
          );
        })}

        <div className="mt-8">
           <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
             Hệ thống
           </p>
           <Link href="/settings">
              <div className="flex items-center px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
                 <Settings size={20} className="mr-3 text-slate-500" />
                 <span className="font-medium text-sm">Cài đặt</span>
              </div>
           </Link>
        </div>
      </div>

      {/* 3. User Profile & Logout */}
      <div className="p-4 border-t border-slate-800 bg-slate-950">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center font-bold text-sm shadow-inner">
            AD
          </div>
          <div className="flex-1 min-w-0">
             <p className="text-sm font-medium text-white truncate">Administrator</p>
             <p className="text-xs text-slate-500 truncate">admin@shop.com</p>
          </div>
        </div>
        <Button 
          onClick={handleLogout}
          variant="ghost" 
          className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-950/30 h-9"
        >
          <LogOut size={16} className="mr-2" />
          Đăng xuất
        </Button>
      </div>
    </div>
  );
}