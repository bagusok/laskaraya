<?php

namespace App\Http\Controllers\dosen;

use App\Http\Controllers\Controller;
use App\Models\CategoryModel;
use App\Models\CompetitionModel;
use App\Models\PeriodModel;
use App\Models\SkillModel;
use App\Models\UserToCompetition;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Intervention\Image\Laravel\Facades\Image;

class DosenCompetitionController extends Controller
{
    public function index()
    {
        $pending = CompetitionModel::where([
            'verified_status' => 'pending',
            'uploader_id' => auth()->user()->id
        ])->count();

        $ongoing = UserToCompetition::where([
            'status' => 'accepted',
            'dosen_id' => auth()->user()->id
        ])->whereHas('competition', function ($query) {
            $query->where([
                'status' => 'ongoing',
                'verified_status' => 'accepted'
            ]);
        })->distinct('competition_id')->count();

        $completed = UserToCompetition::where([
            'status' => 'accepted',
            'dosen_id' => auth()->user()->id
        ])->whereHas('competition', function ($query) {
            $query->where([
                'status' => 'completed',
                'verified_status' => 'accepted'
            ]);
        })->distinct('competition_id')->count();

        $total = UserToCompetition::where([
            'status' => 'accepted',
            'dosen_id' => auth()->user()->id
        ])->whereHas('competition', function ($query) {
            $query->where('verified_status', 'accepted');
        })->distinct('competition_id')->count();

        return Inertia::render('dashboard/dosen/competitions/index')->with([
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


        return Inertia::render('dashboard/dosen/competitions/addCompetition')->with([
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
            'type' => 'in:competitions,dosen_competitions',
            'uploader_id' => 'exists:users,id',
        ]);

        if ($request->query('type') == 'dosen_competitions') {
            $competitions = UserToCompetition::with(['competition', 'competition.category', 'competition.period', 'competitionMembers.user'])
                ->where('dosen_id', auth()->user()->id)
                ->where('status', 'accepted')
                ->whereHas('competition', function ($query) use ($status, $verif_status, $searchQuery) {
                    if ($status) {
                        $query->where('status', $status);
                    }
                    if ($verif_status) {
                        $query->where('verified_status', $verif_status);
                    }
                    if ($searchQuery) {
                        $query->where('name', 'like', '%' . $searchQuery . '%');
                    }
                })
                ->orderBy('created_at', 'desc')
                ->paginate($perPage);

            $competitions->getCollection()->transform(function ($item) {
                return [
                    'id' => $item->competition->id,
                    'name' => $item->competition->name,
                    'category' => $item->competition->category,
                    'start_date' => $item->competition->start_date,
                    'end_date' => $item->competition->end_date,
                    'status' => $item->competition->status,
                    'members' => $item->competitionMembers->map(function ($member) {
                        return [
                            'id' => $member->id,
                            'user_id' => $member->user_id,
                            'user_to_competition_id' => $member->user_to_competition_id,
                            'user' => $member->user,
                            'userToCompetition' => [
                                'id' => $member->userToCompetition->id,
                                'name' => $member->userToCompetition->name,
                                'competition_id' => $member->userToCompetition->competition_id,
                                'status' => $member->userToCompetition->status,
                                'competition' => [
                                    'id' => $member->userToCompetition->competition->id,
                                    'name' => $member->userToCompetition->competition->name,
                                    'category' => $member->userToCompetition->competition->category,
                                    'start_date' => $member->userToCompetition->competition->start_date,
                                    'end_date' => $member->userToCompetition->competition->end_date,
                                    'status' => $member->userToCompetition->competition->status,
                                ]
                            ]
                        ];
                    })
                ];
            })->unique('id');
        } else {
            $competitions = CompetitionModel::with(['category', 'period', 'userToCompetition.competitionMembers.user'])
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

            $competitions->getCollection()->transform(function ($competition) {
                return [
                    'id' => $competition->id,
                    'name' => $competition->name,
                    'category' => $competition->category,
                    'start_date' => $competition->start_date,
                    'end_date' => $competition->end_date,
                    'status' => $competition->status,
                    'members' => $competition->userToCompetition->flatMap(function ($userToCompetition) use ($competition) {
                        return $userToCompetition->competitionMembers->map(function ($member) use ($competition, $userToCompetition) {
                            return [
                                'id' => $member->id,
                                'user_id' => $member->user_id,
                                'user_to_competition_id' => $member->user_to_competition_id,
                                'user' => $member->user,
                                'userToCompetition' => [
                                    'id' => $userToCompetition->id,
                                    'name' => $userToCompetition->name,
                                    'competition_id' => $userToCompetition->competition_id,
                                    'status' => $userToCompetition->status,
                                    'competition' => [
                                        'id' => $competition->id,
                                        'name' => $competition->name,
                                        'category' => $competition->category,
                                        'start_date' => $competition->start_date,
                                        'end_date' => $competition->end_date,
                                        'status' => $competition->status,
                                    ]
                                ]
                            ];
                        });
                    })
                ];
            });
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

        return redirect()->route('dosen.competitions.index')->with('success', 'Competition created successfully.');
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

        return Inertia::render('dashboard/dosen/competitions/editCompetition')->with([
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

        return redirect()->route('dosen.competitions.index')->with('success', 'Competition updated successfully.');
    }

    public function destroy($id)
    {
        $user = auth()->user();

        if ($user->role !== 'dosen') {
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

        return redirect()->route('dosen.competitions.index')->with('success', 'Competition deleted successfully.');
    }
}