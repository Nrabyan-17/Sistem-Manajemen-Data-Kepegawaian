<?php

namespace Database\Factories;

use App\Models\Pegawai;
use App\Models\Team;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Pegawai>
 */
class PegawaiFactory extends Factory
{
    protected $model = Pegawai::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $pendidikanOptions = ['SMA/SMK', 'D3', 'S1', 'S2', 'S3'];

        return [
            'nama' => fake('id_ID')->name(),
            'jenis_kelamin' => fake()->randomElement(['Laki-laki', 'Perempuan']),
            'pendidikan_terakhir' => fake()->randomElement($pendidikanOptions),
            'tanggal_lahir' => fake()->dateTimeBetween('-55 years', '-20 years')->format('Y-m-d'),
            'team_id' => Team::factory(),
        ];
    }
}

