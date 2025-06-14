<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class CompetitionModel extends Model
{
    use HasFactory;

    protected $table = 'competitions';

    protected $fillable = [
        'category_id',
        'period_id',
        'name',
        'image',
        'author',
        'level',
        'status',
        'verified_status',
        'description',
        'start_date',
        'end_date',
        'notes',
        'status',
        'uploader_id',
    ];

    public function category()
    {
        return $this->belongsTo(CategoryModel::class, 'category_id');
    }

    public function period()
    {
        return $this->belongsTo(PeriodModel::class, 'period_id');
    }

    public function skills()
    {
        return $this->belongsToMany(SkillModel::class, 'skill_to_competitions', 'competition_id', 'skill_id');
    }

    public function userToCompetition()
    {
        return $this->hasMany(UserToCompetition::class, 'competition_id');
    }

    public function uploader()
    {
        return $this->belongsTo(UserModel::class, 'uploader_id');
    }

    public function getImageAttribute($value)
    {
        if (!$value) {
            return null;
        }

        return Storage::url('competition_posters/' . $value);
    }

    public function participants()
    {
        return $this->belongsToMany(
            UserModel::class,
            'user_to_competitions',
            'competition_id',
            'registrant_id'
        )->withPivot('status', 'notes');
    }

    public function achievements()
    {
        return $this->hasManyThrough(
            AchievementModel::class,
            UserToCompetition::class,
            'competition_id', // Foreign key on user_to_competitions table
            'user_to_competition_id', // Foreign key on achievements table
            'id', // Local key on competitions table
            'id' // Local key on user_to_competitions table
        );
    }
}
