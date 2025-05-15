<?php

namespace App\Http\Controllers;

use App\Models\UserModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {

        $search = $request->input('search', null);
        $searchQuery = $request->input('search_query', null);
        $sort = $request->input('sort', 'created_at');
        $order = $request->input('order', 'desc');
        $page = $request->input('page', 1);
        $limit = $request->input('limit', 10);

        $request->validate([
            'search_query' => 'nullable|string|max:255',
            'search' => 'nullable|string|in:identifier,name,email',
            'sort' => 'nullable|string|in:created_at,name,email',
            'order' => 'nullable|string|in:asc,desc',
            'page' => 'nullable|integer|min:1',
            'limit' => 'nullable|integer|min:1|max:100'
        ]);

        $users = UserModel::with(['mahasiswa', 'dosen'])->when($searchQuery, function ($query) use ($search, $searchQuery) {
            if ($search === 'name') {
                return $query->where('name', 'like', '%' . $searchQuery . '%');
            } elseif ($search === 'email') {
                return $query->where('email', 'like', '%' . $searchQuery . '%');
            } elseif ($search === 'identifier') {
                return $query->where('identifier', 'like', '%' . $searchQuery . '%');
            }
        })
            ->orderBy($sort, $order)
            ->paginate($limit)
            ->withQueryString();

        return Inertia::render('dashboard/admin/users/index', [
            'users' => $users,
            'pagination' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'per_page' => $users->perPage(),
                'total_page' => $users->total() / $users->perPage(),
                'total_data' => $users->total(),
            ],
        ]);
    }

public function destroy($id)
{
    try {
    $user = UserModel::findOrFail($id);
    if ($user ->role === 'mahasiswa') {
        $user->mahasiswa()->delete();
        $user->delete();
    } elseif ($user->role === 'dosen') {
        $user->dosen()->delete();
        $user->delete();
    }
        return redirect()->back()->with('success', 'User berhasil dihapus');
    } catch (\Exception $e) {
        Log::error("Error deleting user: " . $e->getMessage());
        return redirect()->back()->withErrors(['error' => 'Failed to delete user.']);
    }
}

    public function create()
    {
        return Inertia::render('dashboard/admin/users/userForm', [
            'mode' => 'add',
            'user' => null
        ]);
    }

    public  function postCreate(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'identifier' => 'required|string|max:255|unique:users,identifier',
            'password' => 'required|string|min:8',
            'role' => 'required|string|in:dosen,mahasiswa,admin',
            'phone' => 'nullable|string|max:15',
            'faculty' => 'nullable|string|max:255',
            'year' => 'required_if:role,mahasiswa|integer|min:2000',

        ]);

        DB::beginTransaction();
        try {
            $user = UserModel::create([
                'name' => $request->input('name'),
                'email' => $request->input('email'),
                'identifier' => $request->input('identifier'),
                'password' => bcrypt($request->input('password')),
                'role' => $request->input('role'),
                'phone' => $request->input('phone'),

            ]);

            if ($request->input('role') === 'mahasiswa') {
                $user->mahasiswa()->create([
                    'faculty' => $request->input('faculty'),
                ]);
            } elseif ($request->input('role') === 'dosen') {
                $user->dosen()->create([
                    'faculty' => $request->input('faculty'),
                ]);
            }

            DB::commit();

            return redirect()->back()->with('success', 'User berhasil ditambahkan');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Terjadi kesalahan saat menambahkan user']);
        }
    }

    public function editDetail($id)
    {
        $user = UserModel::with(['mahasiswa', 'dosen'])->findOrFail($id);

        if (!$user) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }
        return response()->json([
            'user' => $user
        ]);
    }

    public function postEdit(Request $request, $id)
    {
        $request->validate([
            'name'       => 'required|string|max:255',
            'email'      => "required|email|max:255|unique:users,email,{$id}",
            'identifier' => "required|string|max:255|unique:users,identifier,{$id}",
            'password'   => 'nullable|string|min:8',
            'role'       => 'required|string|in:dosen,mahasiswa,admin',
            'phone'      => 'nullable|string|max:15',
            'faculty'    => 'nullable|string|max:255',
            'year'       => 'required_if:role,mahasiswa|integer|min:2000',
        ]);

        DB::beginTransaction();
        try {
            $user = UserModel::findOrFail($id);

            $user->name       = $request->input('name');
            $user->email      = $request->input('email');
            $user->identifier = $request->input('identifier');
            if ($request->filled('password')) {
                $user->password = bcrypt($request->input('password'));
            }
            $user->role  = $request->input('role');
            $user->phone = $request->input('phone');
            $user->save();

            if ($request->input('role') === 'mahasiswa') {
                $user->mahasiswa()->updateOrCreate(
                    ['user_id' => $user->id],
                    [
                        'faculty' => $request->input('faculty'),
                        'year'    => $request->input('year'),
                    ]
                );
            } elseif ($request->input('role') === 'dosen') {
                $user->dosen()->updateOrCreate(
                    ['user_id' => $user->id],
                    ['faculty' => $request->input('faculty')]
                );
            } else {
                $user->mahasiswa()->delete();
                $user->dosen()->delete();
            }

            DB::commit();

            return redirect()->back()->with('success', 'User berhasil diperbarui');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                ->withErrors(['error' => 'Terjadi kesalahan saat memperbarui user']);
        }
    }

}
