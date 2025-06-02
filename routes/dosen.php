<?php

use App\Http\Controllers\dosen\DosenCompetitionController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DosenController;

Route::group(['prefix' => 'dosen', 'middleware' => ['auth']], function () {
    Route::group(['prefix' => 'competitions', 'middleware' => ['role:dosen']], function () {
        Route::get('/', [DosenCompetitionController::class, 'index'])->name('dosen.competitions.index');
        Route::get('/get-all', [DosenCompetitionController::class, 'getAllCompetitions'])->name('dosen.competitions.getAll');
        Route::get('/create', [DosenCompetitionController::class, 'create'])->name('dosen.competitions.create');
        Route::post('/create', [DosenCompetitionController::class, 'postCreate'])->name('dosen.competitions.create.post');
        Route::get('/edit/{id}', [DosenCompetitionController::class, 'edit'])->name('dosen.competitions.edit');
        Route::post('/edit/{id}', [DosenCompetitionController::class, 'update'])->name('dosen.competitions.edit.post');
        Route::delete('/{id}', [DosenCompetitionController::class, 'destroy'])->name('dosen.competitions.destroy');
    });

    Route::get('/mahasiswa-bimbingan', [DosenController::class, 'mahasiswaBimbingan'])->name('dosen.bimbingan');
});
