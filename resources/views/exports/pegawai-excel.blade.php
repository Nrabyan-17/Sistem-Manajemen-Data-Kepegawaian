<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <style>
        body {
            font-family: 'Segoe UI', Calibri, Arial, sans-serif;
            color: #1e293b;
        }
        .title {
            font-size: 16pt;
            font-weight: bold;
            color: #1e3a8a;
            text-align: center;
        }
        .subtitle {
            font-size: 11pt;
            color: #475569;
            text-align: center;
        }
        .meta-table {
            margin-top: 12px;
            margin-bottom: 16px;
            font-size: 10pt;
        }
        .meta-label {
            font-weight: bold;
            color: #334155;
            width: 140px;
        }
        table.data-table {
            border-collapse: collapse;
            width: 100%;
            margin-top: 10px;
        }
        table.data-table th {
            background-color: #2563eb;
            color: #ffffff;
            font-weight: bold;
            font-size: 10pt;
            border: 1px solid #1d4ed8;
            padding: 8px 10px;
            text-align: center;
        }
        table.data-table td {
            border: 1px solid #cbd5e1;
            padding: 6px 10px;
            font-size: 9.5pt;
            vertical-align: middle;
        }
        .center {
            text-align: center;
        }
        .right {
            text-align: right;
        }
        .row-even {
            background-color: #f8fafc;
        }
        .footer-summary {
            background-color: #eff6ff;
            font-weight: bold;
            border-top: 2px solid #2563eb;
        }
    </style>
</head>
<body>
    <div class="title">SISTEM MANAJEMEN KEPEGAWAIAN</div>
    <div class="subtitle">LAPORAN DATA PEGAWAI</div>
    <br />

    <table class="meta-table">
        <tr>
            <td class="meta-label">Tim / Organisasi</td>
            <td>: {{ $team->name }}</td>
            <td class="meta-label">Tanggal Ekspor</td>
            <td>: {{ $tanggalCetak }}</td>
        </tr>
        <tr>
            <td class="meta-label">Total Data</td>
            <td>: {{ $data->count() }} Pegawai</td>
            <td class="meta-label">Filter Diterapkan</td>
            <td>: 
                @php
                    $applied = [];
                    if (!empty($filters['search'])) $applied[] = 'Nama: "'.$filters['search'].'"';
                    if (!empty($filters['gender'])) $applied[] = 'Gender: '.$filters['gender'];
                    if (!empty($filters['pendidikan'])) $applied[] = 'Pendidikan: '.$filters['pendidikan'];
                    if (!empty($filters['usia'])) $applied[] = 'Usia: '.$filters['usia'].' th';
                @endphp
                {{ count($applied) > 0 ? implode(', ', $applied) : 'Semua Data (Tanpa Filter)' }}
            </td>
        </tr>
    </table>

    <table class="data-table">
        <thead>
            <tr>
                <th style="width: 50px;">No</th>
                <th style="width: 250px;">Nama Lengkap</th>
                <th style="width: 130px;">Jenis Kelamin</th>
                <th style="width: 140px;">Pendidikan Terakhir</th>
                <th style="width: 130px;">Tanggal Lahir</th>
                <th style="width: 100px;">Usia</th>
                <th style="width: 140px;">Tanggal Terdaftar</th>
            </tr>
        </thead>
        <tbody>
            @forelse($data as $index => $item)
                <tr class="{{ $index % 2 === 1 ? 'row-even' : '' }}">
                    <td class="center">{{ $index + 1 }}</td>
                    <td>{{ $item->nama }}</td>
                    <td class="center">{{ $item->jenis_kelamin }}</td>
                    <td class="center">{{ $item->pendidikan_terakhir }}</td>
                    <td class="center">{{ $item->tanggal_lahir ? $item->tanggal_lahir->format('d/m/Y') : '-' }}</td>
                    <td class="center">{{ $item->usia }} Tahun</td>
                    <td class="center">{{ $item->created_at ? $item->created_at->format('d/m/Y H:i') : '-' }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="7" class="center" style="padding: 20px; color: #64748b;">
                        Tidak ada data pegawai yang sesuai dengan filter.
                    </td>
                </tr>
            @endforelse
        </tbody>
        @if($data->count() > 0)
            <tfoot>
                <tr class="footer-summary">
                    <td colspan="5" class="right" style="font-weight: bold; padding: 8px 10px;">
                        Total Pegawai:
                    </td>
                    <td colspan="2" style="font-weight: bold; padding: 8px 10px;">
                        {{ $data->count() }} Orang
                        (L: {{ $data->where('jenis_kelamin', 'Laki-laki')->count() }}, 
                         P: {{ $data->where('jenis_kelamin', 'Perempuan')->count() }})
                    </td>
                </tr>
            </tfoot>
        @endif
    </table>
</body>
</html>

