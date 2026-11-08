import type { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon({
    className = 'size-5',
    alt = 'Sistem Manajemen Kepegawaian',
    ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            src="/ikon-data-pegawai.jpg"
            alt={alt}
            className={`object-cover ${className}`}
            {...props}
        />
    );
}
