"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { api_service } from "@/lib/api_service"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { Mail, Lock, Loader2 } from "lucide-react"

/* =====================
   TYPES
===================== */

type LoginResponse = {
  token?: string
  error?: string
}

/* =====================
   PAGE
===================== */

export default function LoginPage() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const router = useRouter()

  /* =====================
     HANDLER
  ===================== */

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    if (!validateForm()) return

    setLoading(true)

    try {
      const data: LoginResponse = await api_service.login(
        email.trim(),
        password
      )

      if (data?.token) {
        localStorage.setItem("token", data.token)
        router.push("/dashboard")
      } else {
        setError(data?.error || "Sai email hoặc mật khẩu")
      }

    } catch {
      setError("Không thể kết nối server")
    } finally {
      setLoading(false)
    }
  }

  /* =====================
     VALIDATE
  ===================== */

  const validateForm = () => {

    if (!email) {
      setError("Vui lòng nhập email")
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(email)) {
      setError("Email không đúng định dạng")
      return false
    }

    if (!password) {
      setError("Vui lòng nhập mật khẩu")
      return false
    }

    if (password.length < 4) {
      setError("Mật khẩu tối thiểu 4 ký tự")
      return false
    }

    return true
  }

  /* =====================
     UI
  ===================== */

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 to-slate-100 px-4">

      <Card className="w-full max-w-sm rounded-2xl shadow-2xl">

        <CardHeader className="space-y-2 text-center">

          <CardTitle className="text-3xl font-bold text-blue-600">
            BizFlow
          </CardTitle>

          <p className="text-sm text-slate-500">
            Hệ thống quản lý doanh nghiệp
          </p>

        </CardHeader>

        <CardContent>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* EMAIL */}
            <div className="space-y-1">

              <label className="text-sm text-slate-600">
                Email
              </label>

              <div className="relative">

                <Mail
                  size={18}
                  className="absolute left-3 top-2.5 text-slate-400"
                />

                <Input
                  type="email"
                  className="pl-10"
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={loading}
                />

              </div>

            </div>

            {/* PASSWORD */}
            <div className="space-y-1">

              <label className="text-sm text-slate-600">
                Mật khẩu
              </label>

              <div className="relative">

                <Lock
                  size={18}
                  className="absolute left-3 top-2.5 text-slate-400"
                />

                <Input
                  type="password"
                  className="pl-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  disabled={loading}
                />

              </div>

            </div>

            {/* ERROR */}
            {error && (
              <div className="rounded-lg bg-red-100 px-3 py-2 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* SUBMIT */}
            <Button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              {loading && (
                <Loader2
                  size={18}
                  className="animate-spin"
                />
              )}
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>

          </form>

          <div className="mt-5 text-center text-xs text-slate-400">
            © 2026 BizFlow System
          </div>

        </CardContent>

      </Card>

    </div>
  )
}

