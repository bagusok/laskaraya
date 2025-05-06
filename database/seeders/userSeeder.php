<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class userSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \Illuminate\Support\Facades\DB::table('users')->insert([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'identifier' => 'admin',
            'phone' => '1234567890',
            'password' => bcrypt('12345678'),
            'role' => 'admin',
        ]);
    }
}
