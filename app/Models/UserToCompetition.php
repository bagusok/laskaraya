<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserToCompetition extends Model
{
    use HasFactory;

    protected $table = 'user_to_competitions';
    protected $fillable = [
        'name',
        'registrant_id',
        'dosen_id',
        'competition_id',
        'status',
        'notes',
        'created_at',
        'updated_at'
    ];

    public function competition()
    {
        return $this->belongsTo(CompetitionModel::class, 'competition_id');
    }

    public function registrant()
    {
        return $this->belongsTo(UserModel::class, 'registrant_id');
    }

    public function dosen()
    {
        return $this->belongsTo(UserModel::class, 'dosen_id');
    }

    public function competitionMembers()
    {
        return $this->hasMany(CompetitionMember::class, 'user_to_competition_id');
    }

    public function achievement()
    {
        return $this->hasOne(AchievementModel::class, 'user_to_competition_id');
    }
}
