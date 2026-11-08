<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LaporanController;
use App\Http\Controllers\PegawaiController;
use App\Http\Controllers\Teams\TeamInvitationController;
use App\Http\Middleware\EnsureTeamMembership;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    if (auth()->check()) {
        $user = auth()->user();
        if ($user->currentTeam) {
            return redirect()->route('dashboard', $user->currentTeam->slug);
        }
    }

    return redirect()->route('login');
})->name('home');

Route::prefix('{current_team}')
    ->middleware(['auth', 'verified', EnsureTeamMembership::class])
    ->group(function () {
        Route::get('dashboard', DashboardController::class)->name('dashboard');

        // Manajemen Data Pegawai
        Route::get('pegawai', [PegawaiController::class, 'index'])->name('pegawai.index');
        Route::post('pegawai', [PegawaiController::class, 'store'])->name('pegawai.store');
        Route::put('pegawai/{pegawai}', [PegawaiController::class, 'update'])->name('pegawai.update');
        Route::delete('pegawai/{pegawai}', [PegawaiController::class, 'destroy'])->name('pegawai.destroy');

        // Laporan & Ekspor Data (PDF & Excel)
        Route::get('laporan', [LaporanController::class, 'index'])->name('laporan.index');
        Route::get('laporan/excel', [LaporanController::class, 'exportExcel'])->name('laporan.excel');
        Route::get('laporan/pdf', [LaporanController::class, 'previewPdf'])->name('laporan.pdf');
    });

Route::middleware(['auth'])->group(function () {
    Route::post('invitations/{invitation}/accept', [TeamInvitationController::class, 'accept'])->name('invitations.accept');
    Route::delete('invitations/{invitation}', [TeamInvitationController::class, 'decline'])->name('invitations.decline');
});

require __DIR__.'/settings.php';
