<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
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
    Route::get('/profile/edit', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::put('/profile/update', [ProfileController::class, 'update'])->name('profile.update');
});
