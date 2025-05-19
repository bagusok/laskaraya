<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProgramStudiModel extends Model
{
    use HasFactory;

    protected $table = 'prodi';
    protected $fillable = [
        'nama',
    ];

    public function mahasiswa()
    {
        return $this->hasMany(UserModel::class, 'prodi_id')->where('role', 'mahasiswa');
    }
}
