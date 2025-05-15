<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class UserModel extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $table = 'users';

    protected $fillable = [
        'name',
        'email',
        'identifier',
        'phone',
        'password',
        'role',
        'is_verified',
        'remember_token',
        'profile_picture',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'is_verified' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Override the default username field for authentication.
     */
    public function getAuthIdentifierName()
    {
        return 'identifier';
    }

    public function hasRole($role)
    {
        return $this->role === $role;
    }

    public function mahasiswa()
    {
        return $this->hasOne(MahasiswaModel::class, 'user_id', 'id');
    }

    public function dosen()
    {
        return $this->hasOne(DosenModel::class, 'user_id', 'id');
    }

    public function profile()
    {
        return $this->role === 'mahasiswa'
            ? $this->mahasiswa()
            : ($this->role === 'dosen' ? $this->dosen() : null);
    }

    public function getProfilePictureUrlAttribute()
    {
        if ($this->profile_picture) {
            return asset('storage/profile_pictures/' . $this->profile_picture);
        }
        return asset('images/default-profile.png');
    }
}
