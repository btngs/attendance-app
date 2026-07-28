import React from "react";
import Navbar from "../components/Navbar";

export default function RecapPage() {
    return(
        <main className="min-h-screen bg-white">
            <Navbar />
            <section className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
                <div className="rounded-[20px] border border-zinc-200 bg-white p-6 shadow-sm">
                    <h1 className="text-2xl font-semibold text-zinc-900">Rekapitulasi</h1>
                    <p className="mt-2 text-sm text-zinc-600">
                        Halaman ini memakai spacing yang sama dengan dashboard utama.
                    </p>
                </div>
            </section>
        </main>
    );
}   
