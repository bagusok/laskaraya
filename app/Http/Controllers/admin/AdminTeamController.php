<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\UserToCompetition;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminTeamController extends Controller
{
    public function getAllTeams(Request $request)
    {
        $perPage = $request->query('limit', 10);
        $searchQuery = $request->query('search', null);
        $verifiedStatus = $request->query('verified_status', null);
        $competitionId = $request->query('competition_id', null);

        $request->validate([
            'limit' => 'integer|nullable|min:1',
            'search' => 'string|nullable',
            'verified_status' => 'nullable|in:accepted,rejected,pending',
            'competition_id' => 'integer|nullable|exists:competitions,id',
        ]);

        $teams = UserToCompetition::with(['competition', 'dosen', 'registrant'])->when($searchQuery, function ($query) use ($searchQuery) {
            $query->where('name', 'like', '%' . $searchQuery . '%');
        })->when(
            $verifiedStatus,
            function ($query) use ($verifiedStatus) {
                if ($verifiedStatus === 'accepted') {
                    $query->where('status', 'accepted');
                } elseif ($verifiedStatus === 'rejected') {
                    $query->where('status', 'rejected');
                } elseif ($verifiedStatus === 'pending') {
                    $query->where('status', 'pending');
                }
            }
        )->when(
            $competitionId,
            function ($query) use ($competitionId) {
                $query->where('competition_id', $competitionId);
            }
        )->orderBy('created_at', 'desc')->paginate($perPage);

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

        return Inertia::render('dashboard/admin/competitions/teams/detail', [
            'team' => $team,
            'competition' => $team->competition,
            'members' => $team->competitionMembers->pluck('user')->toArray(),
            'dosen' => $team->dosen,
            'registrant' => $team->registrant,
            'achievement' => $achievement,
            'certificates' => $achievement ? $achievement->certificates : [],
        ]);
    }

    public function responseTeam(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:accepted,rejected',
            'reason' => 'nullable|string|max:255',
        ]);

        $team = UserToCompetition::findOrFail($id);

        if (!$team) {
            return back()->withErrors(['team' => 'Team not found.']);
        }

        if ($team->status !== 'pending') {
            return back()->withErrors(['status' => 'Team response can only be updated if the status is pending.']);
        }

        $team->status = $request->input('status');
        $team->notes = $request->input('reason', null);
        $team->save();

        return back()->with('success', 'Team response updated successfully.');
    }

    public function destroy($id)
    {
        $team = UserToCompetition::findOrFail($id);

        if (!$team) {
            return back()->withErrors(['team' => 'Team not found.']);
        }

        $team->delete();

        return back()->with('success', 'Team deleted successfully.');
    }

    public function logs(Request $request, $id)
    {
        $team = UserToCompetition::with(['competitionMembers', 'competition', 'competitionMembers.user'])
            ->findOrFail($id);

        $logs = $team->logs()->orderBy('created_at', 'desc')->get();

        return Inertia::render('dashboard/admin/competitions/teams/logs/index', [
            'team' => $team,
            'competition' => $team->competition,
            'members' => $team->competitionMembers->pluck('user')->toArray(),
            'logs' => $logs,
        ]);
    }
}
