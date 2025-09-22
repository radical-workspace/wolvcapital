<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transaction extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'user_id',
        'investment_plan_id',
        'transaction_type',
        'amount',
        'currency',
        'status',
        'payment_method',
        'payment_reference',
        'description',
        'notes',
        'fees',
        'processed_at',
        'processed_by',
        'failure_reason',
        'external_transaction_id',
        'bank_reference',
        'metadata',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'amount' => 'decimal:2',
        'fees' => 'decimal:2',
        'net_amount' => 'decimal:2',
        'processed_at' => 'datetime',
        'metadata' => 'array',
    ];

    /**
     * Get the user that owns the transaction.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the investment plan associated with the transaction.
     */
    public function investmentPlan(): BelongsTo
    {
        return $this->belongsTo(InvestmentPlan::class);
    }

    /**
     * Get the admin who processed the transaction.
     */
    public function processedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'processed_by');
    }

    /**
     * Get approvals related to this transaction.
     */
    public function approvals()
    {
        return $this->hasMany(AdminApproval::class);
    }

    /**
     * Check if the transaction is completed.
     */
    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    /**
     * Check if the transaction is pending.
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Check if the transaction failed.
     */
    public function isFailed(): bool
    {
        return in_array($this->status, ['failed', 'cancelled', 'refunded']);
    }

    /**
     * Get the net amount (amount - fees).
     */
    public function getNetAmountAttribute(): float
    {
        return $this->amount - $this->fees;
    }
}