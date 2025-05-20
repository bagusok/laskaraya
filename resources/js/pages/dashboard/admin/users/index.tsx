import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminLayout from "@/components/layouts/adminLayout";
import UsersTable from "@/components/ui/admin/user/user-table";
import { User } from "@/types";
import { PaginatedProps } from "@/types/paginatedProps";
import AddUserModal from "@/components/ui/admin/user/addUserModal";

export default function UserManagement({
    users,
    prodiList
}: {
    users: PaginatedProps<User>;
    prodiList: any[];
}) {
    return (
        <AdminLayout title="Manajemen Pengguna">
            <Card className="border-1 border-purple-300 hover:shadow-md shadow-purple-300 transition-all">
                <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-xl font-bold text-gray-900">
                            Manajemen Pengguna
                        </CardTitle>
                        <AddUserModal prodiList={prodiList as never[]} />
                    </div>
                </CardHeader>
                <CardContent>
                    <UsersTable users={users} />
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
