<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AchievementModel extends Model
{
    use HasFactory;

    protected $table = 'achievements';
    protected $fillable = [
        'user_to_competition_id',
        'name',
        'description',
        'champion',
        'score',
    ];

    public function userToCompetition()
    {
        return $this->belongsTo(UserToCompetition::class, 'user_to_competition_id');
    }

    public function certificates()
    {
        return $this->hasMany(CertificatesModel::class, 'achievement_id');
    }
}
