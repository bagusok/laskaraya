<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserToSkill extends Model
{
    use HasFactory;

    protected $table = 'user_to_skills';

    protected $fillable = [
        'user_id',
        'skill_id',
        'level',
    ];

    public function skill()
    {
        return $this->belongsTo(SkillModel::class, 'skill_id');
    }
}