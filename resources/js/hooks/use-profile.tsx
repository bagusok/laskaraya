import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import useAuth from "@/hooks/use-auth";
import { profileSchema } from "../types/profile.d";
import type { ProfileFormData } from "../types/profile.d";
import toast from "react-hot-toast";

export function useProfileForm() {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset
    } = useForm<ProfileFormData>({
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

    useEffect(() => {
        if (user) {
            reset({
                name: user.name || "",
                email: user.email || "",
                identifier: user.identifier || "",
                phone: user.phone || "",
                faculty: user.faculty || null,
                role: (user.role as "admin" | "dosen" | "mahasiswa") || "admin",
                is_verified: user.is_verified || false,
                password: ""
            });
        }
    }, [user, reset]);

    const onSubmit: SubmitHandler<ProfileFormData> = async (data) => {
        setIsLoading(true);
        try {
            console.log("data.image", data.image);
            const formData = new FormData();
            formData.append("_method", "PUT");
            // Hanya field yang diperlukan backend
            formData.append("name", data.name || "");
            formData.append("email", data.email || "");
            formData.append("identifier", data.identifier || "");
            formData.append("phone", data.phone || "");
            formData.append("role", data.role || "admin");
            formData.append("is_verified", data.is_verified ? "1" : "0");
            if (data.password) formData.append("password", data.password);
            if (data.image && data.image[0])
                formData.append("image", data.image[0]);

            console.log("FormData to send:");
            for (let pair of formData.entries()) {
                console.log(pair[0] + ": " + pair[1]);
            }

            await router.post(route("profile.update"), formData, {
                preserveScroll: true,
                onSuccess: (page) => {
                    if (page.props.user) {
                        reset({
                            name: page.props.user.name,
                            email: page.props.user.email,
                            identifier: page.props.user.identifier,
                            phone: page.props.user.phone,
                            faculty: page.props.user.faculty,
                            role: page.props.user.role as
                                | "admin"
                                | "dosen"
                                | "mahasiswa",
                            is_verified: page.props.user.is_verified,
                            password: ""
                        });
                        toast.success("Profil berhasil diperbarui");
                    }
                },
                onError: (errors) => {
                    console.error(errors);
                    Object.keys(errors).forEach((key) => {
                        toast.error(errors[key]);
                    });
                },
                onFinish: () => {
                    setIsLoading(false);
                }
            });
        } catch (error) {
            console.error(error);
            toast.error("Terjadi kesalahan saat memperbarui profil");
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
