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
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";

export default function AddPeriodModal({
    open,
    onClose
}: {
    open: boolean;
    onClose: () => void;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        year: new Date().getFullYear().toString()
    });

    const handleSubmit = () => {
        post("/period", {
            ...data,
            onSuccess: () => {
                toast.success("Berhasil menambah periode");
                reset();
                onClose();
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle asChild>
                        <h2 className="text-xl font-normal text-purple-900 mb-4 tracking-tight">
                            Tambah Periode
                        </h2>
                    </DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Nama Periode */}
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-xs uppercase tracking-wider text-purple-900 mb-1 font-medium"
                        >
                            Nama Periode
                        </label>
                        <select
                            name="name"
                            id="name"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            className="w-full py-1.5 border-b border-gray-300 focus:border-purple-700 focus:outline-none bg-transparent"
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
                    {/* Tahun */}
                    <div>
                        <label
                            htmlFor="year"
                            className="block text-xs uppercase tracking-wider text-purple-900 mb-1 font-medium"
                        >
                            Tahun
                        </label>
                        <DatePicker
                            selected={
                                data.year
                                    ? new Date(Number(data.year), 0)
                                    : null
                            }
                            onChange={(date) =>
                                setData(
                                    "year",
                                    date ? date.getFullYear().toString() : ""
                                )
                            }
                            showYearPicker
                            dateFormat="yyyy"
                            className="w-full py-1.5 border-b border-gray-300 focus:border-purple-700 focus:outline-none bg-transparent"
                            placeholderText="Pilih Tahun"
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
