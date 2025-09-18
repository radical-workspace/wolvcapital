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
        Schema::create('user_profiles', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreign('id')->references('id')->on('users')->onDelete('cascade');
            $table->timestamps();
            
            // Personal Information
            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->string('phone_number')->nullable();
            
            // Address Information
            $table->text('street_address')->nullable();
            $table->string('city')->nullable();
            $table->string('state')->nullable();
            $table->string('postal_code')->nullable();
            $table->string('country')->default('US');
            
            // Investment Profile
            $table->enum('risk_tolerance', ['conservative', 'moderate', 'aggressive'])
                  ->default('moderate');
            $table->enum('investment_experience', ['beginner', 'intermediate', 'advanced'])
                  ->default('beginner');
            $table->enum('annual_income_range', [
                'under_50k', '50k_100k', '100k_250k', '250k_500k', 'over_500k'
            ])->nullable();
            $table->enum('net_worth_range', [
                'under_100k', '100k_500k', '500k_1m', '1m_5m', 'over_5m'
            ])->nullable();
            
            // Account Status
            $table->enum('kyc_status', ['pending', 'in_review', 'approved', 'rejected'])
                  ->default('pending');
            $table->enum('account_status', ['active', 'suspended', 'closed'])
                  ->default('active');
            
            // Preferences
            $table->boolean('email_notifications')->default(true);
            $table->boolean('sms_notifications')->default(false);
            $table->boolean('newsletter_subscription')->default(true);
            
            // Metadata
            $table->boolean('onboarding_completed')->default(false);
            $table->timestamp('terms_accepted_at')->nullable();
            $table->timestamp('privacy_policy_accepted_at')->nullable();
            $table->string('avatar_url')->nullable();
            $table->timestamp('last_login')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_profiles');
    }
};