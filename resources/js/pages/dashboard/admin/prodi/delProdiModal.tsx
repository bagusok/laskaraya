import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useState } from "react";
import { useForm } from "@inertiajs/react";
import toast from "react-hot-toast";

export default function DelProdiModal({
    prodiId,
    prodiName,
    onSuccess
}: {
    prodiId: number;
    prodiName: string;
    onSuccess?: () => void;
}) {
    const [open, setOpen] = useState(false);
    const { delete: del, processing } = useForm();

    const handleDelete = () => {
        del(route("prodi.destroy", prodiId), {
            onSuccess: (data) => {
                toast.success(
                    data.props.success || "Berhasil menghapus program studi"
                );
                setOpen(false);
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
                    className="hover:bg-purple-100 hover:text-purple-800 text-red-500"
                >
                    <Trash className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle asChild>
                        <h2 className="text-xl font-normal text-red-900 mb-4 tracking-tight">
                            Hapus Program Studi
                        </h2>
                    </DialogTitle>
                </DialogHeader>
                <p>
                    Apakah Anda yakin ingin menghapus program studi{" "}
                    <strong>{prodiName}</strong>? Tindakan ini tidak dapat
                    dibatalkan.
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
                            onClick={handleDelete}
                            className="px-6 py-2 bg-red-800 text-white hover:bg-purple-900 transition-colors text-sm rounded-lg font-medium disabled:opacity-70"
                            disabled={processing}
                        >
                            {processing ? "Menghapus..." : "Hapus"}
                        </button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
