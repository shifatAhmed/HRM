<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Flat extends Model
{
    use HasFactory;

    protected $fillable = [
        'building_id',
        'flat_no',
        'type',
        'floor',
        'size',
        'rent',
        'gas_bill',
        'water_bill',
        'service_charge',
        'electric_meter',
        'status',
        'notes',
    ];

    public function building(): BelongsTo
    {
        return $this->belongsTo(Building::class);
    }

    public function tenants(): HasMany
    {
        return $this->hasMany(Tenant::class);
    }
}
