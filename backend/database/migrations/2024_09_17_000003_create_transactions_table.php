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
        Schema::create('transactions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->timestamps();
            
            // User and Plan References
            $table->foreignUuid('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignUuid('investment_plan_id')->nullable()
                  ->constrained('investment_plans')->onDelete('set null');
            
            // Transaction Details
            $table->enum('transaction_type', [
                'investment', 'withdrawal', 'dividend', 'fee', 
                'transfer_in', 'transfer_out', 'refund'
            ]);
            
            $table->decimal('amount', 15, 2);
            $table->string('currency', 3)->default('USD');
            
            // Status Tracking
            $table->enum('status', [
                'pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'
            ])->default('pending');
            
            // Payment Information
            $table->enum('payment_method', [
                'bank_transfer', 'credit_card', 'debit_card', 
                'wire_transfer', 'crypto', 'internal_transfer'
            ])->nullable();
            $table->string('payment_reference')->nullable(); // External payment gateway reference
            
            // Transaction Metadata
            $table->text('description')->nullable();
            $table->text('notes')->nullable(); // Internal notes for admin use
            $table->decimal('fees', 15, 2)->default(0);
            $table->decimal('net_amount', 15, 2)->storedAs('amount - fees');
            
            // Processing Information
            $table->timestamp('processed_at')->nullable();
            $table->foreignUuid('processed_by')->nullable()
                  ->constrained('users')->onDelete('set null'); // Admin who processed
            $table->text('failure_reason')->nullable();
            
            // External References
            $table->string('external_transaction_id')->nullable(); // Payment gateway transaction ID
            $table->string('bank_reference')->nullable();
            
            // Metadata
            $table->json('metadata')->nullable(); // Flexible storage for additional data
            
            // Indexes
            $table->index('user_id');
            $table->index('investment_plan_id');
            $table->index('transaction_type');
            $table->index('status');
            $table->index('created_at');
            $table->index('processed_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};