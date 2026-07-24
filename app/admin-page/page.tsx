function Header() {
    return(
    <div className="flex flex-col flex-1 items-start justify-center ">
        <h1 className="font-bold text-5xl text-orange-500">Selamat Datang!</h1>
        <h3 className="font-medium text-2xl">Jangan lupa scan absen kedatangan dan pulang hari ini</h3>
    </div>
    )
}

function AttendanceCard() {
    return(
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
            <table className="w-full border-collapse bg-white text-left text-sm text-black">
                <thead className="bg-orange-500">
                    <tr>
                        <th scope="col" className="px-6 py-4 font-medium text-white">No</th>
                        <th scope="col" className="px-6 py-4 font-medium text-white">Nama</th>
                        <th scope="col" className="px-6 py-4 font-medium text-white">Jam Hadir</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 border-t border-gray-100">
                    <tr className="hover:bg-gray-50 odd:bg-white even:bg-slate-50/50">
                        <td className="px-6 py-4 font-medium text-gray-900">1</td>
                        <td className="px-6 py-4 font-medium text-gray-900">Bintang</td>
                        <td className="px-6 py-4 font-medium text-gray-900">09:00</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default function MainPage() {
 return(
    <div className="flex flex-col items-center ">
        <div className="flex flex-1 items-center justify-center">
            <Header />
        </div>
        <AttendanceCard />
    </div>
 );
}