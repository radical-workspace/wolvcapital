<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\InvestmentPlan;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class InvestmentPlanController extends Controller
{
    /**
     * Display a listing of investment plans.
     */
    public function index(Request $request): JsonResponse
    {
        $query = InvestmentPlan::query();

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        } else {
            $query->where('status', 'active');
        }

        // Filter by risk level
        if ($request->has('risk_level')) {
            $query->where('risk_level', $request->risk_level);
        }

        // Filter by plan type
        if ($request->has('plan_type')) {
            $query->where('plan_type', $request->plan_type);
        }

        // Filter by minimum investment
        if ($request->has('min_investment')) {
            $query->where('minimum_investment', '>=', $request->min_investment);
        }

        // Show featured plans first
        $query->orderBy('is_featured', 'desc')
              ->orderBy('expected_annual_return', 'desc');

        $plans = $query->paginate(10);

        return response()->json([
            'plans' => $plans
        ]);
    }

    /**
     * Display the specified investment plan.
     */
    public function show(string $id): JsonResponse
    {
        $plan = InvestmentPlan::find($id);

        if (!$plan) {
            return response()->json([
                'error' => 'Investment plan not found'
            ], 404);
        }

        return response()->json([
            'plan' => $plan
        ]);
    }

    /**
     * Store a newly created investment plan (admin only).
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'short_description' => 'nullable|string|max:500',
            'minimum_investment' => 'required|numeric|min:0',
            'maximum_investment' => 'nullable|numeric|gt:minimum_investment',
            'expected_annual_return' => 'nullable|numeric|min:0|max:100',
            'risk_level' => 'required|in:low,medium,high',
            'plan_type' => 'required|in:stocks,bonds,mixed,crypto,real_estate,commodities',
            'duration_months' => 'nullable|integer|min:1',
            'management_fee_percentage' => 'nullable|numeric|min:0|max:10',
            'performance_fee_percentage' => 'nullable|numeric|min:0|max:50',
            'asset_allocation' => 'nullable|array',
            'requires_approval' => 'boolean',
            'investor_limit' => 'nullable|integer|min:1',
            'target_capital' => 'nullable|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'Validation failed',
                'messages' => $validator->errors()
            ], 422);
        }

        $plan = InvestmentPlan::create($validator->validated());

        return response()->json([
            'message' => 'Investment plan created successfully',
            'plan' => $plan
        ], 201);
    }

    /**
     * Update the specified investment plan (admin only).
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $plan = InvestmentPlan::find($id);

        if (!$plan) {
            return response()->json([
                'error' => 'Investment plan not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'short_description' => 'nullable|string|max:500',
            'minimum_investment' => 'nullable|numeric|min:0',
            'maximum_investment' => 'nullable|numeric|gt:minimum_investment',
            'expected_annual_return' => 'nullable|numeric|min:0|max:100',
            'risk_level' => 'nullable|in:low,medium,high',
            'plan_type' => 'nullable|in:stocks,bonds,mixed,crypto,real_estate,commodities',
            'duration_months' => 'nullable|integer|min:1',
            'management_fee_percentage' => 'nullable|numeric|min:0|max:10',
            'performance_fee_percentage' => 'nullable|numeric|min:0|max:50',
            'asset_allocation' => 'nullable|array',
            'status' => 'nullable|in:active,inactive,coming_soon,archived',
            'is_featured' => 'boolean',
            'requires_approval' => 'boolean',
            'investor_limit' => 'nullable|integer|min:1',
            'target_capital' => 'nullable|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'Validation failed',
                'messages' => $validator->errors()
            ], 422);
        }

        $plan->update($validator->validated());

        return response()->json([
            'message' => 'Investment plan updated successfully',
            'plan' => $plan
        ]);
    }

    /**
     * Remove the specified investment plan (admin only).
     */
    public function destroy(string $id): JsonResponse
    {
        $plan = InvestmentPlan::find($id);

        if (!$plan) {
            return response()->json([
                'error' => 'Investment plan not found'
            ], 404);
        }

        // Archive instead of deleting
        $plan->update(['status' => 'archived']);

        return response()->json([
            'message' => 'Investment plan archived successfully'
        ]);
    }
}