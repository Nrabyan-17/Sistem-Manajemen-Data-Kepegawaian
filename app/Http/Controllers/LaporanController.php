<?php

namespace App\Http\Controllers;

use App\Models\Pegawai;
use App\Models\Team;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class LaporanController extends Controller
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
     * Build filtered pegawai query.
     */
    protected function getFilteredQuery(Request $request, int $teamId)
    {
        $search = $request->input('search');
        $gender = $request->input('gender');
        $pendidikan = $request->input('pendidikan');
        $usiaKategori = $request->input('usia');

        $query = Pegawai::where('team_id', $teamId);

        if ($search) {
            $query->whereRaw('LOWER(nama) LIKE ?', ['%'.strtolower($search).'%']);
        }

        if ($gender && in_array($gender, ['Laki-laki', 'Perempuan'])) {
            $query->where('jenis_kelamin', $gender);
        }

        if ($pendidikan) {
            $query->where('pendidikan_terakhir', $pendidikan);
        }

        if ($usiaKategori) {
            $now = Carbon::now();
            switch ($usiaKategori) {
                case '<25':
                    $query->where('tanggal_lahir', '>', $now->copy()->subYears(25));
                    break;
                case '25-35':
                    $query->whereBetween('tanggal_lahir', [
                        $now->copy()->subYears(35),
                        $now->copy()->subYears(25),
                    ]);
                    break;
                case '36-45':
                    $query->whereBetween('tanggal_lahir', [
                        $now->copy()->subYears(45),
                        $now->copy()->subYears(36),
                    ]);
                    break;
                case '46-55':
                    $query->whereBetween('tanggal_lahir', [
                        $now->copy()->subYears(55),
                        $now->copy()->subYears(46),
                    ]);
                    break;
                case '>55':
                    $query->where('tanggal_lahir', '<=', $now->copy()->subYears(56));
                    break;
            }
        }

        return $query;
    }

    /**
     * Halaman Utama Laporan Data Pegawai.
     */
    public function index(Request $request): Response
    {
        $team = $this->resolveTeam($request);
        $query = $this->getFilteredQuery($request, $team->id);

        $totalPegawai = (clone $query)->count();
        $totalLaki = (clone $query)->where('jenis_kelamin', 'Laki-laki')->count();
        $totalPerempuan = (clone $query)->where('jenis_kelamin', 'Perempuan')->count();

        // Ambil data dengan pagination untuk pratinjau
        $pegawaiList = (clone $query)->orderBy('nama', 'asc')->paginate(15)->withQueryString();

        $allPegawaiForAvg = (clone $query)->get();
        $avgUsia = $allPegawaiForAvg->count() > 0
            ? round($allPegawaiForAvg->avg(fn ($item) => $item->usia), 1)
            : 0;

        return Inertia::render('laporan/index', [
            'pegawai' => $pegawaiList,
            'summary' => [
                'total' => $totalPegawai,
                'laki' => $totalLaki,
                'perempuan' => $totalPerempuan,
                'avgUsia' => $avgUsia,
            ],
            'filters' => [
                'search' => $request->input('search', ''),
                'gender' => $request->input('gender', ''),
                'pendidikan' => $request->input('pendidikan', ''),
                'usia' => $request->input('usia', ''),
            ],
            'genderOptions' => ['Laki-laki', 'Perempuan'],
            'pendidikanOptions' => ['SMA/SMK', 'D3', 'S1', 'S2', 'S3'],
            'usiaOptions' => [
                ['value' => '<25', 'label' => '< 25 tahun'],
                ['value' => '25-35', 'label' => '25 - 35 tahun'],
                ['value' => '36-45', 'label' => '36 - 45 tahun'],
                ['value' => '46-55', 'label' => '46 - 55 tahun'],
                ['value' => '>55', 'label' => '> 55 tahun'],
            ],
        ]);
    }

    /**
     * Ekspor Laporan ke Excel (.xls SpreadsheetML dengan styling).
     */
    public function exportExcel(Request $request)
    {
        $team = $this->resolveTeam($request);
        $format = $request->input('format', 'excel'); // 'excel' or 'csv'
        $data = $this->getFilteredQuery($request, $team->id)->orderBy('nama', 'asc')->get();

        $tanggalCetak = Carbon::now()->translatedFormat('d F Y, H:i:s');
        $filename = 'Laporan_Data_Pegawai_' . date('Ymd_His');

        if ($format === 'csv') {
            return new StreamedResponse(function () use ($data) {
                $handle = fopen('php://output', 'w');
                // UTF-8 BOM agar Excel membaca karakter dengan benar
                fwrite($handle, "\xEF\xBB\xBF");
                // Header CSV
                fputcsv($handle, ['No', 'Nama Pegawai', 'Jenis Kelamin', 'Pendidikan Terakhir', 'Tanggal Lahir', 'Usia (Tahun)']);
                foreach ($data as $index => $item) {
                    fputcsv($handle, [
                        $index + 1,
                        $item->nama,
                        $item->jenis_kelamin,
                        $item->pendidikan_terakhir,
                        $item->tanggal_lahir ? $item->tanggal_lahir->format('d/m/Y') : '-',
                        $item->usia,
                    ]);
                }
                fclose($handle);
            }, 200, [
                'Content-Type' => 'text/csv; charset=UTF-8',
                'Content-Disposition' => "attachment; filename=\"{$filename}.csv\"",
            ]);
        }

        // Generate Excel XML Spreadsheet (kompatibel penuh dengan Microsoft Excel)
        $html = view('exports.pegawai-excel', [
            'data' => $data,
            'team' => $team,
            'tanggalCetak' => $tanggalCetak,
            'filters' => [
                'search' => $request->input('search'),
                'gender' => $request->input('gender'),
                'pendidikan' => $request->input('pendidikan'),
                'usia' => $request->input('usia'),
            ],
        ])->render();

        return response($html, 200, [
            'Content-Type' => 'application/vnd.ms-excel; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}.xls\"",
            'Pragma' => 'no-cache',
            'Expires' => '0',
        ]);
    }

    /**
     * Tampilan cetak PDF resmi / Print Preview.
     */
    public function previewPdf(Request $request)
    {
        $team = $this->resolveTeam($request);
        $data = $this->getFilteredQuery($request, $team->id)->orderBy('nama', 'asc')->get();

        return view('exports.pegawai-pdf', [
            'data' => $data,
            'team' => $team,
            'tanggalCetak' => Carbon::now()->translatedFormat('l, d F Y - H:i:s'),
            'filters' => [
                'search' => $request->input('search'),
                'gender' => $request->input('gender'),
                'pendidikan' => $request->input('pendidikan'),
                'usia' => $request->input('usia'),
            ],
            'summary' => [
                'total' => $data->count(),
                'laki' => $data->where('jenis_kelamin', 'Laki-laki')->count(),
                'perempuan' => $data->where('jenis_kelamin', 'Perempuan')->count(),
                'avgUsia' => $data->count() > 0 ? round($data->avg(fn ($item) => $item->usia), 1) : 0,
            ],
        ]);
    }
}

