import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import useAuth from "@/hooks/use-auth";
import { profileSchema } from "../types/profile.d";
import type { ProfileFormData } from "../types/profile.d";
import toast from "react-hot-toast";
import { usePage } from "@inertiajs/react";
import type { User } from "@/types/profile";

export function useProfileForm() {
    const { props } = usePage();
    const user = props.user as User;
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
            name: user.name,
            email: user.email,
            identifier: user.identifier,
            phone: user.phone,
            role: user.role,
            is_verified: user.is_verified,
            // Set default values for dosen data if exists
            address: user.dosen?.address || "",
            faculty: user.dosen?.faculty || "",
            major: user.dosen?.major || "",
            gender: user.dosen?.gender || undefined,
            birth_place: user.dosen?.birth_place || "",
            birth_date: user.dosen?.birth_date || "",
            password: "",
            prodi_id: user.mahasiswa?.prodi_id
        }
    });

    useEffect(() => {
        if (user) {
            reset({
                name: user.name,
                email: user.email,
                identifier: user.identifier,
                phone: user.phone,
                role: user.role,
                is_verified: user.is_verified,
                password: "",
                address: user.dosen?.address || "",
                faculty: user.dosen?.faculty || "",
                major: user.dosen?.major || "",
                gender: user.dosen?.gender || undefined,
                birth_place: user.dosen?.birth_place || "",
                birth_date: user.dosen?.birth_date || "",
                prodi_id: user.mahasiswa?.prodi_id
            });
        }
    }, [user, reset]);

    const onSubmit: SubmitHandler<ProfileFormData> = async (data) => {
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append("_method", "PUT");

            // Hanya field yang diperlukan backend
            formData.append("name", data.name);
            formData.append("email", data.email);
            formData.append("identifier", data.identifier);
            formData.append("phone", data.phone);
            formData.append("role", data.role);
            formData.append("is_verified", data.is_verified ? "1" : "0");
            if (data.password && data.password.length > 0) {
                formData.append("password", data.password);
            }

            if (data.image && data.image[0]) {
                formData.append("image", data.image[0]);
            }

            // Append dosen data if role is dosen or admin
            if (data.role === "dosen" || data.role === "admin") {
                if (data.address) formData.append("address", data.address);
                if (data.faculty) formData.append("faculty", data.faculty);
                if (data.major) formData.append("major", data.major);
                if (data.gender) formData.append("gender", data.gender);
                if (data.birth_place)
                    formData.append("birth_place", data.birth_place);
                if (data.birth_date)
                    formData.append("birth_date", data.birth_date);
            }

            // Append mahasiswa data if role is mahasiswa
            if (data.role === "mahasiswa" && data.prodi_id) {
                formData.append("prodi_id", data.prodi_id.toString());
            }

            // Append skills data
            if (data.skills) {
                formData.append("skills", JSON.stringify(data.skills));
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
                            role: page.props.user.role,
                            is_verified: page.props.user.is_verified,
                            password: "",
                            address: page.props.user.dosen?.address || "",
                            faculty: page.props.user.dosen?.faculty || "",
                            major: page.props.user.dosen?.major || "",
                            gender: page.props.user.dosen?.gender || undefined,
                            birth_place:
                                page.props.user.dosen?.birth_place || "",
                            birth_date: page.props.user.dosen?.birth_date || "",
                            prodi_id: page.props.user.mahasiswa?.prodi_id
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
            console.error("Error updating profile:", error);
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
