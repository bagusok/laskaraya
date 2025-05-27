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
import { router } from "@inertiajs/react";
import toast from "react-hot-toast";

export default function DeleteTeamModal({
    open,
    onOpenChange,
    teamId,
    refetch
}: {
    teamId: number;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    refetch: () => void;
}) {
    const handleDelete = () => {
        router.delete(route("admin.teams.destroy", teamId), {
            onSuccess: (data) => {
                toast.success(data.props.success);
                refetch();
            },
            onError: (error) => {
                Object.keys(error).forEach((key) => {
                    toast.error(error[key]);
                });
            }
        });
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogTrigger asChild>
                <Button variant="outline">Show Dialog</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Apakah Anda yakin ingin menghapus Tim ini?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Menghapus Tim ini akan menghapus semua data yang terkait
                        dengan Tim ini, termasuk peserta dan hasilnya. Jika Anda
                        tidak yakin, Anda dapat menonaktifkan Tim ini sebagai
                        gantinya.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button
                            className="bg-red-500 hover:bg-red-500 hover:opacity-70"
                            onClick={handleDelete}
                        >
                            Hapus
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
