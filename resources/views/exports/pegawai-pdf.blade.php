<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Laporan Data Pegawai - {{ $team->name }}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        body {
            font-family: 'Plus Jakarta Sans', Arial, sans-serif;
            color: #0f172a;
            background-color: #f8fafc;
            line-height: 1.4;
            padding: 30px;
        }

        /* Container Dokumen Cetak */
        .page-container {
            max-width: 1100px;
            margin: 0 auto;
            background: #ffffff;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        }

        /* Floating Action Bar (Hanya tampil di layar) */
        .action-bar {
            position: sticky;
            top: 20px;
            z-index: 999;
            max-width: 1100px;
            margin: 0 auto 20px auto;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: #ffffff;
            padding: 12px 20px;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
            border: 1px solid #e2e8f0;
        }
        .action-bar .info {
            font-size: 13px;
            font-weight: 600;
            color: #475569;
        }
        .action-bar .buttons {
            display: flex;
            gap: 10px;
        }
        .btn {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 8px 16px;
            font-size: 13px;
            font-weight: 600;
            border-radius: 8px;
            border: none;
            cursor: pointer;
            transition: all 0.2s;
            text-decoration: none;
        }
        .btn-primary {
            background-color: #2563eb;
            color: #ffffff;
        }
        .btn-primary:hover {
            background-color: #1d4ed8;
        }
        .btn-outline {
            background-color: #ffffff;
            color: #334155;
            border: 1px solid #cbd5e1;
        }
        .btn-outline:hover {
            background-color: #f1f5f9;
        }

        /* Kop Surat Resmi */
        .kop-surat {
            display: flex;
            align-items: center;
            gap: 20px;
            border-bottom: 3px double #1e293b;
            padding-bottom: 18px;
            margin-bottom: 24px;
        }
        .logo-box {
            width: 64px;
            height: 64px;
            border-radius: 14px;
            background: #2563eb;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            flex-shrink: 0;
        }
        .kop-text {
            flex: 1;
        }
        .kop-title {
            font-size: 20px;
            font-weight: 800;
            letter-spacing: 0.5px;
            color: #1e3a8a;
            text-transform: uppercase;
        }
        .kop-subtitle {
            font-size: 14px;
            font-weight: 700;
            color: #0f172a;
            margin-top: 2px;
        }
        .kop-meta {
            font-size: 11px;
            color: #64748b;
            margin-top: 4px;
        }

        /* Info & Filter Card */
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 14px 18px;
            margin-bottom: 20px;
            font-size: 12px;
        }
        .info-row {
            display: flex;
            gap: 8px;
        }
        .info-label {
            font-weight: 700;
            color: #475569;
            width: 120px;
        }
        .info-val {
            color: #0f172a;
            font-weight: 500;
        }

        /* Ringkasan KPI Badges */
        .summary-bar {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 12px;
            margin-bottom: 24px;
        }
        .summary-card {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 10px 14px;
            text-align: center;
        }
        .summary-card.primary {
            border-color: #bfdbfe;
            background: #eff6ff;
        }
        .summary-num {
            font-size: 18px;
            font-weight: 800;
            color: #1e3a8a;
        }
        .summary-label {
            font-size: 10.5px;
            font-weight: 600;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        /* Tabel Data Pegawai */
        table.report-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 11px;
            margin-bottom: 30px;
        }
        table.report-table th {
            background-color: #2563eb;
            color: #ffffff;
            font-weight: 700;
            text-align: left;
            padding: 9px 12px;
            border: 1px solid #1d4ed8;
            font-size: 11px;
            letter-spacing: 0.3px;
        }
        table.report-table th.center,
        table.report-table td.center {
            text-align: center;
        }
        table.report-table td {
            padding: 8px 12px;
            border: 1px solid #cbd5e1;
            color: #1e293b;
        }
        table.report-table tr:nth-child(even) {
            background-color: #f8fafc;
        }
        .badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 9999px;
            font-size: 10px;
            font-weight: 600;
        }
        .badge-male {
            background-color: #e0f2fe;
            color: #0369a1;
        }
        .badge-female {
            background-color: #fce7f3;
            color: #be185d;
        }
        .badge-pendidikan {
            background-color: #f1f5f9;
            color: #475569;
            border: 1px solid #e2e8f0;
        }

        /* Kolom Tanda Tangan */
        .signature-section {
            margin-top: 30px;
            display: flex;
            justify-content: flex-end;
            page-break-inside: avoid;
        }
        .signature-box {
            width: 250px;
            text-align: center;
            font-size: 12px;
        }
        .signature-date {
            color: #475569;
            margin-bottom: 4px;
        }
        .signature-role {
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 60px;
        }
        .signature-name {
            font-weight: 800;
            color: #0f172a;
            text-decoration: underline;
        }
        .signature-nip {
            color: #64748b;
            font-size: 11px;
            margin-top: 2px;
        }

        /* Print Settings */
        @media print {
            body {
                padding: 0;
                background: #ffffff;
            }
            .action-bar {
                display: none !important;
            }
            .page-container {
                box-shadow: none;
                border-radius: 0;
                padding: 0;
                max-width: 100%;
            }
            @page {
                size: A4 landscape;
                margin: 12mm 15mm;
            }
            tr {
                page-break-inside: avoid;
            }
        }
    </style>
</head>
<body>

    <!-- Floating Action Bar -->
    <div class="action-bar">
        <div class="info">
            Pratinjau Cetak / Ekspor PDF &bull; <strong>{{ $data->count() }} Pegawai</strong>
        </div>
        <div class="buttons">
            <button onclick="window.print()" class="btn btn-primary">
                Cetak / Simpan PDF
            </button>
            <button onclick="window.close()" class="btn btn-outline">
                Tutup
            </button>
        </div>
    </div>

    <!-- Halaman Dokumen Laporan -->
    <div class="page-container">
        <!-- Kop Surat -->
        <div class="kop-surat">
            <div class="logo-box" style="overflow: hidden; padding: 2px; background: #ffffff; border: 1px solid #cbd5e1;">
                <img src="/ikon-data-pegawai-removebg-preview.png" alt="Logo" style="width: 100%; height: 100%; object-fit: contain; border-radius: 10px; display: block;">
            </div>
            <div class="kop-text">
                <div class="kop-title">SISTEM MANAJEMEN DATA KEPEGAWAIAN</div>
                <div class="kop-subtitle">REKAPITULASI LAPORAN DATA PEGAWAI &bull; {{ strtoupper($team->name) }}</div>
                <div class="kop-meta">Dokumen resmi rekapitulasi data kepegawaian &bull; Dicetak secara otomatis oleh sistem</div>
            </div>
        </div>

        <!-- Meta Informasi Laporan -->
        <div class="info-grid">
            <div class="info-row">
                <span class="info-label">Tanggal Cetak</span>
                <span class="info-val">: {{ $tanggalCetak }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Dicetak Oleh</span>
                <span class="info-val">: {{ auth()->user()->name }} ({{ auth()->user()->email }})</span>
            </div>
            <div class="info-row">
                <span class="info-label">Unit / Tim</span>
                <span class="info-val">: {{ $team->name }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Kriteria Filter</span>
                <span class="info-val">: 
                    @php
                        $applied = [];
                        if (!empty($filters['search'])) $applied[] = 'Nama: "'.$filters['search'].'"';
                        if (!empty($filters['gender'])) $applied[] = 'Gender: '.$filters['gender'];
                        if (!empty($filters['pendidikan'])) $applied[] = 'Pendidikan: '.$filters['pendidikan'];
                        if (!empty($filters['usia'])) $applied[] = 'Rentang Usia: '.$filters['usia'].' th';
                    @endphp
                    {{ count($applied) > 0 ? implode(' | ', $applied) : 'Semua Data Pegawai' }}
                </span>
            </div>
        </div>

        <!-- Ringkasan Statistik -->
        <div class="summary-bar">
            <div class="summary-card primary">
                <div class="summary-num">{{ $summary['total'] }}</div>
                <div class="summary-label">Total Pegawai</div>
            </div>
            <div class="summary-card">
                <div class="summary-num">{{ $summary['laki'] }}</div>
                <div class="summary-label">Laki-Laki</div>
            </div>
            <div class="summary-card">
                <div class="summary-num">{{ $summary['perempuan'] }}</div>
                <div class="summary-label">Perempuan</div>
            </div>
            <div class="summary-card">
                <div class="summary-num">{{ $summary['avgUsia'] }} th</div>
                <div class="summary-label">Rata-rata Usia</div>
            </div>
        </div>

        <!-- Tabel Data -->
        <table class="report-table">
            <thead>
                <tr>
                    <th class="center" style="width: 45px;">NO</th>
                    <th>NAMA PEGAWAI</th>
                    <th class="center" style="width: 120px;">JENIS KELAMIN</th>
                    <th class="center" style="width: 140px;">PENDIDIKAN</th>
                    <th class="center" style="width: 130px;">TANGGAL LAHIR</th>
                    <th class="center" style="width: 90px;">USIA</th>
                </tr>
            </thead>
            <tbody>
                @forelse($data as $index => $item)
                    <tr>
                        <td class="center">{{ $index + 1 }}</td>
                        <td style="font-weight: 600;">{{ $item->nama }}</td>
                        <td class="center">
                            <span class="badge {{ $item->jenis_kelamin === 'Laki-laki' ? 'badge-male' : 'badge-female' }}">
                                {{ $item->jenis_kelamin }}
                            </span>
                        </td>
                        <td class="center">
                            <span class="badge badge-pendidikan">{{ $item->pendidikan_terakhir }}</span>
                        </td>
                        <td class="center">{{ $item->tanggal_lahir ? $item->tanggal_lahir->translatedFormat('d F Y') : '-' }}</td>
                        <td class="center" style="font-weight: 600;">{{ $item->usia }} th</td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="6" class="center" style="padding: 24px; color: #64748b;">
                            Tidak ada data pegawai yang ditemukan sesuai kriteria filter yang diterapkan.
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>

        <!-- Kolom Pengesahan Tanda Tangan -->
        <div class="signature-section">
            <div class="signature-box">
                <div class="signature-date">Surabaya, {{ \Carbon\Carbon::now()->translatedFormat('d F Y') }}</div>
                <div class="signature-role">Pimpinan / Kepala Divisi HRD</div>
                <div class="signature-name">{{ auth()->user()->name }}</div>
                <div class="signature-nip">NIP: 19850712 201001 1 004</div>
            </div>
        </div>
    </div>

    @if(request()->has('auto_print'))
        <script>
            window.addEventListener('load', function() {
                setTimeout(function() {
                    window.print();
                }, 400);
            });
        </script>
    @endif
</body>
</html>

