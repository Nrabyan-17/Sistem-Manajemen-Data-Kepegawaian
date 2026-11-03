<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Pegawai extends Model
{
    use HasFactory;

    protected $table = 'pegawai';

    protected $fillable = [
        'nama',
        'jenis_kelamin',
        'pendidikan_terakhir',
        'tanggal_lahir',
        'team_id',
    ];

    protected $casts = [
        'tanggal_lahir' => 'date',
    ];

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    /**
     * Hitung usia berdasarkan tanggal lahir.
     */
    public function getUsiaAttribute(): int
    {
        return $this->tanggal_lahir->age;
    }
}

