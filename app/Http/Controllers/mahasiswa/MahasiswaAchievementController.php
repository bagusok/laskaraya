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
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Intervention\Image\Laravel\Facades\Image;

class MahasiswaAchievementController extends Controller
{

    public function index(Request $request)
    {

        return Inertia::render('dashboard/mahasiswa/achievements/index');
    }

    public function create(Request $request)
    {
        // Ambil semua tim/lomba yang diikuti user (anggota tim), status tim accepted, status lomba completed/ongoing, verifikasi accepted
        $userCompetitions = \App\Models\CompetitionMember::with([
            'userToCompetition.competition.category',
            'userToCompetition.competition.period',
            'userToCompetition.competition',
            'userToCompetition.competitionMembers.user',
            'userToCompetition.dosen',
            'userToCompetition.registrant',
        ])
            ->where('user_id', auth()->user()->id)
            ->whereHas('userToCompetition', function ($q) {
                $q->where('status', 'accepted')
                    ->whereHas('competition', function ($q2) {
                        $q2->whereIn('status', ['completed', 'ongoing'])
                            ->where('verified_status', 'accepted');
                    });
            })
            ->get()
            ->map(function ($member) {
                $team = $member->userToCompetition;
                // Ambil semua anggota tim (user) dari competitionMembers tanpa filter
                $members = $team->competitionMembers->pluck('user')->unique('id')->values()->toArray();
                $team->members = $members;
                $team->dosen = $team->dosen;
                $team->registrant = $team->registrant;
                $team->competition = $team->competition;
                return $team;
            })
            ->unique('id')
            ->values();

        $categories = CategoryModel::all();
        $periods = PeriodModel::all();
        $skills = SkillModel::all();

        $mahasiswa = UserModel::where('role', 'mahasiswa')->whereNot('id', auth()->user()->id)
            ->get();
        $dosen = UserModel::where('role', 'dosen')
            ->get();

        return Inertia::render('dashboard/mahasiswa/achievements/create', [
            'userCompetitions' => $userCompetitions,
            'categories' => $categories,
            'periods' => $periods,
            'skills' => $skills,
            'mahasiswa' => $mahasiswa,
            'dosen' => $dosen,
        ]);
    }

    public function createWithCompletedCompetition(Request $request)
    {
        $competitions = CompetitionModel::where('status', 'completed')
            ->get();

        $categories = CategoryModel::all();
        $periods = PeriodModel::all();
        $skills = SkillModel::all();

        $mahasiswa = UserModel::where('role', 'mahasiswa')->whereNot('id', auth()->user()->id)
            ->get();
        $dosen = UserModel::where('role', 'dosen')
            ->get();

        return Inertia::render('dashboard/mahasiswa/achievements/create', [
            'competitions' => $competitions,
            'categories' => $categories,
            'periods' => $periods,
            'skills' => $skills,
            'mahasiswa' => $mahasiswa,
            'dosen' => $dosen,

        ]);
    }

    public function postCreateWithCompletedCompetition(Request $request)
    {
        $request->validate([
            'competition_id' => 'nullable|exists:competitions,id',
            'name' => 'required|string|max:255|min:3',
            'author' => 'required|string|max:255',
            'image' => 'nullable|file|image|max:2048',
            'category_id' => 'required|string|exists:categories,id',
            'period_id' => 'required|string|exists:periods,id',
            'level' => 'required|string|in:1,2,3,4,5',
            'status' => 'required|string|in:completed',
            'description' => 'required|string|min:10',
            'start_date' => 'required|date|before:end_date',
            'end_date' => 'required|date|after:start_date',
            'skills' => 'required|array|min:1',
            'skills.*' => 'exists:skills,id',
            'team' => 'required|array',
            'team.name' => 'required|string|max:255|min:3',
            'team.dosen_id' => 'required|exists:users,id',
            'team.competition_members' => 'required|array|min:0',
            'team.competition_members.*.user_id' => 'required|exists:users,id',
            'achievement' => 'required|array',
            'achievement.name' => 'required|string|max:255|min:3',
            'achievement.description' => 'nullable|string|max:1000',
            'achievement.champion' => 'required|in:1,2,3,4,5',
            'achievement.score' => 'required|numeric|min:0|max:100',
            'certificates' => 'required|array|min:1',
            'certificates.*.user_id' => 'required|exists:users,id',
            'certificates.*.file' => 'required|file|mimes:pdf,jpg,jpeg,png|max:2048',
        ]);

        try {
            DB::beginTransaction();

            if ($request->competition_id) {
                $competition = CompetitionModel::findOrFail($request->competition_id);
            } else {

                if ($request->hasFile('image')) {
                    $file = $request->file('image');
                    $webp = Image::read($file)->toWebp(80);
                    $filename = hash('sha256', uniqid()) . '.webp';
                    Storage::disk('public')->put('competition_posters/' . $filename, $webp);


                    $competition = CompetitionModel::create([
                        'name' => $request->name,
                        'author' => $request->author,
                        'description' => $request->description,
                        'image' => $filename,
                        'level' => $request->level,
                        'status' => $request->status,
                        'start_date' => $request->start_date,
                        'end_date' => $request->end_date,
                        'category_id' => $request->category_id,
                        'period_id' => $request->period_id,
                        'uploader_id' => auth()->user()->id,
                        'verified_status' => 'pending',
                    ]);
                } else {
                    return back()->withErrors(['error' => 'Gambar poster kompetisi harus diunggah.']);
                }

                if ($request->has('skills')) {
                    $competition->skills()->attach($request->skills);
                }
            }

            $team = UserToCompetition::create([
                'name' => $request->team['name'],
                'registrant_id' => auth()->user()->id,
                'dosen_id' => $request->team['dosen_id'],
                'competition_id' => $competition->id,
                'status' => 'pending',
            ]);


            $team->competitionMembers()->create([
                'user_id' => auth()->user()->id
            ]);

            foreach ($request->team['competition_members'] as $member) {
                if ($member['user_id'] == auth()->user()->id) continue;

                $team->competitionMembers()->create([
                    'user_id' => $member['user_id']
                ]);
            }

            $achievement = $team->achievement()->create([
                'name' => $request->achievement['name'],
                'description' => $request->achievement['description'] ?? null,
                'champion' => $request->achievement['champion'],
                'score' => $request->achievement['score'],
            ]);

            foreach ($request->certificates as $certData) {
                if (!isset($certData['file']) || !$certData['file']) continue;

                $file = $certData['file'];
                $userId = $certData['user_id'];
                $extension = $file->getClientOriginalExtension();
                $hash = hash('sha256', $userId . "_" . $team->id);

                // Proses gambar ke .webp
                if (in_array(strtolower($extension), ['jpg', 'jpeg', 'png'])) {
                    $webp = Image::read($file)->toWebp(80);
                    $filename = $hash . '.webp';
                    Storage::disk('public')->put('certificates/' . $filename, $webp);
                } else {
                    $filename = $hash . '.' . $extension;
                    $file->storeAs('certificates', $filename, 'public');
                }

                $achievement->certificates()->create([
                    'user_id' => $userId,
                    'file_url' => $filename,
                ]);
            }

            DB::commit();
            return redirect()->route('mahasiswa.achievements.index')->with('success', 'Prestasi kompetisi berhasil ditambahkan.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal menyimpan prestasi: ' . $e->getMessage()]);
        }
    }

    public function editWithCompletedCompetition(Request $request)
    {
        $competitions = CompetitionModel::where('status', 'completed')
            ->get();

        $categories = CategoryModel::all();
        $periods = PeriodModel::all();
        $skills = SkillModel::all();

        $mahasiswa = UserModel::where('role', 'mahasiswa')->whereNot('id', auth()->user()->id)
            ->get();
        $dosen = UserModel::where('role', 'dosen')
            ->get();

        return Inertia::render('dashboard/mahasiswa/achievements/create', [
            'competitions' => $competitions,
            'categories' => $categories,
            'periods' => $periods,
            'skills' => $skills,
            'mahasiswa' => $mahasiswa,
            'dosen' => $dosen,

        ]);
    }


    public function getAllAchievements(Request $request)
    {

        $request->validate([
            'status' => 'nullable|string|in:all,win,lose,unknown,verify_pending,verify_rejected',
        ]);

        $achievements = CompetitionMember::with(['user', 'userToCompetition.achievement', 'userToCompetition.competition', 'userToCompetition.dosen', 'userToCompetition.registrant'])
            ->join('user_to_competitions', 'competition_members.user_to_competition_id', '=', 'user_to_competitions.id')
            ->join('competitions', 'user_to_competitions.competition_id', '=', 'competitions.id')
            ->where('competition_members.user_id', auth()->user()->id)
            ->when($request->status != null, function ($query) use ($request) {
                switch ($request->status) {
                    case 'win':
                        $query->where('user_to_competitions.status', 'accepted')
                            ->where('competitions.verified_status', 'accepted')->whereHas(
                                'userToCompetition.achievement',
                                function ($q) {
                                    $q->whereNotNull('id');
                                }
                            );
                        break;
                    case 'lose':
                        $query->where('user_to_competitions.status', 'accepted')
                            ->where('competitions.status', 'completed')
                            ->where('competitions.verified_status', 'accepted')->whereDoesntHave(
                                'userToCompetition.achievement',
                                function ($q) {
                                    $q->whereNotNull('id');
                                }
                            );
                        break;
                    case 'unknown':
                        $query->where('user_to_competitions.status', 'accepted')
                            ->where('competitions.status', 'ongoing')
                            ->where('competitions.verified_status', 'accepted')->whereDoesntHave(
                                'userToCompetition.achievement',
                                function ($q) {
                                    $q->whereNotNull('id');
                                }
                            );
                        break;
                    case 'verify_pending':
                        $query->where('user_to_competitions.status', 'pending')
                            ->where('competitions.status', 'completed')
                            ->where('competitions.verified_status', 'pending');
                        break;
                    case 'verify_rejected':
                        $query->where('user_to_competitions.status', 'rejected')
                            ->where('competitions.status', 'completed')
                            ->where('competitions.verified_status', 'rejected');
                        break;
                }
            })
            ->orderBy('user_to_competitions.created_at', 'desc')
            ->select('competition_members.*')
            ->paginate(10);


        return response()->json($achievements, 200);
    }

    public function postCreate(Request $request)
    {
        $request->validate([
            'team_id' => 'required|exists:user_to_competitions,id',
            'name' => 'required_without:only_certificate|string|max:255|min:3',
            'description' => 'nullable|string|max:1000',
            'champion' => 'nullable|in:1,2,3,4,5',
            'score' => 'required_without:only_certificate|numeric|min:0|max:100',
            'certificates' => 'nullable|array',
            'certificates.*.file' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
            'certificates.*.user_id' => 'required|exists:users,id',
        ]);

        $team = UserToCompetition::where('id', $request->team_id)->firstOrFail();
        $achievement = $team->achievement;
        $userId = auth()->id();

        try {
            DB::beginTransaction();

            if ($achievement) {
                // Tolak hanya jika user mencoba mengisi ulang field prestasi
                if ($request->filled('name') || $request->filled('score') || $request->filled('champion')) {
                    // Cek apakah user login adalah yang pertama kali input (pemilik achievement)
                    if ($achievement->userToCompetition->registrant_id != $userId) {
                        return back()->withErrors(['error' => 'Data prestasi sudah diisi oleh anggota tim. Anda hanya dapat mengupload sertifikat.']);
                    }
                }
                // Upload/replace sertifikat untuk user login
                if ($request->has('certificates')) {
                    foreach ($request->certificates as $certData) {
                        if ($certData['user_id'] != $userId) continue;
                        if (!isset($certData['file']) || !$certData['file']) continue;
                        // Hapus sertifikat lama user ini jika ada
                        $old = $achievement->certificates()->where('user_id', $userId)->first();
                        if ($old && $old->file_url) {
                            Storage::disk('public')->delete('certificates/' . $old->file_url);
                            $old->delete();
                        }
                        $file = $certData['file'];
                        $extension = $file->getClientOriginalExtension();
                        $hash = hash('sha256', $userId . "_" . $team->id);
                        if (in_array(strtolower($extension), ['jpg', 'jpeg', 'png'])) {
                            $webp = \Intervention\Image\Laravel\Facades\Image::read($file)->toWebp(80);
                            $filename = $hash . '.webp';
                            Storage::disk('public')->put('certificates/' . $filename, $webp);
                        } else {
                            $filename = $hash . '.' . $extension;
                            $file->storeAs('certificates', $filename, 'public');
                        }
                        $achievement->certificates()->create([
                            'user_id' => $userId,
                            'file_url' => $filename,
                        ]);
                    }
                }
                DB::commit();
                return back()->with('success', 'Sertifikat berhasil diupload. Data prestasi sudah diisi oleh anggota tim.');
            } else {
                // Belum ada achievement, izinkan input data prestasi dan sertifikat
                $achievement = $team->achievement()->create([
                    'name' => $request->name,
                    'description' => $request->description,
                    'champion' => $request->champion,
                    'score' => $request->score,
                ]);
                if ($request->has('certificates')) {
                    foreach ($request->certificates as $certData) {
                        if (!isset($certData['file']) || !$certData['file']) continue;
                        $file = $certData['file'];
                        $userIdCert = $certData['user_id'];
                        $extension = $file->getClientOriginalExtension();
                        $hash = hash('sha256', $userIdCert . "_" . $team->id);
                        if (in_array(strtolower($extension), ['jpg', 'jpeg', 'png'])) {
                            $webp = \Intervention\Image\Laravel\Facades\Image::read($file)->toWebp(80);
                            $filename = $hash . '.webp';
                            Storage::disk('public')->put('certificates/' . $filename, $webp);
                        } else {
                            $filename = $hash . '.' . $extension;
                            $file->storeAs('certificates', $filename, 'public');
                        }
                        $achievement->certificates()->create([
                            'user_id' => $userIdCert,
                            'file_url' => $filename,
                        ]);
                    }
                }
                DB::commit();
                return back()->with('success', 'Prestasi dan sertifikat berhasil ditambahkan untuk seluruh anggota tim.');
            }
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal menyimpan: ' . $e->getMessage()]);
        }
    }
}