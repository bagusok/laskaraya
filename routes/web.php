<?php


use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProgramStudiController;
use App\Http\Controllers\SkillController;
use App\Http\Controllers\DosenController;
use App\Http\Controllers\PeriodController;
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
    // (opsional) Route::get('/edit/{id}', [ProgramStudiController::class, 'edit'])->name('prodi.edit');
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


Route::group(['prefix' => 'bimbingan', 'middleware' => ['auth', 'role:dosen']], function () {
    Route::get('/', [DosenController::class, 'index'])->name('dosen.bimbingan');
    Route::post('/', [DosenController::class, 'create'])->name('dosen.bimbingan.create');
    Route::get('/{id}', [DosenController::class, 'show'])->name('dosen.bimbingan.show');
    Route::put('/{id}', [DosenController::class, 'update'])->name('dosen.bimbingan.update');
    Route::delete('/{id}', [DosenController::class, 'destroy'])->name('dosen.bimbingan.destroy');
});

Route::prefix('period')->group(function () {
    Route::get('/', [PeriodController::class, 'index'])->name('period');
    Route::post('/', [PeriodController::class, 'store'])->name('period.store');
    Route::put('/{id}', [PeriodController::class, 'update'])->name('period.update');
    Route::delete('/{id}', [PeriodController::class, 'destroy'])->name('period.destroy');
    Route::get('/{id}', [PeriodController::class, 'show'])->name('period.show');
});


include __DIR__ . '/admin.php';
include __DIR__ . '/mahasiswa.php';
include __DIR__ . '/dosen.php';
