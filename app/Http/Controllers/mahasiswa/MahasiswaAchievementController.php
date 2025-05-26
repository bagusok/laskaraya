<?php

namespace App\Http\Controllers\mahasiswa;

use App\Http\Controllers\Controller;
use App\Models\UserModel;
use App\Models\UserToCompetition;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Intervention\Image\Laravel\Facades\Image;

class MahasiswaAchievementController extends Controller
{
    public function create(Request $request, $id)
    {

        $team = UserToCompetition::with(['competitionMembers', 'competition', 'competitionMembers.user', 'dosen'])
            ->findOrFail($id);

        // if ($team->registrant_id !== auth()->user()->id) {
        //     return back()->withErrors(['error' => 'Hanya ketua tim yang dapat mengedit tim ini.']);
        // }

        $achievement = $team->achievement;

        return Inertia::render('dashboard/mahasiswa/competitions/teams/achievements/index', [
            'team' => $team,
            'competition' => $team->competition,
            'members' => $team->competitionMembers->pluck('user')->toArray(),
            'dosen' => $team->dosen,
            'registrant' => $team->registrant,
            'achievement' => $achievement,
            'certificates' => $achievement ? $achievement->certificates : [],
        ]);
    }

    public function postCreate(Request $request)
    {
        $request->validate([
            'team_id' => 'required|exists:user_to_competitions,id',
            'name' => 'required|string|max:255|min:3',
            'description' => 'nullable|string|max:1000',
            'champion' => 'nullable|in:1,2,3,4,5',
            'score' => 'required|numeric|min:0|max:100',
            'certificates' => 'nullable|array',
            'certificates.*.file' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
            'certificates.*.user_id' => 'required|exists:users,id',
        ]);

        $team = UserToCompetition::where('status', 'accepted')
            ->where('id', $request->team_id)
            ->firstOrFail();

        try {
            DB::beginTransaction();

            $achievement = $team->achievement;

            if ($achievement) {
                $achievement->update([
                    'name' => $request->name,
                    'description' => $request->description,
                    'champion' => $request->champion,
                    'score' => $request->score,
                ]);

                // Hapus file lama jika ada
                foreach ($achievement->certificates as $certificate) {
                    if ($certificate->file_url) {
                        Storage::disk('public')->delete('certificates/' . $certificate->file_url);
                    }
                    $certificate->delete();
                }
            } else {
                $achievement = $team->achievement()->create([
                    'name' => $request->name,
                    'description' => $request->description,
                    'champion' => $request->champion,
                    'score' => $request->score,
                ]);
            }

            // Simpan sertifikat baru jika ada
            if ($request->has('certificates')) {
                foreach ($request->certificates as $certData) {
                    if (!isset($certData['file']) || !$certData['file']) continue;

                    $file = $certData['file'];
                    $userId = $certData['user_id'];
                    $extension = $file->getClientOriginalExtension();
                    $hash = hash('sha256', $userId . "_" . $team->id);

                    // Proses gambar ke .webp
                    if (in_array(strtolower($extension), ['jpg', 'jpeg', 'png'])) {
                        $webp = Image::read($file)->toWebp(80); // 90 adalah kualitas kompresi
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
            return back()->with('success', 'Prestasi berhasil ditambahkan.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal menyimpan: ' . $e->getMessage()]);
        }
    }
}
