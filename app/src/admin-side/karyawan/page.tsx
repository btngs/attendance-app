'use client';

import { useState } from 'react';
import Navbar from '../../components/Navbar';
import SearchBar from '../../components/recap/SearchBar';
import AddButton from '../../components/karyawan/AddButton';
import EmployeeTable, { Employee } from '../../components/karyawan/EmployeeTable';
import AddEmployeeModal from '../../components/karyawan/AddEmployeeModal';
import DeleteEmployeeModal from '../../components/karyawan/DeleteEmployeeModal';
import { ToastContainer } from '../../components/ui/Toast';
import { useToast } from '../../components/ui/useToast';

export default function KaryawanPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  // State untuk modal konfirmasi hapus
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { toasts, showToast, dismissToast } = useToast();

  // ⚠️ Nanti data ini akan diisi dari database
  const [employeeData, setEmployeeData] = useState<Employee[]>([]);

  const filteredEmployees = employeeData.filter((employee) =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function handleOpenAddModal() {
    setEditingEmployee(null); // pastikan mode "Tambah", bukan "Edit"
    setIsModalOpen(true);
  }

  function handleOpenEditModal(employee: Employee) {
    setEditingEmployee(employee); // isi modal dengan data karyawan yang dipilih
    setIsModalOpen(true);
  }

  // Klik "Hapus" di ActionMenu -> buka modal konfirmasi, BELUM menghapus data
  function handleRequestDelete(employee: Employee) {
    setDeletingEmployee(employee);
    setIsDeleteModalOpen(true);
  }

  function handleCloseDeleteModal() {
    if (isDeleting) return; // cegah tutup modal saat proses hapus berjalan
    setIsDeleteModalOpen(false);
    setDeletingEmployee(null);
  }

  // Klik "Hapus" di dalam modal konfirmasi -> baru benar-benar menghapus data
  async function handleConfirmDelete() {
    if (!deletingEmployee) return;

    setIsDeleting(true);
    try {
      // ⚠️ Nanti di sini tempat memanggil API/database untuk hapus data,
      // contoh: await fetch(`/api/employees/${deletingEmployee.id}`, { method: 'DELETE' })
      setEmployeeData((prev) => prev.filter((e) => e.id !== deletingEmployee.id));

      setIsDeleteModalOpen(false);
      setDeletingEmployee(null);
      showToast('Karyawan berhasil dihapus.', 'success');
    } catch {
      showToast('Gagal menghapus karyawan. Coba lagi.', 'error');
    } finally {
      setIsDeleting(false);
    }
  }

  function handleSaveEmployee(formData: Omit<Employee, 'id'>) {
    if (editingEmployee) {
      // Mode Edit -> update baris yang sudah ada
      setEmployeeData((prev) =>
        prev.map((e) => (e.id === editingEmployee.id ? { ...formData, id: editingEmployee.id } : e))
      );
      showToast('Karyawan berhasil diperbarui.', 'success');
    } else {
      // Mode Tambah -> masukkan baris baru
      const newEmployee: Employee = { ...formData, id: crypto.randomUUID() };
      setEmployeeData((prev) => [...prev, newEmployee]);
      showToast('Karyawan berhasil ditambahkan.', 'success');
    }
    setIsModalOpen(false);
    setEditingEmployee(null);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setEditingEmployee(null);
  }

  return (
    <main style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
      <Navbar />

      <section style={{ 
        padding: '10px 60px 40px 60px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header dengan Search dan Tambah Anggota */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
          gap: '16px',
          flexWrap: 'wrap'
        }}>
          <SearchBar 
            value={searchQuery}
            onChange={setSearchQuery}
          />
          
          <AddButton onClick={handleOpenAddModal} />
        </div>

        {/* Tabel Karyawan */}
        <EmployeeTable
          data={filteredEmployees}
          onEdit={handleOpenEditModal}
          onDelete={handleRequestDelete}
        />
      </section>

      {isModalOpen && (
        <AddEmployeeModal
          onClose={handleCloseModal}
          onSave={handleSaveEmployee}
          initialData={editingEmployee ?? undefined}
        />
      )}

      <DeleteEmployeeModal
        employee={deletingEmployee}
        isOpen={isDeleteModalOpen}
        isDeleting={isDeleting}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </main>
  );
}