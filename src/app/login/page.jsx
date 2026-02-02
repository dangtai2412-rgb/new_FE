"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"

import { api_service } from "@/lib/api_service"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle
} from "lucide-react"

/* =====================
   TYPES
===================== */

type LoginResponse = {
  token?: string
  error?: string
}

/* =====================
   HELPER VALIDATE
===================== */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/* =====================
   PAGE
===================== */

export default function LoginPage() {

  /* ---------- STATE ---------- */

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const [remember, setRemember] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const router = useRouter()

  /* =====================
     FORM SUBMIT
  ===================== */

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setError("")
    setSuccess("")

    if (!validateForm()) return

    setLoading(true)

    try {
      const data: LoginResponse = await api_service.login(
        email.trim(),
        password
      )

      if (data?.token) {

        if (remember) {
          localStorage.setItem("token", data.token)
        } else {
          sessionStorage.setItem("token", data.token)
        }

        setSuccess("Đăng nhập thành công!")

        setTimeout(() => {
          router.push("/dashboard")
        }, 600)

      } else {
        setError(data?.error || "Sai email hoặc mật khẩu")
      }

    } catch (err) {
      console.error(err)
      setError("Không thể kết nối đến server")
    } finally {
      setLoading(false)
    }
  }

  /* =====================
     VALIDATION
  ===================== */

  const validateForm = () => {

    if (!email.trim()) {
      setError("Vui lòng nhập email")
      return false
    }

    if (!EMAIL_REGEX.test(email)) {
      setError("Email không đúng định dạng")
      return false
    }

    if (!password) {
      setError("Vui lòng nhập mật khẩu")
      return false
    }

    if (password.length < 4) {
      setError("Mật khẩu phải từ 4 ký tự trở lên")
      return false
    }

    return true
  }

  /* =====================
     UI
  ===================== */

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 via-white to-slate-100 px-4">

      <Card className="w-full max-w-md rounded-2xl shadow-2xl relative overflow-hidden">

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-20">
            <Loader2 size={40} className="animate-spin text-blue-600" />
          </div>
        )}

        <CardHeader className="space-y-3 text-center pb-2">

          <CardTitle className="text-4xl font-bold text-blue-600 tracking-wide">
            BizFlow
          </CardTitle>

          <p className="text-sm text-slate-500">
            Đăng nhập hệ thống quản lý doanh nghiệp
          </p>

        </CardHeader>

        <CardContent className="space-y-5">

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* ===== EMAIL ===== */}
            <div className="space-y-1">

              <label className="text-sm font-medium text-slate-600">
                Email
              </label>

              <div className="relative">

                <Mail
                  size={18}
                  className="absolute left-3 top-2.5 text-slate-400"
                />

                <Input
                  type="email"
                  className="pl-10 focus:ring-2 focus:ring-blue-500"
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={loading}
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
                  size={18}
                  className="absolute left-3 top-2.5 text-slate-400"
                />

                <Input
                  type={showPassword ? "text" : "password"}
                  className="pl-10 pr-10 focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  disabled={loading}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-blue-500"
                >
                  {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>

              </div>

            </div>

            {/* ===== REMEMBER ===== */}
            <div className="flex items-center justify-between text-sm">

              <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={() => setRemember(r => !r)}
                  className="rounded border-slate-300"
                />
                Ghi nhớ đăng nhập
              </label>

              <span className="text-blue-600 hover:underline cursor-pointer">
                Quên mật khẩu?
              </span>

            </div>

            {/* ===== ERROR ===== */}
            {error && (
              <div className="rounded-lg bg-red-100 px-3 py-2 text-sm text-red-600 animate-in fade-in">
                {error}
              </div>
            )}

            {/* ===== SUCCESS ===== */}
            {success && (
              <div className="rounded-lg bg-green-100 px-3 py-2 text-sm text-green-600 flex items-center gap-2 animate-in fade-in">
                <CheckCircle size={16}/>
                {success}
              </div>
            )}

            {/* ===== BUTTON ===== */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-5 transition-all shadow-lg"
            >
              Đăng nhập
            </Button>

          </form>

          <div className="pt-4 border-t text-center space-y-1">

            <p className="text-xs text-slate-400">
              © 2026 BizFlow System
            </p>

            <p className="text-xs text-slate-400">
              Phiên bản 1.0.0
            </p>

          </div>

        </CardContent>

      </Card>

    </div>
  )
}