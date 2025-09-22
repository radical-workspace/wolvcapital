<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserProfileController;
use App\Http\Controllers\Api\InvestmentPlanController;
use App\Http\Controllers\Api\TransactionController;
use Illuminate\Support\Facades\Route;

// Auth routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/logout', [AuthController::class, 'logout']);

// Investment plans (public access)
Route::get('/investment-plans', [InvestmentPlanController::class, 'index']);
Route::get('/investment-plans/{id}', [InvestmentPlanController::class, 'show']);

// Protected routes (require authentication)
Route::middleware('auth:api')->group(function () {
    // User profile
    Route::get('/profile', [UserProfileController::class, 'show']);
    Route::put('/profile', [UserProfileController::class, 'update']);
    Route::get('/profile/investment-summary', [UserProfileController::class, 'investmentSummary']);
    
    // Transactions
    Route::get('/transactions', [TransactionController::class, 'index']);
    Route::get('/transactions/{id}', [TransactionController::class, 'show']);
    Route::post('/transactions/invest', [TransactionController::class, 'invest']);
    Route::post('/transactions/withdraw', [TransactionController::class, 'withdraw']);
    
    // Admin routes
    Route::middleware('admin')->group(function () {
        Route::post('/investment-plans', [InvestmentPlanController::class, 'store']);
        Route::put('/investment-plans/{id}', [InvestmentPlanController::class, 'update']);
        Route::delete('/investment-plans/{id}', [InvestmentPlanController::class, 'destroy']);
    });
});