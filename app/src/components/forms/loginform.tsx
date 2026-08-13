'use client';

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import API from "../../services/api";

type Role = "admin" | "karyawan";

interface LoginFormProps {
  role: Role;
  onRegisterClick: () => void;
}

export default function LoginForm({ role, onRegisterClick }: LoginFormProps) {
  const router = useRouter();

  // State Form
  const [identifier, setIdentifier] = useState(""); // Email atau Admin ID
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const formConfig = useMemo(() => {
    if (role === "admin") {
      return {
        title: "Login Admin",
        description: "Masuk menggunakan Admin ID dan password.",
        primaryLabel: "Masuk sebagai Admin",
        usernameLabel: "Email",
        usernamePlaceholder: "Masukkan Email Admin",
      };
    }

    return {
      title: "Login Karyawan",
      description: "Masuk menggunakan email dan password.",
      primaryLabel: "Masuk sebagai Karyawan",
      usernameLabel: "Email",
      usernamePlaceholder: "Email Address",
    };
  }, [role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      // Mengirimkan request login ke backend Express di Vercel
      const response = await API.post("/auth/login", {
        email: identifier, // Jika admin ID diisi di field ini, disesuaikan dengan parameter backend
        password,
      });

      const { accessToken, user } = response.data;

      // Simpan Token & Data User di localStorage
      if (accessToken) {
        localStorage.setItem("token", accessToken);
        localStorage.setItem("user", JSON.stringify(user));
      }

      // Navigasi ke Dashboard sesuai role
      if (role === "admin" || user?.role === "admin") {
        router.push("/src/admin-side/dashboard");
      } else {
        router.push("/src/karyawan-side/absensi");
      }
    } catch (err: unknown) {
      console.error("Login Error:", err);

      let message = "Login gagal. Silakan periksa kembali kredensial Anda.";

      if (
        err &&
        typeof err === "object" &&
        "response" in err
      ) {
        const axiosError = err as {
          response?: { data?: { message?: string } };
        };

        message = axiosError.response?.data?.message ?? message;
      }

      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mt-6 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3">
        <p className="text-sm font-semibold text-zinc-900">{formConfig.title}</p>
        <p className="mt-1 text-xs leading-5 text-zinc-600">
          {formConfig.description}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        {/* Notifikasi Error */}
        {errorMessage && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {errorMessage}
          </div>
        )}

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-zinc-700">
            {formConfig.usernameLabel}
          </span>
          <input
            type={role === "karyawan" ? "email" : "text"}
            name="identifier"
            required
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            autoComplete="username"
            placeholder={formConfig.usernamePlaceholder}
            className="block h-12 w-full rounded-lg border border-zinc-200 bg-white px-4 text-base text-zinc-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-zinc-700">
            Password
          </span>
          <input
            type="password"
            name="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            placeholder="Password"
            className="block h-12 w-full rounded-lg border border-zinc-200 bg-white px-4 text-base text-zinc-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
          />
        </label>

        {role === "karyawan" && (
          <div className="flex items-center justify-center gap-1 text-sm">
            <span className="text-zinc-500">Belum punya akun?</span>
            <button
              type="button"
              onClick={onRegisterClick}
              className="font-semibold text-amber-500 transition-colors hover:text-amber-600"
            >
              Registrasi disini
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex h-12 w-full items-center justify-center rounded-lg bg-amber-500 px-4 text-sm font-semibold text-white transition-colors hover:bg-amber-600 disabled:opacity-50"
        >
          {loading ? "Memproses..." : formConfig.primaryLabel}
        </button>
      </form>
    </>
  );
}