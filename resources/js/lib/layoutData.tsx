import React from "react";
import { Home, Users, CalendarDays, BookOpen, FileCheck } from "lucide-react";
import { NavItem } from "../types/layout";

export const navItems: NavItem[] = [
  {
    label: "Beranda",
    icon: <Home />,
    href: route('dashboard')
  },
  {
    label: "Manajemen Pengguna",
    icon: <Users />,
    href: route('users.index')
  },
  {
    label: "Manajemen Lomba",
    icon: <CalendarDays />,
    subItems: [
      { label: "Manajemen Data", href: "/dashboard/competitions/manage" },
      { label: "Verifikasi Data", href: "/dashboard/competitions/verify" },
      { label: "Manajemen Periode", href: "/dashboard/competitions/periods" },
    ],
  },
  {
    label: "Manajemen Program Studi",
    icon: <BookOpen />,
    href: "/dashboard/study-programs"
  },
  {
    label: "Sistem Informasi",
    icon: <FileCheck />,
    subItems: [
      { label: "Rekomendasi Peserta", href: "/dashboard/recommendations" },
      { label: "Laporan & Analisis", href: "/dashboard/reports" },
    ],
  },
];
