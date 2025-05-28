<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class DosenController extends Controller
{

    public function index(Request $request)
    {
        return Inertia::render('dashboard/dosen/mahasiswaBimbingan', [
            'mahasiswa' => [
                'data' => [],
                'current_page' => 1,
                'last_page' => 1,
                'per_page' => 10,
                'total_page' => 1,
                'total_data' => 0,
            ],
            'mahasiswaList' => [],
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

        return back();
    }
}
