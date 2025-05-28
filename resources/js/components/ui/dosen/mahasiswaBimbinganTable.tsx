import { Input } from "@/components/ui/input";
import DataTable from "@/components/ui/shared/dataTable";
import { MahasiswaBimbingan } from "@/types/user/user";
import { PaginatedProps } from "@/types/paginatedProps";
import { FormEvent, useMemo, useState } from "react";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination";
import { router } from "@inertiajs/react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import CompleteBimbinganModal from "./completeBimbinganModal";

export default function MahasiswaBimbinganTable({
    mahasiswa,
    mahasiswaList
}: {
    mahasiswa: PaginatedProps<MahasiswaBimbingan>;
    mahasiswaList: any[];
}) {
    const [search, setSearch] = useState<"name" | "identifier">("name");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [status, setStatus] = useState<string>("all");

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        router.visit(route("dosen.bimbingan"), {
            method: "get",
            data: {
                search,
                search_query: searchQuery,
                status: status !== "all" ? status : undefined
            },
            preserveScroll: true,
            preserveState: true
        });
    };

    const columns = useMemo(
        () => [
            { header: "Nama", accessorKey: "name" },
            { header: "NIM", accessorKey: "identifier" },
            { header: "Email", accessorKey: "email" },
            { header: "Nama Tim", accessorKey: "team_name" },
            { header: "Nama Lomba", accessorKey: "competition_name" },
            {
                header: "Status",
                accessorKey: "status",
                cell: ({ row }: any) => {
                    const status = row.original.status;
                    return (
                        <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                                status === "ongoing"
                                    ? "bg-blue-100 text-blue-700"
                                    : status === "completed"
                                      ? "bg-green-100 text-green-700"
                                      : "bg-red-100 text-red-700"
                            }`}
                        >
                            {status === "ongoing"
                                ? "Sedang Berlangsung"
                                : status === "completed"
                                  ? "Selesai"
                                  : "Dibatalkan"}
                        </span>
                    );
                }
            }
        ],
        []
    );

    console.log(mahasiswa.data);

    return (
        <div className="w-full space-y-4">
            <div className="flex justify-between items-center py-2">
                <form
                    className="flex flex-col sm:flex-row items-center gap-4"
                    onSubmit={handleSearch}
                >
                    <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari mahasiswa bimbingan"
                        className="max-w-sm border-purple-200 focus:border-purple-300 focus:ring-purple-300"
                    />
                    <Select
                        onValueChange={(v) =>
                            setSearch(v as "name" | "identifier")
                        }
                        value={search}
                    >
                        <SelectTrigger className="w-full sm:w-auto border-purple-200 hover:border-purple-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-200/50 hover:bg-purple-50/40 hover:text-purple-700 transition-colors">
                            <SelectValue placeholder="Kolom" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="name">Nama</SelectItem>
                            <SelectItem value="identifier">NIM</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select onValueChange={setStatus} value={status}>
                        <SelectTrigger className="w-full sm:w-auto border-purple-200 hover:border-purple-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-200/50 hover:bg-purple-50/40 hover:text-purple-700 transition-colors">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Status</SelectItem>
                            <SelectItem value="bimbingan">Bimbingan</SelectItem>
                            <SelectItem value="selesai">Selesai</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button type="submit" className="bg-purple-500 text-white">
                        Cari
                    </Button>
                </form>
            </div>
            <div className="rounded-md border border-purple-200 overflow-x-auto">
                <DataTable columns={columns as any} data={mahasiswa.data} />
            </div>
            <div className="flex items-center justify-end gap-4 pt-4">
                <div className="text-sm text-gray-500 mr-auto">
                    Menampilkan {mahasiswa.current_page} dari{" "}
                    {mahasiswa.last_page} halaman
                </div>
                <Pagination>
                    <PaginationContent>
                        {mahasiswa.current_page > 1 && (
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() =>
                                        router.visit(route("dosen.bimbingan"), {
                                            method: "get",
                                            data: {
                                                search,
                                                search_query: searchQuery,
                                                status:
                                                    status !== "all"
                                                        ? status
                                                        : undefined,
                                                page: mahasiswa.current_page - 1
                                            },
                                            preserveScroll: false,
                                            preserveState: false
                                        })
                                    }
                                />
                            </PaginationItem>
                        )}
                        <PaginationItem>
                            <PaginationLink
                                isActive={true}
                                className="hover:bg-purple-100/30 hover:text-purple-600"
                            >
                                {mahasiswa.current_page}
                            </PaginationLink>
                        </PaginationItem>
                        {mahasiswa.current_page < mahasiswa.last_page && (
                            <PaginationItem>
                                <PaginationNext
                                    onClick={() =>
                                        router.visit(route("dosen.bimbingan"), {
                                            method: "get",
                                            data: {
                                                search,
                                                search_query: searchQuery,
                                                status:
                                                    status !== "all"
                                                        ? status
                                                        : undefined,
                                                page: mahasiswa.current_page + 1
                                            },
                                            preserveScroll: false,
                                            preserveState: false
                                        })
                                    }
                                />
                            </PaginationItem>
                        )}
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
}
