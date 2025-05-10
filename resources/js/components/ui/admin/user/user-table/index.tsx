import { Input } from "../../../input";
import DataTable from "@/components/ui/shared/dataTable";
import { userDataTableColumns } from "./columns";
import { User } from "@/types";
import { FormEvent, useMemo, useState } from "react";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination";
import { PaginatedProps } from "@/types/paginatedProps";
import { router } from "@inertiajs/react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";

export default function UsersTable({ users }: { users: PaginatedProps<User> }) {
    const columns = useMemo(() => userDataTableColumns(), []);

    const [search, setSearch] = useState<"name" | "email" | "identifier">(
        "name"
    );

    const [searchQuery, setSearchQuery] = useState<string>("");

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();

        router.visit(route("users.index"), {
            method: "get",
            data: {
                search: search,
                search_query: searchQuery
            },
            preserveScroll: true,
            preserveState: true
        });
    };

    return (
        <div className="w-full space-y-4">
            <form
                className="flex flex-col sm:flex-row items-center gap-4 py-4"
                onSubmit={(e) => handleSearch(e)}
            >
                <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Masukan keyword pencarian"
                    className="max-w-sm border-purple-200 focus:border-purple-300 focus:ring-purple-300"
                />
                <Select
                    onValueChange={(v) =>
                        setSearch(v as "name" | "email" | "identifier")
                    }
                    value="name"
                >
                    <SelectTrigger className="w-full sm:w-auto border-purple-200 hover:bg-purple-100/30 hover:text-purple-600">
                        <SelectValue placeholder="Kolom" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="name">Nama</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="identifier">NIM/NIP</SelectItem>
                    </SelectContent>
                </Select>
            </form>
            <div className="rounded-md border border-purple-200 overflow-x-auto">
                <DataTable columns={columns} data={users.data} />
            </div>
            <div className="flex items-center justify-end gap-4 pt-4">
                <div className="text-sm text-gray-500 mr-auto">
                    Menampilkan {users.current_page} dari {users.last_page}{" "}
                    halaman
                </div>
                <Pagination>
                    <PaginationContent>
                        {users.prev_page_url && (
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() =>
                                        router.visit(users.prev_page_url!, {
                                            data: {
                                                search,
                                                search_query: searchQuery
                                            },
                                            method: "get",
                                            preserveScroll: false, // atau true, sesuaikan
                                            preserveState: false // pastikan state lama di-reset
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
                                {users.current_page}
                            </PaginationLink>
                        </PaginationItem>

                        {users.next_page_url && (
                            <PaginationItem>
                                <PaginationNext
                                    onClick={() =>
                                        router.visit(users.next_page_url!, {
                                            method: "get",
                                            data: {
                                                search,
                                                search_query: searchQuery
                                            },
                                            preserveScroll: false, // atau true, sesuaikan
                                            preserveState: false // pastikan state lama di-reset
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
