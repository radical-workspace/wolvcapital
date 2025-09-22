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
        Schema::create('user_investments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->timestamps();
            
            // References
            $table->foreignUuid('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignUuid('investment_plan_id')
                  ->constrained('investment_plans')->onDelete('cascade');
            
            // Investment Details
            $table->decimal('initial_investment', 15, 2);
            $table->decimal('current_value', 15, 2)->default(0);
            $table->decimal('total_invested', 15, 2)->default(0); // Including additional investments
            $table->decimal('total_withdrawn', 15, 2)->default(0);
            
            // Performance Tracking
            $table->decimal('unrealized_gains', 15, 2)->default(0);
            $table->decimal('realized_gains', 15, 2)->default(0);
            $table->decimal('dividends_received', 15, 2)->default(0);
            
            // Status
            $table->enum('status', ['active', 'closed', 'suspended'])->default('active');
            $table->timestamp('investment_date')->useCurrent();
            $table->timestamp('maturity_date')->nullable();
            
            // Additional Performance Metrics
            $table->decimal('shares_units', 15, 6)->nullable(); // For unit-based investments
            $table->decimal('unit_price', 15, 6)->nullable();
            
            // Indexes
            $table->index('user_id');
            $table->index('investment_plan_id');
            $table->index('status');
            $table->index('investment_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_investments');
    }
};