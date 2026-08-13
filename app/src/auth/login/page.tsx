"use client";

import { useState } from "react";
import Image from "next/image";
import logo from "../../assets/logo-kemas.png";
import LoginForm from "../../components/forms/loginform";
import RegisterForm from "../../components/forms/registerform";

type Role = "admin" | "karyawan";
type Mode = "login" | "register";

export default function AuthPage() {
  const [role, setRole] = useState<Role>("karyawan");
  const [mode, setMode] = useState<Mode>("login");

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
                Kelola absesnsi dengan mudah dan efisien menggunakan Sistem
                Absensi Kemas
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center bg-[linear-gradient(135deg,#fff8ef_0%,#ffe7c1_100%)] px-6 py-12 sm:px-10 lg:px-12">
          <div className="w-full max-w-md rounded-xl border border-white/60 bg-white p-6 shadow-[0_18px_60px_rgba(0,0,0,0.08)] sm:p-8">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-3xl font-bold tracking-tight text-amber-500">
                  {mode === "register" ? "Register" : "Login"}
                </p>
                <p className="mt-1 text-sm text-zinc-500">
                  Login ke dashboard karyawan atau admin
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-2 rounded-lg bg-zinc-100 p-1">
              <button
                type="button"
                onClick={() => {
                  setRole("karyawan");
                  setMode("login");
                }}
                className={`rounded-md px-4 py-2 text-sm font-semibold transition ${
                  role === "karyawan" && mode === "login"
                    ? "bg-white text-zinc-900 shadow-sm"
                    : "text-zinc-500"
                }`}
              >
                Karyawan
              </button>
              <button
                type="button"
                onClick={() => {
                  setRole("admin");
                  setMode("login");
                }}
                className={`rounded-md px-4 py-2 text-sm font-semibold transition ${
                  role === "admin" && mode === "login"
                    ? "bg-white text-zinc-900 shadow-sm"
                    : "text-zinc-500"
                }`}
              >
                Admin
              </button>
            </div>

            {mode === "login" ? (
              <LoginForm
                role={role}
                onRegisterClick={() => setMode("register")}
              />
            ) : (
              <RegisterForm onBackClick={() => setMode("login")} />
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
