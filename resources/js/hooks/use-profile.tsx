import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "@inertiajs/react";
import { useState } from "react";
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

    const onSubmit: SubmitHandler<ProfileFormData> = async (data) => {
        setIsLoading(true);
        try {
            const formData = new FormData();

            // Add _method for Laravel to handle PUT request
            formData.append("_method", "PUT");

            // Append all form fields to FormData
            Object.keys(data).forEach((key) => {
                if (key === "profile_picture" && data[key]?.[0]) {
                    formData.append(key, data[key][0]);
                } else if (key !== "profile_picture") {
                    formData.append(
                        key,
                        String(data[key as keyof ProfileFormData])
                    );
                }
            });

            await router.put(route("profile.update"), formData, {
                preserveScroll: true,
                onSuccess: (page) => {
                    // Reset form dengan data terbaru dari response
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
