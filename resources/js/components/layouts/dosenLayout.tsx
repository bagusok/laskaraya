import { useState } from "react";
import { usePage } from "@inertiajs/react";
import Sidebar from "@/components/ui/shared/sidebar";
import Header from "@/components/ui/admin/dashboard/header";
import useAuth from "@/hooks/use-auth";
import { navItemsDosen } from "@/lib/layoutData";

interface DosenLayoutProps {
    children: React.ReactNode;
    title?: string;
}

export default function DosenLayout({ children, title }: DosenLayoutProps) {
    const { user } = useAuth();
    const { url } = usePage();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const closeSidebar = () => setSidebarOpen(false);

    return (
        <div className="bg-white min-h-screen relative">
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={closeSidebar}
                />
            )}
            <Sidebar
                navItems={navItemsDosen}
                sidebarOpen={sidebarOpen}
                onClose={closeSidebar}
                currentUrl={url}
            />

            <div className="lg:ml-72">
                <div className="sticky top-0 z-30 bg-white lg:shadow-none lg:static mt-2">
                    <Header
                        user={user ?? {}}
                        onToggleSidebar={toggleSidebar}
                        title={title}
                    />
                </div>

                <main className="px-2 sm:px-6 lg:px-12 pt-6 lg:pt-1 pb-12">
                    {children}
                </main>
            </div>
        </div>
    );
}
