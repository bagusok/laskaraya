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
        // Hitung total mahasiswa aktif (untuk statistik umum)
        $totalMahasiswaAktif = UserModel::where('role', 'mahasiswa')
            ->where('is_verified', true)
            ->count();

        // Hitung kompetisi yang sedang diikuti oleh mahasiswa ini
        $kompetisiDiikuti = UserToCompetition::where('registrant_id', $user->id)
            ->whereIn('status', ['pending', 'approved', 'ongoing'])
            ->count();

        // Hitung total riwayat lomba (semua kompetisi yang pernah diikuti)
        $riwayatLomba = UserToCompetition::where('registrant_id', $user->id)
            ->count();

        // Hitung jumlah kemenangan (achievements)
        $jumlahMenang = AchievementModel::whereHas('userToCompetition', function($query) use ($user) {
            $query->where('registrant_id', $user->id);
        })->count();

        // Format data untuk frontend
        $stats = [
            [
                'label' => 'Mahasiswa Aktif',
                'value' => (string) $totalMahasiswaAktif,
                'icon' => 'User' // Frontend akan mengkonversi ke icon component
            ],
            [
                'label' => 'Kompetisi Yang Diikuti',
                'value' => (string) $kompetisiDiikuti,
                'icon' => 'Flag'
            ],
            [
                'label' => 'Riwayat Lomba',
                'value' => (string) $riwayatLomba,
                'icon' => 'Trophy'
            ],
            [
                'label' => 'Menang',
                'value' => (string) $jumlahMenang,
                'icon' => 'Award'
            ]
        ];

        return Inertia::render('dashboard/mahasiswa/index', [
            'user' => $user->load(['mahasiswa', 'prodi']),
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
        // Logic untuk dosen dashboard
        return Inertia::render('dashboard/dosen/index', [
            'user' => $user->load(['dosen', 'prodi'])
        ]);
    }
}
