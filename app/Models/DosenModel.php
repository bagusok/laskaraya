<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DosenModel extends Model
{
    use HasFactory;

    protected $table = 'dosen_profiles';
    protected $primaryKey = 'id';

    protected $fillable = [
        'address',
        'faculty',
        'major',
        'gender',
        'birth_place',
        'birth_date',
        'total_competitions',
        'total_wins',
    ];

    public function user()
    {
        return $this->belongsTo(UserModel::class, 'user_id', 'id');
    }
}
