"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import API from "../services/api";
import logo from "../assets/logo-kemas.png";
import {
  LayoutGrid,
  Barcode,
  FileText,
  Users,
  LogOut,
  UserPen,
} from "lucide-react";

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  /**
   * Ambil data user dari localStorage.
   */
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

  /**
   * Tutup dropdown ketika user klik di luar profile.
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /**
   * Logout user.
   */
  const handleLogout = async () => {
    try {
      await API.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      router.push("/src/auth/login");
    }
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: "/src/admin-side/dashboard",
      icon: LayoutGrid,
    },
    {
      name: "Barcode",
      path: "/src/admin-side/barcode",
      icon: Barcode,
    },
    {
      name: "Rekapitulasi",
      path: "/src/admin-side/recap",
      icon: FileText,
    },
    {
      name: "Karyawan",
      path: "/src/admin-side/karyawan",
      icon: Users,
    },
  ];

  const isActive = (path: string) => pathname === path;

  /**
   * Loading state.
   */
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
          position: "fixed",
          left: 0,
          top: 0,
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
        zIndex: 100,
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

      {/* Profile + Dropdown */}
      <div
        ref={dropdownRef}
        style={{
          marginBottom: "32px",
          position: "relative",
        }}
      >
        {/* Profile Card */}
        <div
          onClick={() => setIsDropdownOpen((previous) => !previous)}
          style={{
            backgroundColor: "#fff",
            borderRadius: "12px",
            padding: "16px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            cursor: "pointer",
            transition: "box-shadow 0.2s",
            border: isDropdownOpen
              ? "2px solid #e8a838"
              : "2px solid transparent",
          }}
          onMouseEnter={(event) => {
            if (!isDropdownOpen) {
              event.currentTarget.style.boxShadow =
                "0 4px 12px rgba(0,0,0,0.1)";
            }
          }}
          onMouseLeave={(event) => {
            if (!isDropdownOpen) {
              event.currentTarget.style.boxShadow =
                "0 2px 8px rgba(0,0,0,0.05)";
            }
          }}
        >
          {/* Avatar */}
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
              flexShrink: 0,
              overflow: "hidden",
            }}
          >
            {user.avatar ? (
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
            ) : (
              user.name?.charAt(0).toUpperCase() || "A"
            )}
          </div>

          {/* User Information */}
          <div
            style={{
              flex: 1,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "#333",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user.name || "Admin"}
            </div>

            <div
              style={{
                fontSize: "12px",
                color: "#999",
                textTransform: "capitalize",
              }}
            >
              {user.role || "Admin"}
            </div>
          </div>
        </div>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              marginTop: "8px",
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              padding: "8px 0",
              zIndex: 1000,
              border: "1px solid #f0f0f0",
            }}
          >
            {/* Edit Profile */}
            <button
              type="button"
              onClick={() => {
                router.push("/src/admin-side/edit-profile");
                setIsDropdownOpen(false);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                width: "100%",
                padding: "10px 16px",
                border: "none",
                backgroundColor: "transparent",
                cursor: "pointer",
                fontSize: "14px",
                color: "#333",
                textAlign: "left",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(event) => {
                event.currentTarget.style.backgroundColor = "#fef3e2";
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <UserPen size={18} color="#e8a838" />
              <span>Edit profile</span>
            </button>

            {/* Divider */}
            <div
              style={{
                borderTop: "1px solid #f0f0f0",
                margin: "8px 0",
              }}
            />

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                width: "100%",
                padding: "10px 16px",
                border: "none",
                backgroundColor: "transparent",
                cursor: "pointer",
                fontSize: "14px",
                color: "#f44336",
                textAlign: "left",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(event) => {
                event.currentTarget.style.backgroundColor = "#fde8e8";
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <LogOut size={18} />
              <span>Keluar</span>
            </button>
          </div>
        )}
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
              onMouseEnter={(event) => {
                if (!active) {
                  event.currentTarget.style.backgroundColor = "#fef3e2";
                  event.currentTarget.style.color = "#e8a838";
                }
              }}
              onMouseLeave={(event) => {
                if (!active) {
                  event.currentTarget.style.backgroundColor = "transparent";
                  event.currentTarget.style.color = "#555";
                }
              }}
            >
              <Icon size={20} />
              <span style={{ fontSize: "14px" }}>{item.name}</span>
            </a>
          );
        })}
      </nav>
    </aside>
  );
}