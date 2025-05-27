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

export default function CompleteBimbinganModal({
    open,
    onClose,
    mahasiswa
}: {
    open: boolean;
    onClose: () => void;
    mahasiswa: any;
}) {
    const { post, processing } = useForm();

    const handleComplete = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("dosen.bimbingan.status", mahasiswa.team_id), {
            onSuccess: () => {
                onClose();
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Selesai Bimbingan</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleComplete} className="space-y-4">
                    <p>
                        Apakah Anda yakin untuk menyelesaikan bimbingan{" "}
                        <b>{mahasiswa?.name}</b>?
                    </p>
                    <DialogFooter>
                        <Button
                            type="submit"
                            className="bg-green-600 hover:bg-green-700"
                            disabled={processing}
                        >
                            Ya, Selesai
                        </Button>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Batal
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
