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

        UserModel::create([
            'id' => 10,
            'name' => 'Andi Saputra',
            'email' => 'andi@example.com',
            'identifier' => '10001',
            'phone' => '081234000001',
            'password' => bcrypt('12345678'),
            'role' => 'mahasiswa',
        ])->mahasiswa()->create([
            'major' => 'Teknik Informatika',
            'faculty' => 'Teknologi Informasi',
            'address' => 'Jl. Anggrek No. 10',
            'gender' => 'L',
            'birth_place' => 'Bandung',
            'birth_date' => '2000-02-01',
            'year' => 2021,
        ]);

        UserModel::create([
            'id' => 11,
            'name' => 'Rina Marlina',
            'email' => 'rina@example.com',
            'identifier' => '10002',
            'phone' => '081234000002',
            'password' => bcrypt('12345678'),
            'role' => 'mahasiswa',
        ])->mahasiswa()->create([
            'major' => 'Sistem Informasi',
            'faculty' => 'Ilmu Komputer',
            'address' => 'Jl. Kenanga No. 5',
            'gender' => 'P',
            'birth_place' => 'Jakarta',
            'birth_date' => '1999-03-10',
            'year' => 2020,
        ]);

        UserModel::create([
            'id' => 12,
            'name' => 'Dian Permana',
            'email' => 'dian@example.com',
            'identifier' => '10003',
            'phone' => '081234000003',
            'password' => bcrypt('12345678'),
            'role' => 'mahasiswa',
        ])->mahasiswa()->create([
            'major' => 'Teknik Komputer',
            'faculty' => 'Teknik',
            'address' => 'Jl. Melati No. 3',
            'gender' => 'L',
            'birth_place' => 'Surabaya',
            'birth_date' => '1998-07-15',
            'year' => 2019,
        ]);

        UserModel::create([
            'id' => 13,
            'name' => 'Siti Nurhaliza',
            'email' => 'siti@example.com',
            'identifier' => '10004',
            'phone' => '081234000004',
            'password' => bcrypt('12345678'),
            'role' => 'mahasiswa',
        ])->mahasiswa()->create([
            'major' => 'Teknik Informatika',
            'faculty' => 'Teknologi Informasi',
            'address' => 'Jl. Mawar No. 8',
            'gender' => 'P',
            'birth_place' => 'Medan',
            'birth_date' => '2001-05-21',
            'year' => 2022,
        ]);

        UserModel::create([
            'id' => 14,
            'name' => 'Budi Hartono',
            'email' => 'budi@example.com',
            'identifier' => '10005',
            'phone' => '081234000005',
            'password' => bcrypt('12345678'),
            'role' => 'mahasiswa',
        ])->mahasiswa()->create([
            'major' => 'Teknik Elektro',
            'faculty' => 'Teknik',
            'address' => 'Jl. Sakura No. 6',
            'gender' => 'L',
            'birth_place' => 'Yogyakarta',
            'birth_date' => '1997-11-30',
            'year' => 2018,
        ]);

        UserModel::create([
            'id' => 15,
            'name' => 'Linda Anggraini',
            'email' => 'linda@example.com',
            'identifier' => '10006',
            'phone' => '081234000006',
            'password' => bcrypt('12345678'),
            'role' => 'mahasiswa',
        ])->mahasiswa()->create([
            'major' => 'Manajemen Informatika',
            'faculty' => 'Ekonomi dan Bisnis',
            'address' => 'Jl. Flamboyan No. 9',
            'gender' => 'P',
            'birth_place' => 'Semarang',
            'birth_date' => '1996-09-25',
            'year' => 2017,
        ]);

        UserModel::create([
            'id' => 16,
            'name' => 'Agus Salim',
            'email' => 'agus@example.com',
            'identifier' => '10007',
            'phone' => '081234000007',
            'password' => bcrypt('12345678'),
            'role' => 'mahasiswa',
        ])->mahasiswa()->create([
            'major' => 'Teknik Sipil',
            'faculty' => 'Teknik',
            'address' => 'Jl. Kamboja No. 2',
            'gender' => 'L',
            'birth_place' => 'Makassar',
            'birth_date' => '1995-06-10',
            'year' => 2016,
        ]);

        UserModel::create([
            'id' => 17,
            'name' => 'Dewi Sartika',
            'email' => 'dewi@example.com',
            'identifier' => '10008',
            'phone' => '081234000008',
            'password' => bcrypt('12345678'),
            'role' => 'mahasiswa',
        ])->mahasiswa()->create([
            'major' => 'Ilmu Komputer',
            'faculty' => 'Ilmu Komputer',
            'address' => 'Jl. Merpati No. 4',
            'gender' => 'P',
            'birth_place' => 'Palembang',
            'birth_date' => '2002-12-12',
            'year' => 2023,
        ]);

        UserModel::create([
            'id' => 18,
            'name' => 'Rahmat Hidayat',
            'email' => 'rahmat@example.com',
            'identifier' => '10009',
            'phone' => '081234000009',
            'password' => bcrypt('12345678'),
            'role' => 'mahasiswa',
        ])->mahasiswa()->create([
            'major' => 'Teknik Mesin',
            'faculty' => 'Teknik',
            'address' => 'Jl. Teratai No. 7',
            'gender' => 'L',
            'birth_place' => 'Padang',
            'birth_date' => '1994-01-15',
            'year' => 2015,
        ]);

        UserModel::create([
            'id' => 19,
            'name' => 'Nadia Rahma',
            'email' => 'nadia@example.com',
            'identifier' => '10010',
            'phone' => '081234000010',
            'password' => bcrypt('12345678'),
            'role' => 'mahasiswa',
        ])->mahasiswa()->create([
            'major' => 'Teknik Informatika',
            'faculty' => 'Teknologi Informasi',
            'address' => 'Jl. Cemara No. 12',
            'gender' => 'P',
            'birth_place' => 'Bogor',
            'birth_date' => '2000-08-05',
            'year' => 2021,
        ]);

        UserModel::create([
            'id' => 20,
            'name' => 'Rizky Aditya',
            'email' => 'rizky@example.com',
            'identifier' => '10011',
            'phone' => '081234000011',
            'password' => bcrypt('12345678'),
            'role' => 'mahasiswa',
        ])->mahasiswa()->create([
            'major' => 'Sains Data',
            'faculty' => 'Matematika dan Ilmu Pengetahuan Alam',
            'address' => 'Jl. Cendana No. 14',
            'gender' => 'L',
            'birth_place' => 'Banjarmasin',
            'birth_date' => '2003-03-03',
            'year' => 2024,
        ]);
    }
}
