<?php

namespace App\Models\Concerns;

use App\Models\Account;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class BelongsToAccountScope implements Scope
{
    public function apply(Builder $builder, Model $model): void
    {
        if (auth()->check() && auth()->user()->account_id) {
            $builder->where(
                $model->qualifyColumn('account_id'),
                auth()->user()->account_id,
            );
        }
    }
}

trait BelongsToAccount
{
    protected static function bootBelongsToAccount(): void
    {
        static::addGlobalScope(new BelongsToAccountScope);

        static::creating(function (Model $model): void {
            if ($model->account_id) {
                return;
            }

            $model->account_id = auth()->user()?->account_id
                ?? Account::query()->latest('id')->value('id');
        });
    }

    public function account()
    {
        return $this->belongsTo(Account::class);
    }

    public function scopeForAccount(Builder $query, int $accountId): Builder
    {
        return $query->withoutGlobalScopes()->where(
            $query->getModel()->qualifyColumn('account_id'),
            $accountId,
        );
    }
}
