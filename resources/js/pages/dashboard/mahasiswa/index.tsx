import StatCard from "@/components/ui/admin/dashboard/statCard";
import ProfileCard from "@/components/ui/admin/dashboard/profileCard";
import EventList from "@/components/ui/admin/dashboard/eventList";
import MahasiswaLayout from "@/components/layouts/mahasiswaLayout";
import MahasiswaChart from "@/components/ui/mahasiswaChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useAuth from "@/hooks/use-auth";
import { upcomingEvents } from "@/lib/adminData";
import { User, Award, Trophy, Flag } from "lucide-react";

interface Stat {
    label: string;
    value: string;
    icon: string;
}

interface MahasiswaDashboardProps {
    stats: Stat[];
}

// Helper function to get icon component
const getIconComponent = (iconName: string) => {
    switch (iconName) {
        case 'User':
            return <User className="text-blue-500" />;
        case 'Flag':
            return <Flag className="text-purple-500" />;
        case 'Trophy':
            return <Trophy className="text-green-500" />;
        case 'Award':
            return <Award className="text-amber-500" />;
        default:
            return <User className="text-blue-500" />;
    }
};

export default function MahasiswaDashboard({ stats }: MahasiswaDashboardProps) {
    const { user } = useAuth();

    // Convert stats to include proper icons
    const statsWithIcons = stats.map(stat => ({
        ...stat,
        icon: getIconComponent(stat.icon)
    }));

    // Get values from stats
    const wins = parseInt(stats.find(stat => stat.label === "Menang")?.value || "0");
    const totalCompetitions = parseInt(stats.find(stat => stat.label === "Riwayat Lomba")?.value || "0");
    const ongoingCompetitions = parseInt(stats.find(stat => stat.label === "Kompetisi Yang Diikuti")?.value || "0");

    // Calculate losses
    const losses = totalCompetitions - wins;

    // Create chart data for win rate visualization
    const chartData = [
        {
            label: "Menang",
            value: wins
        },
        {
            label: "Kalah",
            value: losses
        },
        {
            label: "Sedang Diikuti",
            value: ongoingCompetitions
        }
    ];

    return (
        <MahasiswaLayout>
            <section className="mb-10">
                <div className="lg:hidden space-y-6">
                    <ProfileCard user={user} className="" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mt-2">
                    {statsWithIcons.map((stat, index) => (
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

            <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
                <div className="lg:col-span-8 space-y-6">
                    <div className="admin-card">
                        <div className="admin-card-header">Statistik Kompetisi</div>
                        <div className="admin-card-content">
                            <Card className="border-1 border-purple-300 hover:shadow-md shadow-purple-300 transition-all bg-gradient-to-br from-white to-blue-50/20">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-xl font-bold text-gray-900 text-center">
                                        Performa Kompetisi
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <MahasiswaChart data={chartData} />
                                    <div className="mt-6 text-center p-3 bg-purple-100/30 rounded-md">
                                        <span className="text-sm text-gray-500">Win Rate: </span>
                                        <span className="text-lg font-bold text-purple-700">
                                            {totalCompetitions > 0 ? ((wins / totalCompetitions) * 100).toFixed(1) : 0}%
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>
        </MahasiswaLayout>
    );
}
