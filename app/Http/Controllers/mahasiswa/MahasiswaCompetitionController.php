<?php

namespace App\Http\Controllers\mahasiswa;

use App\Http\Controllers\Controller;
use App\Models\CategoryModel;
use App\Models\CompetitionModel;
use App\Models\PeriodModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Intervention\Image\Laravel\Facades\Image;

class MahasiswaCompetitionController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        $pending = CompetitionModel::where('verified_status', 'pending')->count();
        $ongoing = CompetitionModel::where([
            'status' => 'ongoing',
            'verified_status' => 'verified'
        ])->count();
        $completed = CompetitionModel::where([
            'status' => 'completed',
            'verified_status' => 'verified'
        ])->count();

        $total = CompetitionModel::count();

        switch ($user->role) {
            case 'admin':
                return Inertia::render('dashboard/admin/competitions/index')->with([
                    'ongoing' => $ongoing,
                    'pending' => $pending,
                    'completed' => $completed,
                    'total' => $total,
                ]);
            case 'dosen':
                return redirect()->route('dosen.dashboard');
            case 'mahasiswa':
                return redirect()->route('mahasiswa.dashboard');
            default:
                return redirect()->route('index');
        }
    }

    public function create()
    {
        $user = auth()->user();
        $categories = CategoryModel::all();
        $periods = PeriodModel::orderBy('year', 'desc')->get();

        switch ($user->role) {
            case 'admin':
                return Inertia::render('dashboard/admin/competitions/addCompetition')->with([
                    'categories' => $categories,
                    'periods' => $periods,
                ]);
            case 'dosen':
                return redirect()->route('dosen.dashboard');
            case 'mahasiswa':
                return redirect()->route('mahasiswa.dashboard');
            default:
                return redirect()->route('index');
        }
    }

    public function getAllCompetitions(Request $request)
    {
        $perPage = $request->query('limit', 10);
        $status = $request->query('status', null);
        $verif_status = $request->query('verif_status', null);
        $searchQuery = $request->query('search', null);

        $request->validate([
            'limit' => 'integer|min:1|max:100',
            'status' => 'in:ongoing,completed,canceled',
            'verif_status' => 'in:pending,verified,rejected',
            'search' => 'string|max:255',
        ]);

        $competitions = CompetitionModel::with(['category', 'period'])
            ->when($status, function ($query) use ($status) {
                return $query->where('status', $status);
            })
            ->when($verif_status, function ($query) use ($verif_status) {
                return $query->where('verified_status', $verif_status);
            })
            ->when($searchQuery, function ($query) use ($searchQuery) {
                return $query->where('name', 'like', '%' . $searchQuery . '%');
            })
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return response()->json([
            'status' => 'success',
            'message' => 'List of competitions',
            'data' => $competitions->items(),
            'pagination' => [
                'current_page' => $competitions->currentPage(),
                'last_page' => $competitions->lastPage(),
                'per_page' => $competitions->perPage(),
                'total' => $competitions->total(),
                'total_pages' => $competitions->total() / $competitions->perPage(),
                'has_more_pages' => $competitions->hasMorePages(),
            ],
        ]);
    }

    public function postCreate(Request $request)
    {
        $user = auth()->user();

        $request->validate([
            'name' => 'required|string|min:3|max:255',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp,avif|max:2048',
            'author' => 'required|string|min:3|max:255',
            'level' => 'required|in:1,2,3,4,5',
            'status' => 'required|in:ongoing,completed,canceled',
            'category_id' => 'required',
            'period_id' => 'required',
            'description' => 'required',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
        ]);

        $image = $request->file('image');
        $webp_image = Image::read($image)->toWebp();
        $filename = hash('sha256', \Illuminate\Support\Str::uuid()) . '.webp';

        Storage::put('public/competition_posters/' . $filename, $webp_image);

        $competition = CompetitionModel::create([
            'name' => $request->name,
            'image' => $filename,
            'author' => $request->author,
            'level' => $request->level,
            'status' => $request->status,
            'verified_status' => 'pending',
            'category_id' => $request->category_id,
            'period_id' => $request->period_id,
            'description' => $request->description,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
        ]);

        if (!$competition) {
            return back()->with('error', 'Failed to create competition.');
        }

        return redirect()->route('competitions.index')->with('success', 'Competition created successfully.');
    }

    public function edit($id)
    {
        $user = auth()->user();
        $competition = CompetitionModel::findOrFail($id);
        $categories = CategoryModel::all();
        $periods = PeriodModel::orderBy('year', 'desc')->get();

        if (!$competition) {
            return back()->with('error', 'Competition not found.');
        }

        switch ($user->role) {
            case 'admin':
                return Inertia::render('dashboard/admin/competitions/editCompetition')->with([
                    'competition' => $competition,
                    'categories' => $categories,
                    'periods' => $periods,
                ]);
            case 'dosen':
                return redirect()->route('dosen.dashboard');
            case 'mahasiswa':
                return redirect()->route('mahasiswa.dashboard');
            default:
                return redirect()->route('index');
        }
    }

    public function update($id, Request $request)
    {
        $user = auth()->user();

        $request->validate([
            'name' => 'required|string|min:3|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp,avif|max:2048', // image opsional saat update
            'author' => 'required|string|min:3|max:255',
            'level' => 'required|in:1,2,3,4,5',
            'status' => 'required|in:ongoing,completed,canceled',
            'category_id' => 'required',
            'period_id' => 'required',
            'description' => 'required',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
        ]);

        $competition = CompetitionModel::findOrFail($id);

        // Jika ada file gambar baru
        if ($request->hasFile('image')) {
            // Hapus gambar lama jika ada
            if ($competition->image && Storage::exists('public/competition_posters/' . $competition->image)) {
                Storage::delete('public/competition_posters/' . $competition->image);
            }

            $image = $request->file('image');
            $webp_image = Image::read($image)->toWebp();
            $filename = hash('sha256', \Illuminate\Support\Str::uuid()) . '.webp';
            Storage::put('public/competition_posters/' . $filename, $webp_image);

            $competition->image = $filename;
        }

        // Update data lainnya
        $competition->name = $request->name;
        $competition->author = $request->author;
        $competition->level = $request->level;
        $competition->status = $request->status;
        $competition->category_id = $request->category_id;
        $competition->period_id = $request->period_id;
        $competition->description = $request->description;
        $competition->start_date = $request->start_date;
        $competition->end_date = $request->end_date;

        $competition->save();

        return redirect()->route('competitions.index')->with('success', 'Competition updated successfully.');
    }

    public function destroy($id)
    {
        $user = auth()->user();

        if ($user->role !== 'admin') {
            return redirect()->route('index')->with('error', 'Unauthorized access.');
        }

        $competition = CompetitionModel::findOrFail($id);

        if (!$competition) {
            return back()->withErrors(['error' => 'Competition not found.']);
        }

        if ($competition->image) {
            Storage::delete('public/competition_posters/' . $competition->image);
        }

        $competition->delete();

        return redirect()->route('competitions.index')->with('success', 'Competition deleted successfully.');
    }
}
