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

export default function DelPeriodModal({
    open,
    onClose,
    period
}: {
    open: boolean;
    onClose: () => void;
    period: any;
}) {
    const { delete: destroy, processing } = useForm();

    const handleDelete = (e: React.FormEvent) => {
        e.preventDefault();
        destroy(`/period/${period.id}`, {
            onSuccess: () => {
                onClose();
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Hapus Periode</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleDelete} className="space-y-4">
                    <p>
                        Yakin ingin menghapus periode <b>{period?.name}</b> (
                        {period?.year})?
                    </p>
                    <DialogFooter>
                        <Button
                            type="submit"
                            variant="destructive"
                            disabled={processing}
                        >
                            Hapus
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
