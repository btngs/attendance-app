import type {
  SortOption,
  StatusKehadiran,
} from "../types/rekapitulasi";

export const STATUS_STYLES: Record<
  StatusKehadiran,
  {
    background: string;
    color: string;
    label: string;
  }
> = {
  Hadir: {
    background: "#eaf8e9",
    color: "#55b65a",
    label: "Hadir",
  },

  "Tidak hadir": {
    background: "#ffe8e8",
    color: "#ef6262",
    label: "Tidak hadir",
  },

  Terlambat: {
    background: "#fff2d8",
    color: "#e7a329",
    label: "Terlambat",
  },

  Izin: {
    background: "#e4f2ff",
    color: "#4da3e6",
    label: "Izin",
  },

  WFH: {
    background: "#e4f2ff",
    color: "#4da3e6",
    label: "WFH",
  },

  Sakit: {
    background: "#e4f2ff",
    color: "#4da3e6",
    label: "Sakit",
  },
};

export const SORT_OPTIONS: {
  value: SortOption;
  label: string;
}[] = [
  {
    value: "terbaru",
    label: "Terbaru",
  },
  {
    value: "7_hari_terakhir",
    label: "7 hari terakhir",
  },
  {
    value: "1_bulan_terakhir",
    label: "1 bulan terakhir",
  },
  {
    value: "3_bulan_terakhir",
    label: "3 bulan terakhir",
  },
];

export const TABLE_COLUMNS = [
  "Tanggal",
  "Nama Karyawan",
  "Waktu Masuk",
  "Waktu Keluar",
  "Keterlambatan",
  "Status kehadiran",
] as const;