<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tenant extends Model
{
    use HasFactory;

    protected $fillable = [
        'flat_id',
        'name',
        'phone',
        'nid',
        'nid_photo',
        'profession',
        'family_members',
        'advance_amount',
        'monthly_rent',
        'move_in_date',
        'move_out_date',
        'status',
        'emergency_contact',
        'photo',
        'note',
    ];

    protected $casts = [
        'nid_photo' => 'array',
    ];

    public function flat(): BelongsTo
    {
        return $this->belongsTo(Flat::class);
    }

    public function invoices(): HasMany
    {
        return $this->hasMany(RentInvoice::class);
    }
}
