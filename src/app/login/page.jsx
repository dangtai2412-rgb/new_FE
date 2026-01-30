"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api_service } from "@/lib/api_service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock, Loader2 } from "lucide-react";

export default function LoginPage() {

  // ===== State form =====
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ===== State UI =====
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  // ===== Submit handler =====
  const handle_submit = async (e) => {
    e.preventDefault();
    setError("");

    /* --- Validate chi tiết --- */

    if (!email.includes("@")) {
      setError("Email không hợp lệ");
      return;
    }

    if (password.length < 4) {
      setError("Mật khẩu phải từ 4 ký tự trở lên");
      return;
    }

    /* --- Call API --- */
    setLoading(true);

    try {
      const data = await api_service.login(email, password);

      if (data?.token) {

        // Lưu token (để dùng sau)
        localStorage.setItem("token", data.token);

        router.push("/dashboard");

      } else {
        setError(data?.error || "Sai tài khoản hoặc mật khẩu");
      }

    } catch (err) {
      setError("Không kết nối được server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-slate-100">

      <Card className="w-[380px] shadow-2xl rounded-2xl">

        {/* ===== HEADER ===== */}
        <CardHeader className="text-center space-y-2">

          <CardTitle className="text-3xl font-bold text-blue-600">
            BizFlow
          </CardTitle>

          <p className="text-slate-500 text-sm">
            Hệ thống quản lý doanh nghiệp
          </p>

        </CardHeader>

        {/* ===== BODY ===== */}
        <CardContent>

          <form 
            onSubmit={handle_submit} 
            className="space-y-5"
          >

            {/* ===== EMAIL ===== */}
            <div className="space-y-1">

              <label className="text-sm text-slate-600">
                Email
              </label>

              <div className="relative">

                <Mail 
                  className="absolute left-3 top-2.5 text-slate-400" 
                  size={18} 
                />

                <Input
                  className="pl-10"
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />

              </div>

            </div>

            {/* ===== PASSWORD ===== */}
            <div className="space-y-1">

              <label className="text-sm text-slate-600">
                Mật khẩu
              </label>

              <div className="relative">

                <Lock 
                  className="absolute left-3 top-2.5 text-slate-400" 
                  size={18} 
                />

                <Input
                  className="pl-10"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />

              </div>

            </div>

            {/* ===== ERROR ===== */}
            {error && (
              <div className="bg-red-100 text-red-600 text-sm px-3 py-2 rounded-lg">
                {error}
              </div>
            )}

            {/* ===== BUTTON ===== */}
            <Button
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 flex gap-2"
            >
              {loading && <Loader2 className="animate-spin" size={18} />}
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>

          </form>

          {/* ===== FOOTER ===== */}
          <div className="mt-5 text-center text-xs text-slate-400">
            © 2026 BizFlow System
          </div>

        </CardContent>

      </Card>

    </div>
  );
}
