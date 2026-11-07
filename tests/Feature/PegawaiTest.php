<?php

use App\Models\Pegawai;
use App\Models\User;

it('updates a pegawai through the team-prefixed route', function () {
    $user = User::factory()->create();
    $team = $user->currentTeam;
    $pegawai = Pegawai::factory()->create(['team_id' => $team->id]);

    $response = $this
        ->actingAs($user)
        ->put(route('pegawai.update', [
            'current_team' => $team->slug,
            'pegawai' => $pegawai->id,
        ]), [
            'nama' => 'Nama Baru',
            'jenis_kelamin' => 'Perempuan',
            'pendidikan_terakhir' => 'S1',
            'tanggal_lahir' => '1990-01-01',
        ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('pegawai', [
        'id' => $pegawai->id,
        'nama' => 'Nama Baru',
    ]);
});

it('deletes a pegawai through the team-prefixed route', function () {
    $user = User::factory()->create();
    $team = $user->currentTeam;
    $pegawai = Pegawai::factory()->create(['team_id' => $team->id]);

    $response = $this
        ->actingAs($user)
        ->delete(route('pegawai.destroy', [
            'current_team' => $team->slug,
            'pegawai' => $pegawai->id,
        ]));

    $response->assertRedirect();
    $this->assertDatabaseMissing('pegawai', [
        'id' => $pegawai->id,
    ]);
});
