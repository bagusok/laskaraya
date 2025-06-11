import StatCard from "@/components/ui/admin/dashboard/statCard";
import ProfileCard from "@/components/ui/admin/dashboard/profileCard";
import EventList from "@/components/ui/admin/dashboard/eventList";
import ProgramStudiList from "@/components/ui/admin/dashboard/programStudiList";
import PeriodList from "@/components/ui/admin/dashboard/periodList";
import AdminLayout from "@/components/layouts/adminLayout";
import useAuth from "@/hooks/use-auth";
import { upcomingEvents, programStudi, periods } from "@/lib/adminData";
import { User, Users, Award, Trophy, Flag, BookOpen, Calendar, Target } from "lucide-react";

interface Stat {
    label: string;
    value: string;
    icon: string;
}

interface AdminDashboardProps {
    stats: Stat[];
}

// Helper function to get icon component
const getIconComponent = (iconName: string) => {
    const iconProps = "w-5 h-5";

    switch (iconName) {
        case 'User':
            return <User className={iconProps} />;
        case 'Users':
            return <Users className={iconProps} />;
        case 'Award':
            return <Award className={iconProps} />;
        case 'Trophy':
            return <Trophy className={iconProps} />;
        case 'Flag':
            return <Flag className={iconProps} />;
        case 'BookOpen':
            return <BookOpen className={iconProps} />;
        case 'Calendar':
            return <Calendar className={iconProps} />;
        case 'Target':
            return <Target className={iconProps} />;
        default:
            return <User className={iconProps} />;
    }
};

export default function AdminDashboard({ stats }: AdminDashboardProps) {
    const { user } = useAuth();

    return (
        <AdminLayout>
            {/* Statistics cards */}
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
                            icon={getIconComponent(stat.icon)} // Pass actual icon component
                            className=""
                        />
                    ))}
                </div>
            </section>

            {/* Main content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 space-y-6">
                    <EventList events={upcomingEvents} className="" />
                    <ProgramStudiList programs={programStudi} className="" />
                </div>
                <div className="hidden lg:block lg:col-span-4 space-y-6">
                    <ProfileCard user={user} className="" />
                </div>
                <div className="lg:col-span-8 space-y-6">
                    <PeriodList periods={periods} className="" />
                </div>
            </div>
        </AdminLayout>
    );
}
