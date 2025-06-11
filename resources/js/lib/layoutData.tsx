import React from "react";
import {
    Home,
    Users,
    CalendarDays,
    BookOpen,
    FileCheck,
    Trophy,
    Medal
} from "lucide-react";
import { NavItem } from "../types/layout";

export const navItems: NavItem[] = [
    {
        label: "Beranda",
        icon: <Home />,
        href: route("dashboard")
    },
    {
        label: "Manajemen Pengguna",
        icon: <Users />,
        href: route("users.index")
    },
    {
        label: "Manajemen Lomba",
        icon: <CalendarDays />,
        subItems: [
            {
                label: "Manajemen Data",
                href: route("admin.competitions.index")
            },
            {
                label: "Manajemen Periode",
                href: route("period")
            },
            {
                label: "Manajemen Atribut",
                href: "/dashboard/skills"
            },
            {
                label: "Manajemen Kategori",
                href: "/dashboard/admin/categories"
            }

        ]
    },
    {
        label: "Manajemen Program Studi",
        icon: <BookOpen />,
        href: route("programStudi")
    },
    {
        label: "Sistem Informasi",
        icon: <FileCheck />,
        subItems: [
            {
                label: "Rekomendasi Peserta",
                href: route("admin.recommendations.index")
            },
            {
                label: "Laporan & Analisis",
                href: route("admin.reports.index")
            }
        ]
    },
    {
        label: "Prestasi Mahasiswa",
        icon: <Medal />,
        href: route("admin.achievements.index")
    }
];

export const navItemsDosen = [
    {
        label: "Beranda",
        icon: <Home />,
        href: "/dashboard"
    },
    {
        label: "Manajemen Mahasiswa Bimbingan",
        icon: <Users />,
        subItems: [
            {
                label: "Daftar Mahasiswa Bimbingan",
                href: route("dosen.bimbingan")
            },
            {
                label: "Prestasi Mahasiswa",
                href: route("dosen.prestasi")
            }
        ]
    },
    {
        label: "Data Lomba/Kompetisi",
        icon: <Trophy />,
        subItems: [
            {
                label: "Daftar Lomba",
                href: route("dosen.competitions.index")
            },
            {
                label: "Tambah Lomba",
                href: route("dosen.competitions.create")
            },
            {
                label: "Manajemen Ketrampilan",
                href: "/dashboard/dosen/skills"
            },
            {
                label: "Manajemen Kategori",
                href: "/dashboard/dosen/categories"
            }

        ]
    }
];

export const navItemsMahasiswa = [
    {
        label: "Beranda",
        icon: <Home />,
        href: "/dashboard"
    },
    {
        label: "Data Lomba/Kompetisi",
        icon: <Trophy />,
        subItems: [
            {
                label: "Daftar Lomba",
                href: route("mahasiswa.competitions.index")
            },
            {
                label: "Manajemen Ketrampilan",
                href: "/dashboard/mahasiswa/skills"
            },
            {
                label: "Manajemen Kategori",
                href: "/dashboard/mahasiswa/categories"
            }
        ]
    },
    {
        label: "Riwayat Prestasi",
        icon: <Medal />,
        href: route("mahasiswa.achievements.index")
    }
];
