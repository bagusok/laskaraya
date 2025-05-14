import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "../../button";
import { Trash } from "lucide-react";
import { useState } from "react";
import { router, useForm } from "@inertiajs/react";
import toast from "react-hot-toast";

export default function DelUserModal({
    userId,
    userName
}: {
    userId: number;
    userName: string;
}) {
    const [open, setOpen] = useState(false);

    const { data, setData, errors, delete: del, processing } = useForm();

     const handleDelete = () => {
            del(route("users.destroy", userId), {
                onSuccess: (data) => {
                    toast.success(data.props.success);
                    console.log("User deleted successfully!");
                    setOpen(false);
                },
                onError: (errors) => {
                    Object.keys(errors).forEach((key) => {
                        toast.error(errors[key]);
                    });

                    console.error(errors);
                }
            });
        };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    size="icon"
                    variant="outline"
                    className="hover:bg-red-100/30 hover:text-red-600 text-red-300"
                >
                    <Trash className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle asChild>
                        <h2 className="text-xl font-normal text-red-900 mb-4 tracking-tight">
                            Hapus Pengguna
                        </h2>
                    </DialogTitle>
                </DialogHeader>
                <p>
                    Apakah Anda yakin ingin menghapus pengguna{" "}
                    <strong>{userName}</strong>? Tindakan ini tidak dapat
                    dibatalkan.
                </p>
                <DialogFooter>
                    <div className="flex justify-end gap-3 pt-4">
                        <DialogClose asChild>
                            <button
                                type="button"
                                className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors font-medium text-sm border border-gray-100 rounded-lg bg-white"
                            >
                                Batal
                            </button>
                        </DialogClose>
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="px-6 py-2 bg-red-800 text-white hover:bg-red-900 transition-colors text-sm rounded-lg font-medium"
                        >
                            Hapus
                        </button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
