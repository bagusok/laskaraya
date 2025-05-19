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

class ProfileController extends Controller
{
    public function show()
    {
        $user = Auth::user()->load(['dosen', 'mahasiswa']);
        return Inertia::render('dashboard/admin/profileDetail', [
            'user' => $user
        ]);
    }

    public function edit()
    {
        $user = Auth::user()->load(['dosen', 'mahasiswa']);
        return Inertia::render('dashboard/admin/editProfile', [
            'user' => $user
        ]);
    }

    public function update(Request $request)
    {
        /** @var UserModel $user */
        $user = Auth::user();

        if (!$user) {
            return back()->withErrors(['error' => 'User tidak ditemukan']);
        }

        $data = $request->all();
        Log::info('DATA YANG DITERIMA:', $data);
        if (array_key_exists('password', $data) && $data['password'] === '') {
            unset($data['password']);
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
            'prodi_id' => 'nullable|exists:program_studi,id'
        ])->validate();

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

            // Update dosen data if role is dosen or admin
            if (in_array($validated['role'], ['dosen', 'admin'])) {
                $dosenData = [
                    'address' => $validated['address'] ?? null,
                    'faculty' => $validated['faculty'] ?? null,
                    'major' => $validated['major'] ?? null,
                    'gender' => $validated['gender'] ?? null,
                    'birth_place' => $validated['birth_place'] ?? null,
                    'birth_date' => $validated['birth_date'] ?? null,
                ];

                if ($user->dosen) {
                    $user->dosen->update($dosenData);
                } else {
                    $user->dosen()->create($dosenData);
                }
            }

            // Update mahasiswa data if role is mahasiswa
            if ($validated['role'] === 'mahasiswa' && isset($validated['prodi_id'])) {
                $mahasiswaData = [
                    'prodi_id' => $validated['prodi_id']
                ];

                if ($user->mahasiswa) {
                    $user->mahasiswa->update($mahasiswaData);
                } else {
                    $user->mahasiswa()->create($mahasiswaData);
                }
            }

            return redirect()->route('profile.show')->with([
                'success' => 'Profil berhasil diperbarui'
            ]);
        } catch (\Exception $e) {
            Log::error('Error updating profile: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Terjadi kesalahan saat memperbarui profil: ' . $e->getMessage()]);
        }
    }
}
