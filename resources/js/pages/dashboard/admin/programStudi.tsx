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
import { motion, AnimatePresence } from "framer-motion";

const initialProgramStudiList = [
    "D-IV Teknik Informatika",
    "D-IV Sistem Informasi Bisnis",
    "D-II PPLS"
];

export default function ProgramStudi() {
    const [programStudiList, setProgramStudiList] = useState(
        initialProgramStudiList
    );
    const [openDialog, setOpenDialog] = useState(false);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [inputValue, setInputValue] = useState("");

    // Handler untuk tambah/edit
    const handleOpenAdd = () => {
        setEditIndex(null);
        setInputValue("");
        setOpenDialog(true);
    };
    const handleOpenEdit = (idx: number) => {
        setEditIndex(idx);
        setInputValue(programStudiList[idx]);
        setOpenDialog(true);
    };
    const handleSave = () => {
        if (inputValue.trim() === "") return;
        if (editIndex === null) {
            setProgramStudiList([...programStudiList, inputValue]);
        } else {
            const newList = [...programStudiList];
            newList[editIndex] = inputValue;
            setProgramStudiList(newList);
        }
        setOpenDialog(false);
    };
    const handleDelete = (idx: number) => {
        if (window.confirm("Yakin ingin menghapus program studi ini?")) {
            setProgramStudiList(programStudiList.filter((_, i) => i !== idx));
        }
    };

    return (
        <AdminLayout>
            <div className="container mx-auto py-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    <Card className="border border-purple-200 rounded-xl shadow-sm bg-gradient-to-br from-white to-purple-50/30">
                        <CardHeader className="flex flex-row items-center gap-3 pb-4 border-b border-purple-100 justify-between">
                            <div className="flex items-center gap-3">
                                <BookOpen
                                    className="text-purple-500"
                                    size={28}
                                />
                                <CardTitle className="text-2xl font-bold text-gray-800">
                                    Manajemen Program Studi
                                </CardTitle>
                            </div>
                            <motion.div
                                whileTap={{ scale: 0.95 }}
                                whileHover={{ scale: 1.05 }}
                            >
                                <Button
                                    className="bg-purple-500 hover:bg-purple-600 text-white transition-colors"
                                    onClick={handleOpenAdd}
                                >
                                    <Plus className="mr-2" size={18} /> Tambah
                                </Button>
                            </motion.div>
                        </CardHeader>
                        <CardContent className="py-8">
                            <ul className="space-y-4">
                                <AnimatePresence>
                                    {programStudiList.map((prodi, idx) => (
                                        <motion.li
                                            key={prodi + idx}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{
                                                duration: 0.3,
                                                ease: "easeOut"
                                            }}
                                            className="flex items-center gap-3 bg-purple-50/60 rounded-lg px-5 py-3 border border-purple-300 shadow-md hover:shadow-sm hover:shadow-purple-200 justify-between cursor-pointer transition-all duration-200 hover:scale-[1.03] hover:-translate-y-0.5"
                                        >
                                            <div className="flex items-center gap-3">
                                                <BookOpen
                                                    className="text-purple-400"
                                                    size={22}
                                                />
                                                <span className="text-lg font-medium text-gray-700">
                                                    {prodi}
                                                </span>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="text-purple-600 hover:text-purple-800"
                                                    onClick={() =>
                                                        handleOpenEdit(idx)
                                                    }
                                                >
                                                    <Pencil size={18} />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="text-red-500 hover:text-red-700"
                                                    onClick={() =>
                                                        handleDelete(idx)
                                                    }
                                                >
                                                    <Trash2 size={18} />
                                                </Button>
                                            </div>
                                        </motion.li>
                                    ))}
                                </AnimatePresence>
                            </ul>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
            <AnimatePresence>
                {openDialog && (
                    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                        <DialogContent asChild>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                            >
                                <DialogHeader>
                                    <DialogTitle>
                                        {editIndex === null
                                            ? "Tambah Program Studi"
                                            : "Edit Program Studi"}
                                    </DialogTitle>
                                </DialogHeader>
                                <Input
                                    value={inputValue}
                                    onChange={(e) =>
                                        setInputValue(e.target.value)
                                    }
                                    placeholder="Nama Program Studi"
                                    className="mt-4"
                                />
                                <DialogFooter>
                                    <Button
                                        className="bg-purple-500 hover:bg-purple-600 text-white"
                                        onClick={handleSave}
                                    >
                                        Simpan
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => setOpenDialog(false)}
                                    >
                                        Batal
                                    </Button>
                                </DialogFooter>
                            </motion.div>
                        </DialogContent>
                    </Dialog>
                )}
            </AnimatePresence>
        </AdminLayout>
    );
}
