// admin.jsx (Main Dashboard file)
import { User, Award, UserPlus, Trophy } from "lucide-react";
import { Home, CalendarDays, BookOpen, FileCheck } from "lucide-react";
import useAuth from "@/hooks/use-auth";
import Sidebar from "@/components/ui/shared/sidebar";

// Import dashboard components
import Header from "@/components/ui/admin/dashboard/header";
import StatCard from "@/components/ui/admin/dashboard/statCard";
import ProfileCard from "@/components/ui/admin/dashboard/profileCard";
import EventList from "@/components/ui/admin/dashboard/eventList";
import ProgramStudiList from "@/components/ui/admin/dashboard/programStudiList";
import PeriodList from "@/components/ui/admin/dashboard/periodList";

export default function AdminDashboard() {
  const { user } = useAuth();

  // Define navigation items
  const navItems = [
    { label: "Beranda", icon: <Home />, href: "/dashboard" },
    {
        label: "Manajemen Pengguna",
        icon: <User />,
        href: "/users",
    },
    {
        label: "Manajemen Data Lomba",
        icon: <CalendarDays />,
        subItems: [
            { label: "Manajemen Data", href: "/competitions/manage" },
            { label: "Verifikasi Data", href: "/competitions/verify" },
            { label: "Manajemen Periode", href: "/competitions/periods" },
        ],
    },
    {
        label: "Manajemen Program Studi",
        icon: <BookOpen />,
        href: "/study-programs",
    },
    {
        label: "Sistem Informasi",
        icon: <FileCheck />,
        subItems: [
            { label: "Rekomendasi Peserta", href: "/recommendations" },
            { label: "Laporan & Analisis", href: "/reports" },
        ],
    },
  ];

  // Placeholder data
  const stats = [
    { label: "Mahasiswa Aktif", value: "783", icon: <User className="text-blue-500" /> },
    { label: "Kompetisi Selesai", value: "42", icon: <Trophy className="text-purple-500" /> },
    { label: "Pemenang", value: "18", icon: <Award className="text-amber-500" /> },
    { label: "Dosen Pembimbing", value: "24", icon: <UserPlus className="text-green-500" /> },
  ];

  const upcomingEvents = [
    { name: "Kompetisi Desain UI/UX", date: "28 Mei 2025", category: "Desain" },
    { name: "Hackathon: Solusi AI", date: "04 Juni 2025", category: "Teknologi" },
    { name: "Kompetisi Business Plan", date: "15 Juni 2025", category: "Bisnis" },
  ];

  const programStudi = [
    { id: 1, name: "Teknik Informatika", students: 245, competitions: 18 },
    { id: 2, name: "Sistem Informasi", students: 189, competitions: 12 },
  ];

  const periods = [
    { id: 1, name: "Semester Gasal 2024/2025", status: "Aktif", events: 12 },
    { id: 2, name: "Semester Genap 2024/2025", status: "Mendatang", events: 8 },
  ];

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <Sidebar navItems={navItems} />

      {/* Main Content */}
      <div className="flex-1 ml-72 pt-12 px-12 pb-16">
        {/* Header Section */}
        <Header user={user} />

        {/* Stats Grid */}
        <section className="mb-12">
          <div className="grid grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                label={stat.label}
                value={stat.value}
                icon={stat.icon}
              />
            ))}
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-8 space-y-8">
            <EventList events={upcomingEvents} />
            <ProgramStudiList programs={programStudi} />
          </div>
          <div className="col-span-4 space-y-8">
            <ProfileCard user={user} />
            <PeriodList periods={periods} />
          </div>
        </div>
      </div>
    </div>
  );
}
