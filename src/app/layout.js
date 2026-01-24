import { Inter } from "next/font/google";
import "./globals.css";
// Lưu ý: Tên file đã được viết thường hoàn toàn theo đúng yêu cầu
import { AppSidebar } from "@/components/app_sidebar";

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
          {/* sidebar cố định bên trái */}
          <AppSidebar />
          
          {/* nội dung chính nằm bên phải */}
          <main className="flex-1 ml-64 p-8 transition-all duration-300">
             {/* header của hệ thống */}
             <header className="flex justify-between items-center mb-8 pb-4 border-b border-slate-200">
                <div>
                  <h1 className="text-2xl font-bold text-slate-800 uppercase tracking-tight">Hệ thống quản lý</h1>
                  <p className="text-xs text-slate-500 mt-1">BizFlow v1.0 | Giải pháp hỗ trợ hộ kinh doanh</p>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-sm font-bold text-slate-800">Admin Nhóm 7</p>
                        <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold uppercase">Online</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center font-bold text-slate-500">
                      D
                    </div>
                </div>
             </header>

             {/* đây là nơi các trang của bạn E, F, G sẽ hiển thị */}
             <div className="animate-in fade-in duration-500">
                {children}
             </div>
          </main>
        </div>
      </body>
    </html>
  );
}