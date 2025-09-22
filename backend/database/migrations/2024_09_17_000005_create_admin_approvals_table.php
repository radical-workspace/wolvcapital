<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('admin_approvals', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->timestamps();
            
            // Request Details
            $table->enum('approval_type', [
                'kyc_verification', 'large_investment', 'withdrawal_request',
                'account_closure', 'investment_plan_creation', 'user_suspension',
                'document_verification', 'bank_account_change', 'high_risk_investment'
            ]);
            
            // Subject References
            $table->foreignUuid('user_id')->nullable()
                  ->constrained('users')->onDelete('cascade');
            $table->foreignUuid('transaction_id')->nullable()
                  ->constrained('transactions')->onDelete('cascade');
            $table->foreignUuid('investment_plan_id')->nullable()
                  ->constrained('investment_plans')->onDelete('cascade');
            
            // Request Information
            $table->foreignUuid('requested_by')->constrained('users');
            $table->string('title');
            $table->text('description')->nullable();
            $table->json('request_data')->nullable(); // Flexible storage for request-specific data
            
            // Approval Status
            $table->enum('status', [
                'pending', 'under_review', 'approved', 'rejected', 'cancelled', 'expired'
            ])->default('pending');
            $table->enum('priority', ['low', 'medium', 'high', 'critical'])->default('medium');
            
            // Assignment
            $table->foreignUuid('assigned_to')->nullable()
                  ->constrained('users')->onDelete('set null');
            
            // Processing Information
            $table->foreignUuid('approved_by')->nullable()
                  ->constrained('users')->onDelete('set null');
            $table->foreignUuid('rejected_by')->nullable()
                  ->constrained('users')->onDelete('set null');
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('rejected_at')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->text('approval_notes')->nullable();
            
            // Metadata
            $table->json('tags')->nullable();
            $table->string('external_reference')->nullable();
            $table->json('attachments')->nullable(); // URLs to supporting documents
            $table->timestamp('expires_at')->nullable();
            
            // Indexes
            $table->index('status');
            $table->index('approval_type');
            $table->index('user_id');
            $table->index('assigned_to');
            $table->index('priority');
            $table->index('created_at');
            $table->index('expires_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admin_approvals');
    }
};