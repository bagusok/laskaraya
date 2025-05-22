import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { useForm } from "@inertiajs/react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Pencil } from "lucide-react";

export default function EditBimbinganModal({
    bimbingan,
    onSuccess
}: {
    bimbingan: any;
    onSuccess?: () => void;
}) {
    const [open, setOpen] = useState(false);
    const { data, setData, put, processing, reset, errors } = useForm({
        status: bimbingan.status || "Aktif",
        prestasi: bimbingan.prestasi || "",
        kategori: bimbingan.kategori || ""
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route("dosen.bimbingan.update", bimbingan.id), {
            onSuccess: () => {
                toast.success("Berhasil mengubah bimbingan");
                setOpen(false);
                reset();
                if (onSuccess) onSuccess();
            },
            onError: (errors) => {
                Object.keys(errors).forEach((key) => {
                    toast.error(errors[key]);
                });
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    size="icon"
                    variant="outline"
                    className="hover:bg-purple-100/30 hover:text-purple-600 text-purple-300"
                >
                    <Pencil className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle asChild>
                        <h2 className="text-xl font-normal text-purple-900 mb-4 tracking-tight">
                            Edit Bimbingan
                        </h2>
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-xs uppercase tracking-wider text-purple-900 mb-1 font-medium"
                        >
                            Nama Mahasiswa
                        </label>
                        <Input
                            id="name"
                            value={bimbingan.name}
                            readOnly
                            className="w-full py-1.5 border-b border-gray-300 focus:border-purple-700 focus:outline-none transition-colors text-base bg-gray-100"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="status"
                            className="block text-xs uppercase tracking-wider text-purple-900 mb-1 font-medium"
                        >
                            Status
                        </label>
                        <Select
                            value={data.status}
                            onValueChange={(v) => setData("status", v)}
                        >
                            <SelectTrigger className="w-full py-1.5 border-b border-gray-300 focus:border-purple-700 focus:outline-none bg-transparent">
                                <SelectValue placeholder="Pilih Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Aktif">Aktif</SelectItem>
                                <SelectItem value="Selesai">Selesai</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.status && (
                            <small className="text-red-400 italic text-xs">
                                * {errors.status}
                            </small>
                        )}
                    </div>
                    <div>
                        <label
                            htmlFor="prestasi"
                            className="block text-xs uppercase tracking-wider text-purple-900 mb-1 font-medium"
                        >
                            Prestasi (opsional)
                        </label>
                        <Input
                            id="prestasi"
                            placeholder="Masukkan prestasi"
                            value={data.prestasi}
                            onChange={(e) =>
                                setData("prestasi", e.target.value)
                            }
                            className="w-full py-1.5 border-b border-gray-300 focus:border-purple-700 focus:outline-none transition-colors text-base bg-transparent"
                        />
                        {errors.prestasi && (
                            <small className="text-red-400 italic text-xs">
                                * {errors.prestasi}
                            </small>
                        )}
                    </div>
                    <div>
                        <label
                            htmlFor="kategori"
                            className="block text-xs uppercase tracking-wider text-purple-900 mb-1 font-medium"
                        >
                            Kategori (opsional)
                        </label>
                        <Input
                            id="kategori"
                            placeholder="Masukkan kategori"
                            value={data.kategori}
                            onChange={(e) =>
                                setData("kategori", e.target.value)
                            }
                            className="w-full py-1.5 border-b border-gray-300 focus:border-purple-700 focus:outline-none transition-colors text-base bg-transparent"
                        />
                        {errors.kategori && (
                            <small className="text-red-400 italic text-xs">
                                * {errors.kategori}
                            </small>
                        )}
                    </div>
                </div>
                <DialogFooter>
                    <div className="flex flex-col md:flex-row justify-end gap-3 pt-4">
                        <DialogClose asChild>
                            <button
                                type="button"
                                className="w-full md:w-auto px-4 py-2 text-purple-700 hover:text-purple-900 transition-colors font-medium text-sm border border-purple-100 rounded-lg bg-white"
                            >
                                Batal
                            </button>
                        </DialogClose>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={processing}
                            className="w-full md:w-auto px-6 py-2 bg-purple-800 text-white hover:bg-purple-900 transition-colors text-sm rounded-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        >
                            {processing ? "Loading..." : "Simpan"}
                        </button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
