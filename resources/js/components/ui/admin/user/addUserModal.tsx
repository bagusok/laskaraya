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
import { Plus } from "lucide-react";
import { useForm } from "@inertiajs/react";
import toast from "react-hot-toast";
import { useState } from "react";

export default function AddUserModal({ prodiList = [] }) {
    const [open, setOpen] = useState(false);

    const { data, setData, errors, post, processing } = useForm({
        name: "",
        email: "",
        identifier: "",
        phone: "",
        faculty: "",
        role: "mahasiswa",
        password: "",
        year: new Date().getFullYear(),
        prodi_id: ""
    });

    const handleSubmit = () => {
        post(route("users.create"), {
            onSuccess: (data) => {
                toast.success(data.props.success);
                console.log("User added successfully!");
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

    console.log("prodiList", prodiList);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                    <Plus size={16} className="mr-2" />
                    Tambah Pengguna
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle asChild>
                        <h2 className="text-xl font-normal text-purple-900 mb-4 tracking-tight">
                            Tambah Pengguna
                        </h2>
                    </DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name Field */}
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-xs uppercase tracking-wider text-purple-900 mb-1 font-medium"
                        >
                            Nama
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
                    {/* Email Field */}
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-xs uppercase tracking-wider text-purple-900 mb-1 font-medium"
                        >
                            Email
                        </label>
                        <input
                            name="email"
                            id="email"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            className="w-full py-1.5 border-b border-gray-300 focus:border-purple-700 focus:outline-none transition-colors text-base bg-transparent"
                            required
                        />
                        {errors.email && (
                            <small className="text-red-400 italic text-xs">
                                * {errors.email}
                            </small>
                        )}
                    </div>
                    {/* NIM/NIP Field */}
                    <div>
                        <label
                            htmlFor="identifier"
                            className="block text-xs uppercase tracking-wider text-purple-900 mb-1 font-medium"
                        >
                            NIM/NIP
                        </label>
                        <input
                            type="number"
                            name="identifier"
                            id="identifier"
                            value={data.identifier}
                            onChange={(e) =>
                                setData("identifier", e.target.value)
                            }
                            className="w-full py-1.5 border-b border-gray-300 focus:border-purple-700 focus:outline-none transition-colors text-base bg-transparent"
                            required
                            min={3}
                        />
                        {errors.identifier && (
                            <small className="text-red-400 italic text-xs">
                                * {errors.identifier}
                            </small>
                        )}
                    </div>
                    {/* Phone Field */}
                    <div>
                        <label
                            htmlFor="phone"
                            className="block text-xs uppercase tracking-wider text-purple-900 mb-1 font-medium"
                        >
                            No. Telepon
                        </label>
                        <input
                            name="phone"
                            id="phone"
                            value={data.phone}
                            onChange={(e) => setData("phone", e.target.value)}
                            className="w-full py-1.5 border-b border-gray-300 focus:border-purple-700 focus:outline-none transition-colors text-base bg-transparent"
                            required
                        />
                        {errors.phone && (
                            <small className="text-red-400 italic text-xs">
                                * {errors.phone}
                            </small>
                        )}
                    </div>
                    {/* Faculty Field */}
                    <div>
                        <label
                            htmlFor="faculty"
                            className="block text-xs uppercase tracking-wider text-purple-900 mb-1 font-medium"
                        >
                            Jurusan
                        </label>
                        <input
                            name="faculty"
                            id="faculty"
                            value={data.faculty}
                            onChange={(e) => setData("faculty", e.target.value)}
                            className="w-full py-1.5 border-b border-gray-300 focus:border-purple-700 focus:outline-none transition-colors text-base bg-transparent"
                            required
                        />
                        {errors.faculty && (
                            <small className="text-red-400 italic text-xs">
                                * {errors.faculty}
                            </small>
                        )}
                    </div>
                    {/* Role Field */}
                    <div>
                        <label
                            htmlFor="role"
                            className="block text-xs uppercase tracking-wider text-purple-900 mb-1 font-medium"
                        >
                            Role
                        </label>
                        <div className="relative">
                            <select
                                name="role"
                                value={data.role}
                                onChange={(e) =>
                                    setData("role", e.target.value)
                                }
                                className="w-full py-1.5 border-b border-gray-300 focus:border-purple-700 focus:outline-none bg-transparent appearance-none text-base text-purple-900 font-medium uppercase tracking-wide"
                            >
                                <option
                                    value="mahasiswa"
                                    className="text-purple-700 bg-white font-medium"
                                >
                                    Mahasiswa
                                </option>
                                <option
                                    value="dosen"
                                    className="text-purple-700 bg-white font-medium"
                                >
                                    Dosen
                                </option>
                                <option
                                    value="admin"
                                    className="text-purple-700 bg-white font-medium"
                                >
                                    Admin
                                </option>
                            </select>
                            <div className="absolute right-2 bottom-2 pointer-events-none">
                                <svg
                                    className="h-4 w-4 text-purple-900"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                    {data.role === "mahasiswa" && (
                        <div>
                            <label
                                htmlFor="year"
                                className="block text-xs uppercase tracking-wider text-purple-900 mb-1 font-medium"
                            >
                                Tahun Masuk
                            </label>
                            <input
                                type="number"
                                name="year"
                                id="year"
                                value={data.year}
                                onChange={(e) =>
                                    setData("year", Number(e.target.value))
                                }
                                className="w-full py-1.5 border-b border-gray-300 focus:border-purple-700 focus:outline-none transition-colors text-base bg-transparent"
                                required
                                min={2000}
                            />
                            {errors.year && (
                                <small className="text-red-400 italic text-xs">
                                    * {errors.year}
                                </small>
                            )}
                        </div>
                    )}
                    {/* Prodi Field */}
                    <div>
                        <label
                            htmlFor="prodi_id"
                            className="block text-xs uppercase tracking-wider text-purple-900 mb-1 font-medium"
                        >
                            Program Studi
                        </label>
                        <select
                            name="prodi_id"
                            value={data.prodi_id || ""}
                            onChange={(e) =>
                                setData("prodi_id", e.target.value)
                            }
                            className="w-full py-1.5 border-b border-gray-300 focus:border-purple-700 focus:outline-none bg-transparent"
                            required
                        >
                            <option value="">Pilih Program Studi</option>
                            {prodiList.map((prodi: any) => (
                                <option key={prodi.id} value={prodi.id}>
                                    {prodi.nama}
                                </option>
                            ))}
                        </select>
                        {errors.prodi_id && (
                            <small className="text-red-400 italic text-xs">
                                * {errors.prodi_id}
                            </small>
                        )}
                    </div>
                    {/* Password Field */}
                    <div className="md:col-span-2">
                        <label
                            htmlFor="password"
                            className="block text-xs uppercase tracking-wider text-purple-900 mb-1 font-medium"
                        >
                            Password
                        </label>
                        <input
                            name="password"
                            id="password"
                            type="password"
                            value={data.password}
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            className="w-full py-1.5 border-b border-gray-300 focus:border-purple-700 focus:outline-none transition-colors text-base bg-transparent"
                            autoComplete="new-password"
                            required
                        />
                        {errors.password && (
                            <small className="text-red-400 italic text-xs">
                                * {errors.password}
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
