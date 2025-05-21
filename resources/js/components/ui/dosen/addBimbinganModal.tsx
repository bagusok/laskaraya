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

export default function AddBimbinganModal({
    mahasiswaList = [],
    onSuccess
}: {
    mahasiswaList?: any[];
    onSuccess?: () => void;
}) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, reset, errors } = useForm({
        mahasiswaId: "",
        status: "Aktif",
        kategori: ""
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("dosen.bimbingan.create"), {
            onSuccess: () => {
                toast.success("Berhasil menambah bimbingan");
                setOpen(false);
                reset();
                onSuccess?.();
            },
            onError: (err) => {
                toast.error("Gagal menambah bimbingan");
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-purple-500 text-white">
                    Tambah Bimbingan
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Tambah Mahasiswa Bimbingan</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1">Nama Mahasiswa</label>
                        <Select
                            value={data.mahasiswaId}
                            onValueChange={(v) => setData("mahasiswaId", v)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Mahasiswa" />
                            </SelectTrigger>
                            <SelectContent>
                                {mahasiswaList.map((m) => (
                                    <SelectItem key={m.id} value={String(m.id)}>
                                        {m.name} ({m.identifier})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.mahasiswaId && (
                            <div className="text-red-500 text-xs">
                                {errors.mahasiswaId}
                            </div>
                        )}
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
