<?php

use App\Http\Controllers\mahasiswa\MahasiswaAchievementController;
use App\Http\Controllers\mahasiswa\MahasiswaCompetitionController;
use App\Http\Controllers\mahasiswa\MahasiswaTeamController;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'mahasiswa', 'middleware' => ['auth']], function () {
    Route::group(['prefix' => 'competitions', 'middleware' => ['role:mahasiswa']], function () {
        Route::get('/', [MahasiswaCompetitionController::class, 'index'])->name('mahasiswa.competitions.index');
        Route::get('/get-all', [MahasiswaCompetitionController::class, 'getAllCompetitions'])->name('mahasiswa.competitions.getAll');
        Route::get('/create', [MahasiswaCompetitionController::class, 'create'])->name('mahasiswa.competitions.create');
        Route::post('/create', [MahasiswaCompetitionController::class, 'postCreate'])->name('mahasiswa.competitions.create.post');
        Route::get('/edit/{id}', [MahasiswaCompetitionController::class, 'edit'])->name('mahasiswa.competitions.edit');
        Route::post('/edit/{id}', [MahasiswaCompetitionController::class, 'update'])->name('mahasiswa.competitions.edit.post');
        Route::delete('/{id}', [MahasiswaCompetitionController::class, 'destroy'])->name('mahasiswa.competitions.destroy');

        Route::post('/join', [MahasiswaCompetitionController::class, 'postJoin'])->name('mahasiswa.competitions.join.post');
        Route::get('/join/{id}', [MahasiswaCompetitionController::class, 'join'])->name('mahasiswa.competitions.join');
    });

    Route::group(['prefix' => 'teams', 'middleware' => ['role:mahasiswa']], function () {
        // Route::get('/', [MahasiswaTeamController::class, 'index'])->name('mahasiswa.teams.index');
        Route::get('/edit/{id}', [MahasiswaTeamController::class, 'edit'])->name('mahasiswa.teams.edit');
        Route::post('/edit', [MahasiswaTeamController::class, 'postEdit'])->name('mahasiswa.teams.edit.post');
        Route::delete('/{id}', [MahasiswaTeamController::class, 'destroy'])->name('mahasiswa.teams.destroy');
        Route::get('/get-all', [MahasiswaTeamController::class, 'getAllTeams'])->name('mahasiswa.teams.getAll');

        Route::get('/{id}/achievement', [MahasiswaAchievementController::class, 'create'])->name('mahasiswa.teams.achievement.create');
        Route::post('/achievement', [MahasiswaAchievementController::class, 'postCreate'])->name('mahasiswa.teams.achievement.create.post');
    });
});
