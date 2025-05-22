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
import { useForm } from "@inertiajs/react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function DelBimbinganModal({
    bimbinganId,
    bimbinganName,
    onSuccess
}: {
    bimbinganId: number;
    bimbinganName: string;
    onSuccess?: () => void;
}) {
    const [open, setOpen] = useState(false);
    const { delete: del, processing } = useForm();

    const handleDelete = () => {
        del(route("dosen.bimbingan.destroy", bimbinganId), {
            onSuccess: () => {
                toast.success("Berhasil menghapus bimbingan");
                setOpen(false);
                onSuccess?.();
            },
            onError: (errors) => {
                toast.error("Gagal menghapus bimbingan");
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    size="icon"
                    variant="ghost"
                    className="hover:bg-red-100/30 hover:text-red-600"
                >
                    🗑️
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Hapus Bimbingan</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    Yakin ingin menghapus bimbingan <b>{bimbinganName}</b>?
                </div>
                <DialogFooter>
                    <Button
                        onClick={handleDelete}
                        disabled={processing}
                        className="bg-red-500 text-white"
                    >
                        Hapus
                    </Button>
                    <DialogClose asChild>
                        <Button type="button" variant="outline">
                            Batal
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
