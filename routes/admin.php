<?php

use App\Http\Controllers\admin\AdminCompetitionController;
use App\Http\Controllers\admin\AdminTeamController;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'admin', 'middleware' => ['auth']], function () {
    Route::group(['prefix' => 'competitions', 'middleware' => ['role:admin']], function () {
        Route::get('/', [AdminCompetitionController::class, 'index'])->name('admin.competitions.index');
        Route::get('/get-all', [AdminCompetitionController::class, 'getAllCompetitions'])->name('admin.competitions.getAll');
        Route::get('/detail/{id}', [AdminCompetitionController::class, 'detail'])->name('admin.competitions.detail');
        Route::get('/create', [AdminCompetitionController::class, 'create'])->name('admin.competitions.create');
        Route::post('/create', [AdminCompetitionController::class, 'postCreate'])->name('admin.competitions.create.post');
        Route::get('/edit/{id}', [AdminCompetitionController::class, 'edit'])->name('admin.competitions.edit');
        Route::post('/edit/{id}', [AdminCompetitionController::class, 'update'])->name('admin.competitions.edit.post');

        Route::post('/response/{id}', [AdminCompetitionController::class, 'responseCompetition'])->name('admin.competitions.response');

        Route::delete('/{id}', [AdminCompetitionController::class, 'destroy'])->name('admin.competitions.destroy');
    });

    Route::group(['prefix' => 'teams', 'middleware' => ['role:admin']], function () {
        // Route::get('/', [TeamTeamController::class, 'index'])->name('team.teams.index');
        Route::get('/edit/{id}', [AdminTeamController::class, 'edit'])->name('admin.teams.edit');
        Route::post('/edit', [AdminTeamController::class, 'postEdit'])->name('admin.teams.edit.post');
        Route::get('/detail/{id}', [AdminTeamController::class, 'detail'])->name('admin.teams.detail');

        Route::post('/response/{id}', [AdminTeamController::class, 'responseTeam'])->name('admin.teams.response');

        Route::delete('/{id}', [AdminTeamController::class, 'destroy'])->name('admin.teams.destroy');
        Route::get('/get-all', [AdminTeamController::class, 'getAllTeams'])->name('admin.teams.getAll');
    });
});
