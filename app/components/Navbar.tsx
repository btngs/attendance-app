import logo from "../src/assets/logo-kemas.png";
import Image from "next/image";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 mb-12 w-full border-b border-zinc-200 bg-white">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-3 items-center px-5 py-4 sm:px-8 lg:px-10">
        <div className="justify-self-start">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-22 items-center justify-center">
              <Image
                src={logo}
                alt="Kemas Foundation"
                width={128}
                height={128}
                priority
              />
            </div>
          </div>
        </div>

        <nav className="hidden items-center justify-center gap-2 justify-self-center bg-white px-2 py-1 sm:flex">
          <a
            href="/admin-side/dashboard"
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-[#FFF3D6] hover:text-[#F5A623]" 
          >
            Dashboard
          </a>
          <a
            href="/recap"
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-amber-50 hover:text-amber-600"
          >
            Barcode 
          </a>
          <a
            href="/admin-side/recap"
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-amber-50 hover:text-amber-600"
          >
            Rekapitulasi
          </a>
        </nav>

        <div className="flex justify-end justify-self-end">
          <button
            type="button"
            aria-label="User profile"
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path d="M20 21a8 8 0 0 0-16 0" />
              <circle cx="12" cy="8" r="4" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
