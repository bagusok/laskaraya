<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SkillModel extends Model
{
    use HasFactory;

    protected $table = 'skills';
    protected $primaryKey = 'id';

    protected $fillable = [
        'name',
    ];
}
