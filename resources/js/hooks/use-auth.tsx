import { Role } from "@/types";
import { usePage } from "@inertiajs/react";

export default function useAuth() {
  const { props } = usePage();
  const user = props.user;

  const hasRole = (...roles: Role[]) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  const isAuthenticated = !!user;

  return {
    user,
    isAuthenticated,
    hasRole,
  };
}
