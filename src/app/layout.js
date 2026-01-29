// src/app/layout.js
import { Inter } from "next/font/google";
import "./globals.css";
import { AppSidebar } from "@/components/app_sidebar";
// import { TopBar } from "@/components/top_bar"; // Nếu bạn có Topbar

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Phần mềm Quản lý Bán hàng",
  description: "By Your Name",
};

// Component con để check logic hiển thị Sidebar (Client Component)
// Lưu ý: layout.js là Server Component nên ta cần tách phần logic check path ra
// Nhưng để đơn giản, ta dùng CSS hoặc check trong Sidebar.
// Cách tốt nhất là tạo một Client Wrapper.

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className={`${inter.className} bg-slate-50 text-slate-900`}>
        {/* Wrapper chính */}
        <div className="flex min-h-screen">
           {/* Sidebar Component (Tự động ẩn ở login nhờ logic bên trong hoặc dùng wrapper) */}
           {/* Để đơn giản, ta cứ render, và dùng CSS ẩn hoặc Conditional Rendering ở level page */}
           
           {/* Cách chuẩn: Layout Wrapper */}
           <LayoutWrapper>
             {children}
           </LayoutWrapper>
        </div>
      </body>
    </html>
  );
}

