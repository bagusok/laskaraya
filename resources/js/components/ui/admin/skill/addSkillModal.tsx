import React, { useState } from "react";
import { Button } from "@/components/ui/button";

export default function AddSkillModal({ onSubmit, initialData, open, onClose }: {
    onSubmit: (data: { name: string; id?: number | null }) => void;
    initialData?: { name: string; id?: number | null };
    open: boolean;
    onClose: () => void;
}) {
    const [form, setForm] = useState(initialData || { name: "", id: null });
    React.useEffect(() => {
        setForm(initialData || { name: "", id: null });
    }, [initialData, open]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(form);
    };

    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                <h2 className="text-lg font-bold mb-4">{form.id ? "Edit" : "Tambah"} Ketrampilan</h2>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        <label className="block mb-1 font-medium">Nama Ketrampilan</label>
                        <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full border p-2 rounded" required />
                    </div>
                    <div className="flex gap-2 justify-end">
                        <Button type="button" variant="secondary" onClick={onClose}>Batal</Button>
                        <Button type="submit" variant="default">{form.id ? "Update" : "Tambah"}</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

