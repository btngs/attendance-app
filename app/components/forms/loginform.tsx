"use client";

import { useMemo } from "react";

type Role = "admin" | "karyawan";

interface LoginFormProps {
  role: Role;
  onRegisterClick: () => void;
}

export default function LoginForm({ role, onRegisterClick }: LoginFormProps) {
  const formConfig = useMemo(() => {
    if (role === "admin") {
      return {
        title: "Login Admin",
        description: "Masuk menggunakan Admin ID dan password.",
        primaryLabel: "Masuk sebagai Admin",
        usernameLabel: "Admin ID",
        usernamePlaceholder: "Masukkan Admin ID",
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

  return (
    <>
      <div className="mt-6 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3">
        <p className="text-sm font-semibold text-zinc-900">{formConfig.title}</p>
        <p className="mt-1 text-xs leading-5 text-zinc-600">
          {formConfig.description}
        </p>
      </div>

      <form className="mt-6 space-y-5">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-zinc-700">
            {formConfig.usernameLabel}
          </span>
          <input
            type="text"
            name="username"
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
          className="flex h-12 w-full items-center justify-center rounded-lg bg-amber-500 px-4 text-sm font-semibold text-white transition-colors hover:bg-amber-600"
        >
          {formConfig.primaryLabel}
        </button>
      </form>
    </>
  );
}
