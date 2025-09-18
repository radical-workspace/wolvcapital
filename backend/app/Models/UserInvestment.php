<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserInvestment extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'user_id',
        'investment_plan_id',
        'initial_investment',
        'current_value',
        'total_invested',
        'total_withdrawn',
        'unrealized_gains',
        'realized_gains',
        'dividends_received',
        'status',
        'investment_date',
        'maturity_date',
        'shares_units',
        'unit_price',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'initial_investment' => 'decimal:2',
        'current_value' => 'decimal:2',
        'total_invested' => 'decimal:2',
        'total_withdrawn' => 'decimal:2',
        'unrealized_gains' => 'decimal:2',
        'realized_gains' => 'decimal:2',
        'dividends_received' => 'decimal:2',
        'shares_units' => 'decimal:6',
        'unit_price' => 'decimal:6',
        'investment_date' => 'datetime',
        'maturity_date' => 'datetime',
    ];

    /**
     * Get the user that owns the investment.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the investment plan.
     */
    public function investmentPlan(): BelongsTo
    {
        return $this->belongsTo(InvestmentPlan::class);
    }

    /**
     * Get total gains (realized + unrealized).
     */
    public function getTotalGainsAttribute(): float
    {
        return $this->realized_gains + $this->unrealized_gains;
    }

    /**
     * Get total return percentage.
     */
    public function getTotalReturnPercentageAttribute(): ?float
    {
        if ($this->total_invested == 0) {
            return null;
        }
        
        return (($this->current_value - $this->total_invested) / $this->total_invested) * 100;
    }

    /**
     * Check if the investment is active.
     */
    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    /**
     * Check if the investment has matured.
     */
    public function hasMatured(): bool
    {
        return $this->maturity_date && $this->maturity_date->isPast();
    }
}