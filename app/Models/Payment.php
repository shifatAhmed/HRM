<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'invoice_id',
        'payment_method',
        'amount',
        'payment_date',
        'note',
    ];

    public function invoice(): BelongsTo
    {
        return $this->belongsTo(RentInvoice::class, 'invoice_id');
    }
}
