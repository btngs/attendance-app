import Image from "next/image";
import Link from "next/link";
import logo from "../../src/assets/logo-kemas.png";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-linear-to-br from-white to-amber-100 px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md items-center justify-center">
        <div className="w-full">
          <div className="mx-auto flex flex-col items-center text-center">
            <div className="flex h-32 w-32 items-center justify-center">
              <Image
                src={logo}
                alt="Kemas Foundation"
                width={256}
                height={256}
                priority
              />
            </div>
          </div>

          <div className="mt-8 rounded-[14px] border border-zinc-200 bg-white p-6 shadow-[0_18px_60px_rgba(0,0,0,0.06)] sm:p-8">
            <div className="flex flex-col  text-left">
              <h2 className="text-2xl font-bold tracking-tight text-amber-500">
                Sign in
              </h2>
              <p className="mt-1 max-w-sm leading-6 text-zinc-600 text-sm">
                Masuk untuk lanjut ke dashboard karyawan
              </p>
            </div>

            <form className="mt-8 space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-zinc-700">
                  Email
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Email Address"
                  required
                  className="block h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 text-base text-zinc-900 outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-zinc-700">
                  Password
                </span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Password"
                  required
                  className="block h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 text-base text-zinc-900 outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
              </label>

              <div className="flex items-center justify-between gap-4">
                <label className="flex items-center gap-2 text-sm text-zinc-600">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-zinc-300 text-amber-500 focus:ring-amber-100"
                  />
                  Ingat saya
                </label>

                <Link
                  href="#"
                  className="text-sm font-semibold text-amber-500 transition-colors hover:text-amber-600"
                >
                  Lupa password?
                </Link>
              </div>

              <button
                type="submit"
                className="flex h-12 w-full items-center justify-center rounded-xl bg-amber-500 px-4 text-sm font-semibold text-white transition-colors hover:bg-amber-600"
              >
                Sign in
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-zinc-500">
              Belum punya akun?{" "}
              <Link
                href="#"
                className="font-semibold text-amber-500 transition-colors hover:text-amber-600"
              >
                Daftar disini
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
