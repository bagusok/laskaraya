<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Models\DosenModel;

class DosenController extends Controller
{

    public function index(Request $request)
    {
        $dosenId = auth()->user()->id;

        // Cek dan buat data jika belum ada
        $dosenProfile = \App\Models\DosenModel::firstOrCreate(
            ['user_id' => $dosenId],
            ['total_competitions' => 0, 'total_wins' => 0]
        );

        $totalCompetitions = $dosenProfile->total_competitions;
        $totalWins = $dosenProfile->total_wins;
        $winRate = $totalCompetitions > 0 ? round(($totalWins / $totalCompetitions) * 100) : 0;

        // Hitung total mahasiswa yang dibimbing
        $totalStudents = \App\Models\UserToCompetition::where('dosen_id', $dosenId)
            ->with('competitionMembers')
            ->get()
            ->pluck('competitionMembers')
            ->flatten()
            ->pluck('user_id')
            ->unique()
            ->count();

        // Ambil data mahasiswa bimbingan
        $mahasiswaBimbingan = \App\Models\CompetitionMember::with(['user', 'userToCompetition.competition.category'])
            ->whereHas('userToCompetition', function ($query) use ($dosenId) {
                $query->where('dosen_id', $dosenId)
                    ->where('status', 'accepted');
            })
            ->get();

        return Inertia::render('dashboard/dosen/index', [
            'stats' => [
                'total_competitions' => $totalCompetitions,
                'total_wins' => $totalWins,
                'total_students' => $totalStudents,
                'win_rate' => $winRate,
            ],
            'mahasiswaBimbingan' => $mahasiswaBimbingan,
        ]);
    }

    public function create(Request $request)
    {
        return back();
    }

    public function show($id)
    {
        return back();
    }

    public function update(Request $request, $id)
    {
        return back();
    }

    public function destroy($id)
    {
        return back();
    }

    public function mahasiswaBimbingan(Request $request)
    {
        $dosenId = auth()->user()->id;
        $perPage = $request->query('limit', 10);
        $search = $request->query('search', 'name');
        $searchQuery = $request->query('search_query', '');
        $status = $request->query('status', 'all');

        $teams = \App\Models\UserToCompetition::with(['competition', 'competitionMembers.user'])
            ->where('dosen_id', $dosenId)
            ->where('status', 'accepted')
            ->whereHas('competition', function ($q) {
                $q->where('verified_status', 'accepted');
            })
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
                $query->whereHas('competition', function ($q) use ($status) {
                    $q->where('status', $status);
                });
            })
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        $mahasiswa = [];
        foreach ($teams as $team) {
            foreach ($team->competitionMembers as $member) {
                $mahasiswa[] = [
                    'id' => $member->user->id,
                    'team_id' => $team->id,
                    'name' => $member->user->name,
                    'identifier' => $member->user->identifier,
                    'email' => $member->user->email,
                    'team_name' => $team->name,
                    'competition_name' => $team->competition->name,
                    'status' => $team->competition->status,
                ];
            }
        }

        return Inertia::render('dashboard/dosen/mahasiswaBimbingan', [
            'mahasiswa' => [
                'data' => $mahasiswa,
                'current_page' => $teams->currentPage(),
                'last_page' => $teams->lastPage(),
                'per_page' => $teams->perPage(),
                'total_page' => $teams->lastPage(),
                'total_data' => $teams->total(),
            ],
            'mahasiswaList' => [],
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $team = \App\Models\UserToCompetition::findOrFail($id);
        $team->bimbingan_status = 'selesai';
        $team->save();

        // Ambil dosen terkait
        $dosenProfile = \App\Models\DosenModel::where('user_id', $team->dosen_id)->first();
        if ($dosenProfile) {
            // Tambah total lomba diikuti
            $dosenProfile->increment('total_competitions');

            // Jika dosen memilih menang, tambah total_wins
            if ($request->has('is_win') && $request->input('is_win')) {
                $dosenProfile->increment('total_wins');
            }
        }

        return back();
    }
}