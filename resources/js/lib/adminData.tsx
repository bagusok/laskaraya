import React from "react";
import { User, Award, UserPlus, Trophy } from "lucide-react";
import { Stat, Event, ProgramStudi, Period } from "../types/admin";

export const stats: Stat[] = [
  { label: "Mahasiswa Aktif", value: "783", icon: <User className="text-blue-500" /> },
  { label: "Kompetisi Selesai", value: "42", icon: <Trophy className="text-purple-500" /> },
  { label: "Pemenang", value: "18", icon: <Award className="text-amber-500" /> },
  { label: "Dosen Pembimbing", value: "24", icon: <UserPlus className="text-green-500" /> },
];

export const upcomingEvents: Event[] = [
  { name: "Kompetisi Desain UI/UX", date: "28 Mei 2025", category: "Desain" },
  { name: "Hackathon: Solusi AI", date: "04 Juni 2025", category: "Teknologi" },
  { name: "Kompetisi Business Plan", date: "15 Juni 2025", category: "Bisnis" },
];

export const programStudi: ProgramStudi[] = [
  { id: 1, name: "Teknik Informatika", students: 245, competitions: 18 },
  { id: 2, name: "Sistem Informasi", students: 189, competitions: 12 },
];

export const periods: Period[] = [
  { id: 1, name: "Semester Gasal 2024/2025", status: "Aktif", events: 12 },
  { id: 2, name: "Semester Genap 2024/2025", status: "Mendatang", events: 8 },
];
