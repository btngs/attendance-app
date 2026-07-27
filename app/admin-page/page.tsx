import React from "react";
import QRCode from "react-qr-code";

function Header() {
  return (
    <div className="flex flex-col items-start justify-center">
      <h1 className="text-5xl font-extrabold text-amber-500 tracking-tight">
        Selamat datang!
      </h1>
      <h3 className="mt-2 text-xl font-medium text-gray-800">
        Jangan lupa scan absen kedatangan dan pulang hari ini
      </h3>
    </div>
  );
}

function AttendanceCard() {
  const namelist = [
    { id: 1, name: "Joko Widodo", time: "09.15" },
    { id: 2, name: "Prabowo Subianto", time: "09.15" },
    { id: 3, name: "Mario Teguh", time: "09.15" },
    { id: 4, name: "Hotman Paris", time: "09.15" },
    { id: 5, name: "Dadan Hindayana", time: "09.15" },
    { id: 6, name: "Gibran Rakagooning", time: "09.15" },
  ];

  return (
    <div className="flex flex-col w-full">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">
          Status <span className="text-amber-500">Absensi</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-400">
                <th scope="col" className="pb-3 w-12 text-center font-normal">
                  No
                </th>
                <th scope="col" className="pb-3 pl-4 font-normal">
                  Nama
                </th>
                <th scope="col" className="pb-3 text-right font-normal">
                  Jam Hadir
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {namelist.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50">
                  <td className="py-3.5 text-center font-medium text-gray-500">
                    {item.id}.
                  </td>

                  <td className="py-3.5 pl-4">
                    <div className="flex items-center gap-4">
                      <div className="h-9 w-9 shrink-0 rounded-full bg-gray-300" />
                      <span className="font-semibold text-gray-600">
                        {item.name}
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 text-right font-semibold text-gray-500">
                    {item.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-2 text-right">
        <button className="text-[11px] font-medium text-gray-400 hover:text-gray-600">
          Lihat Selengkapnya
        </button>
      </div>
    </div>
  );
}

function QrCodeSection() {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="w-full max-w-95 p-2 bg-white">
        <QRCode
          size={380}
          style={{ height: "auto", maxWidth: "100%", width: "100%" }}
          value="https://kemasfoundation.org"
        />
      </div>

      <p className="mt-8 text-sm font-medium text-gray-500">
        Di perbarui dalam <span className="font-semibold text-gray-700">05.44</span>
      </p>
    </div>
  );
}

export default function MainPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
        <div className="flex flex-col gap-8 lg:col-span-6">
          <Header />
          <AttendanceCard />
        </div>

        <div className="flex items-center justify-center pt-2 lg:col-span-6">
          <QrCodeSection />
        </div>
      </div>
    </main>
  );
}