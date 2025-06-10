import MahasiswaLayout from "@/components/layouts/mahasiswaLayout";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import CustomInput from "@/components/ui/shared/customInput";
import { Textarea } from "@/components/ui/textarea";
import { router, useForm } from "@inertiajs/react";
import toast from "react-hot-toast";
import { Team } from "../../team-table/columns";
import { ArrowLeft, Trash } from "lucide-react";

type Props = {
    logs: {
        id: number;
        user_to_competition_id: number;
        name: string;
        description: string;
        date: string;
        created_at: string;
        updated_at: string;
    }[];
    team: Team;
};

export default function AddLog({ logs, team }: Props) {
    const { errors, data, setData, processing, post } = useForm({
        name: "",
        description: "",
        date: new Date().toISOString().split("T")[0]
    });

    const handleSubmit = (e: React.FormEvent) => {
        console.log("Submitting log data:", data);
        e.preventDefault();
        post(route("mahasiswa.teams.logs.post", team.id), {
            onSuccess: () => {
                toast.success("Log berhasil ditambahkan");
                setData({
                    name: "",
                    description: "",
                    date: new Date().toISOString().split("T")[0]
                });
            },
            onError: (errors) => {
                Object.keys(errors).forEach((key) => {
                    toast.error(errors[key]);
                });
            }
        });
    };

    const deleteLog = (logId: number) => {
        router.delete(
            route("mahasiswa.teams.logs.delete", { id: team.id, logId }),
            {
                onSuccess: () => {
                    toast.success("Log berhasil dihapus");
                },
                onError: (errors) => {
                    Object.keys(errors).forEach((key) => {
                        toast.error(errors[key]);
                    });
                }
            }
        );
    };

    return (
        <MahasiswaLayout title="Tambah Log">
            <Button
                variant="ghost"
                className="mb-4"
                onClick={() => window.history.back()}
            >
                <ArrowLeft />
                <span className="ml-2">Kembali</span>
            </Button>

            <div className="flex justify-between mb-6">
                <h1 className="text-2xl font-bold">Riwayat Log</h1>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>Tambah Log</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogTitle>Tambah Log</DialogTitle>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <CustomInput
                                label="Nama Log"
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                value={data.name}
                                error={errors.name}
                                required
                                placeholder="Masukkan nama log"
                                type="text"
                            />
                            <div>
                                <Label className="text-purple-800">
                                    Deskripsi
                                </Label>
                                <Textarea
                                    onChange={(e) =>
                                        setData("description", e.target.value)
                                    }
                                    value={data.description}
                                ></Textarea>
                            </div>
                            <CustomInput
                                label="Tanggal"
                                type="date"
                                onChange={(e) =>
                                    setData("date", e.target.value)
                                }
                                value={data.date}
                                error={errors.date}
                                required
                                placeholder="Pilih tanggal"
                            />
                            <DialogFooter>
                                <Button type="submit" disabled={processing}>
                                    {processing
                                        ? "Menambahkan..."
                                        : "Tambah Log"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {logs?.map((log) => (
                <Card key={log.id} className="mb-4">
                    <CardContent>
                        <div className="w-full flex justify-between">
                            <p className="text-lg font-semibold text-purple-800">
                                {new Date(log.date).toLocaleDateString(
                                    "id-ID",
                                    {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric"
                                    }
                                )}
                            </p>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="outline">
                                        <Trash size="16"></Trash>
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            Apakah Anda yakin ingin menghapus
                                            log ini?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Log yang dihapus tidak dapat
                                            dikembalikan.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>
                                            Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={() => deleteLog(log.id)}
                                        >
                                            Hapus
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                        <div>
                            <p className="font-semibold text-lg">{log.name}</p>
                            <p className="text-muted-foreground line-clamp-3 text-ellipsis">
                                {log.description}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </MahasiswaLayout>
    );
}
