import { Inertia } from "@inertiajs/react";
import { route } from "ziggy-js";

export function handleDeleteUser(userId: number) {
  Inertia.delete(route("users.destroy", userId));
}