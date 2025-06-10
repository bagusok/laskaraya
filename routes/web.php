<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProgramStudiController;
use App\Http\Controllers\SkillController;
use App\Http\Controllers\DosenController;
use App\Http\Controllers\PeriodController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\dosen\DosenAchievementController;
use App\Http\Controllers\RecommendationController;
use App\Http\Controllers\mahasiswa\MahasiswaCompetitionController;
use App\Http\Controllers\ReportController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return Inertia::render('index');
})->name('index');

Route::group(['prefix' => 'auth'], function () {
    Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
    Route::post('/login', [AuthController::class, 'login'])->name('login.post');

    Route::get('/register', [AuthController::class, 'showRegisterForm'])->name('register');
    Route::post('/register', [AuthController::class, 'register'])->name('register.post');

    Route::get('/logout', [AuthController::class, 'logout'])->name('logout')->middleware('auth');
});

Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard')->middleware('auth');

Route::group(['prefix' => 'users', 'middleware' => ['auth', 'role:admin']], function () {
    Route::get('/', [UserController::class, 'index'])->name('users.index');
    Route::post('/add', [UserController::class, 'postCreate'])->name('users.create');

    Route::put('/edit/{id}', [UserController::class, 'postEdit'])->name('users.edit');
    Route::get('/edit/{id}', [UserController::class, 'editDetail'])->name('users.edit.detail');
    Route::delete('/{id}', [UserController::class, 'destroy'])->name('users.destroy');
});

// Profile routes
Route::middleware(['auth'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'show'])->name('profile.show');
    Route::get('/profile/edit', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::put('/profile/update', [ProfileController::class, 'update'])->name('profile.update');
});

Route::group(['prefix' => 'prodi', 'middleware' => ['auth', 'role:admin']], function () {
    Route::get('/', [ProgramStudiController::class, 'index'])->name('programStudi');
    Route::post('/add', [ProgramStudiController::class, 'store'])->name('prodi.create');
    Route::put('/edit/{id}', [ProgramStudiController::class, 'update'])->name('prodi.update');
    Route::delete('/{id}', [ProgramStudiController::class, 'destroy'])->name('prodi.destroy');
    Route::get('/{id}', [ProgramStudiController::class, 'show'])->name('prodi.detail');
});

Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/dashboard/skills', [SkillController::class, 'index'])->name('skills.index');
    Route::post('/dashboard/skills', [SkillController::class, 'store'])->name('skills.store');
    Route::put('/dashboard/skills/{id}', [SkillController::class, 'update'])->name('skills.update');
    Route::delete('/dashboard/skills/{id}', [SkillController::class, 'destroy'])->name('skills.destroy');

});

// CRUD Skill untuk dosen
Route::middleware(['auth', 'role:dosen'])->prefix('dashboard/dosen/skills')->group(function () {
    Route::get('/', [SkillController::class, 'indexDosen'])->name('dosen.skills.index');
    Route::post('/', [SkillController::class, 'storeDosen'])->name('dosen.skills.store');
    Route::put('/{id}', [SkillController::class, 'updateDosen'])->name('dosen.skills.update');
    Route::delete('/{id}', [SkillController::class, 'destroyDosen'])->name('dosen.skills.destroy');
});

Route::middleware(['auth', 'role:dosen'])->group(function () {
    Route::get('/dashboard/dosen/achievements', [DosenAchievementController::class, 'index'])->name('dosen.achievements.index');
    Route::get('/dashboard/dosen/achievements/{id}', [DosenAchievementController::class, 'show'])->name('dosen.achievements.show');
    Route::post('/dashboard/dosen/achievements/{id}/status', [DosenAchievementController::class, 'updateStatus'])->name('dosen.achievements.updateStatus');
});

Route::group(['prefix' => 'bimbingan', 'middleware' => ['auth', 'role:dosen']], function () {
    Route::get('/', [DosenController::class, 'index'])->name('dosen.bimbingan');
    Route::post('/', [DosenController::class, 'create'])->name('dosen.bimbingan.create');
    Route::get('/{id}', [DosenController::class, 'show'])->name('dosen.bimbingan.show');
    Route::put('/{id}', [DosenController::class, 'update'])->name('dosen.bimbingan.update');
    Route::delete('/{id}', [DosenController::class, 'destroy'])->name('dosen.bimbingan.destroy');
    Route::post('/{id}/status', [DosenController::class, 'updateStatus'])->name('dosen.bimbingan.status');
});

Route::prefix('period')->group(function () {
    Route::get('/', [PeriodController::class, 'index'])->name('period');
    Route::post('/', [PeriodController::class, 'store'])->name('period.store');
    Route::put('/{id}', [PeriodController::class, 'update'])->name('period.update');
    Route::delete('/{id}', [PeriodController::class, 'destroy'])->name('period.destroy');
    Route::get('/{id}', [PeriodController::class, 'show'])->name('period.show');
});

//CRUD untuk skill mahasiswa
Route::middleware(['auth', 'role:mahasiswa'])->prefix('dashboard/mahasiswa/skills')->group(function () {
    Route::get('/', [SkillController::class, 'indexMahasiswa'])->name('mahasiswa.skills.index');
    Route::post('/', [SkillController::class, 'storeMahasiswa'])->name('mahasiswa.skills.store');
    Route::put('/{id}', [SkillController::class, 'updateMahasiswa'])->name('mahasiswa.skills.update');
    Route::delete('/{id}', [SkillController::class, 'destroyMahasiswa'])->name('mahasiswa.skills.destroy');
});

// Routes untuk Admin
Route::prefix('dashboard/admin/categories')->middleware(['auth'])->group(function () {
    Route::get('/', [CategoryController::class, 'index'])->name('admin.categories.index');
    Route::post('/', [CategoryController::class, 'store'])->name('admin.categories.store');
    Route::put('/{id}', [CategoryController::class, 'update'])->name('admin.categories.update');
    Route::delete('/{id}', [CategoryController::class, 'destroy'])->name('admin.categories.destroy');
});

// Routes untuk Dosen
Route::prefix('dashboard/dosen/categories')->middleware(['auth'])->group(function () {
    Route::get('/', [CategoryController::class, 'indexDosen'])->name('dosen.categories.index');
    Route::post('/', [CategoryController::class, 'storeDosen'])->name('dosen.categories.store');
    Route::put('/{id}', [CategoryController::class, 'updateDosen'])->name('dosen.categories.update');
    Route::delete('/{id}', [CategoryController::class, 'destroyDosen'])->name('dosen.categories.destroy');
});

// Routes untuk Mahasiswa
Route::prefix('dashboard/mahasiswa/categories')->middleware(['auth'])->group(function () {
    Route::get('/', [CategoryController::class, 'indexMahasiswa'])->name('mahasiswa.categories.index');
    Route::post('/', [CategoryController::class, 'storeMahasiswa'])->name('mahasiswa.categories.store');
    Route::put('/{id}', [CategoryController::class, 'updateMahasiswa'])->name('mahasiswa.categories.update');
    Route::delete('/{id}', [CategoryController::class, 'destroyMahasiswa'])->name('mahasiswa.categories.destroy');
});

//Route admin
Route::middleware(['auth', 'role:admin'])->group(function () {
        Route::get('/admin/recommendations', [RecommendationController::class, 'index'])
            ->name('admin.recommendations.index');

        // Route untuk mendapatkan rekomendasi berdasarkan kompetisi (AJAX)
        Route::get('/admin/recommendations/get', [RecommendationController::class, 'getRecommendations'])
            ->name('admin.recommendations.get');

        // Route untuk halaman analisis detail (GET request)
        Route::get('/admin/recommendations/analysis', [RecommendationController::class, 'showAnalysis'])
            ->name('admin.recommendations.analysis');

        // Route untuk mendapatkan analisis detail mahasiswa (AJAX - if needed)
        Route::get('/admin/recommendations/analysis/data', [RecommendationController::class, 'getDetailedAnalysis'])
            ->name('admin.recommendations.analysis.data');

        // Route untuk export CSV
        Route::get('/admin/recommendations/export', [RecommendationController::class, 'exportRecommendations'])
            ->name('admin.recommendations.export');

        // Reports routes - perbaikan yang perlu ditambahkan
        Route::get('admin.reports', [ReportController::class, 'showReportsPage'])->name('admin.reports.index');
        Route::get('admin.reports.data', [ReportController::class, 'index'])->name('admin.reports.data');
        Route::get('admin.reports.filters', [ReportController::class, 'getFilters'])->name('admin.reports.filters');
        Route::get('admin.reports.export', [ReportController::class, 'export'])->name('admin.reports.export');
        Route::get('/admin/reports/download/{filename}', [ReportController::class, 'downloadReport'])->name('admin.reports.download');
});

Route::get('/dashboard/dosen', [DosenController::class, 'index'])->name('dashboard.dosen');

include __DIR__ . '/admin.php';
include __DIR__ . '/mahasiswa.php';
include __DIR__ . '/dosen.php';
