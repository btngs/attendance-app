"use client";

import { useCallback, useMemo, useState } from "react";

import Sidebar from "../../components/Sidebar";
import SearchBar from "../../components/recap/SearchBar";
import AddButton from "../../components/karyawan/AddButton";
import EmployeeTable, {
  Employee,
} from "../../components/karyawan/EmployeeTable";
import AddEmployeeModal from "../../components/karyawan/AddEmployeeModal";
import DeleteEmployeeModal from "../../components/karyawan/DeleteEmployeeModal";
import EmployeeDetailModal from "../../components/karyawan/EmployeeDetailModal";

import { ToastContainer } from "../../components/ui/Toast";
import { useToast } from "../../components/ui/useToast";

export default function KaryawanPage() {
  // ============================================================
  // STATE
  // ============================================================

  const [searchQuery, setSearchQuery] = useState("");

  const [employeeData, setEmployeeData] = useState<Employee[]>([]);

  // Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] =
    useState<Employee | null>(null);

  // Detail
  const [detailEmployee, setDetailEmployee] =
    useState<Employee | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] =
    useState(false);

  // Delete
  const [deletingEmployee, setDeletingEmployee] =
    useState<Employee | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] =
    useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast
  const { toasts, showToast, dismissToast } = useToast();

  // ============================================================
  // FILTER
  // ============================================================

  const filteredEmployees = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return employeeData;
    }

    return employeeData.filter((employee) =>
      employee.name.toLowerCase().includes(query)
    );
  }, [employeeData, searchQuery]);

  // ============================================================
  // DATA
  // ============================================================

  /**
   * Dipanggil EmployeeTable setelah berhasil mengambil
   * data karyawan dari API.
   *
   * useCallback digunakan agar referensi function tetap stabil
   * dan EmployeeTable tidak melakukan fetch berulang-ulang
   * setiap kali parent melakukan re-render.
   */
  const handleEmployeesLoaded = useCallback(
    (data: Employee[]) => {
      setEmployeeData(data);
    },
    []
  );

  // ============================================================
  // ADD EMPLOYEE
  // ============================================================

  const handleOpenAddModal = useCallback(() => {
    setEditingEmployee(null);
    setIsModalOpen(true);
  }, []);

  // ============================================================
  // EDIT EMPLOYEE
  // ============================================================

  const handleOpenEditModal = useCallback(
    (employee: Employee) => {
      setIsDetailModalOpen(false);
      setDetailEmployee(null);

      setEditingEmployee(employee);
      setIsModalOpen(true);
    },
    []
  );

  // ============================================================
  // DETAIL EMPLOYEE
  // ============================================================

  const handleOpenDetailModal = useCallback(
    (employee: Employee) => {
      setDetailEmployee(employee);
      setIsDetailModalOpen(true);
    },
    []
  );

  const handleCloseDetailModal = useCallback(() => {
    setIsDetailModalOpen(false);
    setDetailEmployee(null);
  }, []);

  // ============================================================
  // DELETE EMPLOYEE
  // ============================================================

  const handleRequestDelete = useCallback(
    (employee: Employee) => {
      setDeletingEmployee(employee);
      setIsDeleteModalOpen(true);
    },
    []
  );

  const handleCloseDeleteModal = useCallback(() => {
    if (isDeleting) {
      return;
    }

    setIsDeleteModalOpen(false);
    setDeletingEmployee(null);
  }, [isDeleting]);

  const handleConfirmDelete = useCallback(async () => {
    if (!deletingEmployee) {
      return;
    }

    setIsDeleting(true);

    try {
      /*
       * Untuk sementara data dihapus dari state lokal.
       *
       * Jika backend DELETE sudah tersedia, API delete
       * bisa ditambahkan di sini:
       *
       * await API.delete(`/users/${deletingEmployee.id}`);
       */

      setEmployeeData((previousEmployees) =>
        previousEmployees.filter(
          (employee) => employee.id !== deletingEmployee.id
        )
      );

      setIsDeleteModalOpen(false);
      setDeletingEmployee(null);

      showToast(
        "Karyawan berhasil dihapus.",
        "success"
      );
    } catch (error: unknown) {
      console.error(
        "Error deleting employee:",
        error
      );

      showToast(
        "Gagal menghapus karyawan. Silakan coba lagi.",
        "error"
      );
    } finally {
      setIsDeleting(false);
    }
  }, [deletingEmployee, showToast]);

  // ============================================================
  // SAVE EMPLOYEE
  // ============================================================

  const handleSaveEmployee = useCallback(
    (formData: Omit<Employee, "id">) => {
      if (editingEmployee) {
        // UPDATE
        setEmployeeData((previousEmployees) =>
          previousEmployees.map((employee) =>
            employee.id === editingEmployee.id
              ? {
                  ...formData,
                  id: editingEmployee.id,
                }
              : employee
          )
        );

        showToast(
          "Data karyawan berhasil diperbarui.",
          "success"
        );
      } else {
        // CREATE
        const newEmployee: Employee = {
          ...formData,
          id: crypto.randomUUID(),
        };

        setEmployeeData((previousEmployees) => [
          ...previousEmployees,
          newEmployee,
        ]);

        showToast(
          "Karyawan berhasil ditambahkan.",
          "success"
        );
      }

      setIsModalOpen(false);
      setEditingEmployee(null);
    },
    [editingEmployee, showToast]
  );

  // ============================================================
  // CLOSE ADD / EDIT MODAL
  // ============================================================

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingEmployee(null);
  }, []);

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#fff",
      }}
    >
      <Sidebar />

      <main
        style={{
          marginLeft: "260px",
          width: "calc(100% - 260px)",
          minHeight: "100vh",
          padding: "32px 40px",
          boxSizing: "border-box",
        }}
      >
        {/* ======================================================
            HEADER
        ====================================================== */}

        <div
          style={{
            marginBottom: "24px",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "22px",
              fontWeight: 700,
              color: "#333",
            }}
          >
            Karyawan
          </h1>

          <p
            style={{
              margin: "6px 0 0",
              fontSize: "14px",
              color: "#888",
            }}
          >
            Kelola data karyawan yang terdaftar.
          </p>
        </div>

        {/* ======================================================
            TOOLBAR
        ====================================================== */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            marginBottom: "20px",
            flexWrap: "wrap",
          }}
        >
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
          />

          <AddButton
            onClick={handleOpenAddModal}
          />
        </div>

        {/* ======================================================
            EMPLOYEE TABLE
        ====================================================== */}

        <EmployeeTable
          data={filteredEmployees}
          onEdit={handleOpenEditModal}
          onDetail={handleOpenDetailModal}
          onDelete={handleRequestDelete}
          onDataLoaded={handleEmployeesLoaded}
        />
      </main>

      {/* ========================================================
          ADD / EDIT MODAL
      ======================================================== */}

      {isModalOpen && (
        <AddEmployeeModal
          onClose={handleCloseModal}
          onSave={handleSaveEmployee}
          initialData={
            editingEmployee ?? undefined
          }
        />
      )}

      {/* ========================================================
          DETAIL MODAL
      ======================================================== */}

      <EmployeeDetailModal
        employee={detailEmployee}
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        onEdit={() => {
          if (detailEmployee) {
            handleOpenEditModal(detailEmployee);
          }
        }}
      />

      {/* ========================================================
          DELETE MODAL
      ======================================================== */}

      <DeleteEmployeeModal
        employee={deletingEmployee}
        isOpen={isDeleteModalOpen}
        isDeleting={isDeleting}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />

      {/* ========================================================
          TOAST
      ======================================================== */}

      <ToastContainer
        toasts={toasts}
        onDismiss={dismissToast}
      />
    </div>
  );
}