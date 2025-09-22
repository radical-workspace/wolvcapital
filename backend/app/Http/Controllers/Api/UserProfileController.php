<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UserProfile;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class UserProfileController extends Controller
{
    /**
     * Display the user's profile.
     */
    public function show(Request $request): JsonResponse
    {
        $user = $request->user(); // This would come from authentication middleware
        $profile = UserProfile::with('user')->find($user->id);

        if (!$profile) {
            return response()->json([
                'error' => 'Profile not found'
            ], 404);
        }

        return response()->json([
            'profile' => $profile
        ]);
    }

    /**
     * Update the user's profile.
     */
    public function update(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $validator = Validator::make($request->all(), [
            'first_name' => 'nullable|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'date_of_birth' => 'nullable|date|before:today',
            'phone_number' => 'nullable|string|max:20',
            'street_address' => 'nullable|string',
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:20',
            'country' => 'nullable|string|max:2',
            'risk_tolerance' => 'nullable|in:conservative,moderate,aggressive',
            'investment_experience' => 'nullable|in:beginner,intermediate,advanced',
            'annual_income_range' => 'nullable|in:under_50k,50k_100k,100k_250k,250k_500k,over_500k',
            'net_worth_range' => 'nullable|in:under_100k,100k_500k,500k_1m,1m_5m,over_5m',
            'email_notifications' => 'nullable|boolean',
            'sms_notifications' => 'nullable|boolean',
            'newsletter_subscription' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'Validation failed',
                'messages' => $validator->errors()
            ], 422);
        }

        $profile = UserProfile::updateOrCreate(
            ['id' => $user->id],
            $validator->validated()
        );

        return response()->json([
            'message' => 'Profile updated successfully',
            'profile' => $profile
        ]);
    }

    /**
     * Get user's investment summary.
     */
    public function investmentSummary(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $investments = $user->investments()
            ->with('investmentPlan')
            ->where('status', 'active')
            ->get();

        $summary = [
            'total_invested' => $investments->sum('total_invested'),
            'current_value' => $investments->sum('current_value'),
            'total_gains' => $investments->sum('unrealized_gains') + $investments->sum('realized_gains'),
            'total_return_percentage' => 0,
            'investments_count' => $investments->count(),
        ];

        if ($summary['total_invested'] > 0) {
            $summary['total_return_percentage'] = 
                (($summary['current_value'] - $summary['total_invested']) / $summary['total_invested']) * 100;
        }

        return response()->json([
            'summary' => $summary,
            'investments' => $investments
        ]);
    }
}