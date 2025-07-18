import StatCard from "@/components/ui/admin/dashboard/statCard";
import ProfileCard from "@/components/ui/admin/dashboard/profileCard";
import DosenLayout from "@/components/layouts/dosenLayout";
import useAuth from "@/hooks/use-auth";
import MahasiswaBimbinganList from "@/components/ui/dosen/dashboard/mahasiswaBimbinganList";
import LombaKompetisiList from "@/components/ui/dosen/dashboard/lombaKompetisiList";
import { Head, Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Trophy, Users, Target } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { User } from "@/types/profile";

type Props = {
    stats: {
        total_competitions: number;
        total_wins: number;
        total_students?: number;
        win_rate?: number;
    };
    mahasiswaBimbingan: CompetitionMember[];
};

interface Mahasiswa {
    nama: string;
    prestasi: string;
    kategori: string;
    tahun: number;
    status: string;
}

interface CompetitionMember {
    id: number;
    user_id: number;
    user_to_competition_id: number;
    user: User;
    userToCompetition: {
        id: number;
        name: string;
        competition_id: number;
        status: "pending" | "accepted" | "rejected";
        competition: {
            id: number;
            name: string;
            category: {
                id: number;
                name: string;
            };
            start_date: string;
            end_date: string;
            status: string;
        };
    };
}

interface Lomba {
    id: number;
    name: string;
    category: {
        id: number;
        name: string;
    };
    start_date: string;
    end_date: string;
    status: string;
    members: CompetitionMember[];
}

export default function DosenDashboard({ stats, mahasiswaBimbingan }: Props) {
    console.log("STATS DARI BACKEND:", stats);

    // Provide fallback values untuk safety
    const safeStats = {
        total_competitions: stats?.total_competitions ?? 0,
        total_wins: stats?.total_wins ?? 0,
        total_students: stats?.total_students ?? 0,
        win_rate: stats?.win_rate ?? 0
    };

    const { user } = useAuth();

    const lombaKompetisi = useQuery({
        queryKey: ["lombaKompetisi"],
        queryFn: async () => {
            const res = await axios.get(route("dosen.competitions.getAll"));
            return res.data;
        }
    });

    // Ubah format stats untuk konsistensi dengan format lain
    const statsData = [
        {
            label: "Total Lomba",
            value: safeStats.total_competitions.toString(),
            icon: <Award className="w-5 h-5 text-blue-500" />
        },
        {
            label: "Total Kemenangan",
            value: safeStats.total_wins.toString(),
            icon: <Trophy className="w-5 h-5 text-amber-500" />
        },
        safeStats.total_students !== undefined && {
            label: "Total Mahasiswa",
            value: safeStats.total_students.toString(),
            icon: <Users className="w-5 h-5 text-green-500" />
        },
        safeStats.win_rate !== undefined && {
            label: "Win Rate",
            value: `${safeStats.win_rate}%`,
            icon: <Target className="w-5 h-5 text-purple-500" />
        }
    ].filter(Boolean);

    if (!user) return null;

    return (
        <DosenLayout>
            <Head title="Dosen Dashboard" />
            <motion.section
                className="mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <div className="lg:hidden space-y-6">
                    <ProfileCard user={user as User} />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mt-2">
                    {statsData.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.5,
                                ease: "easeOut",
                                delay: index * 0.1
                            }}
                        >
                            <StatCard
                                label={stat.label}
                                value={stat.value}
                                icon={stat.icon}
                                className="shadow-sm"
                            />
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* Main content grid */}
            <motion.div
                className="grid grid-cols-1 lg:grid-cols-12 gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
            >
                <div className="lg:col-span-8 space-y-6">
                    {/* <MahasiswaBimbinganList data={mahasiswaBimbingan} /> */}
                    <LombaKompetisiList
                        data={(lombaKompetisi.data?.data as Lomba[]) ?? []}
                    />
                </div>
                <div className="hidden lg:block lg:col-span-4 space-y-6">
                    <ProfileCard user={user as User} />
                </div>
            </motion.div>
        </DosenLayout>
    );
}
