import { Inter } from "next/font/google";
import "./globals.css";
import { AppSidebar } from "@/components/app_sidebar";
import { TopBar } from "@/components/top_bar"; // Import component mới nè

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "BizFlow - Nền tảng Hộ kinh doanh",
  description: "Hỗ trợ chuyển đổi số theo thông tư 88",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className={`${inter.className} bg-slate-50 text-slate-900`}>
        <div className="flex min-h-screen">
          {/* Sidebar cố định bên trái */}
          <AppSidebar />
          
          {/* Nội dung chính nằm bên phải */}
          {/* Mình bỏ padding p-8 ở đây đi để Header dính sát lề trên cùng cho đẹp */}
          <main className="flex-1 ml-64 min-h-screen flex flex-col transition-all duration-300">
             
             {/* Header mới nằm ở đây (Sticky) */}
             <TopBar />

             {/* Phần nội dung thay đổi (Children) */}
             <div className="flex-1 p-8 overflow-y-auto animate-in fade-in duration-500">
                {children}
             </div>
          </main>
        </div>
      </body>
    </html>
  );
}