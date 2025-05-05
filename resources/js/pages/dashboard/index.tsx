import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/use-auth";
import { Link } from "@inertiajs/react";

export default function Dashboard() {
  const { user } = useAuth();

  console.log(user);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="mt-4">Welcome to the dashboard!</p>
      {user && (
        <div className="mt-4">
          <p className="text-lg">User: {user.name}</p>
          <p className="text-lg">Email: {user.email}</p>
          <p className="text-lg">Role: {user.role}</p>
        </div>
      )}

      <Button asChild>
        <Link href={route("logout")} className="mt-4">
          Logout
        </Link>
      </Button>
    </div>
  );
}
