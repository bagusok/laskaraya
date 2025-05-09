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
    ];

    public function user()
    {
        return $this->belongsTo(UserModel::class, 'user_id', 'id');
    }
}
