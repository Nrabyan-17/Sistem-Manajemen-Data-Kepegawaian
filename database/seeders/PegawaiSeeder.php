<?php

namespace Database\Seeders;

use App\Models\Pegawai;
use App\Models\Team;
use Illuminate\Database\Seeder;

class PegawaiSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ambil team pertama (personal team dari test user)
        $team = Team::first();

        if (! $team) {
            return;
        }

        // Buat 30 data pegawai contoh
        Pegawai::factory()
            ->count(30)
            ->for($team)
            ->create();
    }
}

