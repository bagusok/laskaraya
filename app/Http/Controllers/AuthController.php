<?php

namespace App\Http\Controllers;

use App\Models\UserModel;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function showLoginForm()
    {
        return Inertia::render('auth/login', []);
    }
    public function showRegisterForm()
    {
        return Inertia::render('auth/register', []);
    }

    public function login(Request $request)
    {
        // Validate the request data
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string|min:8',
        ]);

        if (auth()->attempt($request->only('email', 'password'))) {
            Inertia::share([
                'user' => auth()->user(),
            ]);
            return redirect()->route('dashboard')->with('success', 'Login successful');
        }

        // If login fails, redirect back with an error message
        return redirect()->back()->withErrors(['message' => 'Invalid credentials']);
    }

    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'identifier' => 'required|string|max:255|unique:users,identifier',
            'phone' => 'required|string|max:255|unique:users,phone',
            'faculty' => 'required|string|max:255',
            'password' => 'required|string|min:8',
        ]);

        $user = UserModel::create([
            'name' => $request->name,
            'email' => $request->email,
            'identifier' => $request->identifier,
            'phone' => $request->phone,
            'faculty' => $request->faculty,
            'password' => bcrypt($request->password),
        ]);

        // auth()->login($user);

        return to_route(route: 'login')->with('success', 'Registration successful. Please log in.');
    }

    public function logout(Request $request)
    {
        auth()->logout();
        return redirect()->route('login')->with('success', 'Logout successful');
    }
}
