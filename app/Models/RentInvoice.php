<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RentInvoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'tenant_id',
        'flat_id',
        'month',
        'year',
        'house_rent',
        'electricity_bill',
        'gas_bill',
        'water_bill',
        'service_charge',
        'garage_bill',
        'internet_bill',
        'other_charges',
        'total_amount',
        'paid_amount',
        'due_amount',
        'status',
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    public function flat(): BelongsTo
    {
        return $this->belongsTo(Flat::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class, 'invoice_id');
    }
}
