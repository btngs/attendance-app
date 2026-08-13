/**
 * Shared helpers for the employee-facing attendance pages.
 *
 * The backend response shape isn't fully documented, so these helpers
 * accept every field-name variant we've seen elsewhere in the codebase
 * (see admin-side/recap and admin-side/dashboard). If your backend uses
 * different field names, add them to the relevant `??` chain below.
 */

export type SimpleStatus = "hadir" | "sakit" | "izin" | "tidak-hadir";

export interface RawAttendanceRecord {
  id?: number | string;
  _id?: number | string;

  userId?: number | string;
  user_id?: number | string;
  employeeId?: number | string;

  employeeName?: string;
  employee_name?: string;
  namaKaryawan?: string;
  name?: string;
  userName?: string;

  date?: string;
  tanggal?: string;
  attendance_date?: string;

  checkIn?: string | null;
  check_in?: string | null;
  waktuMasuk?: string | null;

  checkOut?: string | null;
  check_out?: string | null;
  waktuKeluar?: string | null;

  status?: string;
  attendance_status?: string;
}

/** Pull an array of records out of whatever shape the API responds with. */
export function extractAttendanceArray(
  responseData: unknown,
): RawAttendanceRecord[] {
  if (Array.isArray(responseData)) {
    return responseData as RawAttendanceRecord[];
  }

  if (
    responseData &&
    typeof responseData === "object" &&
    "data" in responseData
  ) {
    const data = (responseData as { data?: unknown }).data;

    if (Array.isArray(data)) {
      return data as RawAttendanceRecord[];
    }
  }

  return [];
}

/** Collapse the many possible backend status strings into the 4 buckets the UI uses. */
export function normalizeSimpleStatus(raw: string | undefined): SimpleStatus {
  const value = (raw ?? "").trim().toLowerCase();

  if (
    value === "hadir" ||
    value === "present" ||
    value === "terlambat" ||
    value === "late"
  ) {
    return "hadir";
  }

  if (value === "sakit" || value === "sick") {
    return "sakit";
  }

  if (
    value === "izin" ||
    value === "cuti" ||
    value === "leave" ||
    value === "wfh"
  ) {
    return "izin";
  }

  return "tidak-hadir";
}

/** Does this raw record belong to the given logged-in user? */
export function belongsToUser(
  record: RawAttendanceRecord,
  userId: string | number | undefined,
  userName: string | undefined,
): boolean {
  const recordUserId = record.userId ?? record.user_id ?? record.employeeId;

  if (userId !== undefined && recordUserId !== undefined) {
    return String(recordUserId) === String(userId);
  }

  // Fallback: some endpoints may not include a userId on each record.
  const recordName =
    record.namaKaryawan ??
    record.employeeName ??
    record.employee_name ??
    record.userName ??
    record.name;

  if (userName && recordName) {
    return recordName.trim().toLowerCase() === userName.trim().toLowerCase();
  }

  return false;
}

export function getRecordDate(record: RawAttendanceRecord): string {
  return record.tanggal ?? record.date ?? record.attendance_date ?? "";
}

export function getRecordCheckIn(record: RawAttendanceRecord): string {
  return record.waktuMasuk ?? record.checkIn ?? record.check_in ?? "";
}

export function getRecordCheckOut(record: RawAttendanceRecord): string {
  return record.waktuKeluar ?? record.checkOut ?? record.check_out ?? "";
}

/** "Senin, 3 Agustus" */
export function formatShortDate(dateStr: string): string {
  const date = new Date(dateStr);

  if (Number.isNaN(date.getTime())) return dateStr || "-";

  return date.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

/** "Agustus 2026" */
export function formatMonthYear(dateStr: string): string {
  const date = new Date(dateStr);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });
}

/** True if the ISO date string falls on today's calendar date. */
export function isToday(dateStr: string): boolean {
  const date = new Date(dateStr);

  if (Number.isNaN(date.getTime())) return false;

  const now = new Date();

  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}
