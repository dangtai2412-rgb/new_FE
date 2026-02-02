"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api_service } from "@/lib/api_service";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { 
  Mail, 
  Lock, 
  Loader2, 
  Eye, 
  EyeOff, 
  CheckCircle 
} from "lucide-react";

export default function LoginPage() {

  /* =====================
     FORM STATE
  ===================== */

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  /* =====================
     UI STATE
  ===================== */

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const router = useRouter();

  /* =====================
     VALIDATION
  ===================== */

  const validateForm = () => {

    if (!email) {
      return "Vui lòng nhập email";
    }

    if (!email.match(/^\S+@\S+\.\S+$/)) {
      return "Email không đúng định dạng";
    }

    if (!password) {
      return "Vui lòng nhập mật khẩu";
    }

    if (password.length < 4) {
      return "Mật khẩu tối thiểu 4 ký tự";
    }

    return "";
  };

  /* =====================
     SUBMIT
  ===================== */

  const handle_submit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {

      const data = await api_service.login(email, password);

      if (data?.token) {

        if (remember) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("remember", "true");
        } else {
          sessionStorage.setItem("token", data.token);
        }

        setSuccess("Đăng nhập thành công! Đang chuyển trang...");

        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);

      } else {
        setError(data?.error || "Sai tài khoản hoặc mật khẩu");
      }

    } catch {
      setError("Không kết nối được server");
    } finally {
      setLoading(false);
    }
  };

  /* =====================
     UI
  ===================== */

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-slate-100">

      <Card className="w-[420px] shadow-2xl rounded-2xl animate-fade-in">

        {/* ===== HEADER ===== */}
        <CardHeader className="text-center space-y-2">

          <CardTitle className="text-3xl font-bold text-blue-600">
            BizFlow
          </CardTitle>

          <p className="text-slate-500 text-sm">
            Đăng nhập hệ thống quản lý doanh nghiệp
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

              <label className="text-sm font-medium text-slate-600">
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

              <label className="text-sm font-medium text-slate-600">
                Mật khẩu
              </label>

              <div className="relative">

                <Lock 
                  className="absolute left-3 top-2.5 text-slate-400" 
                  size={18} 
                />

                <Input
                  className="pl-10 pr-10"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>

              </div>

            </div>

            {/* ===== OPTIONS ===== */}
            <div className="flex justify-between items-center text-sm">

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={() => setRemember(!remember)}
                />
                Nhớ đăng nhập
              </label>

              <a 
                href="#" 
                className="text-blue-600 hover:underline"
              >
                Quên mật khẩu?
              </a>

            </div>

            {/* ===== ERROR ===== */}
            {error && (
              <div className="bg-red-100 text-red-600 px-3 py-2 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* ===== SUCCESS ===== */}
            {success && (
              <div className="bg-green-100 text-green-600 px-3 py-2 rounded-lg text-sm flex items-center gap-2">
                <CheckCircle size={16}/>
                {success}
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

          {/* ===== DIVIDER ===== */}
          <div className="my-6 flex items-center gap-3 text-slate-400 text-xs">
            <div className="flex-1 h-px bg-slate-200"></div>
            Hoặc
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>

          {/* ===== SOCIAL LOGIN (FAKE) ===== */}
          <div className="space-y-3">

            <Button 
              variant="outline" 
              className="w-full"
            >
              Đăng nhập với Google
            </Button>

            <Button 
              variant="outline" 
              className="w-full"
            >
              Đăng nhập với Facebook
            </Button>

          </div>

          {/* ===== FOOTER ===== */}
          <div className="mt-6 text-center text-xs text-slate-400">
            © 2026 BizFlow System · All rights reserved
          </div>

        </CardContent>

      </Card>

    </div>
  );
}
