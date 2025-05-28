import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminLayout from "@/components/layouts/adminLayout";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus, Search } from "lucide-react";
import AddSkillModal from "@/components/ui/admin/skill/addSkillModal";
import React, { useState, useMemo } from "react";
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
import toast from "react-hot-toast";

export default function SkillsManagementAdmin() {
    const [modalOpen, setModalOpen] = useState(false);
    const [editData, setEditData] = useState<Skill | null>(null);
    const [deleteSkill, setDeleteSkill] = useState<Skill | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const skills = usePage<{ skills: Skill[] }>().props.skills;

    // Filter skills based on search query
    const filteredSkills = useMemo(() => {
        if (!searchQuery.trim()) {
            return skills;
        }
        return skills.filter(skill =>
            skill.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [skills, searchQuery]);

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
                toast.success("Ketrampilan berhasil dihapus.");
                setDeleteSkill(null);
            },
            onError: () => toast.error("Gagal menghapus ketrampilan."),
            onFinish: () => setDeleting(false),
        });
    };

    const handleSubmit = (data: Skill) => {
        if (data.id) {
            router.put(`/dashboard/skills/${data.id}`, data, {
                onSuccess: () => {
                    toast.success("Ketrampilan berhasil diperbarui!");
                    setModalOpen(false);
                },
                onError: () => toast.error("Gagal memperbarui ketrampilan."),
            });
        } else {
            router.post("/dashboard/skills", data, {
                onSuccess: () => {
                    toast.success("Ketrampilan berhasil ditambahkan!");
                    setModalOpen(false);
                },
                onError: () => toast.error("Gagal menambahkan ketrampilan."),
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

                    {/* Search Bar */}
                    <div className="mt-4 relative">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                type="text"
                                placeholder="Cari ketrampilan..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                        {searchQuery && (
                            <div className="mt-2 text-sm text-gray-600">
                                Ditemukan {filteredSkills.length} dari {skills.length} ketrampilan
                            </div>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border border-purple-200 overflow-x-auto">
                        <table className="table-fixed caption-bottom text-sm w-full">
                            <thead className="[&_tr]:border-b">
                            <tr className="border-b bg-purple-50/50 hover:bg-purple-100/30">
                                <th className="w-1/12 h-12 px-4 text-center text-gray-900 font-semibold">#</th>
                                <th className="w-7/12 h-12 px-4 text-left text-gray-900 font-semibold">Nama</th>
                                <th className="w-4/12 h-12 px-4 text-center text-gray-900 font-semibold">Aksi</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredSkills.map((skill, idx) => (
                                <tr key={skill.id} className="border-b hover:bg-purple-100/30 hover:scale-[1.01] transition-all duration-200">
                                    <td className="p-4 text-center text-gray-700">{idx + 1}</td>
                                    <td className="p-4 text-gray-700">
                                            <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                                                {/* Highlight search matches */}
                                                {searchQuery ? (
                                                    skill.name.split(new RegExp(`(${searchQuery})`, 'gi')).map((part, i) =>
                                                        part.toLowerCase() === searchQuery.toLowerCase() ? (
                                                            <mark key={i} className="bg-yellow-200 rounded px-1">{part}</mark>
                                                        ) : part
                                                    )
                                                ) : skill.name}
                                            </span>
                                    </td>
                                    <td className="p-4 text-center text-gray-700">
                                        <div className="flex justify-center items-center gap-2">
                                            <Button size="icon" variant="ghost" onClick={() => handleEdit(skill)}>
                                                <Pencil className="h-4 w-4 text-purple-600" />
                                            </Button>
                                            <Dialog open={deleteSkill?.id === skill.id} onOpenChange={open => setDeleteSkill(open ? skill : null)}>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="hover:bg-red-100 border-red-300"
                                                    >
                                                        <Trash2 className="h-4 w-4 text-red-600" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Hapus Ketrampilan</DialogTitle>
                                                    </DialogHeader>
                                                    <p>Yakin ingin menghapus <strong>{skill.name}</strong>? Tindakan ini tidak dapat dibatalkan.</p>
                                                    <DialogFooter>
                                                        <DialogClose asChild>
                                                            <button className="px-4 py-2 border rounded">Batal</button>
                                                        </DialogClose>
                                                        <button
                                                            onClick={() => handleDelete(skill.id)}
                                                            disabled={deleting}
                                                            className="px-6 py-2 bg-red-800 text-white rounded"
                                                        >
                                                            {deleting && deleteSkill?.id === skill.id ? "Menghapus..." : "Hapus"}
                                                        </button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredSkills.length === 0 && searchQuery && (
                                <tr>
                                    <td colSpan={3} className="text-center p-4 text-gray-500">
                                        Tidak ada ketrampilan yang cocok dengan pencarian "{searchQuery}"
                                    </td>
                                </tr>
                            )}
                            {skills.length === 0 && !searchQuery && (
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
