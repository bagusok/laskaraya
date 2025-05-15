<?php

namespace App\Http\Controllers;

use App\Models\UserModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;

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
            'password' => 'nullable|min:8'
        ]);

        // Hapus password dari data jika kosong
        if (empty($validated['password'])) {
            unset($validated['password']);
        } else {
            $validated['password'] = Hash::make($validated['password']);
        }

        try {
            $user->update($validated);
            return redirect()->route('dashboard')->with('success', 'Profil berhasil diperbarui');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Terjadi kesalahan saat memperbarui profil']);
        }
    }
}