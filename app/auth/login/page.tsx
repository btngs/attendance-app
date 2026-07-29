"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import logo from "../../src/assets/logo-kemas.png";

type Role = "admin" | "karyawan";

export default function AuthPage() {
  const [role, setRole] = useState<Role>("admin");

  const formConfig = useMemo(() => {
    if (role === "admin") {
      return {
        title: "Login Admin",
        description: "Masuk menggunakan Admin ID dan password.",
        primaryLabel: "Masuk sebagai Admin",
        usernameLabel: "Admin ID",
        usernamePlaceholder: "Masukkan Admin ID",
        helperText: "Gunakan akun admin yang terdaftar.",
      };
    }

    return {
      title: "Login Karyawan",
      description: "Masuk menggunakan email dan password.",
      primaryLabel: "Masuk sebagai Karyawan",
      usernameLabel: "Email",
      usernamePlaceholder: "Email Address",
      helperText: "Gunakan akun karyawan yang terdaftar.",
    };
  }, [role]);

  return (
    <main className="min-h-screen bg-white">
      <section className="grid min-h-screen grid-cols-1 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="flex items-center justify-center bg-white px-6 py-12 sm:px-10 lg:px-12">
          <div className="flex w-full max-w-lg flex-col items-center text-center">
            <div className="flex h-44 w-44 items-center justify-center sm:h-42 sm:w-52">
              <Image
                src={logo}
                alt="Kemas Foundation"
                width={720}
                height={720}
                priority
              />
            </div>
            <div className="mt-4 space-y-3">
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
                Sistem Absensi Kemas
              </h1>
              <p className="mx-auto max-w-md text-sm leading-6 text-zinc-600 sm:text-base">
                Kelola absesnsi dengan mudah dan efisien menggunakan Sistem Absensi Kemas
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center bg-[linear-gradient(135deg,#fff8ef_0%,#ffe7c1_100%)] px-6 py-12 sm:px-10 lg:px-12">
          <div className="w-full max-w-md rounded-xl border border-white/60 bg-white p-6 shadow-[0_18px_60px_rgba(0,0,0,0.08)] sm:p-8">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-3xl font-bold tracking-tight text-amber-500">
                  Login
                </p>
                <p className="mt-1 text-sm text-zinc-500">
                  Login ke dashboard karyawan atau admin
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-2 rounded-lg bg-zinc-100 p-1">
              <button
                type="button"
                onClick={() => setRole("karyawan")}
                className={`rounded-md px-4 py-2 text-sm font-semibold transition ${
                  role === "karyawan"
                    ? "bg-white text-zinc-900 shadow-sm"
                    : "text-zinc-500"
                }`}
              >
                Karyawan
              </button>
              <button
                type="button"
                onClick={() => setRole("admin")}
                className={`rounded-md px-4 py-2 text-sm font-semibold transition ${
                  role === "admin"
                    ? "bg-white text-zinc-900 shadow-sm"
                    : "text-zinc-500"
                }`}
              >
                Admin
              </button>
            </div>

            <div className="mt-6 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3">
              <p className="text-sm font-semibold text-zinc-900">
                {formConfig.title}
              </p>
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
          </div>
        </div>
      </section>
    </main>
  );
}
