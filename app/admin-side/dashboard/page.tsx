import type { CSSProperties } from "react";
import QRCode from "react-qr-code";
import Navbar from "../../components/Navbar"


const attendanceRows = [
  { id: 1, name: "Denas Raditya", time: "09.00", status: "Hadir" },
  { id: 2, name: "Denas Raditya", time: "08.50", status: "Hadir" },
  { id: 3, name: "Denas Raditya", time: "09.00", status: "Hadir" },
  { id: 4, name: "Denas Raditya", time: "09.20", status: "Terlambat" },
  { id: 5, name: "Denas Raditya", time: "10.00", status: "Terlambat" },
  { id: 6, name: "Denas Raditya", time: "09.00", status: "Hadir" },
];

const statusStyles: Record<string, CSSProperties> = {
  Hadir: { backgroundColor: "#dcfce7", color: "#16a34a" },
  Terlambat: { backgroundColor: "#fee2e2", color: "#ef4444" },
};

function Avatar({ initials }: { initials: string }) {
  return (
    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-[10px] font-bold text-amber-600">
      {initials}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-white">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_1px_1px,rgba(244,161,52,0.12)_1px,transparent_0)] [background-size:24px_24px] opacity-50"
      />
      <Navbar />
      <section className="mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-6xl items-center px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <div className="grid w-full grid-cols-1 gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="space-y-6">
            <header className="max-w-xl">
              <h1 className="text-4xl font-extrabold tracking-tight text-amber-500 sm:text-5xl">
                Selamat datang!
              </h1>
              <p className="mt-2 text-sm font-medium leading-6 text-zinc-700 sm:text-lg">
                Jangan lupa scan absen kedatangan dan pulang hari ini
              </p>
            </header>

            <div
              id="status-absensi"
              className="rounded-[8px] border border-zinc-200 bg-white px-4 py-4 shadow-sm sm:px-8"
            >
              <div className="mb-4 flex items-center gap-2">
                <h2 className="text-xl font-bold text-zinc-900 sm:text-2xl">
                  Status <span className="text-amber-500">Absensi</span>
                </h2>
              </div>

              <div className="overflow-hidden">
                <table className="w-full border-collapse text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-zinc-200 text-zinc-400">
                      <th className="w-10 pb-3 font-normal">No</th>
                      <th className="pb-3 font-normal">Nama</th>
                      <th className="pb-3 text-right font-normal">Jam Hadir</th>
                      <th className="pb-3 text-right font-normal">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {attendanceRows.map((row) => (
                      <tr key={row.id} className="transition-colors hover:bg-zinc-50/70">
                        <td className="py-3 pr-2 text-center font-medium text-zinc-500">
                          {row.id}.
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-3">
                            <Avatar initials="DR" />
                            <span className="font-semibold text-zinc-600">
                              {row.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 text-right font-semibold text-zinc-500">
                          {row.time}
                        </td>
                        <td className="py-3 text-right">
                          <span
                            className="inline-flex rounded-full px-3 py-1 text-[11px] font-semibold"
                            style={statusStyles[row.status]}
                          >
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 text-center sm:text-left">
                <button className="text-[11px] font-semibold text-amber-500 transition-colors hover:text-amber-600">
                  lihat selengkapnya
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center lg:justify-end">
            <div className="flex flex-col items-center">
              <div
                id="qr-code"
                className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-zinc-200"
              >
                <QRCode
                  size={320}
                  value="https://attendance-app.example.com"
                  fgColor="#111111"
                  bgColor="#ffffff"
                  style={{
                    width: "100%",
                    height: "auto",
                    display: "block",
                  }}
                />
              </div>

              <p className="mt-7 text-sm font-medium text-zinc-500">
                Di perbarui dalam{" "}
                <span className="font-semibold text-zinc-700">05.44</span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
