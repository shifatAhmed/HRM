<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Concerns\BelongsToAccount;

class FamilyMemberDetail extends Model
{
    use HasFactory, BelongsToAccount;

    protected $fillable = [
        'tenant_id',
        'member_name',
        'member_photo',
        'member_photos',
    ];

    protected $casts = [
        'member_photos' => 'array',
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }
}
