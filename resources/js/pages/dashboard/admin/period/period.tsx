import AdminLayout from "@/components/layouts/adminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Plus, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import AddPeriodModal from "./addPeriodModal";
import EditPeriodModal from "./editPeriodModal";
import DelPeriodModal from "./delPeriodModal";
import { usePage } from "@inertiajs/react";
import { router } from "@inertiajs/react";

export default function PeriodIndex() {
    const periodList = (usePage().props.periodList ?? []) as any[];
    const [openDialog, setOpenDialog] = useState(false);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

    // Handler untuk tambah/edit
    const handleOpenAdd = () => {
        setEditIndex(null);
        setOpenDialog(true);
    };
    const handleOpenEdit = (idx: number) => {
        setEditIndex(idx);
        setOpenDialog(true);
    };
    const handleOpenDelete = (idx: number) => {
        setDeleteIndex(idx);
        setOpenDeleteDialog(true);
    };
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditIndex(null);
    };
    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setDeleteIndex(null);
    };

    return (
        <AdminLayout>
            <div className="container mx-auto py-8">
                <Card className="border border-purple-200 rounded-xl shadow-sm bg-gradient-to-br from-white to-purple-50/30">
                    <CardHeader className="flex flex-row items-center gap-3 pb-4 border-b border-purple-100 justify-between">
                        <div className="flex items-center gap-3">
                            <BookOpen className="text-purple-500" size={28} />
                            <CardTitle className="text-2xl font-bold text-gray-800">
                                Manajemen Periode
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
                            {periodList.map((period, idx) => (
                                <li
                                    key={period.id}
                                    className="flex items-center gap-3 bg-purple-50/60 rounded-lg px-5 py-3 border border-purple-300 shadow-md hover:shadow-purple-300 hover:bg-purple-100/40 justify-between cursor-pointer transition-all duration-200 hover:scale-[1.03] hover:-translate-y-0.5"
                                    style={{ userSelect: "none" }}
                                    onClick={() =>
                                        router.visit(`/period/${period.id}`)
                                    }
                                >
                                    <div className="flex items-center gap-3">
                                        <BookOpen
                                            className="text-purple-400"
                                            size={22}
                                        />
                                        <span className="text-lg font-medium text-gray-700">
                                            {period.name} ({period.year})
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
                            {periodList.length === 0 && (
                                <li className="text-center text-gray-500 py-8">
                                    Belum ada data periode
                                </li>
                            )}
                        </ul>
                    </CardContent>
                </Card>
            </div>
            {/* Modal Tambah/Edit */}
            {openDialog && (
                <AddPeriodModal
                    open={openDialog && editIndex === null}
                    onClose={handleCloseDialog}
                />
            )}
            {openDialog && editIndex !== null && (
                <EditPeriodModal
                    open={openDialog}
                    onClose={handleCloseDialog}
                    period={periodList[editIndex]}
                />
            )}
            {/* Modal Konfirmasi Hapus */}
            {openDeleteDialog && (
                <DelPeriodModal
                    open={openDeleteDialog}
                    onClose={handleCloseDeleteDialog}
                    period={periodList[deleteIndex ?? 0]}
                />
            )}
        </AdminLayout>
    );
}
