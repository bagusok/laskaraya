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
import { Plus } from "lucide-react";
import { useForm } from "@inertiajs/react";
import toast from "react-hot-toast";
import { useState } from "react";

export default function AddProdiModal() {
    const [open, setOpen] = useState(false);
    const { data, setData, errors, post, processing } = useForm({
        name: ""
    });

    const handleSubmit = () => {
        post(route("prodi.create"), {
            onSuccess: (data) => {
                toast.success(
                    data.props.success || "Berhasil menambah program studi"
                );
                setOpen(false);
                setData("name", "");
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
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                    <Plus size={16} className="mr-2" />
                    Tambah Program Studi
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle asChild>
                        <h2 className="text-xl font-normal text-purple-900 mb-4 tracking-tight">
                            Tambah Program Studi
                        </h2>
                    </DialogTitle>
                </DialogHeader>
                <div className="mb-4">
                    <label
                        htmlFor="name"
                        className="block text-xs uppercase tracking-wider text-purple-900 mb-1 font-medium"
                    >
                        Nama Program Studi
                    </label>
                    <input
                        name="name"
                        id="name"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        className="w-full py-1.5 border-b border-gray-300 focus:border-purple-700 focus:outline-none transition-colors text-base bg-transparent"
                        required
                    />
                    {errors.name && (
                        <small className="text-red-400 italic text-xs">
                            * {errors.name}
                        </small>
                    )}
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
                            disabled={processing || !data.name.trim()}
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
