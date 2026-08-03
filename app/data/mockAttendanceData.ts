// Tipe data untuk absensi (Interface)
export interface AttendanceRecord {
  date: string;
  employeeId: string;
  employeeName: string;
  timeIn: string | null;
  timeOut: string | null;
  totalHours: string | null;
  lateDuration: string | null;
  status: 'hadir' | 'tidak hadir' | 'terlambat' | 'izin' | 'wfh' | 'sakit';
}

// Data dummy (nanti dihapus saat backend siap)
export const mockAttendanceData: AttendanceRecord[] = [
  {
    date: '12/04/2026',
    employeeId: 'I-009212',
    employeeName: 'Denias Raditya',
    timeIn: '09:15',
    timeOut: '09:15',
    totalHours: '8j',
    lateDuration: '0 mnt',
    status: 'hadir'
  },
  {
    date: '12/04/2026',
    employeeId: 'P-009212',
    employeeName: 'Bintang Syahri Mahardika',
    timeIn: null,
    timeOut: null,
    totalHours: null,
    lateDuration: null,
    status: 'tidak hadir'
  },
  {
    date: '12/04/2026',
    employeeId: 'P-009212',
    employeeName: 'Muhamad Attilla Priyanto',
    timeIn: '09:15',
    timeOut: '09:15',
    totalHours: '8j',
    lateDuration: '12 mnt',
    status: 'terlambat'
  },
  {
    date: '12/04/2026',
    employeeId: 'C-009212',
    employeeName: 'Denias Raditya',
    timeIn: null,
    timeOut: null,
    totalHours: null,
    lateDuration: null,
    status: 'izin'
  },
  {
    date: '12/04/2026',
    employeeId: 'C-009212',
    employeeName: 'Denias Raditya',
    timeIn: null,
    timeOut: null,
    totalHours: null,
    lateDuration: null,
    status: 'wfh'
  },
  {
    date: '12/04/2026',
    employeeId: 'P-009212',
    employeeName: 'Denias Raditya',
    timeIn: null,
    timeOut: null,
    totalHours: null,
    lateDuration: null,
    status: 'sakit'
  }
];