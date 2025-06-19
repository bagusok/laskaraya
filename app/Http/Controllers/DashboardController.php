<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\AchievementModel;
use App\Models\UserModel; // Import yang hilang
use App\Models\UserToCompetition; // Import yang hilang
use App\Models\CompetitionModel; // Tambahan untuk admin stats
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        if ($user->role === 'mahasiswa') {
            return $this->mahasiswaDashboard($user);
        } elseif ($user->role === 'admin') {
            return $this->adminDashboard($user);
        } elseif ($user->role === 'dosen') {
            return $this->dosenDashboard($user);
        }

        return redirect()->route('login');
    }

    private function mahasiswaDashboard($user)
    {
        $user->load('mahasiswa');
        $mahasiswa = $user->mahasiswa;

        $totalMahasiswaAktif = UserModel::where('role', 'mahasiswa')
            ->where('is_verified', true)
            ->count();

        $kompetisiDiikuti = UserToCompetition::where('registrant_id', $user->id)
            ->whereIn('status', ['pending', 'approved', 'ongoing'])
            ->count();

        $stats = [
            [
                'label' => 'Mahasiswa Aktif',
                'value' => (string) $totalMahasiswaAktif,
                'icon' => 'User'
            ],
            [
                'label' => 'Kompetisi Yang Diikuti',
                'value' => (string) $kompetisiDiikuti,
                'icon' => 'Flag'
            ],
            [
                'label' => 'Riwayat Lomba',
                'value' => (string) ($mahasiswa ? $mahasiswa->total_competitions : 0),
                'icon' => 'Trophy'
            ],
            [
                'label' => 'Menang',
                'value' => (string) ($mahasiswa ? $mahasiswa->total_wins : 0),
                'icon' => 'Award'
            ]
        ];

        return Inertia::render('dashboard/mahasiswa/index', [
            'user' => $user,
            'stats' => $stats
        ]);
    }

    private function adminDashboard($user)
    {
        // Hitung total mahasiswa aktif
        $totalMahasiswaAktif = UserModel::where('role', 'mahasiswa')
            ->where('is_verified', true)
            ->count();

        // Hitung total kompetisi selesai
        $kompetisiSelesai = CompetitionModel::where('status', 'completed')
            ->count();

        // Hitung total pemenang (achievements)
        $totalPemenang = AchievementModel::count();

        // Hitung total dosen pembimbing
        $totalDosenPembimbing = UserModel::where('role', 'dosen')
            ->where('is_verified', true)
            ->count();

        // Format data untuk frontend - sama seperti mahasiswa
        $stats = [
            [
                'label' => 'Mahasiswa Aktif',
                'value' => (string) $totalMahasiswaAktif,
                'icon' => 'Users'
            ],
            [
                'label' => 'Kompetisi Selesai',
                'value' => (string) $kompetisiSelesai,
                'icon' => 'Trophy'
            ],
            [
                'label' => 'Total Pemenang',
                'value' => (string) $totalPemenang,
                'icon' => 'Award'
            ],
            [
                'label' => 'Dosen Pembimbing',
                'value' => (string) $totalDosenPembimbing,
                'icon' => 'User'
            ]
        ];

        return Inertia::render('dashboard/admin/index', [
            'user' => $user,
            'stats' => $stats // Kirim stats ke frontend
        ]);
    }

    private function dosenDashboard($user)
    {
        $user->load('dosen');
        $dosen = $user->dosen;

        $totalCompetitions = $dosen ? $dosen->total_competitions : 0;
        $totalWins = $dosen ? $dosen->total_wins : 0;
        $winRate = $totalCompetitions > 0 ? round(($totalWins / $totalCompetitions) * 100, 1) : 0;

        // Hitung total mahasiswa bimbingan
        $totalStudents = \App\Models\UserToCompetition::where('dosen_id', $user->id)
            ->with('competitionMembers')
            ->get()
            ->pluck('competitionMembers')
            ->flatten()
            ->pluck('user_id')
            ->unique()
            ->count();

        $stats = [
            'total_competitions' => $totalCompetitions,
            'total_wins' => $totalWins,
            'total_students' => $totalStudents,
            'win_rate' => $winRate,
        ];

        return Inertia::render('dashboard/dosen/index', [
            'user' => $user,
            'stats' => $stats
        ]);
    }
}