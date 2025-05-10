import React from "react";
import { Button } from "@/components/ui/button";
import { UserDeleteProps } from "@/types/user/userDelete";
import AdminLayout from "@/components/layouts/adminLayout";
import { handleDeleteUser } from "@/lib/userDelete.utils";

export default function UserDelete({ user }: UserDeleteProps) {
    return (
        <AdminLayout title="Hapus Pengguna">
            <div className="max-w-lg mx-auto mt-20 bg-white rounded-2xl shadow-xl p-8 border border-purple-200">
                <h2 className="text-xl font-bold text-purple-700 mb-4">
                    Konfirmasi Hapus Pengguna
                </h2>
                <p className="mb-6 text-gray-700 text-center">
                    Apakah Anda yakin ingin menghapus pengguna{" "}
                    <b>{user.name}</b>?
                </p>
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => history.back()}>
                        Batal
                    </Button>
                    <Button
                        className="bg-red-600 hover:bg-red-700"
                        onClick={() => handleDeleteUser(user.id!)}
                    >
                        Hapus
                    </Button>
                </div>
            </div>
        </AdminLayout>
    );
}
