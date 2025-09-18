<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AdminApproval extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'approval_type',
        'user_id',
        'transaction_id',
        'investment_plan_id',
        'requested_by',
        'title',
        'description',
        'request_data',
        'status',
        'priority',
        'assigned_to',
        'approved_by',
        'rejected_by',
        'approved_at',
        'rejected_at',
        'rejection_reason',
        'approval_notes',
        'tags',
        'external_reference',
        'attachments',
        'expires_at',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'request_data' => 'array',
        'tags' => 'array',
        'attachments' => 'array',
        'approved_at' => 'datetime',
        'rejected_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    /**
     * Get the user this approval is for.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the transaction this approval is for.
     */
    public function transaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class);
    }

    /**
     * Get the investment plan this approval is for.
     */
    public function investmentPlan(): BelongsTo
    {
        return $this->belongsTo(InvestmentPlan::class);
    }

    /**
     * Get the user who requested this approval.
     */
    public function requester(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requested_by');
    }

    /**
     * Get the admin assigned to this approval.
     */
    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    /**
     * Get the admin who approved this.
     */
    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    /**
     * Get the admin who rejected this.
     */
    public function rejector(): BelongsTo
    {
        return $this->belongsTo(User::class, 'rejected_by');
    }

    /**
     * Check if the approval is pending.
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Check if the approval is approved.
     */
    public function isApproved(): bool
    {
        return $this->status === 'approved';
    }

    /**
     * Check if the approval is rejected.
     */
    public function isRejected(): bool
    {
        return $this->status === 'rejected';
    }

    /**
     * Check if the approval has expired.
     */
    public function hasExpired(): bool
    {
        return $this->expires_at && $this->expires_at->isPast();
    }
}