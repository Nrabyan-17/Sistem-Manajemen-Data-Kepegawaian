<?php

namespace App\Http\Controllers;

use App\Models\Pegawai;
use App\Models\Team;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PegawaiController extends Controller
{
    /**
     * Resolve the current team for the user.
     */
    protected function resolveTeam(Request $request): Team
    {
        $user = $request->user();
        $team = $user->currentTeam;

        if (! $team) {
            $teamRoute = $request->route('current_team');
            $team = $teamRoute instanceof Team
                ? $teamRoute
                : Team::where('slug', $teamRoute)->firstOrFail();
        }

        return $team;
    }

    /**
     * Display a listing of pegawai.
     */
    public function index(Request $request): Response
    {
        $team = $this->resolveTeam($request);

        $search = $request->input('search');
        $gender = $request->input('gender');
        $pendidikan = $request->input('pendidikan');

        $query = Pegawai::where('team_id', $team->id);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(nama) LIKE ?', ['%'.strtolower($search).'%']);
            });
        }

        if ($gender && in_array($gender, ['Laki-laki', 'Perempuan'])) {
            $query->where('jenis_kelamin', $gender);
        }

        if ($pendidikan) {
            $query->where('pendidikan_terakhir', $pendidikan);
        }

        $pegawai = $query->latest()
            ->paginate(10)
            ->withQueryString()
            ->through(function (Pegawai $item) {
                return [
                    'id' => $item->id,
                    'nama' => $item->nama,
                    'jenis_kelamin' => $item->jenis_kelamin,
                    'pendidikan_terakhir' => $item->pendidikan_terakhir,
                    'tanggal_lahir' => $item->tanggal_lahir->format('Y-m-d'),
                    'tanggal_lahir_formatted' => $item->tanggal_lahir->translatedFormat('d F Y'),
                    'usia' => $item->usia,
                    'created_at' => $item->created_at->format('d/m/Y H:i'),
                ];
            });

        return Inertia::render('pegawai/index', [
            'pegawai' => $pegawai,
            'filters' => [
                'search' => $search ?? '',
                'gender' => $gender ?? '',
                'pendidikan' => $pendidikan ?? '',
            ],
            'pendidikanOptions' => ['SMA/SMK', 'D3', 'S1', 'S2', 'S3'],
            'genderOptions' => ['Laki-laki', 'Perempuan'],
        ]);
    }

    /**
     * Store a newly created pegawai in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $team = $this->resolveTeam($request);

        $validated = $request->validate([
            'nama' => ['required', 'string', 'max:255'],
            'jenis_kelamin' => ['required', 'in:Laki-laki,Perempuan'],
            'pendidikan_terakhir' => ['required', 'in:SMA/SMK,D3,S1,S2,S3'],
            'tanggal_lahir' => ['required', 'date', 'before:today'],
        ], [
            'nama.required' => 'Nama pegawai wajib diisi.',
            'jenis_kelamin.required' => 'Pilih jenis kelamin.',
            'jenis_kelamin.in' => 'Pilihan jenis kelamin tidak valid.',
            'pendidikan_terakhir.required' => 'Pilih jenjang pendidikan terakhir.',
            'pendidikan_terakhir.in' => 'Pilihan pendidikan terakhir tidak valid.',
            'tanggal_lahir.required' => 'Tanggal lahir wajib diisi.',
            'tanggal_lahir.date' => 'Format tanggal lahir tidak valid.',
            'tanggal_lahir.before' => 'Tanggal lahir harus sebelum hari ini.',
        ]);

        $team->pegawai()->create($validated);

        return back()->with('success', 'Data pegawai berhasil ditambahkan.');
    }

    /**
     * Update the specified pegawai in storage.
     */
    public function update(Request $request, string $current_team, Pegawai $pegawai): RedirectResponse
    {
        $team = $this->resolveTeam($request);

        abort_if($pegawai->team_id !== $team->id, 403);

        $validated = $request->validate([
            'nama' => ['required', 'string', 'max:255'],
            'jenis_kelamin' => ['required', 'in:Laki-laki,Perempuan'],
            'pendidikan_terakhir' => ['required', 'in:SMA/SMK,D3,S1,S2,S3'],
            'tanggal_lahir' => ['required', 'date', 'before:today'],
        ], [
            'nama.required' => 'Nama pegawai wajib diisi.',
            'jenis_kelamin.required' => 'Pilih jenis kelamin.',
            'jenis_kelamin.in' => 'Pilihan jenis kelamin tidak valid.',
            'pendidikan_terakhir.required' => 'Pilih jenjang pendidikan terakhir.',
            'pendidikan_terakhir.in' => 'Pilihan pendidikan terakhir tidak valid.',
            'tanggal_lahir.required' => 'Tanggal lahir wajib diisi.',
            'tanggal_lahir.date' => 'Format tanggal lahir tidak valid.',
            'tanggal_lahir.before' => 'Tanggal lahir harus sebelum hari ini.',
        ]);

        $pegawai->update($validated);

        return back()->with('success', 'Data pegawai berhasil diperbarui.');
    }

    /**
     * Remove the specified pegawai from storage.
     */
    public function destroy(Request $request, string $current_team, Pegawai $pegawai): RedirectResponse
    {
        $team = $this->resolveTeam($request);

        abort_if($pegawai->team_id !== $team->id, 403);

        $pegawai->delete();

        return back()->with('success', 'Data pegawai berhasil dihapus.');
    }
}

