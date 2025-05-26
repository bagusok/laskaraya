import React from "react";
import {
    Home,
    Users,
    CalendarDays,
    BookOpen,
    FileCheck,
    Trophy
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
                label: "Verifikasi Data",
                href: "/dashboard/competitions/verify"
            },
            {
                label: "Manajemen Periode",
                href: route("period")
            },
            {
                label: "Manajemen Atribut",
                href: "/dashboard/skills"
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
                href: "/dashboard/recommendations"
            },
            { label: "Laporan & Analisis", href: "/dashboard/reports" }
        ]
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
                href: "/dashboard/dosen/prestasi"
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
                href: "/dashboard/dosen/lomba/tambah"
            },
            {
                label: "Manajemen Ketrampilan",
                href: "/dashboard/dosen/skills"
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
            }
        ]
    }
];
