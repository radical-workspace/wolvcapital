<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdminApproval extends Model
{
    protected $fillable = [
        'user_id',
        'type',
        'data',
        'status',
        'reviewed_by',
        'reviewed_at',
        'comment'
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}