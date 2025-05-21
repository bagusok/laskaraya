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
                onSuccess?.();
            },
            onError: (err) => {
                toast.error("Gagal mengubah bimbingan");
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    size="icon"
                    variant="ghost"
                    className="hover:bg-purple-100/30 hover:text-purple-600"
                >
                    ✏️
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Bimbingan</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1">Nama Mahasiswa</label>
                        <Input
                            value={bimbingan.name}
                            readOnly
                            className="bg-gray-100"
                        />
                    </div>
                    <div>
                        <label className="block mb-1">Status</label>
                        <Select
                            value={data.status}
                            onValueChange={(v) => setData("status", v)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Aktif">Aktif</SelectItem>
                                <SelectItem value="Selesai">Selesai</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Input
                        placeholder="Prestasi (opsional)"
                        value={data.prestasi}
                        onChange={(e) => setData("prestasi", e.target.value)}
                    />
                    <Input
                        placeholder="Kategori (opsional)"
                        value={data.kategori}
                        onChange={(e) => setData("kategori", e.target.value)}
                    />
                    <DialogFooter>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-purple-500 text-white"
                        >
                            Simpan
                        </Button>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Batal
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
