<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PeriodModel extends Model
{
    use HasFactory;

    protected $table = 'periods';
    protected $fillable = [
        'competition_id',
        'name',
        'year',
    ];
}
