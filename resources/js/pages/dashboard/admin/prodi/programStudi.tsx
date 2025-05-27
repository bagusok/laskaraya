import AdminLayout from "@/components/layouts/adminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Plus, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Link, router } from "@inertiajs/react";

interface ProgramStudiIndexProps {
    prodiList: { id: number; nama: string }[];
}

export default function ProgramStudiIndex({
    prodiList
}: ProgramStudiIndexProps) {
    const [openDialog, setOpenDialog] = useState(false);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [inputValue, setInputValue] = useState("");
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

    // Handler untuk tambah/edit
    const handleOpenAdd = () => {
        setEditIndex(null);
        setInputValue("");
        setOpenDialog(true);
    };
    const handleOpenEdit = (idx: number) => {
        setEditIndex(idx);
        setInputValue(prodiList[idx].nama);
        setOpenDialog(true);
    };
    const handleSave = () => {
        if (editIndex === null) {
            // TAMBAH
            router.post(
                route("prodi.create"),
                { nama: inputValue },
                {
                    onSuccess: () => {
                        setOpenDialog(false);
                        setInputValue("");
                        setEditIndex(null);
                    }
                }
            );
        } else {
            // EDIT
            router.put(
                route("prodi.update", prodiList[editIndex].id),
                { nama: inputValue },
                {
                    onSuccess: () => {
                        setOpenDialog(false);
                        setInputValue("");
                        setEditIndex(null);
                    }
                }
            );
        }
    };
    const handleOpenDelete = (idx: number) => {
        setDeleteIndex(idx);
        setOpenDeleteDialog(true);
    };
    const handleDelete = () => {
        if (deleteIndex !== null) {
            setOpenDeleteDialog(false);
            router.delete(route("prodi.destroy", prodiList[deleteIndex].id), {
                onSuccess: () => {}
            });
            setDeleteIndex(null);
        }
    };
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setInputValue("");
        setEditIndex(null);
    };
    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setDeleteIndex(null);
    };

    return (
        <AdminLayout title="Manajemen Program Studi">
            <div className="container mx-auto py-8">
                <Card className="border border-purple-200 rounded-xl shadow-sm bg-gradient-to-br from-white to-purple-50/30">
                    <CardHeader className="flex flex-row items-center gap-3 pb-4 border-b border-purple-100 justify-between">
                        <div className="flex items-center gap-3">
                            <BookOpen className="text-purple-500" size={28} />
                            <CardTitle className="text-2xl font-bold text-gray-800">
                                Manajemen Program Studi
                            </CardTitle>
                        </div>
                        <Button
                            className="bg-purple-500 hover:bg-purple-700 text-white transition-colors"
                            onClick={handleOpenAdd}
                        >
                            <Plus className="mr-2" size={18} /> Tambah
                        </Button>
                    </CardHeader>
                    <CardContent className="py-8">
                        <ul className="space-y-4">
                            {prodiList.map((prodi, idx) => (
                                <li
                                    key={prodi.id}
                                    onClick={() =>
                                        router.visit(
                                            route("prodi.detail", {
                                                id: prodi.id
                                            })
                                        )
                                    }
                                    className="flex items-center gap-3 bg-purple-50/60 rounded-lg px-5 py-3 border border-purple-300 shadow-md hover:shadow-purple-300 hover:bg-purple-100/40 justify-between cursor-pointer transition-all duration-200 hover:scale-[1.03] hover:-translate-y-0.5"
                                    style={{ userSelect: "none" }}
                                >
                                    <div className="flex items-center gap-3">
                                        <BookOpen
                                            className="text-purple-400"
                                            size={22}
                                        />
                                        <span className="text-lg font-medium text-gray-700">
                                            {prodi.nama}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="text-purple-600 hover:bg-purple-100 hover:text-purple-800"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleOpenEdit(idx);
                                            }}
                                        >
                                            <Pencil size={18} />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="text-red-500 hover:bg-purple-100 hover:text-purple-800"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleOpenDelete(idx);
                                            }}
                                        >
                                            <Trash2 size={18} />
                                        </Button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
            {/* Modal Tambah/Edit */}
            {openDialog && (
                <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {editIndex === null
                                    ? "Tambah Program Studi"
                                    : "Edit Program Studi"}
                            </DialogTitle>
                        </DialogHeader>
                        <Input
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Nama Program Studi"
                            className="mt-4"
                        />
                        <DialogFooter>
                            <Button
                                className="bg-purple-500 hover:bg-purple-700 text-white"
                                onClick={handleSave}
                                disabled={inputValue.trim() === ""}
                            >
                                Simpan
                            </Button>
                            <Button
                                variant="outline"
                                className="hover:bg-purple-100 hover:text-purple-800"
                                onClick={handleCloseDialog}
                            >
                                Batal
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
            {/* Modal Konfirmasi Hapus */}
            {openDeleteDialog && (
                <Dialog
                    open={openDeleteDialog}
                    onOpenChange={setOpenDeleteDialog}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Konfirmasi Hapus</DialogTitle>
                        </DialogHeader>
                        <div className="py-4 text-gray-700">
                            Apakah Anda yakin ingin menghapus program studi ini?
                        </div>
                        <DialogFooter>
                            <Button
                                className="bg-red-500 hover:bg-purple-700 text-white"
                                onClick={handleDelete}
                            >
                                Hapus
                            </Button>
                            <Button
                                variant="outline"
                                className="hover:bg-purple-100 hover:text-purple-800"
                                onClick={handleCloseDeleteDialog}
                            >
                                Batal
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </AdminLayout>
    );
}
