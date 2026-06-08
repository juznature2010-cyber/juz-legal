"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { mapSupabaseAuthError } from "@/lib/auth-utils";
import {
  getPostAuthPath,
  getSafeCallbackUrl,
  isReservedAdminEmail,
  resolveUserRoleClient,
} from "@/lib/auth-client";

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = getSafeCallbackUrl(searchParams.get("callbackUrl"));
  const supabase = useMemo(
    () => (isSupabaseConfigured() ? createClient() : null),
    []
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const loginHref = callbackUrl
    ? `/dang-nhap?callbackUrl=${encodeURIComponent(callbackUrl)}`
    : "/dang-nhap";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const trimmedEmail = email.trim();

    if (isReservedAdminEmail(trimmedEmail)) {
      setError("Email này dành cho quản trị viên. Vui lòng dùng email khác.");
      return;
    }

    if (password.length < 8) {
      setError("Mật khẩu phải có ít nhất 8 ký tự.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setLoading(true);

    if (!supabase) {
      setError("Hệ thống đăng ký chưa được cấu hình. Vui lòng thử lại sau.");
      setLoading(false);
      return;
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: trimmedEmail,
      password,
      options: {
        data: {
          full_name: name.trim(),
          phone: phone.trim() || null,
        },
      },
    });

    if (signUpError) {
      setError(mapSupabaseAuthError(signUpError.message));
      setLoading(false);
      return;
    }

    if (data.user && !data.session) {
      setSuccess(
        "Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản, sau đó đăng nhập."
      );
      setLoading(false);
      return;
    }

    if (data.user && data.session) {
      const role = await resolveUserRoleClient(supabase, data.user);
      router.push(getPostAuthPath(role, callbackUrl));
      router.refresh();
      setLoading(false);
      return;
    }

    setError("Không thể tạo tài khoản. Vui lòng thử lại.");
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <Label htmlFor="name">Họ và tên *</Label>
        <Input
          id="name"
          name="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1.5"
          placeholder="Nguyễn Văn A"
        />
      </div>
      <div>
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1.5"
          placeholder="email@example.com"
        />
      </div>
      <div>
        <Label htmlFor="phone">Số điện thoại</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="mt-1.5"
          placeholder="0901234567"
        />
      </div>
      <div>
        <Label htmlFor="password">Mật khẩu *</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1.5"
        />
        <p className="mt-1 text-xs text-muted">Tối thiểu 8 ký tự</p>
      </div>
      <div>
        <Label htmlFor="confirmPassword">Xác nhận mật khẩu *</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mt-1.5"
        />
      </div>

      {error && (
        <p className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {success && (
        <p className="rounded border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          {success}{" "}
          <Link href={loginHref} className="font-medium text-navy underline">
            Đăng nhập
          </Link>
        </p>
      )}

      <Button type="submit" variant="gold" size="lg" className="w-full" disabled={loading}>
        {loading ? "Đang đăng ký..." : "Đăng ký"}
      </Button>

      <p className="text-center text-sm text-muted">
        Đã có tài khoản?{" "}
        <Link
          href={loginHref}
          className="font-medium text-navy underline-offset-4 hover:underline"
        >
          Đăng nhập
        </Link>
      </p>
    </form>
  );
}
