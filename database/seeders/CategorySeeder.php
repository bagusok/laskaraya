<?php

namespace Database\Seeders;

use App\Models\CategoryModel;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        CategoryModel::create([
            'id' => 1,
            'name' => 'Hackathon',
        ]);

        CategoryModel::create([
            'id' => 2,
            'name' => 'UI/UX Design',
        ]);

        CategoryModel::create([
            'id' => 3,
            'name' => 'Competitive Programming',
        ]);

        CategoryModel::create([
            'id' => 4,
            'name' => 'Cyber Security Challenge',
        ]);

        CategoryModel::create([
            'id' => 5,
            'name' => 'Data Science Competition',
        ]);

        CategoryModel::create([
            'id' => 6,
            'name' => 'Game Development',
        ]);

        CategoryModel::create([
            'id' => 7,
            'name' => 'Mobile App Development',
        ]);

        CategoryModel::create([
            'id' => 8,
            'name' => 'Web Development',
        ]);

        CategoryModel::create([
            'id' => 9,
            'name' => 'Startup Pitching',
        ]);

        CategoryModel::create([
            'id' => 10,
            'name' => 'AI & Machine Learning Competition',
        ]);
    }
}
