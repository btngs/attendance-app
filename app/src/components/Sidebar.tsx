"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import API from "../services/api";
import logo from "../assets/logo-kemas.png";
import { LayoutGrid, Barcode, FileText, Users, LogOut } from "lucide-react";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error("Gagal parsing data user:", error);
          router.push("/src/auth/login");
        }
      } else {
        router.push("/src/auth/login");
      }
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [router]);

  const handleLogout = async () => {
    try {
      await API.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Hapus data dari localStorage saat logout
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/src/auth/login");
    }
  };

  const menuItems = [
    { name: "Dashboard", path: "/src/admin-side/dashboard", icon: LayoutGrid },
    { name: "Barcode", path: "/src/admin-side/barcode", icon: Barcode },
    { name: "Rekapitulasi", path: "/src/admin-side/recap", icon: FileText },
    { name: "Karyawan", path: "/src/admin-side/karyawan", icon: Users },
  ];

  const isActive = (path: string) => pathname === path;

  // Tampilkan loading sederhana sambil cek localStorage
  if (!user) {
    return (
      <aside
        style={{
          width: "260px",
          backgroundColor: "#FDF6E3",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ color: "#e8a838" }}>Loading...</div>
      </aside>
    );
  }

  return (
    <aside
      style={{
        width: "260px",
        backgroundColor: "#FDF6E3",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: "24px 16px",
        position: "fixed",
        left: 0,
        top: 0,
        boxShadow: "2px 0 8px rgba(0,0,0,0.05)",
      }}
    >
      {/* Logo */}
      <div
        style={{
          marginBottom: "32px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Image
          src={logo}
          alt="Kemas Foundation"
          width={120}
          height={50}
          style={{ objectFit: "contain" }}
          priority
        />
      </div>

      {/* Profile Section */}
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "12px",
          padding: "16px",
          marginBottom: "32px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            backgroundColor: "#e8a838",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: "20px",
            fontWeight: "600",
          }}
        >
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt="Profile"
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          ) : user?.name ? (
            user.name.charAt(0).toUpperCase()
          ) : (
            "A"
          )}
        </div>
        <div>
          <div
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "#333",
            }}
          >
            {user?.name || "Admin"}
          </div>
          <div
            style={{
              fontSize: "12px",
              color: "#999",
            }}
          >
            {user?.role || "Admin"}
          </div>
        </div>
      </div>

      {/* Menu Navigation */}
      <nav style={{ flex: 1 }}>
        {menuItems.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;

          return (
            <a
              key={item.name}
              href={item.path}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 16px",
                marginBottom: "8px",
                borderRadius: "8px",
                textDecoration: "none",
                backgroundColor: active ? "#e8a838" : "transparent",
                color: active ? "#fff" : "#555",
                fontWeight: active ? "600" : "500",
                transition: "all 0.2s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = "#fef3e2";
                  e.currentTarget.style.color = "#e8a838";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#555";
                }
              }}
            >
              <Icon size={20} />
              <span style={{ fontSize: "14px" }}>{item.name}</span>
            </a>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div style={{ marginTop: "auto" }}>
        <button
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            width: "100%",
            padding: "12px 16px",
            border: "none",
            backgroundColor: "transparent",
            color: "#f44336",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#fde8e8")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
        >
          <LogOut size={20} />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
}
