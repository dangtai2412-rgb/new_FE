"use client"

import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/app_sidebar";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  
  // Danh sách các trang KHÔNG hiện Sidebar
  const publicPages = ["/login", "/register", "/forgot-password"];
  const isPublicPage = publicPages.includes(pathname);

  return (
    <>
      {!isPublicPage && <AppSidebar />}
      
      {/* Nội dung chính sẽ bị đẩy sang phải 64 (256px) nếu có sidebar */}
      <main className={`flex-1 transition-all duration-300 ${!isPublicPage ? "ml-64" : ""}`}>
        {children}
      </main>
    </>
  );
  
}