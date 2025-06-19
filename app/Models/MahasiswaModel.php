<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MahasiswaModel extends Model
{
    use HasFactory;

    protected $table = 'mahasiswa_profiles';
    protected $primaryKey = 'id';
    protected $fillable = [
        'address',
        'year',
        'faculty',
        'major',
        'gender',
        'birth_place',
        'birth_date',
        'prodi_id',
        'total_competitions',
        'total_wins'
    ];

    protected $attributes = [
        'total_competitions' => 0,
        'total_wins' => 0
    ];

    protected $casts = [
        'total_competitions' => 'integer',
        'total_wins' => 'integer',
        'year' => 'integer'
    ];

    public function user()
    {
        return $this->belongsTo(UserModel::class, 'user_id', 'id');
    }

    public function incrementCompetitions()
    {
        $this->increment('total_competitions');
        return $this;
    }

    public function incrementWins()
    {
        $this->increment('total_wins');
        return $this;
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (!isset($model->total_competitions)) {
                $model->total_competitions = 0;
            }
            if (!isset($model->total_wins)) {
                $model->total_wins = 0;
            }
        });
    }
}