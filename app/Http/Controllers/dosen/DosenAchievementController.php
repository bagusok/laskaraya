<?php

namespace App\Http\Controllers\dosen;

use App\Http\Controllers\Controller;
use App\Models\AchievementModel;
use App\Models\CompetitionMember;
use App\Models\UserToCompetition;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DosenAchievementController extends Controller
{
    public function index(Request $request)
    {
        $dosenId = auth()->user()->id;
        $perPage = $request->query('limit', 10);
        $search = $request->query('search', 'name');
        $searchQuery = $request->query('search_query', '');
        $status = $request->query('status', 'all');

        $achievements = UserToCompetition::with(['competition', 'competitionMembers.user', 'achievement'])
            ->where('dosen_id', $dosenId)
            ->when($searchQuery, function ($query) use ($search, $searchQuery) {
                if ($search === 'name') {
                    $query->whereHas('competitionMembers.user', function ($q) use ($searchQuery) {
                        $q->where('name', 'like', '%' . $searchQuery . '%');
                    });
                } else if ($search === 'identifier') {
                    $query->whereHas('competitionMembers.user', function ($q) use ($searchQuery) {
                        $q->where('identifier', 'like', '%' . $searchQuery . '%');
                    });
                }
            })
            ->when($status !== 'all', function ($query) use ($status) {
                if ($status === 'win') {
                    $query->whereHas('achievement');
                } else if ($status === 'lose') {
                    $query->whereDoesntHave('achievement')
                        ->whereHas('competition', function ($q) {
                            $q->where('status', 'completed');
                        });
                }
            })
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        $stats = [
            'total' => UserToCompetition::where('dosen_id', $dosenId)->count(),
            'wins' => UserToCompetition::where('dosen_id', $dosenId)
                ->whereHas('achievement')
                ->count(),
            'ongoing' => UserToCompetition::where('dosen_id', $dosenId)
                ->whereHas('competition', function ($q) {
                    $q->where('status', 'ongoing');
                })
                ->count(),
            'pending' => UserToCompetition::where('dosen_id', $dosenId)
                ->whereHas('competition', function ($q) {
                    $q->where('status', 'completed')
                        ->where('verified_status', 'pending');
                })
                ->count(),
        ];

        return Inertia::render('dashboard/dosen/achievements/index', [
            'achievements' => $achievements,
            'stats' => $stats,
        ]);
    }

    public function show($id)
    {
        $achievement = UserToCompetition::with(['competition', 'competitionMembers.user', 'achievement', 'achievement.certificates'])
            ->where('dosen_id', auth()->user()->id)
            ->findOrFail($id);

        return Inertia::render('dashboard/dosen/achievements/show', [
            'achievement' => $achievement,
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $achievement = \App\Models\UserToCompetition::where('dosen_id', auth()->user()->id)
            ->findOrFail($id);

        $achievement->bimbingan_status = 'selesai';
        $achievement->save();

        // Hitung ulang total_wins
        $dosenId = auth()->user()->id;
        $totalWins = \App\Models\UserToCompetition::where('dosen_id', $dosenId)
            ->whereHas('achievement')
            ->count();
        \App\Models\DosenModel::where('user_id', $dosenId)->update([
            'total_wins' => $totalWins,
        ]);

        return back()->with('success', 'Status bimbingan berhasil diperbarui');
    }

    public function mahasiswaAchievements()
    {
        $dosenId = auth()->user()->id;
        // Ambil semua UserToCompetition (tim) yang dibimbing dosen ini
        $teams = \App\Models\UserToCompetition::with(['competition', 'competitionMembers.user', 'achievement'])
            ->where('dosen_id', $dosenId)
            ->get();

        $mahasiswaAchievements = [];
        foreach ($teams as $team) {
            foreach ($team->competitionMembers as $member) {
                // Hanya tampilkan mahasiswa (bukan dosen)
                if ($member->user && $member->user->role === 'mahasiswa') {
                    $mahasiswaAchievements[] = [
                        'mahasiswa_name' => $member->user->name,
                        'team_name' => $team->name,
                        'achievement_name' => $team->achievement ? $team->achievement->name : '-',
                        'competition_name' => $team->competition ? $team->competition->name : '-',
                        'year' => $team->competition ? date('Y', strtotime($team->competition->start_date)) : '-',
                        'status' => $team->achievement ? 'Menang' : ($team->competition && $team->competition->status === 'completed' ? 'Kalah' : 'Belum Selesai'),
                    ];
                }
            }
        }
        return Inertia::render('dashboard/dosen/mahasiswaAchievements', [
            'mahasiswaAchievements' => $mahasiswaAchievements
        ]);
    }
}