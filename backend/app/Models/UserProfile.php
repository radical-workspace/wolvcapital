<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserProfile extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'id',
        'first_name',
        'last_name',
        'date_of_birth',
        'phone_number',
        'street_address',
        'city',
        'state',
        'postal_code',
        'country',
        'risk_tolerance',
        'investment_experience',
        'annual_income_range',
        'net_worth_range',
        'kyc_status',
        'account_status',
        'email_notifications',
        'sms_notifications',
        'newsletter_subscription',
        'onboarding_completed',
        'terms_accepted_at',
        'privacy_policy_accepted_at',
        'avatar_url',
        'last_login',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'date_of_birth' => 'date',
        'email_notifications' => 'boolean',
        'sms_notifications' => 'boolean',
        'newsletter_subscription' => 'boolean',
        'onboarding_completed' => 'boolean',
        'terms_accepted_at' => 'datetime',
        'privacy_policy_accepted_at' => 'datetime',
        'last_login' => 'datetime',
    ];

    /**
     * Get the user that owns the profile.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the full name attribute.
     */
    public function getFullNameAttribute(): ?string
    {
        if (!$this->first_name && !$this->last_name) {
            return null;
        }
        
        return trim($this->first_name . ' ' . $this->last_name);
    }
}