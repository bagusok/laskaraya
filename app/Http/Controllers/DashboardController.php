<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();

        switch ($user->role) {
            case 'admin':
                return Inertia::render('dashboard/admin/index');
            case 'dosen':
                return app(\App\Http\Controllers\DosenController::class)->index($request);
            case 'mahasiswa':
                return Inertia::render('dashboard/mahasiswa/index');
            default:
                abort(403, 'Unauthorized action.');
        }
    }
}