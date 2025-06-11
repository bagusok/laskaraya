<?php

use App\Http\Controllers\admin\AdminAchievementController;
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

        Route::get('/{id}/add-team', [AdminCompetitionController::class, 'addTeam'])->name('admin.competitions.addTeam');
        Route::post('/{id}/add-team', [AdminCompetitionController::class, 'postAddTeam'])->name('admin.competitions.addTeam.post');
        Route::get('/{id}/topsis', [AdminCompetitionController::class, 'topsisDetail'])->name('admin.competitions.topsis');

        Route::delete('/{id}', [AdminCompetitionController::class, 'destroy'])->name('admin.competitions.destroy');
    });

    Route::group(['prefix' => 'teams', 'middleware' => ['role:admin']], function () {
        // Route::get('/', [TeamTeamController::class, 'index'])->name('team.teams.index');
        Route::get('/edit/{id}', [AdminTeamController::class, 'edit'])->name('admin.teams.edit');
        Route::post('/edit', [AdminTeamController::class, 'postEdit'])->name('admin.teams.edit.post');
        Route::get('/detail/{id}', [AdminTeamController::class, 'detail'])->name('admin.teams.detail');
        Route::get('/detail/{id}/logs', [AdminTeamController::class, 'logs'])->name('admin.teams.logs');

        Route::post('/response/{id}', [AdminTeamController::class, 'responseTeam'])->name('admin.teams.response');

        Route::delete('/{id}', [AdminTeamController::class, 'destroy'])->name('admin.teams.destroy');
        Route::get('/get-all', [AdminTeamController::class, 'getAllTeams'])->name('admin.teams.getAll');
    });

    Route::group(['prefix' => 'achievements', 'middleware' => ['role:admin']], function () {
        Route::get('/', [AdminAchievementController::class, 'index'])->name('admin.achievements.index');
        Route::get('/get-all', [AdminAchievementController::class, 'getAllAchievements'])->name('admin.achievements.getAll');
        Route::get('/create', [AdminAchievementController::class, 'createWithCompletedCompetition'])->name('admin.achievements.create');
        Route::post('/create', [AdminAchievementController::class, 'postCreateWithCompletedCompetition'])->name('admin.achievements.create.post');
        Route::delete('/delete/{id}', [AdminAchievementController::class, 'destroy'])->name('admin.achievements.destroy');

        Route::get('/detail/{id}', [AdminAchievementController::class, 'detail'])->name('admin.achievements.detail');
        Route::post('/response/{id}', [AdminAchievementController::class, 'responseAchievement'])->name('admin.achievements.response');

        Route::get('/export-excel', [AdminAchievementController::class, 'exportExcel'])->name('admin.achievements.exportExcel');
        Route::get('test', [AdminAchievementController::class, 'testSPK'])->name('admin.achievements.test');
    });
});
