<?php

namespace Database\Seeders;

use App\Models\SkillModel;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SkillSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        SkillModel::create(['id' => 1, 'name' => 'Python']);
        SkillModel::create(['id' => 2, 'name' => 'JavaScript']);
        SkillModel::create(['id' => 3, 'name' => 'HTML']);
        SkillModel::create(['id' => 4, 'name' => 'CSS']);
        SkillModel::create(['id' => 5, 'name' => 'PHP']);
        SkillModel::create(['id' => 6, 'name' => 'Laravel']);
        SkillModel::create(['id' => 7, 'name' => 'React']);
        SkillModel::create(['id' => 8, 'name' => 'Vue.js']);
        SkillModel::create(['id' => 9, 'name' => 'Flutter']);
        SkillModel::create(['id' => 10, 'name' => 'Dart']);
        SkillModel::create(['id' => 11, 'name' => 'Java']);
        SkillModel::create(['id' => 12, 'name' => 'Kotlin']);
        SkillModel::create(['id' => 13, 'name' => 'Swift']);
        SkillModel::create(['id' => 14, 'name' => 'SQL']);
        SkillModel::create(['id' => 15, 'name' => 'MongoDB']);
        SkillModel::create(['id' => 16, 'name' => 'Firebase']);
        SkillModel::create(['id' => 17, 'name' => 'Node.js']);
        SkillModel::create(['id' => 18, 'name' => 'Express.js']);
        SkillModel::create(['id' => 19, 'name' => 'REST API']);
        SkillModel::create(['id' => 20, 'name' => 'GraphQL']);
        SkillModel::create(['id' => 21, 'name' => 'UI/UX Design']);
        SkillModel::create(['id' => 22, 'name' => 'Figma']);
        SkillModel::create(['id' => 23, 'name' => 'Adobe XD']);
        SkillModel::create(['id' => 24, 'name' => 'Machine Learning']);
        SkillModel::create(['id' => 25, 'name' => 'Data Science']);
        SkillModel::create(['id' => 26, 'name' => 'TensorFlow']);
        SkillModel::create(['id' => 27, 'name' => 'Cyber Security']);
        SkillModel::create(['id' => 28, 'name' => 'Git']);
        SkillModel::create(['id' => 29, 'name' => 'Docker']);
        SkillModel::create(['id' => 30, 'name' => 'Problem Solving']);
    }
}
