<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class ProgramStudiController extends Controller
{
    public function index()
    {
        return Inertia::render('dashboard/admin/programStudi');
    }
}