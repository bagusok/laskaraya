import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminLayout from "@/components/layouts/adminLayout";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus } from "lucide-react";
import AddSkillModal from "@/components/ui/admin/skill/addSkillModal";
import React, { useState } from "react";
import { router, usePage } from "@inertiajs/react";
import type { Skill } from "@/types/skill";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";

export default function SkillsManagement() {
    const skills = usePage<{ skills: Skill[] }>().props.skills;
    const [modalOpen, setModalOpen] = useState(false);
    const [editData, setEditData] = useState<Skill | null>(null);
    // State untuk dialog hapus
    const [deleteSkill, setDeleteSkill] = useState<Skill | null>(null);
    const [deleting, setDeleting] = useState(false);

    const handleAdd = () => {
        setEditData(null);
        setModalOpen(true);
    };
    const handleEdit = (skill: Skill) => {
        setEditData(skill);
        setModalOpen(true);
    };
    const handleDelete = (id: number) => {
        setDeleting(true);
        router.delete(`/dashboard/skills/${id}`, {
            onSuccess: () => {
                setDeleteSkill(null);
                setDeleting(false);
            },
            onFinish: () => setDeleting(false)
        });
    };
    const handleSubmit = (data: Skill) => {
        if (data.id) {
            router.put(`/dashboard/skills/${data.id}`, data, {
                onSuccess: () => setModalOpen(false)
            });
        } else {
            router.post("/dashboard/skills", data, {
                onSuccess: () => setModalOpen(false)
            });
        }
    };
    return (
        <AdminLayout title="Manajemen Ketrampilan">
            <Card className="border-1 border-purple-300 hover:shadow-md shadow-purple-300 transition-all">
                <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-xl font-bold text-gray-900">
                            Manajemen Ketrampilan
                        </CardTitle>
                        <Button onClick={handleAdd} className="bg-purple-600 hover:bg-purple-700 text-white" type="button">
                            <Plus className="mr-2" size={16}/>Tambah Ketrampilan
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border border-purple-200 overflow-x-auto">
                        <table className="table-fixed caption-bottom text-sm w-full">
                            <thead className="[&_tr]:border-b">
                                <tr className="border-b transition-colors data-[state=selected]:bg-mutcentered bg-purple-50/50 hover:bg-purple-100/30">
                                    <th className="w-1/12 h-12 px-4 text-center align-middle text-gray-900 font-semibold whitespace-nowrap">#</th>
                                    <th className="w-7/12 h-12 px-4 text-left align-middle text-gray-900 font-semibold whitespace-nowrap">Nama</th>
                                    <th className="w-4/12 h-12 px-4 text-center align-middle text-gray-900 font-semibold whitespace-nowrap">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {skills.map((skill, idx) => (
                                    <tr key={skill.id} className="border-b hover:bg-purple-100/30 hover:scale-[1.01] transition-all duration-200">
                                        <td className="p-4 align-middle text-gray-700 whitespace-nowrap text-center">{idx + 1}</td>
                                        <td className="p-4 align-middle text-gray-700 whitespace-nowrap">
                                            <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">{skill.name}</span>
                                        </td>
                                        <td className="p-4 align-middle text-gray-700 whitespace-nowrap text-center">
                                            <div className="flex justify-center items-center gap-2">
                                                <Button size="icon" variant="outline" className="hover:bg-purple-100/30 hover:text-purple-600 text-purple-300" onClick={() => handleEdit(skill)}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                {/* Dialog konfirmasi hapus */}
                                                <Dialog open={deleteSkill?.id === skill.id} onOpenChange={open => setDeleteSkill(open ? skill : null)}>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            size="icon"
                                                            variant="destructive"
                                                            className="hover:bg-red-100/30 hover:text-red-600 text-red-300"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="sm:max-w-[425px]">
                                                        <DialogHeader>
                                                            <DialogTitle asChild>
                                                                <h2 className="text-xl font-normal text-red-900 mb-4 tracking-tight">
                                                                    Hapus Ketrampilan
                                                                </h2>
                                                            </DialogTitle>
                                                        </DialogHeader>
                                                        <p>
                                                            Apakah Anda yakin ingin menghapus ketrampilan{" "}
                                                            <strong>{skill.name}</strong>? Tindakan ini tidak dapat dibatalkan.
                                                        </p>
                                                        <DialogFooter>
                                                            <div className="flex justify-end gap-3 pt-4">
                                                                <DialogClose asChild>
                                                                    <button
                                                                        type="button"
                                                                        className="px-4 py-2 text-purple-700 hover:text-purple-900 transition-colors font-medium text-sm border border-purple-100 rounded-lg bg-white"
                                                                    >
                                                                        Batal
                                                                    </button>
                                                                </DialogClose>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleDelete(skill.id)}
                                                                    className="px-6 py-2 bg-red-800 text-white hover:bg-purple-900 transition-colors text-sm rounded-lg font-medium disabled:opacity-70"
                                                                    disabled={deleting}
                                                                >
                                                                    {deleting && deleteSkill?.id === skill.id ? "Menghapus..." : "Hapus"}
                                                                </button>
                                                            </div>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {skills.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="text-center p-4 text-gray-500">Belum ada data ketrampilan.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
            <AddSkillModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleSubmit}
                initialData={editData}
            />
        </AdminLayout>
    );
}
