import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DataTable from "@/components/ui/admin/user/dataTable";
import AdminLayout from "@/components/layouts/adminLayout";
import { users as initialUsers, columns } from "@/lib/userData";
import Modal from "@/components/ui/shared/modal";
import UserForm from "@/pages/dashboard/admin/userForm";
import { User } from "@/types/user";
import { ColumnDef } from "@tanstack/react-table";
import { createActionColumn } from "@/lib/table.utils";

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [modal, setModal] = useState<null | "add" | "edit" | "delete">(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const openAdd = () => {
    setSelectedUser(null);
    setModal("add");
  };
  const openEdit = (user: User) => {
    setSelectedUser(user);
    setModal("edit");
  };
  const openDelete = (user: User) => {
    setSelectedUser(user);
    setModal("delete");
  };
  const closeModal = () => {
    setModal(null);
    setSelectedUser(null);
  };

  // Dummy handler
  const handleAdd = (data: Partial<User>) => {
    setUsers((prev) => [...prev, { ...data, id: prev.length + 1 } as User]);
    closeModal();
  };
  const handleEdit = (data: Partial<User>) => {
    setUsers((prev) => prev.map(u => u.id === selectedUser?.id ? { ...u, ...data } : u));
    closeModal();
  };
  const handleDelete = () => {
    setUsers((prev) => prev.filter(u => u.id !== selectedUser?.id));
    closeModal();
  }

  return (
    <AdminLayout title="Manajemen Pengguna">
      <Card className="border-1 border-purple-300 hover:shadow-md shadow-purple-300 transition-all">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-bold text-gray-900">
              Manajemen Pengguna
            </CardTitle>
            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white"
              onClick={openAdd}
            >
              <Plus size={16} className="mr-2" />
              Tambah Pengguna
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={users}
            onEdit={openEdit}
            onDelete={openDelete}
          />
        </CardContent>
      </Card>

      {/* Modal Tambah */}
      <Modal isOpen={modal === "add"} onClose={closeModal} title="Tambah Pengguna">
        <UserForm mode="add" onSubmit={handleAdd} onCancel={closeModal} />
      </Modal>
      {/* Modal Edit */}
      <Modal isOpen={modal === "edit"} onClose={closeModal} title="Edit Pengguna">
        <UserForm mode="edit" initialValues={selectedUser || {}} onSubmit={handleEdit} onCancel={closeModal} />
      </Modal>
      {/* Modal Delete */}
      <Modal isOpen={modal === "delete"} onClose={closeModal} title="Hapus Pengguna"
        footer={
          <>
            <Button variant="outline" onClick={closeModal}>Batal</Button>
            <Button className="bg-red-600 hover:bg-red-700" onClick={handleDelete}>Hapus</Button>
          </>
        }
      >
        <div className="text-center py-4">
          Apakah Anda yakin ingin menghapus pengguna <b>{selectedUser?.name}</b>?
        </div>
      </Modal>
    </AdminLayout>
  );
}
