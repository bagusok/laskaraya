<?php

namespace App\Http\Controllers;

use App\Models\UserModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class ProfileController extends Controller
{
    public function show()
    {
        $user = Auth::user()->load('dosen');
        return Inertia::render('dashboard/admin/profileDetail', [
            'user' => $user
        ]);
    }

    public function edit()
    {
        $user = Auth::user()->load('dosen');
        return Inertia::render('dashboard/admin/editProfile', [
            'user' => $user
        ]);
    }

    public function update(Request $request)
    {
        $user = Auth::user();

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
            'birth_date' => 'nullable|date'
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

                // Store new image
                $file = $request->file('image');
                $filename = time() . '_' . $file->getClientOriginalName();
                $file->storeAs('public/profile_pictures', $filename);
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

            return redirect()->route('profile.show')->with([
                'success' => 'Profil berhasil diperbarui'
            ]);
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Terjadi kesalahan saat memperbarui profil: ' . $e->getMessage()]);
        }
    }
}