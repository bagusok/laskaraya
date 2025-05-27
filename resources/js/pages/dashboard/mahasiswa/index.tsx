import StatCard from "@/components/ui/admin/dashboard/statCard";
import ProfileCard from "@/components/ui/admin/dashboard/profileCard";
import EventList from "@/components/ui/admin/dashboard/eventList";
import MahasiswaLayout from "@/components/layouts/mahasiswaLayout";
import useAuth from "@/hooks/use-auth";
import { upcomingEvents } from "@/lib/adminData";
import { stats } from "@/lib/mahasiswaData";
import { Star } from "lucide-react";

export default function MahasiswaDashboard() {
    const { user } = useAuth();

    // Hitung winrate
    const wins = parseInt(stats.find(stat => stat.label === "Menang")?.value || "0");
    const totalCompetitions = parseInt(stats.find(stat => stat.label === "Riwayat Lomba")?.value || "1");
    const winRate = ((wins / totalCompetitions) * 100).toFixed(1);

    const winRateStat = {
        label: "Ratio Menang",
        value: `${winRate}%`,
        icon: <Star className="text-yellow-500" />,
    };

    return (
        <MahasiswaLayout>
            <section className="mb-10">
                <div className="lg:hidden space-y-6">
                    <ProfileCard user={user} className="" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mt-2">
                    {stats.map((stat, index) => (
                        <StatCard
                            key={index}
                            label={stat.label}
                            value={stat.value}
                            icon={stat.icon}
                            className="shadow-sm"
                        />
                    ))}
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
                <div className="lg:col-span-8 space-y-6">
                    <EventList events={upcomingEvents} className="" />
                </div>
                <div className="hidden lg:block lg:col-span-4 space-y-6">
                    <ProfileCard user={user} className="" />
                </div>
            </div>

            <section className="mb-10 relative z-10">
                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                    <StatCard
                        label={winRateStat.label}
                        value={winRateStat.value}
                        icon={winRateStat.icon}
                        className="w-full max-w-md mx-auto shadow-sm"
                    />
                </div>
            </section>
        </MahasiswaLayout>
    );
}
