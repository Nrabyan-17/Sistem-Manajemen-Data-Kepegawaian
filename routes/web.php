<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PegawaiController;
use App\Http\Controllers\Teams\TeamInvitationController;
use App\Http\Middleware\EnsureTeamMembership;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::prefix('{current_team}')
    ->middleware(['auth', 'verified', EnsureTeamMembership::class])
    ->group(function () {
        Route::get('dashboard', DashboardController::class)->name('dashboard');

        // Manajemen Data Pegawai
        Route::get('pegawai', [PegawaiController::class, 'index'])->name('pegawai.index');
        Route::post('pegawai', [PegawaiController::class, 'store'])->name('pegawai.store');
        Route::put('pegawai/{pegawai}', [PegawaiController::class, 'update'])->name('pegawai.update');
        Route::delete('pegawai/{pegawai}', [PegawaiController::class, 'destroy'])->name('pegawai.destroy');
    });

Route::middleware(['auth'])->group(function () {
    Route::post('invitations/{invitation}/accept', [TeamInvitationController::class, 'accept'])->name('invitations.accept');
    Route::delete('invitations/{invitation}', [TeamInvitationController::class, 'decline'])->name('invitations.decline');
});

require __DIR__.'/settings.php';
