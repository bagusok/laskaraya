<?php

namespace App\Http\Controllers;

use App\Models\UserModel;
use App\Models\DosenModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Intervention\Image\Laravel\Facades\Image;
use App\Models\ProgramStudiModel;
use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;
use Illuminate\View\View;

class ProfileController extends Controller
{
    public function show()
    {
        $user = Auth::user()->load(['dosen', 'mahasiswa', 'userToSkills.skill', 'prodi']);
        $userSkills = $user->userToSkills->map(function ($item) {
            return [
                'id' => $item->skill_id,
                'name' => $item->skill->name,
                'level' => $item->level,
            ];
        });
        return Inertia::render('dashboard/admin/profileDetail', [
            'user' => $user,
            'userSkills' => $userSkills,
        ]);
    }

    public function edit()
    {
        $user = Auth::user()->load(['dosen', 'mahasiswa', 'userToSkills.skill', 'prodi']);
        $prodiList = ProgramStudiModel::all(['id', 'nama']);
        $skills = \App\Models\SkillModel::all(['id', 'name']);
        $userSkills = $user->userToSkills->map(function ($item) {
            return [
                'id' => $item->skill_id,
                'name' => $item->skill->name,
                'level' => $item->level,
            ];
        });
        return Inertia::render('dashboard/admin/editProfile', [
            'user' => $user,
            'prodiList' => $prodiList,
            'skills' => $skills,
            'userSkills' => $userSkills,
        ]);
    }

    public function update(Request $request)
    {
        Log::info('RAW REQUEST:', $request->all());
        /** @var UserModel $user */
        $user = Auth::user();

        if (!$user) {
            return back()->withErrors(['error' => 'User tidak ditemukan']);
        }

        $data = $request->all();
        Log::info('DATA YANG DITERIMA:', $data);
        Log::info('USER ROLE:', ['role' => $user->role]);
        Log::info('MAHASISWA DATA:', ['mahasiswa' => $user->mahasiswa]);

        if (array_key_exists('password', $data) && $data['password'] === '') {
            unset($data['password']);
        }

        // Decode skills JSON if exists
        if (isset($data['skills'])) {
            $data['skills'] = json_decode($data['skills'], true);
        }

        $validated = Validator::make($data, [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'identifier' => 'required|string|unique:users,identifier,' . $user->id,
            'phone' => 'required|string|max:20',
            'role' => 'required|in:admin,dosen,mahasiswa',
            'is_verified' => 'boolean',
            'password' => ['nullable', 'string', 'min:8'],
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            // Tambahan validasi untuk data dosen
            'address' => 'nullable|string|max:255',
            'faculty' => 'nullable|string|max:255',
            'major' => 'nullable|string|max:255',
            'gender' => 'nullable|in:L,P',
            'birth_place' => 'nullable|string|max:255',
            'birth_date' => 'nullable|date',
            'prodi_id' => 'nullable|exists:program_studi,id',
            'skills' => 'nullable|array',
            'skills.*.id' => 'required|exists:skills,id',
            'skills.*.level' => 'required|integer|min:1|max:5',
            'total_competitions' => 'nullable|numeric',
            'total_wins' => 'nullable|numeric',
        ])->validate();

        Log::info('VALIDATED DATA:', $validated);

        try {
            // Hapus password dari data jika kosong
            if (empty($validated['password'])) {
                unset($validated['password']);
            } else {
                $validated['password'] = Hash::make($validated['password']);
            }

            // Handle image upload
            if ($request->hasFile('image')) {
                // Delete old image if exists
                if ($user->image && Storage::exists('public/profile_pictures/' . $user->image)) {
                    Storage::delete('public/profile_pictures/' . $user->image);
                }

                $file = $request->file('image');
                $webp_image = Image::read($file)->toWebp();
                $filename = hash('sha256', $user->id) . '.webp';
                Storage::put('public/profile_pictures/' . $filename, $webp_image);
                $validated['image'] = $filename;
            }

            // Update user data
            $user->update($validated);
            Log::info('USER UPDATED:', ['user' => $user->toArray()]);

            // Update mahasiswa data if role is mahasiswa
            if ($user->role === 'mahasiswa') {
                $mahasiswaData = [
                    'total_competitions' => $request->input('total_competitions', 0),
                    'total_wins' => $request->input('total_wins', 0)
                ];

                Log::info('Mahasiswa Data to be saved:', $mahasiswaData);

                try {
                    if ($user->mahasiswa) {
                        $user->mahasiswa->update($mahasiswaData);
                        Log::info('Mahasiswa profile updated successfully');
                    } else {
                        $user->mahasiswa()->create($mahasiswaData);
                        Log::info('New mahasiswa profile created successfully');
                    }
                } catch (\Exception $e) {
                    Log::error('Error saving mahasiswa data: ' . $e->getMessage());
                    throw $e;
                }
            }

            // Update dosen data if role is dosen
            if ($user->role === 'dosen') {
                $dosenData = [
                    'total_competitions' => $request->input('total_competitions', 0),
                    'total_wins' => $request->input('total_wins', 0)
                ];

                Log::info('Dosen Data to be saved:', $dosenData);

                try {
                    if ($user->dosen) {
                        $user->dosen->update($dosenData);
                        Log::info('Dosen profile updated successfully');
                    } else {
                        $user->dosen()->create($dosenData);
                        Log::info('New dosen profile created successfully');
                    }
                } catch (\Exception $e) {
                    Log::error('Error saving dosen data: ' . $e->getMessage());
                    throw $e;
                }
            }

            // Update user skills
            if (isset($validated['skills'])) {
                // Hapus semua skill lama
                \App\Models\UserToSkill::where('user_id', $user->id)->delete();
                // Tambahkan skill baru
                foreach ($validated['skills'] as $skill) {
                    \App\Models\UserToSkill::create([
                        'user_id' => $user->id,
                        'skill_id' => $skill['id'],
                        'level' => $skill['level'],
                    ]);
                }
            }

            return redirect()->route('profile.show')->with([
                'success' => 'Profil berhasil diperbarui'
            ]);
        } catch (\Exception $e) {
            Log::error('Error updating profile: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            if ($e instanceof \Illuminate\Validation\ValidationException) {
                Log::error('VALIDATION ERRORS: ' . json_encode($e->errors()));
            }
            return back()->withErrors(['error' => 'Terjadi kesalahan saat memperbarui profil: ' . $e->getMessage()]);
        }
    }

    public function updateCompetitionStatus(Request $request, $id)
    {
        try {
            $user = Auth::user();
            if (!$user || !$user->mahasiswa) {
                return back()->withErrors(['error' => 'Data mahasiswa tidak ditemukan']);
            }

            $mahasiswa = $user->mahasiswa;

            // Increment total competitions
            $mahasiswa->incrementCompetitions();

            // If competition is won, increment total wins
            if ($request->has('is_win') && $request->input('is_win')) {
                $mahasiswa->incrementWins();
            }

            \Illuminate\Support\Facades\Log::info('Updated competition status for mahasiswa:', [
                'id' => $mahasiswa->id,
                'total_competitions' => $mahasiswa->total_competitions,
                'total_wins' => $mahasiswa->total_wins
            ]);

            return back()->with('success', 'Status kompetisi berhasil diperbarui');
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Error updating competition status: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Terjadi kesalahan saat memperbarui status kompetisi']);
        }
    }
}