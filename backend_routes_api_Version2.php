<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AdminApprovalController;
use App\Http\Controllers\Api\UserProfileController;

// Public auth routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::get('/profile', [UserProfileController::class, 'show']);
    Route::put('/profile', [UserProfileController::class, 'update']);

    // User can submit approval requests
    Route::post('/approvals', [AdminApprovalController::class, 'store']);

    // Admin-only routes
    Route::middleware('can:isAdmin')->group(function () {
        Route::get('/approvals', [AdminApprovalController::class, 'index']);
        Route::put('/approvals/{id}', [AdminApprovalController::class, 'update']);
    });
});