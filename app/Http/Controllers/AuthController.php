<?php

namespace App\Http\Controllers;

use App\Models\UserModel;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function showLoginForm()
    {
        return Inertia::render('auth/login', []);
    }

    public function login(Request $request)
    {
        // Validate the request data
        $request->validate([
            'identifier' => 'required|string',
            'password' => 'required|string|min:8',
        ]);

        // Attempt to authenticate using the identifier field
        $credentials = [
            'identifier' => $request->identifier,
            'password' => $request->password,
        ];

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate(); // Regenerate session to prevent fixation
            Inertia::share([
                'user' => Auth::user(),
            ]);
            return redirect()->route('dashboard')->with('success', 'Login berhasil');
        }

        // If login fails, redirect back with an error message
        return redirect()->back()->withErrors(['identifier' => 'Identifier atau password salah']);
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect()->route('login')->with('success', 'Logout successful');
    }
}
