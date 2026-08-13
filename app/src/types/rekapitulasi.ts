export type StatusKehadiran =
  | "Hadir"
  | "Tidak hadir"
  | "Terlambat"
  | "Izin"
  | "WFH"
  | "Sakit";

export interface RiwayatKehadiran {
  id: string | number;
  tanggal: string;
  namaKaryawan: string;
  waktuMasuk: string | null;
  waktuKeluar: string | null;
  keterlambatanMenit: number | null;
  status: StatusKehadiran;
}

export type SortOption =
  | "terbaru"
  | "7_hari_terakhir"
  | "1_bulan_terakhir"
  | "3_bulan_terakhir";