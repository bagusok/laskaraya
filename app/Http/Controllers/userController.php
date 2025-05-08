<?php

namespace App\Http\Controllers;

use App\Models\UserModel;
use Illuminate\Http\Request;
use Inertia\Inertia;

class userController extends Controller
{
    public function index()
    {
        $users = UserModel::all();

        return Inertia::render('dashboard/admin/users', [
            'users' => $users
        ]);
    }

    public function destroy(UserModel $user)
    {
        $user->delete();

        return redirect()->back()->with('success', 'User berhasil dihapus');
    }

    public function create()
    {
        return Inertia::render('dashboard/admin/userForm', [
            'mode' => 'add',
            'user' => null
        ]);
    }

    public function edit(UserModel $user)
    {
        return Inertia::render('dashboard/admin/userForm', [
            'mode' => 'edit',
            'user' => $user
        ]);
    }

    public function delete(UserModel $user)
    {
        return Inertia::render('dashboard/admin/userDelete', [
            'user' => $user
        ]);
    }
}
