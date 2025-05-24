import { Role, User } from "@/types";
import { usePage } from "@inertiajs/react";

export default function useAuth() {
    const { props } = usePage();
    const user = props.user as User | null;

    const hasRole = (...roles: Role[]) => {
        if (!user) return false;
        return roles.includes(user.role);
    };

    const isAuthenticated = !!user;

    return {
        user,
        isAuthenticated,
        hasRole
    };
}
