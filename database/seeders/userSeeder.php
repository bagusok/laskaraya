<?php

namespace Database\Seeders;

use App\Models\UserModel;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // \Illuminate\Support\Facades\DB::table('users')->insert([
        //     'name' => 'Admin',
        //     'email' => 'admin@example.com',
        //     'identifier' => 'admin',
        //     'phone' => '1234567890',
        //     'password' => bcrypt('12345678'),
        //     'role' => 'admin',
        // ]);

        UserModel::create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'identifier' => '123',
            'phone' => '1234567890',
            'password' => bcrypt('12345678'),
            'role' => 'admin',
        ])->dosen()->create([
            'major' => 'Teknik Informatika',
            'faculty' => 'Teknologi Informasi',
            'address' => 'Jl. Raya No. 1',
            'gender' => 'L',
            'birth_place' => 'Jakarta',
            'birth_date' => '1990-01-01',
        ]);

        UserModel::create([
            'name' => 'Dosen',
            'email' => 'dosen@example.com',
            'identifier' => '1234',
            'phone' => '12345678901',
            'password' => bcrypt('12345678'),
            'role' => 'dosen',
        ])->dosen()->create([
            'major' => 'Teknik Informatika',
            'faculty' => 'Teknologi Informasi',
            'address' => 'Jl. Raya No. 1',
            'gender' => 'L',
            'birth_place' => 'Jakarta',
            'birth_date' => '1990-01-01',
        ]);



        UserModel::create([
            'name' => 'Mahasiswa',
            'email' => 'mahasiswa@example.com',
            'identifier' => '12345',
            'phone' => '081234567890',
            'password' => bcrypt('12345678'),
            'role' => 'mahasiswa',
        ])->mahasiswa()->create([
            'major' => 'Teknik Informatika',
            'faculty' => 'Teknologi Informasi',
            'address' => 'Jl. Raya No. 1',
            'gender' => 'L',
            'birth_place' => 'Jakarta',
            'birth_date' => '1990-01-01',
            'year' => 2023,
        ]);
    }
}
