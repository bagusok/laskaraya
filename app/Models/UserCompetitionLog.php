<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserCompetitionLog extends Model
{
    use HasFactory;

    protected $table = 'user_competition_logs';
    protected $primaryKey = 'id';

    protected $fillable = [
        'user_to_competition_id',
        'name',
        'description',
        'date'
    ];

    public function userToCompetition()
    {
        return $this->belongsTo(UserToCompetition::class, 'user_to_competition_id');
    }
}
