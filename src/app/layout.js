import { Inter } from "next/font/google";
import "./globals.css";
import { AppSidebar } from "@/components/AppSidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "BizFlow - Quản lý Hộ kinh doanh",
  description: "Nền tảng hỗ trợ chuyển đổi số cho hộ kinh doanh",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className={`${inter.className} bg-slate-50 text-slate-900`}>
        <div className="flex min-h-screen">
          {/* Sidebar cố định bên trái */}
          <AppSidebar />
          
          {/* Nội dung chính nằm bên phải */}
          <main className="flex-1 ml-64 p-8 transition-all duration-300 ease-in-out">
             {/* Header nhỏ phía trên */}
             <header className="flex justify-between items-center mb-8 pb-4 border-b border-slate-200">
                <h1 className="text-2xl font-bold text-slate-800">Hệ thống quản lý</h1>
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-slate-600">Xin chào, Chủ cửa hàng</span>
                    <div className="w-9 h-9 rounded-full bg-slate-200 border border-slate-300"></div>
                </div>
             </header>

             {/* Nội dung các trang con sẽ hiện ở đây */}
             {children}
          </main>
        </div>
      </body>
    </html>
  );
}