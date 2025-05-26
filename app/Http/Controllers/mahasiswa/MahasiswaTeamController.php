<?php

namespace App\Http\Controllers\mahasiswa;

use App\Http\Controllers\Controller;
use App\Models\CompetitionMember;
use App\Models\UserModel;
use App\Models\UserToCompetition;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class MahasiswaTeamController extends Controller
{

    public function edit(Request $request, $id)
    {
        $team = UserToCompetition::with(['competitionMembers', 'competition', 'competitionMembers.user'])
            ->findOrFail($id);

        if ($team->registrant_id !== auth()->user()->id) {
            return back()->withErrors(['error' => 'Hanya ketua tim yang dapat mengedit tim ini.']);
        }

        $mahasiswa = UserModel::where('role', 'mahasiswa')
            ->where('id', '!=', auth()->user()->id)
            ->get();

        $dosen = UserModel::where('role', 'dosen')->get();

        // dd($dosen);

        return Inertia::render('dashboard/mahasiswa/competitions/teams/editTeam', [
            'team' => $team,
            'competition' => $team->competition,
            // Selain kita sendiri sendiri
            'members' => $team->competitionMembers->where('user_id', '!=', auth()->user()->id)->pluck('user')->toArray(),
            'dosen' => $dosen,
            'mahasiswa' => $mahasiswa,
            'registrant' => $team->registrant,
        ]);
    }

    public function postEdit(Request $request)
    {

        $id = $request->input('team_id');

        $request->validate([
            'team_id' => 'required|exists:user_to_competitions,id',
            'name' => 'required|string|max:255',
            'dosen_id' => 'nullable|exists:users,id',
            'competition_members' => 'array',
            'competition_members.*.user_id' => 'exists:users,id|distinct',
        ]);

        $team = UserToCompetition::findOrFail($id);

        if ($team->registrant_id !== auth()->user()->id) {
            return back()->withErrors(['error' => 'Hanya ketua tim yang dapat mengedit tim ini.']);
        }


        try {
            DB::beginTransaction();
            $team->name = $request->input('name');
            $team->dosen_id = $request->input('dosen_id');
            $team->save();

            $team->competitionMembers()->delete();

            $members = $request->input('competition_members', []);

            $existingLeader = CompetitionMember::where('user_id', $team->registrant_id)
                ->where('user_to_competition_id', $team->id)
                ->first();

            if ($existingLeader) {
                DB::rollBack();
                return back()->withErrors(['error' => 'Ketua tim sudah terdaftar sebagai anggota tim lain.']);
            }

            $existingMembers = CompetitionMember::whereIn('user_id', array_column($members, 'user_id'))
                ->whereHas('userToCompetition', function ($query) use ($team) {
                    $query->where('competition_id', $team->competition_id)
                        ->where('id', '!=', $team->id); // exclude current team
                })->get();

            if ($existingMembers->isNotEmpty()) {
                DB::rollBack();
                return back()->withErrors(['error' => 'Beberapa anggota tim sudah terdaftar di tim lain.']);
            }

            $members[] = [
                'user_id' => $team->registrant_id,
                'user_to_competition_id' => $team->id,
            ];

            $team->competitionMembers()->createMany(array_map(function ($member) use ($team) {
                return [
                    'user_id' => $member['user_id'],
                    'user_to_competition_id' => $team->id,
                ];
            }, $members));
            DB::commit();

            return back()->with('success', 'Team updated successfully');
        } catch (Exception $e) {

            return back()->withErrors(['error' => 'Terjadi kesalahan saat mengedit tim: ' . $e->getMessage()]);
        }
    }

    public function destroy(Request $request, $id)
    {
        $team = UserToCompetition::findOrFail($id);

        if ($team->registrant_id !== auth()->user()->id) {
            return back()->withErrors(['error' => 'Hanya ketua tim yang dapat menghapus tim ini.']);
        }

        $team->delete();

        return back()->with('success', 'Team deleted successfully');
    }

    public function getAllTeams(Request $request)
    {
        $perPage = $request->query('limit', 10);
        $searchQuery = $request->query('search', null);

        $request->validate([
            'limit' => 'integer|nullable|min:1',
            'search' => 'string|nullable',
        ]);

        $teams = UserToCompetition::with(['competitionMembers', 'competition', 'dosen', 'registrant'])->when($searchQuery, function ($query) use ($searchQuery) {
            $query->where('name', 'like', '%' . $searchQuery . '%');
        })
            ->whereHas('competitionMembers', function ($query) {
                $query->where('user_id', auth()->user()->id);
            })->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json([
            'status' => 'success',
            'data' => $teams->items(),
            'pagination' => [
                'total' => $teams->total(),
                'current_page' => $teams->currentPage(),
                'last_page' => $teams->lastPage(),
                'per_page' => $teams->perPage(),
                'has_more_pages' => $teams->hasMorePages(),
            ],
        ]);
    }

    public function detail($id)
    {
        $team = UserToCompetition::with(['competitionMembers', 'competition', 'competitionMembers.user', 'dosen'])
            ->findOrFail($id);

        $achievement = $team->achievement;

        return Inertia::render('dashboard/mahasiswa/competitions/teams/detail', [
            'team' => $team,
            'competition' => $team->competition,
            'members' => $team->competitionMembers->pluck('user')->toArray(),
            'dosen' => $team->dosen,
            'registrant' => $team->registrant,
            'achievement' => $achievement,
            'certificates' => $achievement ? $achievement->certificates : [],
        ]);
    }
}
