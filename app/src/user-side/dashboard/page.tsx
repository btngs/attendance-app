"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// This route was left empty and unreferenced anywhere in the app.
// The real employee dashboard lives at /src/karyawan-side/absensi,
// so redirect here instead of shipping a blank/broken page.
export default function UserSideDashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/src/karyawan-side/absensi");
  }, [router]);

  return null;
}
