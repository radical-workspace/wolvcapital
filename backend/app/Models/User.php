<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasUuids;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'email',
        'password',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * Kept as $casts property so Laravel handles them correctly.
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    /**
     * Get the user's profile.
     */
    public function profile(): HasOne
    {
        // user_profiles uses 'id' as the primary key and references users.id.
        // Define relation explicitly so Eloquent doesn't expect user_profiles.user_id.
        return $this->hasOne(UserProfile::class, 'id', 'id');
    }

    /**
     * Get the user's transactions.
     */
    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    /**
     * Get the user's investments.
     */
    public function investments(): HasMany
    {
        return $this->hasMany(UserInvestment::class);
    }

    /**
     * Get approvals requested by this user.
     */
    public function requestedApprovals(): HasMany
    {
        return $this->hasMany(AdminApproval::class, 'requested_by');
    }

    /**
     * Get approvals assigned to this user.
     */
    public function assignedApprovals(): HasMany
    {
        return $this->hasMany(AdminApproval::class, 'assigned_to');
    }

    /**
     * Check if user is admin.
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }
}