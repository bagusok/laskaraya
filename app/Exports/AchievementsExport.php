<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class AchievementsExport implements FromCollection, WithHeadings, WithMapping, WithStyles
{
    private $data;

    public function __construct($data)
    {
        $this->data = collect($data);
    }

    public function collection()
    {
        return $this->data;
    }

    public function headings(): array
    {
        return [
            'Nama',
            'NIM',
            'Kompetisi',
            'Nama TIM',
            'Dosen Pembimbing',
            'Prestasi',
            'Skor',
            'Juara',
            'Kategori',
            'Periode',
            'Status Lomba',
            'Status Verifikasi Lomba',
            'Status Verifikasi Tim',
            'Tanggal Bergabung',
        ];
    }

    public function map($row): array
    {
        return [
            $row['Nama'],
            $row['NIM'],
            $row['Kompetisi'],
            $row['Nama TIM'],
            $row['Dosen Pembimbing'],
            $row['Prestasi'],
            $row['Skor'],
            $row['Juara'],
            $row['Kategori'],
            $row['Periode'],
            $row['Status Lomba'],
            $row['Status Verifikasi Lomba'],
            $row['Status Verifikasi Tim'],
            $row['Tanggal Bergabung'],
        ];
    }

    public function styles(Worksheet $sheet)
    {
        $sheet->getStyle('A1:N1')->applyFromArray([
            'font' => [
                'bold' => true,
                'color' => ['rgb' => 'FFFFFF'],
            ],
            'fill' => [
                'fillType' => 'solid',
                'startColor' => ['rgb' => '4F81BD'], // biru
            ],
        ]);

        // Tambahkan warna khusus untuk kolom Juara (kolom H = kolom ke-8)
        $highestRow = $sheet->getHighestRow();

        for ($row = 2; $row <= $highestRow; $row++) {
            $champion = $sheet->getCell('H' . $row)->getValue();

            $color = match ($champion) {
                1 => 'FFD700', // Emas
                2 => 'C0C0C0', // Perak
                3 => 'CD7F32', // Perunggu
                default => null,
            };

            if ($color) {
                $sheet->getStyle('H' . $row)->applyFromArray([
                    'fill' => [
                        'fillType' => 'solid',
                        'startColor' => ['rgb' => $color],
                    ],
                ]);
            }
        }

        return [];
    }
}
