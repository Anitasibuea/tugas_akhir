export interface ReportDetail {
    id: number;
    tanggal: string;
    lokasi: string;
    tipe_tiang: string;
    status_laporan: 'Open' | 'Pending' | 'Closed';
    nama_mitra: string;
    petugas_mitra: string;
    latitude: number;
    longitude: number;
    deskripsi: string;
    created_at?: string;
    updated_at?: string;
    foto: string | null;
}

export const formatDate = (dateString: string, locale: string = 'id-ID'): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

export const formatDateTime = (dateString?: string, locale: string = 'id-ID'): string => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};