<?php

namespace App\Http\Controllers;

use App\Models\UserModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function edit()
    {
        $user = Auth::user();
        return Inertia::render('dashboard/admin/editProfile', [
            'user' => $user
        ]);
    }

    public function update(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'identifier' => 'required|string|unique:users,identifier,' . $user->id,
            'phone' => 'required|string|max:20',
            'role' => 'required|in:admin,dosen,mahasiswa',
            'is_verified' => 'boolean',
            'password' => 'nullable|min:8',
            'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg|max:2048'
        ]);

        try {
            // Hapus password dari data jika kosong
            if (empty($validated['password'])) {
                unset($validated['password']);
            } else {
                $validated['password'] = Hash::make($validated['password']);
            }

            // Handle profile picture upload
            if ($request->hasFile('profile_picture')) {
                // Delete old profile picture if exists
                if ($user->profile_picture && Storage::exists('public/profile_pictures/' . $user->profile_picture)) {
                    Storage::delete('public/profile_pictures/' . $user->profile_picture);
                }

                // Store new profile picture
                $file = $request->file('profile_picture');
                $filename = time() . '_' . $file->getClientOriginalName();
                $file->storeAs('public/profile_pictures', $filename);
                $validated['profile_picture'] = $filename;
            }

            // Update user data
            $user->update($validated);

            // Refresh user data
            $user->refresh();

            return back()->with([
                'success' => 'Profil berhasil diperbarui',
                'user' => $user
            ]);
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Terjadi kesalahan saat memperbarui profil: ' . $e->getMessage()]);
        }
    }
}
