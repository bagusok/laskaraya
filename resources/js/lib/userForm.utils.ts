import { User } from "@/types/user/user";
import { ChangeEvent, FormEvent, Dispatch, SetStateAction } from "react";

export const defaultValues: Partial<User> = {
    name: "",
    email: "",
    identifier: "",
    phone: "",
    faculty: "",
    password: "",
    role: "Mahasiswa",
    is_verified: false,
    prodi_id: undefined
};

export function handleChangeForm(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    setForm: Dispatch<SetStateAction<Partial<User>>>
) {
    const { name, value, type } = e.target;
    let val: any = value;
    if (type === "checkbox" && e.target instanceof HTMLInputElement) {
        val = e.target.checked;
    }
    setForm((prev) => ({
        ...prev,
        [name]: val
    }));
}

export function handleSubmitForm(
    e: FormEvent,
    form: Partial<User>,
    onSubmit: (values: Partial<User>) => void
) {
    e.preventDefault();
    onSubmit(form);
}
