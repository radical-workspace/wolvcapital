<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$email = 'e2e_test_user2@example.com';
$user = User::where('email', $email)->first();
if (!$user) {
    echo "User not found\n";
    exit(1);
}
$user->password = Hash::make('password123');
$user->save();

echo "Password reset for {$email}\n";
