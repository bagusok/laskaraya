<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\userController;
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


Route::group(['prefix' => 'dashboard'], function () {
    Route::get('/', function () {
        return Inertia::render('dashboard/admin/admin'); // Point to your Dashboard.tsx
    })->name('dashboard');

 });
 Route::group(['prefix' => 'users'], function () {
    Route::get('/', [userController::class, 'index'])->name('users.index');
    Route::get('/add', [userController::class, 'create'])->name('users.add');
    Route::get('/{user}/edit', [userController::class, 'edit'])->name('users.edit');
    Route::get('/{user}/delete', [userController::class, 'delete'])->name('users.delete');
    Route::delete('/{user}', [userController::class, 'destroy'])->name('users.destroy');
 });

