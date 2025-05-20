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
import { motion } from "framer-motion";

export default function DosenDashboard() {
    const { user } = useAuth();

    return (
        <DosenLayout>
            <Head title="Dosen" />
            <motion.section
                className="mb-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
            >
                <div className="lg:hidden space-y-6">
                    <ProfileCard user={user} />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mt-2">
                    {statsDosen.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{
                                duration: 0.4,
                                ease: "easeOut",
                                delay: index * 0.05
                            }}
                        >
                            <StatCard
                                label={stat.label}
                                value={stat.value}
                                icon={stat.icon}
                            />
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* Main content grid */}
            <motion.div
                className="grid grid-cols-1 lg:grid-cols-12 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
            >
                <div className="lg:col-span-8 space-y-6">
                    <MahasiswaBimbinganList data={mahasiswaBimbingan} />
                    <LombaKompetisiList data={lombaKompetisi} />
                </div>
                <div className="hidden lg:block lg:col-span-4 space-y-6">
                    <ProfileCard user={user} />
                </div>
            </motion.div>
        </DosenLayout>
    );
}
