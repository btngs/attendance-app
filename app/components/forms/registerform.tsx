"use client";

interface RegisterFormProps {
  onBackClick: () => void;
}

export default function RegisterForm({ onBackClick }: RegisterFormProps) {
  return (
    <>
      <div className="mt-6 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3">
        <p className="text-sm font-semibold text-zinc-900">Registrasi</p>
        <p className="mt-1 text-xs leading-5 text-zinc-600">
          Lengkapi data untuk membuat akun baru.
        </p>
      </div>

      <form className="mt-6 space-y-5">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-zinc-700">
            Username
          </span>
          <input
            type="text"
            name="register_username"
            placeholder="Username"
            className="block h-12 w-full rounded-lg border border-zinc-200 bg-white px-4 text-base text-zinc-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-zinc-700">
            Email
          </span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            placeholder="Email"
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
            autoComplete="new-password"
            placeholder="Password"
            className="block h-12 w-full rounded-lg border border-zinc-200 bg-white px-4 text-base text-zinc-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
          />
        </label>

        <p className="text-xs text-zinc-500">
          Pastikan data yang dimasukkan sesuai dengan role yang dipilih.
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onBackClick}
            className="flex h-12 flex-1 items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-700 transition-colors hover:border-amber-300 hover:bg-amber-50 hover:text-amber-600"
          >
            Kembali
          </button>
          <button
            type="submit"
            className="flex h-12 flex-1 items-center justify-center rounded-lg bg-amber-500 px-4 text-sm font-semibold text-white transition-colors hover:bg-amber-600"
          >
            Daftar Sekarang
          </button>
        </div>
      </form>
    </>
  );
}
