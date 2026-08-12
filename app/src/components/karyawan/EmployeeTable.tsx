"use client";

import { useEffect, useState } from "react";
import ActionMenu from "./ActionMenu";
import API from "../../services/api";

// ============================================================
// TYPE
// ============================================================

export interface Employee {
  id: number | string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  address?: string;
  gender?: string;
  division?: string;
  position?: string;
  education?: string;
  emergencyContact?: string;
  photo?: string;
}

interface EmployeeTableProps {
  data: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
  onDetail: (employee: Employee) => void;
  onDataLoaded: (data: Employee[]) => void;
}

// ============================================================
// API RESPONSE
// ============================================================

interface EmployeeApiResponse {
  data?: Employee[] | { data?: Employee[] };
  message?: string;
}

// ============================================================
// THEME
// ============================================================

const PRIMARY = "#e8a838";
const PRIMARY_LIGHT = "#fef3e2";
const BORDER = "#f0ece3";

const ROW_HOVER_BG = "#fff3d6";
const ROW_HOVER_ACCENT = "#f5a623";

// ============================================================
// ROLE STYLE
// ============================================================

function getRoleStyle(role?: string): React.CSSProperties {
  switch ((role ?? "").toLowerCase()) {
    case "tetap":
      return {
        backgroundColor: "#e8f5e9",
        color: "#2e7d32",
      };

    case "magang":
      return {
        backgroundColor: "#e3f2fd",
        color: "#1565c0",
      };

    case "kontrak":
      return {
        backgroundColor: PRIMARY_LIGHT,
        color: PRIMARY,
      };

    default:
      return {
        backgroundColor: "#f5f5f5",
        color: "#666",
      };
  }
}

// ============================================================
// EXTRACT EMPLOYEE DATA
// ============================================================

function extractEmployees(
  responseData: EmployeeApiResponse | Employee[]
): Employee[] {
  if (Array.isArray(responseData)) {
    return responseData;
  }

  if (Array.isArray(responseData.data)) {
    return responseData.data;
  }

  if (
    responseData.data &&
    typeof responseData.data === "object" &&
    Array.isArray(responseData.data.data)
  ) {
    return responseData.data.data;
  }

  return [];
}

// ============================================================
// COMPONENT
// ============================================================

export default function EmployeeTable({
  data,
  onEdit,
  onDelete,
  onDetail,
  onDataLoaded,
}: EmployeeTableProps) {
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [hoveredRowId, setHoveredRowId] = useState<
    string | number | null
  >(null);

  const [openMenuRowId, setOpenMenuRowId] = useState<
    string | number | null
  >(null);

  // ==========================================================
  // FETCH EMPLOYEE DATA
  // ==========================================================

  useEffect(() => {
    let isMounted = true;

    const fetchEmployeeData = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const response =
          await API.get<EmployeeApiResponse>("/users");

        if (!isMounted) {
          return;
        }

        const employees = extractEmployees(response.data);

        onDataLoaded(employees);
      } catch (error: unknown) {
        if (!isMounted) {
          return;
        }

        console.error(
          "Error fetching employee data:",
          error
        );

        let message =
          "Gagal mengambil data karyawan dari server.";

        if (
          error &&
          typeof error === "object" &&
          "response" in error
        ) {
          const axiosError = error as {
            response?: {
              data?: {
                message?: string;
              };
            };
          };

          message =
            axiosError.response?.data?.message ??
            message;
        }

        setErrorMessage(message);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    
    void fetchEmployeeData();

    return () => {
      isMounted = false;
    };
  }, [onDataLoaded]);

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "#ffffff",
        border: `1px solid ${BORDER}`,
        borderRadius: "12px",
        overflow: "visible",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        {/* ====================================================
            HEADER
        ==================================================== */}

        <thead>
          <tr
            style={{
              backgroundColor: PRIMARY_LIGHT,
            }}
          >
            {/* NO */}
            <th
              style={{
                ...headerStyle,
                width: "60px",
                textAlign: "center",
              }}
            >
              No
            </th>

            {/* NAMA */}
            <th style={headerStyle}>
              Nama Karyawan
            </th>

            {/* JABATAN */}
            <th style={headerStyle}>
              Jabatan
            </th>

            {/* DIVISI */}
            <th style={headerStyle}>
              Divisi
            </th>

            {/* STATUS */}
            <th style={headerStyle}>
              Status Kerja
            </th>

            {/* AKSI */}
            <th
              style={{
                ...headerStyle,
                width: "60px",
                textAlign: "center",
              }}
            >
              Aksi
            </th>
          </tr>
        </thead>

        {/* ====================================================
            BODY
        ==================================================== */}

        <tbody>
          {/* LOADING */}
          {loading && (
            <tr>
              <td
                colSpan={6}
                style={emptyStyle}
              >
                Memuat data karyawan...
              </td>
            </tr>
          )}

          {/* ERROR */}
          {!loading && errorMessage && (
            <tr>
              <td
                colSpan={6}
                style={{
                  ...emptyStyle,
                  color: "#d32f2f",
                }}
              >
                {errorMessage}
              </td>
            </tr>
          )}

          {/* EMPTY */}
          {!loading &&
            !errorMessage &&
            data.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  style={emptyStyle}
                >
                  Belum ada data karyawan.
                </td>
              </tr>
            )}

          {/* DATA */}
          {!loading &&
            !errorMessage &&
            data.length > 0 &&
            data.map((employee, index) => {
              const isRowActive =
                hoveredRowId === employee.id ||
                openMenuRowId === employee.id;

              /*
               * Nomor dibuat otomatis berdasarkan posisi
               * karyawan yang sedang ditampilkan.
               *
               * index:
               * 0 -> No 1
               * 1 -> No 2
               * 2 -> No 3
               * dst.
               */
              const rowNumber = index + 1;

              return (
                <tr
                  key={employee.id}
                  onMouseEnter={() =>
                    setHoveredRowId(employee.id)
                  }
                  onMouseLeave={() =>
                    setHoveredRowId(null)
                  }
                  style={{
                    borderBottom: `1px solid ${BORDER}`,
                    backgroundColor: isRowActive
                      ? ROW_HOVER_BG
                      : "transparent",
                    boxShadow: isRowActive
                      ? `inset 0 0 0 1px ${ROW_HOVER_ACCENT}33`
                      : "none",
                    transition:
                      "background-color 150ms ease, box-shadow 150ms ease",
                  }}
                >
                  {/* ==========================================
                      NO
                  ========================================== */}

                  <td
                    style={{
                      ...cellStyle,
                      width: "60px",
                      textAlign: "center",
                      fontWeight: 500,
                      color: "#777",
                    }}
                  >
                    {rowNumber}
                  </td>

                  {/* ==========================================
                      NAMA
                  ========================================== */}

                  <td style={cellStyle}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "50%",
                          backgroundColor: "#e0e0e0",
                          backgroundImage:
                            employee.photo
                              ? `url(${employee.photo})`
                              : undefined,
                          backgroundSize: "cover",
                          backgroundPosition:
                            "center",
                          backgroundRepeat:
                            "no-repeat",
                          flexShrink: 0,
                        }}
                      />

                      <span>
                        {employee.name || "-"}
                      </span>
                    </div>
                  </td>

                  {/* ==========================================
                      JABATAN
                  ========================================== */}

                  <td style={cellStyle}>
                    {employee.position || "-"}
                  </td>

                  {/* ==========================================
                      DIVISI
                  ========================================== */}

                  <td style={cellStyle}>
                    {employee.division || "-"}
                  </td>

                  {/* ==========================================
                      STATUS
                  ========================================== */}

                  <td style={cellStyle}>
                    <span
                      style={{
                        ...getRoleStyle(
                          employee.role
                        ),
                        display: "inline-block",
                        padding: "6px 16px",
                        borderRadius: "20px",
                        fontSize: "13px",
                        fontWeight: 500,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {employee.role || "-"}
                    </span>
                  </td>

                  {/* ==========================================
                      ACTION
                  ========================================== */}

                  <td
                    style={{
                      ...cellStyle,
                      width: "60px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent:
                          "flex-end",
                        alignItems: "center",
                        opacity: isRowActive
                          ? 1
                          : 0,
                        transition:
                          "opacity 150ms ease",
                      }}
                    >
                      <ActionMenu
                        onEdit={() =>
                          onEdit(employee)
                        }
                        onDetail={() =>
                          onDetail(employee)
                        }
                        onDelete={() =>
                          onDelete(employee)
                        }
                        onOpenChange={(
                          isOpen
                        ) => {
                          setOpenMenuRowId(
                            isOpen
                              ? employee.id
                              : null
                          );
                        }}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}

// ============================================================
// STYLES
// ============================================================

const headerStyle: React.CSSProperties = {
  padding: "14px 16px",
  textAlign: "left",
  fontSize: "14px",
  fontWeight: 600,
  color: PRIMARY,
};

const cellStyle: React.CSSProperties = {
  padding: "14px 16px",
  fontSize: "14px",
  color: "#333",
};

const emptyStyle: React.CSSProperties = {
  padding: "40px 20px",
  textAlign: "center",
  color: "#999",
  fontSize: "14px",
};