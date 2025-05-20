<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProdiSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('prodi')->insert([
            ['nama' => 'D-IV Teknik Informatika'],
            ['nama' => 'D-IV Sistem Informasi Bisnis'],
            ['nama' => 'D-II Pengembangan Perangkat Lunak Situs'],
        ]);
    }
}
