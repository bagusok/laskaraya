<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class CertificatesModel extends Model
{
    use HasFactory;

    protected $table = 'certificates';

    protected $fillable = [
        'user_id',
        'achievement_id',
        'file_url',
    ];

    public function achievement()
    {
        return $this->belongsTo(AchievementModel::class, 'achievement_id');
    }

    public function user()
    {
        return $this->belongsTo(UserModel::class, 'user_id');
    }

    public function getFileUrlAttribute($value)
    {
        if (!$value) {
            return null;
        }

        return Storage::url('certificates/' . $value);
    }
}
