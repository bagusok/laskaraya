import { User, Award, UserPlus, Trophy } from "lucide-react";
import { Home, CalendarDays, BookOpen, FileCheck } from "lucide-react";
import useAuth from "@/hooks/use-auth";
import Sidebar from "@/components/ui/shared/sidebar";
import { useState } from "react";
import Header from "@/components/ui/admin/dashboard/header";
import StatCard from "@/components/ui/admin/dashboard/statCard";
import ProfileCard from "@/components/ui/admin/dashboard/profileCard";
import EventList from "@/components/ui/admin/dashboard/eventList";
import ProgramStudiList from "@/components/ui/admin/dashboard/programStudiList";
import PeriodList from "@/components/ui/admin/dashboard/periodList";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const navItems = [
    { label: "Beranda", icon: <Home />, href: "/dashboard" },
    { label: "Manajemen Pengguna", icon: <User />, href: "/users" },
    {
      label: "Manajemen Lomba",
      icon: <CalendarDays />,
      subItems: [
        { label: "Manajemen Data", href: "/competitions/manage" },
        { label: "Verifikasi Data", href: "/competitions/verify" },
        { label: "Manajemen Periode", href: "/competitions/periods" },
      ],
    },
    { label: "Manajemen Program Studi", icon: <BookOpen />, href: "/study-programs" },
    {
      label: "Sistem Informasi",
      icon: <FileCheck />,
      subItems: [
        { label: "Rekomendasi Peserta", href: "/recommendations" },
        { label: "Laporan & Analisis", href: "/reports" },
      ],
    },
  ];

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
    <div className="bg-white min-h-screen relative">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar Component */}
      <Sidebar
        navItems={navItems}
        sidebarOpen={sidebarOpen}
        onClose={closeSidebar}
      />

      {/* Main content area */}
      <div className="lg:ml-72">
        {/* Sticky header */}
        <div className="sticky top-0 z-30 bg-white lg:shadow-none lg:static">
          <Header user={user} onToggleSidebar={toggleSidebar} />
        </div>

        <main className="px-4 sm:px-6 lg:px-12 pt-6 lg:pt-12 pb-16">
          {/* Mobile-only profile card */}
          <div className="block lg:hidden mb-6">
            <ProfileCard user={user} />
          </div>

          {/* Statistics cards */}
          <section className="mb-10">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
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

          {/* Main content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-6">
              <EventList events={upcomingEvents} />
              <ProgramStudiList programs={programStudi} />
            </div>
            <div className="hidden lg:block lg:col-span-4 space-y-6">
              <ProfileCard user={user} />
              <PeriodList periods={periods} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
