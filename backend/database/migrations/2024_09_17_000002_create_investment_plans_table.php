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
        Schema::create('investment_plans', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->timestamps();
            
            // Plan Details
            $table->string('name');
            $table->text('description')->nullable();
            $table->text('short_description')->nullable();
            
            // Financial Details
            $table->decimal('minimum_investment', 15, 2)->default(0);
            $table->decimal('maximum_investment', 15, 2)->nullable();
            $table->decimal('expected_annual_return', 5, 2)->nullable(); // Percentage
            $table->enum('risk_level', ['low', 'medium', 'high']);
            
            // Plan Configuration
            $table->enum('plan_type', ['stocks', 'bonds', 'mixed', 'crypto', 'real_estate', 'commodities']);
            $table->integer('duration_months')->nullable(); // NULL for open-ended plans
            $table->decimal('management_fee_percentage', 5, 2)->default(0);
            $table->decimal('performance_fee_percentage', 5, 2)->default(0);
            
            // Asset Allocation (JSON for flexibility)
            $table->json('asset_allocation')->nullable(); // e.g., {"stocks": 60, "bonds": 30, "cash": 10}
            
            // Status and Availability
            $table->enum('status', ['active', 'inactive', 'coming_soon', 'archived'])
                  ->default('active');
            $table->boolean('is_featured')->default(false);
            $table->boolean('requires_approval')->default(false);
            
            // Investment Limits
            $table->integer('investor_limit')->nullable(); // Maximum number of investors
            $table->integer('current_investors')->default(0);
            $table->decimal('total_capital_raised', 15, 2)->default(0);
            $table->decimal('target_capital', 15, 2)->nullable();
            
            // Metadata
            $table->json('additional_info')->nullable(); // Flexible storage
            
            // Indexes
            $table->index('status');
            $table->index('plan_type');
            $table->index('risk_level');
            $table->index('is_featured');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('investment_plans');
    }
};