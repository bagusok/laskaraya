import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useCallback, useState } from "react";
import { teamColumns } from "./columns";
import DataTable from "@/components/ui/shared/dataTable";
import DeleteTeamModal from "./deleteTeam";
import useAuth from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

export enum VerifiedStatus {
    ACCEPTED = "accepted",
    REJECTED = "rejected",
    PENDING = "pending"
}

export default function TeamTable() {
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [teamId, setTeamId] = useState(0);

    const [page, setPage] = useState(1);

    const { user } = useAuth();

    const [verifiedStatus, _setVerifiedStatus] =
        useState<VerifiedStatus | null>(null);

    const teams = useQuery({
        queryKey: ["teams", page, verifiedStatus],
        queryFn: async () => {
            const res = await axios.get(route("admin.teams.getAll"), {
                params: {
                    page,
                    limit: 10,
                    ...(verifiedStatus
                        ? { verified_status: verifiedStatus }
                        : {})
                }
            });
            return res.data;
        }
    });

    const setVerifiedStatus = (status: VerifiedStatus | null) => {
        _setVerifiedStatus(status);
        setPage(1);
    };

    const columns = useCallback(() => {
        return teamColumns(setOpenDeleteModal, setTeamId, user?.id ?? 0);
    }, [user?.id]);

    return (
        <>
            <div className="w-full mt-6 p-1 bg-white inline-flex gap-2 rounded-xl overflow-hidden border overflow-x-auto">
                {teams.isLoading && (
                    <div className="flex items-center justify-center w-full h-96">
                        <p className="text-muted-foreground">Loading...</p>
                    </div>
                )}

                {teams.isSuccess && teams.data.data && (
                    <div>
                        <div className="mt-6 p-1 rounded bg-muted inline-flex gap-2">
                            <Button
                                onClick={() => setVerifiedStatus(null)}
                                size="sm"
                                className={cn("rounded", {
                                    "bg-white rounded text-black font-medium hover:text-black hover:bg-white":
                                        verifiedStatus === null,
                                    "bg-muted text-black/50 hover:bg-muted":
                                        verifiedStatus !== null
                                })}
                            >
                                Semua
                            </Button>
                            <Button
                                onClick={() =>
                                    setVerifiedStatus(VerifiedStatus.ACCEPTED)
                                }
                                size="sm"
                                className={cn("rounded", {
                                    "bg-white rounded text-black font-medium hover:text-black hover:bg-white":
                                        verifiedStatus ===
                                        VerifiedStatus.ACCEPTED,
                                    "bg-muted text-black/50 hover:bg-muted":
                                        verifiedStatus !==
                                        VerifiedStatus.ACCEPTED
                                })}
                            >
                                Diterima
                            </Button>
                            <Button
                                onClick={() =>
                                    setVerifiedStatus(VerifiedStatus.REJECTED)
                                }
                                size="sm"
                                className={cn("rounded", {
                                    "bg-white rounded text-black font-medium hover:text-black hover:bg-white":
                                        verifiedStatus ===
                                        VerifiedStatus.REJECTED,
                                    "bg-muted text-black/50 hover:bg-muted":
                                        verifiedStatus !==
                                        VerifiedStatus.REJECTED
                                })}
                            >
                                Ditolak
                            </Button>
                            <Button
                                onClick={() =>
                                    setVerifiedStatus(VerifiedStatus.PENDING)
                                }
                                size="sm"
                                className={cn("rounded", {
                                    "bg-white rounded text-black font-medium hover:text-black hover:bg-white":
                                        verifiedStatus ===
                                        VerifiedStatus.PENDING,
                                    "bg-muted text-black/50 hover:bg-muted":
                                        verifiedStatus !==
                                        VerifiedStatus.PENDING
                                })}
                            >
                                Menunggu Verifikasi
                            </Button>
                        </div>
                        <DataTable columns={columns()} data={teams.data.data} />
                    </div>
                )}

                {teams.isError && (
                    <div className="flex items-center justify-center w-full h-96">
                        <p className="text-muted-foreground">
                            Terjadi kesalahan saat memuat data kompetisi
                        </p>
                    </div>
                )}
            </div>
            <div className="w-full inline-flex justify-between items-center mt-4">
                <div>
                    <p className="text-sm text-muted-foreground">
                        Halaman {teams.data?.pagination.current_page} dari{" "}
                        {teams.data?.pagination.last_page} | Total Data:{" "}
                        {teams.data?.pagination.total}{" "}
                    </p>
                </div>

                <div className="inline-flex gap-2">
                    <Button
                        disabled={+teams.data?.pagination.current_page === 1}
                        onClick={() => {
                            setPage(+teams.data?.pagination.current_page - 1);
                        }}
                        variant="outline"
                        size="sm"
                    >
                        Sebelumnya
                    </Button>
                    <Button
                        disabled={
                            +teams.data?.pagination.current_page ===
                            +teams.data?.pagination.last_page
                        }
                        onClick={() => {
                            setPage(+teams.data?.pagination.current_page + 1);
                        }}
                        variant="outline"
                        size="sm"
                    >
                        Selanjutnya
                    </Button>
                </div>
            </div>
            {openDeleteModal && (
                <DeleteTeamModal
                    teamId={teamId}
                    open={openDeleteModal}
                    onOpenChange={setOpenDeleteModal}
                    refetch={() => {
                        teams.refetch();
                    }}
                />
            )}
        </>
    );
}
