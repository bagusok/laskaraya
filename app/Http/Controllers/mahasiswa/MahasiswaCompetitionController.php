<?php

namespace App\Http\Controllers\mahasiswa;

use App\Http\Controllers\Controller;
use App\Models\CategoryModel;
use App\Models\CompetitionMember;
use App\Models\CompetitionModel;
use App\Models\PeriodModel;
use App\Models\SkillModel;
use App\Models\UserModel;
use App\Models\UserToCompetition;
use Illuminate\Http\Request;
use Illuminate\Log\Logger;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Intervention\Image\Laravel\Facades\Image;

class MahasiswaCompetitionController extends Controller
{
    public function index()
    {
        $pending = CompetitionModel::where([
            'verified_status' => 'pending',
            'uploader_id' => auth()->user()->id
        ])->count();

        $ongoing = CompetitionMember::whereHas('userToCompetition', function ($query) {
            $query->where([
                'status' => 'accepted',
                'user_id' => auth()->user()->id
            ]);
        })->whereHas('userToCompetition.competition', function ($query) {
            $query->where([
                'status' => 'ongoing',
                'verified_status' => 'accepted'
            ]);
        })->count();

        $completed = CompetitionMember::whereHas('userToCompetition', function ($query) {
            $query->where([
                'status' => 'accepted',
                'user_id' => auth()->user()->id
            ]);
        })->whereHas('userToCompetition.competition', function ($query) {
            $query->where([
                'status' => 'completed',
                'verified_status' => 'accepted'
            ]);
        })->count();

        $total = CompetitionMember::whereHas('userToCompetition', function ($query) {
            $query->where([
                'status' => 'accepted',
                'user_id' => auth()->user()->id
            ]);
        })->whereHas('userToCompetition.competition', function ($query) {
            $query->where([
                'verified_status' => 'accepted'
            ]);
        })->count();

        return Inertia::render('dashboard/mahasiswa/competitions/index')->with([
            'ongoing' => $ongoing,
            'pending' => $pending,
            'completed' => $completed,
            'total' => $total,
        ]);
    }


    public function create()
    {
        $categories = CategoryModel::all();
        $periods = PeriodModel::orderBy('year', 'desc')->get();
        $skills = SkillModel::all();


        return Inertia::render('dashboard/mahasiswa/competitions/addCompetition')->with([
            'categories' => $categories,
            'periods' => $periods,
            'skills' => $skills,
        ]);
    }

    public function getAllCompetitions(Request $request)
    {
        $perPage = $request->query('limit', 10);
        $status = $request->query('status', null);
        $verif_status = $request->query('verif_status', null);
        $searchQuery = $request->query('search', null);
        $uploader_id = $request->query('uploader_id', null);

        $request->validate([
            'limit' => 'integer|min:1|max:100',
            'status' => 'in:ongoing,completed,canceled',
            'verif_status' => 'in:pending,accepted,rejected',
            'search' => 'string|max:255',
            'type' => 'in:competitions,mahasiswa_competitions',
            'uploader_id' => 'exists:users,id',
        ]);

        if ($request->query('type') == 'mahasiswa_competitions') {
            $competitions = CompetitionMember::with('userToCompetition.competition.category', 'userToCompetition.competition.period')->where('user_id', auth()->user()->id)
                ->whereHas('userToCompetition', function ($query) use ($status, $verif_status, $searchQuery, $uploader_id) {
                    if ($status) {
                        $query->whereHas('competition', function ($q) use ($status) {
                            $q->where('status', $status);
                        });
                    }
                    if ($verif_status) {
                        $query->whereHas('competition', function ($q) use ($verif_status) {
                            $q->where('verified_status', $verif_status);
                        });
                    }
                    if ($searchQuery) {
                        $query->whereHas('competition', function ($q) use ($searchQuery) {
                            $q->where('name', 'like', '%' . $searchQuery . '%');
                        });
                    }
                })
                ->orderBy('created_at', 'desc')
                ->paginate($perPage);

            $competitions->getCollection()->transform(function ($item) {
                return [
                    'id' => $item->userToCompetition->competition->id,
                    'name' => $item->userToCompetition->competition->name,
                    'image' => $item->userToCompetition->competition->image,
                    'author' => $item->userToCompetition->competition->author,
                    'level' => $item->userToCompetition->competition->level,
                    'status' => $item->userToCompetition->competition->status,
                    'verified_status' => $item->userToCompetition->competition->verified_status,
                    'category' => $item->userToCompetition->competition->category,
                    'period' => $item->userToCompetition->competition->period,
                    'description' => $item->userToCompetition->competition->description,
                    'start_date' => $item->userToCompetition->competition->start_date,
                    'end_date' => $item->userToCompetition->competition->end_date,
                ];
            });
        } else {
            $competitions = CompetitionModel::with(['category', 'period'])
                ->where(function ($query) use ($status, $verif_status, $searchQuery, $uploader_id) {
                    if ($status) {
                        $query->where('status', $status);
                    }
                    if ($verif_status) {
                        $query->where('verified_status', $verif_status);
                    }
                    if ($searchQuery) {
                        $query->where('name', 'like', '%' . $searchQuery . '%');
                    }

                    if ($uploader_id) {
                        $query->where('uploader_id', $uploader_id);
                    }
                })
                ->orderBy('created_at', 'desc')
                ->paginate($perPage);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'List of competitions',
            'data' => $competitions->items(),
            'pagination' => [
                'current_page' => $competitions->currentPage(),
                'last_page' => $competitions->lastPage(),
                'per_page' => $competitions->perPage(),
                'total' => $competitions->total(),
                'total_pages' => $competitions->total() / $competitions->perPage(),
                'has_more_pages' => $competitions->hasMorePages(),
            ],
        ]);
    }

    public function postCreate(Request $request)
    {
        $user = auth()->user();

        $request->validate([
            'name' => 'required|string|min:3|max:255',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp,avif|max:2048',
            'author' => 'required|string|min:3|max:255',
            'level' => 'required|in:1,2,3,4,5',
            'status' => 'required|in:ongoing,completed,canceled',
            'category_id' => 'required',
            'period_id' => 'required',
            'description' => 'required',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'skills' => 'required|array',
            'skills.*' => 'exists:skills,id',
        ]);

        $image = $request->file('image');
        $webp_image = Image::read($image)->toWebp();
        $filename = hash('sha256', \Illuminate\Support\Str::uuid()) . '.webp';

        Storage::put('public/competition_posters/' . $filename, $webp_image);

        $competition = CompetitionModel::create([
            'name' => $request->name,
            'image' => $filename,
            'author' => $request->author,
            'level' => $request->level,
            'status' => $request->status,
            'verified_status' => 'pending',
            'category_id' => $request->category_id,
            'period_id' => $request->period_id,
            'description' => $request->description,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'uploader_id' => $user->id,
        ]);

        if ($request->has('skills')) {
            $competition->skills()->attach($request->skills);
        }



        if (!$competition) {
            return back()->with('error', 'Failed to create competition.');
        }

        return redirect()->route('mahasiswa.competitions.index')->with('success', 'Competition created successfully.');
    }

    public function edit($id)
    {
        $competition = CompetitionModel::findOrFail($id);
        $categories = CategoryModel::all();
        $periods = PeriodModel::orderBy('year', 'desc')->get();
        $skills = SkillModel::all();
        $selectedSkills = $competition->skills->pluck('id')->toArray();

        if (!$competition) {
            return back()->with('error', 'Competition not found.');
        }

        return Inertia::render('dashboard/mahasiswa/competitions/editCompetition')->with([
            'competition' => $competition,
            'categories' => $categories,
            'periods' => $periods,
            'skills' => $skills,
            'selectedSkills' => $selectedSkills,

        ]);
    }

    public function update($id, Request $request)
    {
        $user = auth()->user();

        $request->validate([
            'name' => 'required|string|min:3|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp,avif|max:2048', // image opsional saat update
            'author' => 'required|string|min:3|max:255',
            'level' => 'required|in:1,2,3,4,5',
            'status' => 'required|in:ongoing,completed,canceled',
            'category_id' => 'required',
            'period_id' => 'required',
            'description' => 'required',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'skills' => 'required|array',
            'skills.*' => 'exists:skills,id',
        ]);

        $competition = CompetitionModel::findOrFail($id);

        // Jika ada file gambar baru
        if ($request->hasFile('image')) {
            // Hapus gambar lama jika ada
            if ($competition->image && Storage::exists('public/competition_posters/' . $competition->image)) {
                Storage::delete('public/competition_posters/' . $competition->image);
            }

            $image = $request->file('image');
            $webp_image = Image::read($image)->toWebp();
            $filename = hash('sha256', \Illuminate\Support\Str::uuid()) . '.webp';
            Storage::put('public/competition_posters/' . $filename, $webp_image);

            $competition->image = $filename;
        }

        // Update data lainnya
        $competition->name = $request->name;
        $competition->author = $request->author;
        $competition->level = $request->level;
        $competition->status = $request->status;
        $competition->category_id = $request->category_id;
        $competition->period_id = $request->period_id;
        $competition->description = $request->description;
        $competition->start_date = $request->start_date;
        $competition->end_date = $request->end_date;
        $competition->verified_status = 'pending';

        // Update skills
        if ($request->has('skills')) {
            $competition->skills()->sync($request->skills);
        } else {
            $competition->skills()->detach();
        }

        $competition->save();

        return redirect()->route('mahasiswa.competitions.index')->with('success', 'Competition updated successfully.');
    }

    public function destroy($id)
    {
        $user = auth()->user();

        if ($user->role !== 'mahasiswa') {
            return redirect()->route('index')->with('error', 'Unauthorized access.');
        }

        $competition = CompetitionModel::findOrFail($id);

        if (!$competition) {
            return back()->withErrors(['error' => 'Competition not found.']);
        }

        if ($competition->image) {
            Storage::delete('public/competition_posters/' . $competition->image);
        }

        $competition->delete();

        return redirect()->route('mahasiswa.competitions.index')->with('success', 'Competition deleted successfully.');
    }

    public function join($id)
    {
        $user = auth()->user();

        $competition = CompetitionModel::where([
            'id' => $id,
            'status' => 'ongoing',
            'verified_status' => 'accepted',
        ])->first();

        if (!$competition) {
            return redirect()->route('mahasiswa.competitions.index')->withErrors(
                ['error' => 'Competition not found or not available for joining.']
            );
        }

        $dosen = UserModel::where([
            'role' => 'dosen',
        ])->get();

        $mahasiswa = UserModel::where([
            'role' => 'mahasiswa',
        ])->whereNot('id', $user->id)->get();

        return Inertia::render('dashboard/mahasiswa/competitions/join/index')->with([
            'competition' => $competition,
            'dosen' => $dosen,
            'mahasiswa' => $mahasiswa,
        ]);
    }

    public function postJoin(Request $request)
    {
        $user = auth()->user();

        $id = $request->input('competition_id');
        $name = $request->input('name');
        $dosen_id = $request->input('dosen_id');
        $members = $request->input('competition_members', []);

        $request->validate([
            'competition_id' => 'required|exists:competitions,id',
            'name' => 'required|string|min:3|max:255',
            'dosen_id' => 'required|exists:users,id',
            'competition_members' => 'required|array',
            'competition_members.*.user_id' => 'required|exists:users,id|distinct',

        ]);


        $competition = CompetitionModel::where('id', $id)
            ->where('status', 'ongoing')
            ->where('verified_status', 'accepted')
            ->first();

        if (!$competition) {
            return redirect()->route('mahasiswa.competitions.index')->withErrors(
                ['error' => 'Competition not found or not available for joining.']
            );
        }

        $existingLeader = CompetitionMember::whereHas('userToCompetition', function ($query) use ($user, $competition) {
            $query->where('user_id', $user->id)
                ->where('competition_id', $competition->id);
        })->first();

        if ($existingLeader) {
            return redirect()->route('mahasiswa.competitions.index')->withErrors(
                ['error' => 'You are already a member of this competition.']
            );
        }

        // cek members juga
        $existingMembers = CompetitionMember::whereHas('userToCompetition', function ($query) use ($members, $competition) {
            $query->whereIn('user_id', array_column($members, 'user_id'))
                ->where('competition_id', $competition->id);
        })->get();

        if ($existingMembers->isNotEmpty()) {
            return redirect()->route('mahasiswa.competitions.index')->withErrors(
                ['error' => 'Some members are already part of this competition.']
            );
        }

        try {

            DB::beginTransaction();

            //    create user to competition
            $userToCompetition = UserToCompetition::create([
                'name' => $name,
                'registrant_id' => $user->id,
                'competition_id' => $competition->id,
                'dosen_id' => $dosen_id,
                'status' => 'pending',
            ]);

            // create competition member for the leader
            CompetitionMember::create([
                'user_id' => $user->id,
                'user_to_competition_id' => $userToCompetition->id,
            ]);

            // create competition members for the other members
            foreach ($members as $member) {
                CompetitionMember::create([
                    'user_id' => $member['user_id'],
                    'user_to_competition_id' => $userToCompetition->id,
                ]);
            }

            DB::commit();

            return redirect()->route('mahasiswa.competitions.index')->with('success', 'Successfully joined the competition.');
        } catch (\Exception $e) {
            dd($e);
            return redirect()->route('mahasiswa.competitions.index')->withErrors(
                ['error' => 'Failed to join the competition. Please try again later.']
            );
        }
    }
}
