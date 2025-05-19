import StatCard from "@/components/ui/admin/dashboard/statCard";
import ProfileCard from "@/components/ui/admin/dashboard/profileCard";
import DosenLayout from "@/components/layouts/dosenLayout";
import useAuth from "@/hooks/use-auth";
import MahasiswaBimbinganList from "@/components/ui/dosen/dashboard/mahasiswaBimbinganList";
import LombaKompetisiList from "@/components/ui/dosen/dashboard/lombaKompetisiList";
import {
    statsDosen,
    mahasiswaBimbingan,
    lombaKompetisi
} from "@/lib/dosenData";
import { Head, Link } from "@inertiajs/react";

export default function DosenDashboard() {
    const { user } = useAuth();

    return (

        <DosenLayout>
            <Head title="Dosen" />
            <section className="mb-10">
                <div className="lg:hidden space-y-6">
                    <ProfileCard user={user} />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mt-2">
                    {statsDosen.map((stat, index) => (
                        <StatCard
                            key={index}
                            label={stat.label}
                            value={stat.value}
                            icon={stat.icon}
                        />
                    ))}
                </div>
            </section>

            {/* Main content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 space-y-6">
                    <MahasiswaBimbinganList data={mahasiswaBimbingan} />
                    <LombaKompetisiList data={lombaKompetisi} />
                </div>
                <div className="hidden lg:block lg:col-span-4 space-y-6">
                    <ProfileCard user={user} />
                </div>
            </div>
        </DosenLayout>
    );
}
