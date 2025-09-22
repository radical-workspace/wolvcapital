<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\InvestmentPlan;
use App\Models\UserInvestment;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller
{
    /**
     * Display a listing of user's transactions.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $query = Transaction::where('user_id', $user->id)
                           ->with(['investmentPlan', 'processedBy']);

        // Filter by transaction type
        if ($request->has('type')) {
            $query->where('transaction_type', $request->type);
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Order by most recent first
        $transactions = $query->orderBy('created_at', 'desc')->paginate(20);

        return response()->json([
            'transactions' => $transactions
        ]);
    }

    /**
     * Display the specified transaction.
     */
    public function show(Request $request, string $id): JsonResponse
    {
        $user = $request->user();
        
        $transaction = Transaction::with(['investmentPlan', 'processedBy'])
                                 ->where('user_id', $user->id)
                                 ->find($id);

        if (!$transaction) {
            return response()->json([
                'error' => 'Transaction not found'
            ], 404);
        }

        return response()->json([
            'transaction' => $transaction
        ]);
    }

    /**
     * Create a new investment transaction.
     */
    public function invest(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $validator = Validator::make($request->all(), [
            'investment_plan_id' => 'required|uuid|exists:investment_plans,id',
            'amount' => 'required|numeric|min:1',
            'payment_method' => 'required|in:bank_transfer,credit_card,debit_card,wire_transfer',
            'description' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'Validation failed',
                'messages' => $validator->errors()
            ], 422);
        }

        $plan = InvestmentPlan::find($request->investment_plan_id);

        // Check if plan is available
        if (!$plan->isAvailable()) {
            return response()->json([
                'error' => 'Investment plan is not available'
            ], 400);
        }

        // Check minimum investment
        if ($request->amount < $plan->minimum_investment) {
            return response()->json([
                'error' => "Minimum investment amount is {$plan->minimum_investment}"
            ], 400);
        }

        // Check maximum investment if set
        if ($plan->maximum_investment && $request->amount > $plan->maximum_investment) {
            return response()->json([
                'error' => "Maximum investment amount is {$plan->maximum_investment}"
            ], 400);
        }

        DB::beginTransaction();
        try {
            // Create transaction
            $transaction = Transaction::create([
                'user_id' => $user->id,
                'investment_plan_id' => $plan->id,
                'transaction_type' => 'investment',
                'amount' => $request->amount,
                'payment_method' => $request->payment_method,
                'description' => $request->description,
                'status' => $plan->requires_approval ? 'pending' : 'processing',
            ]);

            // If no approval required, create investment record
            if (!$plan->requires_approval) {
                UserInvestment::create([
                    'user_id' => $user->id,
                    'investment_plan_id' => $plan->id,
                    'initial_investment' => $request->amount,
                    'total_invested' => $request->amount,
                    'current_value' => $request->amount,
                    'investment_date' => now(),
                ]);

                // Update plan statistics
                $plan->increment('current_investors');
                $plan->increment('total_capital_raised', $request->amount);
            }

            DB::commit();

            return response()->json([
                'message' => $plan->requires_approval 
                    ? 'Investment submitted for approval' 
                    : 'Investment created successfully',
                'transaction' => $transaction->load('investmentPlan')
            ], 201);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'error' => 'Failed to create investment'
            ], 500);
        }
    }

    /**
     * Create a withdrawal request.
     */
    public function withdraw(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $validator = Validator::make($request->all(), [
            'user_investment_id' => 'required|uuid|exists:user_investments,id',
            'amount' => 'required|numeric|min:1',
            'description' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'Validation failed',
                'messages' => $validator->errors()
            ], 422);
        }

        $investment = UserInvestment::where('user_id', $user->id)
                                   ->where('id', $request->user_investment_id)
                                   ->first();

        if (!$investment) {
            return response()->json([
                'error' => 'Investment not found'
            ], 404);
        }

        // Check if withdrawal amount is valid
        $availableAmount = $investment->current_value - $investment->total_withdrawn;
        if ($request->amount > $availableAmount) {
            return response()->json([
                'error' => "Maximum withdrawal amount is {$availableAmount}"
            ], 400);
        }

        $transaction = Transaction::create([
            'user_id' => $user->id,
            'investment_plan_id' => $investment->investment_plan_id,
            'transaction_type' => 'withdrawal',
            'amount' => $request->amount,
            'description' => $request->description,
            'status' => 'pending', // Withdrawals typically require approval
        ]);

        return response()->json([
            'message' => 'Withdrawal request submitted for approval',
            'transaction' => $transaction->load('investmentPlan')
        ], 201);
    }
}