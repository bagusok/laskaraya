import { User, Award, Trophy } from "lucide-react";

export const statsDosen = [
    {
        label: "Mahasiswa Bimbingan",
        value: 12,
        icon: <User className="text-blue-500" />
    },
    {
        label: "Prestasi Mahasiswa",
        value: 8,
        icon: <Award className="text-amber-500" />
    },
    {
        label: "Lomba Diikuti",
        value: 5,
        icon: <Trophy className="text-purple-500" />
    }
];

export const mahasiswaBimbingan = [
    {
        nama: "Ahmad Fauzi",
        prestasi: "Juara 1 Lomba Karya Tulis Ilmiah",
        kategori: "Ilmiah",
        tahun: 2023,
        status: "Aktif"
    },
    {
        nama: "Siti Aminah",
        prestasi: "Finalis Lomba Debat",
        kategori: "Debat",
        tahun: 2022,
        status: "Aktif"
    },
    {
        nama: "Budi Santoso",
        prestasi: "Peserta Lomba Poster",
        kategori: "Desain",
        tahun: 2023,
        status: "Lulus"
    }
];

export const lombaKompetisi = [
    {
        nama: "Lomba Karya Tulis Ilmiah",
        tanggal: "10 Juli 2024",
        kategori: "Ilmiah"
    },
    {
        nama: "Kompetisi Debat Mahasiswa",
        tanggal: "20 Agustus 2024",
        kategori: "Debat"
    },
    {
        nama: "Lomba Poster Digital",
        tanggal: "5 September 2024",
        kategori: "Desain"
    }
];
