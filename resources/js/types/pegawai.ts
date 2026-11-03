export type PegawaiItem = {
    id: number;
    nama: string;
    jenis_kelamin: 'Laki-laki' | 'Perempuan';
    pendidikan_terakhir: string;
    tanggal_lahir: string;
    tanggal_lahir_formatted: string;
    usia: number;
    created_at: string;
};

export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

export type PaginatedData<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: PaginationLink[];
};

