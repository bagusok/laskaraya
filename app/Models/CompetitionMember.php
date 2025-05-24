<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompetitionMember extends Model
{
    use HasFactory;

    protected $table = 'competition_members';
    protected $fillable = [
        'user_to_competition_id',
        'user_id',
    ];

    public function userToCompetition()
    {
        return $this->hasOne(UserToCompetition::class, 'id', 'user_to_competition_id');
    }

    public function user()
    {
        return $this->belongsTo(UserModel::class, 'user_id');
    }
}
