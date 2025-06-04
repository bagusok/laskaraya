import { router } from "@inertiajs/react";
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

export default function CompleteBimbinganModal({
    open,
    onClose,
    mahasiswa
}: {
    open: boolean;
    onClose: () => void;
    mahasiswa: any;
}) {
    const [isWin, setIsWin] = useState(false);
    const [processing, setProcessing] = useState(false);

    const handleComplete = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        router.post(
            route("dosen.bimbingan.status", mahasiswa.team_id),
            { is_win: isWin },
            {
                onSuccess: () => {
                    setProcessing(false);
                    onClose();
                },
                onFinish: () => setProcessing(false)
            }
        );
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
                    <div className="space-y-2">
                        <label className="font-medium">
                            Apakah lomba ini dimenangkan?
                        </label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-1">
                                <input
                                    type="radio"
                                    name="is_win"
                                    checked={isWin}
                                    onChange={() => setIsWin(true)}
                                />
                                Menang
                            </label>
                            <label className="flex items-center gap-1">
                                <input
                                    type="radio"
                                    name="is_win"
                                    checked={!isWin}
                                    onChange={() => setIsWin(false)}
                                />
                                Tidak Menang
                            </label>
                        </div>
                    </div>
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
