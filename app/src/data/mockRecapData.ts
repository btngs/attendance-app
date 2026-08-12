// Dummy recap data used for testing and preview in admin recap pages
export const mockRecapData = Array.from({ length: 15 }, (_, i) => ({
  id: `EMP-${i + 1}`,
  date: "2026-08-03",
  employeeId: `P-00${i + 1}`,
  employeeName: `Karyawan Contoh ${i + 1}`,
  role: i % 2 === 0 ? "Tetap" : "Magang",
  timeIn: "08:00",
  timeOut: "17:00",
  status: i % 3 === 0 ? "terlambat" : "hadir",
}));

export default mockRecapData;
