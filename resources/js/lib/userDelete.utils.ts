import { router } from "@inertiajs/react";
import { route } from "ziggy-js";

export function handleDeleteUser(userId: number) {
    router.delete(route("users.destroy", userId));
}
