import { useForm } from "@inertiajs/react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function EditPeriodModal({
    open,
    onClose,
    period,
    onSuccess
}: {
    open: boolean;
    onClose: () => void;
    period: any;
    onSuccess?: () => void;
}) {
    const { data, setData, put, processing, errors, reset } = useForm({
        name: period?.name || "",
        year: period?.year || new Date().getFullYear()
    });

    useEffect(() => {
        if (open) {
            setData({
                name: period?.name || "",
                year: period?.year || new Date().getFullYear()
            });
        }
    }, [open, period]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/period/${period.id}`, {
            onSuccess: () => {
                toast.success("Berhasil mengubah periode");
                reset();
                onClose();
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
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle asChild>
                        <h2 className="text-xl font-normal text-purple-900 mb-4 tracking-tight">
                            Edit Periode
                        </h2>
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-xs uppercase tracking-wider text-purple-900 mb-1 font-medium"
                        >
                            Nama Periode
                        </label>
                        <select
                            id="name"
                            className="w-full py-1.5 border-b border-gray-300 focus:border-purple-700 focus:outline-none bg-transparent appearance-none text-base text-purple-900 font-medium uppercase tracking-wide"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            required
                        >
                            <option value="">Pilih Periode</option>
                            <option value="Ganjil">Ganjil</option>
                            <option value="Genap">Genap</option>
                        </select>
                        {errors.name && (
                            <small className="text-red-400 italic text-xs">
                                * {errors.name}
                            </small>
                        )}
                    </div>
                    <div>
                        <label
                            htmlFor="year"
                            className="block text-xs uppercase tracking-wider text-purple-900 mb-1 font-medium"
                        >
                            Tahun
                        </label>
                        <input
                            type="number"
                            id="year"
                            className="w-full py-1.5 border-b border-gray-300 focus:border-purple-700 focus:outline-none transition-colors text-base bg-transparent"
                            value={data.year}
                            onChange={(e) =>
                                setData("year", Number(e.target.value))
                            }
                            required
                            min={2000}
                        />
                        {errors.year && (
                            <small className="text-red-400 italic text-xs">
                                * {errors.year}
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
