import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DosenLayout from "@/components/layouts/dosenLayout";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus, Search } from "lucide-react";
import AddCategoryModal from "@/components/ui/admin/category/addCategoryModal";
import React, { useState, useMemo } from "react";
import { router, usePage } from "@inertiajs/react";
import type { Category } from "@/types/category";
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

export default function CategoriesManagementDosen() {
    const [modalOpen, setModalOpen] = useState(false);
    const [editData, setEditData] = useState<Category | null>(null);
    const [deleteCategory, setDeleteCategory] = useState<Category | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const categories = usePage<{ categories: Category[] }>().props.categories;

    // Filter categories based on search query
    const filteredCategories = useMemo(() => {
        if (!searchQuery.trim()) {
            return categories;
        }
        return categories.filter(category =>
            category.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [categories, searchQuery]);

    const handleAdd = () => {
        setEditData(null);
        setModalOpen(true);
    };

    const handleEdit = (category: Category) => {
        setEditData(category);
        setModalOpen(true);
    };

    const handleDelete = (id: number) => {
        setDeleting(true);
        router.delete(`/dashboard/dosen/categories/${id}`, {
            onSuccess: () => {
                toast.success("Kategori berhasil dihapus.");
                setDeleteCategory(null);
            },
            onError: () => toast.error("Gagal menghapus kategori."),
            onFinish: () => setDeleting(false),
        });
    };

    const handleSubmit = (data: Category) => {
        if (data.id) {
            router.put(`/dashboard/dosen/categories/${data.id}`, data, {
                onSuccess: () => {
                    toast.success("Kategori berhasil diperbarui!");
                    setModalOpen(false);
                },
                onError: () => toast.error("Gagal memperbarui kategori."),
            });
        } else {
            router.post("/dashboard/dosen/categories", data, {
                onSuccess: () => {
                    toast.success("Kategori berhasil ditambahkan!");
                    setModalOpen(false);
                },
                onError: () => toast.error("Gagal menambahkan kategori."),
            });
        }
    };

    return (
        <DosenLayout title="Manajemen Kategori">
            <Card className="border-1 border-purple-300 hover:shadow-md shadow-purple-300 transition-all">
                <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-xl font-bold text-gray-900">
                            Manajemen Kategori
                        </CardTitle>
                        <Button onClick={handleAdd} className="bg-purple-600 hover:bg-purple-700 text-white" type="button">
                            <Plus className="mr-2" size={16}/>Tambah Kategori
                        </Button>
                    </div>

                    {/* Search Bar */}
                    <div className="mt-4 relative">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                type="text"
                                placeholder="Cari kategori..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                        {searchQuery && (
                            <div className="mt-2 text-sm text-gray-600">
                                Ditemukan {filteredCategories.length} dari {categories.length} kategori
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
                            {filteredCategories.map((category, idx) => (
                                <tr key={category.id} className="border-b hover:bg-purple-100/30 hover:scale-[1.01] transition-all duration-200">
                                    <td className="p-4 text-center text-gray-700">{idx + 1}</td>
                                    <td className="p-4 text-gray-700">
                                            <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                                                {/* Highlight search matches */}
                                                {searchQuery ? (
                                                    category.name.split(new RegExp(`(${searchQuery})`, 'gi')).map((part, i) =>
                                                        part.toLowerCase() === searchQuery.toLowerCase() ? (
                                                            <mark key={i} className="bg-yellow-200 rounded px-1">{part}</mark>
                                                        ) : part
                                                    )
                                                ) : category.name}
                                            </span>
                                    </td>
                                    <td className="p-4 text-center text-gray-700">
                                        <div className="flex justify-center items-center gap-2">
                                            <Button size="icon" variant="ghost" onClick={() => handleEdit(category)}>
                                                <Pencil className="h-4 w-4 text-purple-600" />
                                            </Button>
                                            <Dialog open={deleteCategory?.id === category.id} onOpenChange={open => setDeleteCategory(open ? category : null)}>
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
                                                        <DialogTitle>Hapus Kategori</DialogTitle>
                                                    </DialogHeader>
                                                    <p>Yakin ingin menghapus <strong>{category.name}</strong>? Tindakan ini tidak dapat dibatalkan.</p>
                                                    <DialogFooter>
                                                        <DialogClose asChild>
                                                            <button className="px-4 py-2 border rounded">Batal</button>
                                                        </DialogClose>
                                                        <button
                                                            onClick={() => handleDelete(category.id)}
                                                            disabled={deleting}
                                                            className="px-6 py-2 bg-red-800 text-white rounded"
                                                        >
                                                            {deleting && deleteCategory?.id === category.id ? "Menghapus..." : "Hapus"}
                                                        </button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredCategories.length === 0 && searchQuery && (
                                <tr>
                                    <td colSpan={3} className="text-center p-4 text-gray-500">
                                        Tidak ada kategori yang cocok dengan pencarian "{searchQuery}"
                                    </td>
                                </tr>
                            )}
                            {categories.length === 0 && !searchQuery && (
                                <tr>
                                    <td colSpan={3} className="text-center p-4 text-gray-500">Belum ada data kategori.</td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
            <AddCategoryModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleSubmit}
                initialData={editData}
            />
        </DosenLayout>
    );
}
