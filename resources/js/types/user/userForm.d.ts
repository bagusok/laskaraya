import { User } from "../user";

export interface UserFormProps {
    initialValues?: Partial<User>;
    onSubmit: (values: Partial<User>) => void;
    onCancel: () => void;
    mode: "add" | "edit";
    prodi_id?: number;
    prodiList: { id: number; nama: string }[];
}
