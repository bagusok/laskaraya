import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "@inertiajs/react";
import { useState } from "react";
import useAuth from "@/hooks/use-auth";
import { profileSchema } from "../types/profile.d";
import type { ProfileFormData } from "../types/profile.d";

export function useProfileForm() {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset
    } = useForm<{
        name: string;
        email: string;
        identifier: string;
        phone: string;
        faculty: string | null;
        role: "admin" | "dosen" | "mahasiswa";
        is_verified: boolean;
        password?: string;
    }>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user?.name || "",
            email: user?.email || "",
            identifier: user?.identifier || "",
            phone: user?.phone || "",
            faculty: user?.faculty || null,
            role: (user?.role as "admin" | "dosen" | "mahasiswa") || "admin",
            is_verified: user?.is_verified || false,
            password: ""
        }
    });

    const onSubmit: SubmitHandler<ProfileFormData> = async (data) => {
        setIsLoading(true);
        try {
            await router.put(
                route("profile.update"),
                {
                    ...data,
                    _method: "PUT"
                },
                {
                    onSuccess: () => {
                        reset({
                            name: data.name,
                            email: data.email,
                            identifier: data.identifier,
                            phone: data.phone,
                            faculty: data.faculty,
                            role: data.role as "admin" | "dosen" | "mahasiswa",
                            is_verified: data.is_verified,
                            password: ""
                        });
                        router.visit(route("dashboard"));
                    },
                    onError: (errors) => {
                        console.error(errors);
                    },
                    onFinish: () => {
                        setIsLoading(false);
                    }
                }
            );
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    };

    return {
        register,
        handleSubmit,
        errors,
        setValue,
        onSubmit,
        isLoading,
        user
    };
}
