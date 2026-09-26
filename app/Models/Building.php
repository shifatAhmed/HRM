<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Concerns\BelongsToAccount;

class Building extends Model
{
    use HasFactory, BelongsToAccount;

    protected $fillable = [
        'name',
        'address',
        'description',
    ];

    public function flats(): HasMany
    {
        return $this->hasMany(Flat::class);
    }
}
