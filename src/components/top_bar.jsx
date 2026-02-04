"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { 
  Bell, Search, ChevronRight, 
  Check, X, AlertCircle, ShoppingCart, CheckCircle2, Info
} from "lucide-react";
import { MOCK_NOTIFICATIONS } from "@/lib/mock_data";

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

  // --- LOGIC XỬ LÝ THÔNG BÁO ---
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  // Đếm số tin chưa đọc (isRead = false)
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Hành động: Đánh dấu tất cả đã đọc
  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  // Hành động: Xóa 1 thông báo
  const handleDismiss = (id, e) => {
    e.stopPropagation(); // Ngăn sự kiện click lan ra ngoài làm đóng popup
    setNotifications(notifications.filter(n => n.id !== id));
  };

  // Helper: Chọn icon phù hợp với loại thông báo
  const getIcon = (type) => {
    switch (type) {
      case 'order': return <ShoppingCart size={14} className="text-blue-500" />;
      case 'alert': return <AlertCircle size={14} className="text-orange-500" />;
      case 'success': return <CheckCircle2 size={14} className="text-green-500" />;
      default: return <Info size={14} className="text-slate-500" />;
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
      <div className="flex items-center justify-between px-8 py-4">
        
        {/* Breadcrumbs & Title (Giữ nguyên của bạn) */}
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
          {/* Search Bar */}
          <div className="hidden md:flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-lg border-transparent focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all border">
            <Search size={18} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Tìm kiếm..." 
              className="bg-transparent text-sm outline-none w-48 text-slate-700 placeholder:text-slate-400"
            />
          </div>

          {/* --- CÁI CHUÔNG THÔNG BÁO --- */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={`relative p-2 rounded-full transition-colors ${showNotifications ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-100 text-slate-600'}`}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-red-500 border-2 border-white rounded-full animate-pulse"></span>
              )}
            </button>

            {/* POPUP DROPDOWN */}
            {showNotifications && (
              <>
                {/* Lớp nền trong suốt để click ra ngoài thì đóng */}
                <div 
                  className="fixed inset-0 z-[100]" 
                  onClick={() => setShowNotifications(false)}
                ></div>

                <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-2xl border border-slate-100 z-[101] overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                  {/* Header Popup */}
                  <div className="p-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/80 backdrop-blur-sm">
                    <h3 className="font-bold text-sm text-slate-800">Thông báo ({unreadCount})</h3>
                    {unreadCount > 0 && (
                      <button 
                        onClick={handleMarkAllRead} 
                        className="text-[10px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-full border border-blue-100 hover:bg-blue-100 transition-colors"
                      >
                        <Check size={10} /> Đọc hết
                      </button>
                    )}
                  </div>

                  {/* Danh sách thông báo */}
                  <div className="max-h-[350px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
                        <Bell size={24} className="opacity-20"/>
                        <span>Không có thông báo mới</span>
                      </div>
                    ) : (
                      notifications.map((item) => (
                        <div 
                          key={item.id} 
                          className={`p-3 border-b border-slate-50 hover:bg-slate-50 transition-colors flex gap-3 relative group ${!item.isRead ? 'bg-blue-50/40' : ''}`}
                        >
                          {/* Icon Tròn */}
                          <div className="mt-1 bg-white p-1.5 rounded-full shadow-sm border border-slate-100 h-fit shrink-0">
                            {getIcon(item.type)}
                          </div>
                          
                          {/* Nội dung */}
                          <div className="flex-1 pr-5">
                            <p className={`text-sm ${!item.isRead ? 'font-bold text-slate-800' : 'text-slate-600'}`}>
                              {item.title}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5 leading-snug">{item.message}</p>
                            <p className="text-[10px] text-slate-400 mt-1 font-medium">{item.time}</p>
                          </div>
                          
                          {/* Nút xóa nhanh (Chỉ hiện khi hover) */}
                          <button 
                            onClick={(e) => handleDismiss(item.id, e)}
                            className="absolute top-2 right-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all"
                            title="Xóa thông báo này"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                  
                  {/* Footer Popup */}
                  <div className="p-2 bg-slate-50 text-center border-t border-slate-100 hover:bg-slate-100 transition-colors cursor-pointer">
                    <button className="text-xs font-bold text-slate-500 hover:text-blue-600">Xem tất cả lịch sử</button>
                  </div>
                </div>
              </>
            )}
          </div>
          {/* --- KẾT THÚC CÁI CHUÔNG --- */}

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
            <div className="text-right hidden sm:block">
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