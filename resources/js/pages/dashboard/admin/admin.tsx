import { User, Award, UserPlus, Trophy } from "lucide-react";
import StatCard from "@/components/ui/admin/dashboard/statCard";
import ProfileCard from "@/components/ui/admin/dashboard/profileCard";
import EventList from "@/components/ui/admin/dashboard/eventList";
import ProgramStudiList from "@/components/ui/admin/dashboard/programStudiList";
import PeriodList from "@/components/ui/admin/dashboard/periodList";
import AdminLayout from "@/components/layouts/adminLayout";
import useAuth from "@/hooks/use-auth";
import { stats, upcomingEvents, programStudi, periods } from "@/lib/adminData";

interface Stat {
  label: string;
  value: string;
  icon: React.ReactNode;
}

interface Event {
  name: string;
  date: string;
  category: string;
}

interface ProgramStudi {
  id: number;
  name: string;
  students: number;
  competitions: number;
}

interface Period {
  id: number;
  name: string;
  status: string;
  events: number;
}

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <AdminLayout>
      {/* Statistics cards */}

      <section className="mb-10">
      <div className="lg:hidden space-y-6">
    <ProfileCard user={user} className="" />
  </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mt-10">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              label={stat.label}
              value={stat.value}
              icon={stat.icon}
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
