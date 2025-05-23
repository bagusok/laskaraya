<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SkillToCompetition extends Model
{
    use HasFactory;
    protected $table = 'skill_to_competitions';

    protected $fillable = [
        'competition_id',
        'skill_id',
    ];

    public function competitions()
    {
        return $this->belongsTo(CompetitionModel::class, 'competition_id');
    }

    public function skills()
    {
        return $this->belongsTo(SkillModel::class, 'skill_id');
    }
}
