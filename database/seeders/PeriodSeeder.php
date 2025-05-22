<?php

namespace Database\Seeders;

use App\Models\PeriodModel;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PeriodSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($year = 2020; $year <= 2026; $year++) {
            // Semester 1 - Ganjil
            PeriodModel::create([
                'name' => 'Ganjil ' . $year,
                'year' => $year,
            ]);

            // Semester 2 - Genap
            PeriodModel::create([
                'name' => 'Genap ' . $year,
                'year' => $year,
            ]);
        }
    }
}
