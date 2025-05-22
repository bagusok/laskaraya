<?php

use App\Http\Controllers\admin\AdminCompetitionController;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'admin', 'middleware' => ['auth']], function () {
    Route::group(['prefix' => 'competitions', 'middleware' => ['role:admin']], function () {
        Route::get('/', [AdminCompetitionController::class, 'index'])->name('admin.competitions.index');
        Route::get('/get-all', [AdminCompetitionController::class, 'getAllCompetitions'])->name('admin.competitions.getAll');
        Route::get('/create', [AdminCompetitionController::class, 'create'])->name('admin.competitions.create');
        Route::post('/create', [AdminCompetitionController::class, 'postCreate'])->name('admin.competitions.create.post');
        Route::get('/edit/{id}', [AdminCompetitionController::class, 'edit'])->name('admin.competitions.edit');
        Route::post('/edit/{id}', [AdminCompetitionController::class, 'update'])->name('admin.competitions.edit.post');
        Route::delete('/{id}', [AdminCompetitionController::class, 'destroy'])->name('admin.competitions.destroy');
    });
});
