<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class InvestmentPlan extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'name',
        'description',
        'short_description',
        'minimum_investment',
        'maximum_investment',
        'expected_annual_return',
        'risk_level',
        'plan_type',
        'duration_months',
        'management_fee_percentage',
        'performance_fee_percentage',
        'asset_allocation',
        'status',
        'is_featured',
        'requires_approval',
        'investor_limit',
        'current_investors',
        'total_capital_raised',
        'target_capital',
        'additional_info',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'minimum_investment' => 'decimal:2',
        'maximum_investment' => 'decimal:2',
        'expected_annual_return' => 'decimal:2',
        'management_fee_percentage' => 'decimal:2',
        'performance_fee_percentage' => 'decimal:2',
        'total_capital_raised' => 'decimal:2',
        'target_capital' => 'decimal:2',
        'asset_allocation' => 'array',
        'additional_info' => 'array',
        'is_featured' => 'boolean',
        'requires_approval' => 'boolean',
    ];

    /**
     * Get the transactions for this investment plan.
     */
    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    /**
     * Get the user investments for this plan.
     */
    public function userInvestments(): HasMany
    {
        return $this->hasMany(UserInvestment::class);
    }

    /**
     * Get approvals related to this investment plan.
     */
    public function approvals(): HasMany
    {
        return $this->hasMany(AdminApproval::class);
    }

    /**
     * Check if the plan is available for investment.
     */
    public function isAvailable(): bool
    {
        return $this->status === 'active' && 
               ($this->investor_limit === null || $this->current_investors < $this->investor_limit);
    }

    /**
     * Get the progress towards target capital as a percentage.
     */
    public function getCapitalProgressAttribute(): ?float
    {
        if (!$this->target_capital) {
            return null;
        }
        
        return min(100, ($this->total_capital_raised / $this->target_capital) * 100);
    }
}