<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class UserProfileController extends Controller
{
    public function show(Request $request)
    {
        return response()->json($request->user());
    }

    public function update(Request $request)
    {
        $fields = $request->validate([
            'name' => 'nullable|string|max:255',
            'email' => 'nullable|string|email|max:255'
        ]);
        $user = $request->user();
        $user->update($fields);
        return response()->json($user);
    }
}