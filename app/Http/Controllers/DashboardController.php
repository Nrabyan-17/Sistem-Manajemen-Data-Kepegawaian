<?php

namespace App\Http\Controllers;

use App\Models\Pegawai;
use App\Models\TeamInvitation;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();
        $email = strtolower($user->email);
        
        $team = $user->currentTeam;
        if (! $team) {
            $teamRoute = $request->route('current_team');
            $team = $teamRoute instanceof \App\Models\Team
                ? $teamRoute
                : \App\Models\Team::where('slug', $teamRoute)->first();
        }

        $teamId = $team?->id;

        $pendingInvitations = TeamInvitation::query()
            ->with(['inviter', 'team'])
            ->whereRaw('LOWER(email) = ?', [$email])
            ->whereNull('accepted_at')
            ->where(fn ($query) => $query
                ->whereNull('expires_at')
                ->orWhere('expires_at', '>=', now()))
            ->latest()
            ->get()
            ->map(fn (TeamInvitation $invitation) => [
                'code' => $invitation->code,
                'inviterName' => $invitation->inviter->name,
                'team' => [
                    'name' => $invitation->team->name,
                    'slug' => $invitation->team->slug,
                ],
            ]);

        // Ambil data pegawai milik team saat ini
        $pegawaiQuery = Pegawai::where('team_id', $teamId);

        // Total pegawai
        $totalPegawai = $pegawaiQuery->count();

        // Data grafik jenis kelamin
        $genderData = Pegawai::where('team_id', $teamId)
            ->select('jenis_kelamin', DB::raw('count(*) as jumlah'))
            ->groupBy('jenis_kelamin')
            ->get()
            ->map(fn ($item) => [
                'name' => $item->jenis_kelamin,
                'value' => (int) $item->jumlah,
            ])
            ->values()
            ->toArray();

        // Data grafik pendidikan terakhir
        $pendidikanData = Pegawai::where('team_id', $teamId)
            ->select('pendidikan_terakhir', DB::raw('count(*) as jumlah'))
            ->groupBy('pendidikan_terakhir')
            ->orderByRaw("CASE pendidikan_terakhir
                WHEN 'SMA/SMK' THEN 1
                WHEN 'D3' THEN 2
                WHEN 'S1' THEN 3
                WHEN 'S2' THEN 4
                WHEN 'S3' THEN 5
                ELSE 6
            END")
            ->get()
            ->map(fn ($item) => [
                'name' => $item->pendidikan_terakhir,
                'value' => (int) $item->jumlah,
            ])
            ->values()
            ->toArray();

        // Data grafik usia
        $pegawaiUsia = Pegawai::where('team_id', $teamId)->get()
            ->map(fn ($p) => abs($p->usia));

        $usiaGroups = [
            '20-25' => 0,
            '26-30' => 0,
            '31-35' => 0,
            '36-40' => 0,
            '41-45' => 0,
            '46-50' => 0,
            '> 50' => 0,
        ];

        foreach ($pegawaiUsia as $usia) {
            if ($usia <= 25) {
                $usiaGroups['20-25']++;
            } elseif ($usia <= 30) {
                $usiaGroups['26-30']++;
            } elseif ($usia <= 35) {
                $usiaGroups['31-35']++;
            } elseif ($usia <= 40) {
                $usiaGroups['36-40']++;
            } elseif ($usia <= 45) {
                $usiaGroups['41-45']++;
            } elseif ($usia <= 50) {
                $usiaGroups['46-50']++;
            } else {
                $usiaGroups['> 50']++;
            }
        }

        $usiaData = collect($usiaGroups)
            ->map(fn ($value, $key) => ['name' => $key, 'value' => $value])
            ->values()
            ->toArray();

        // Hitung rata-rata usia
        $avgUsia = $pegawaiUsia->count() > 0
            ? round($pegawaiUsia->avg(), 1)
            : 0;

        return Inertia::render('dashboard', [
            'pendingInvitations' => $pendingInvitations,
            'totalPegawai' => $totalPegawai,
            'genderData' => $genderData,
            'pendidikanData' => $pendidikanData,
            'usiaData' => $usiaData,
            'avgUsia' => $avgUsia,
        ]);
    }
}
