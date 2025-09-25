<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class Authenticate
{
    public function handle(Request $request, Closure $next, $guard = null)
    {
        // Minimal placeholder: do not enforce auth in local dev
        return $next($request);
    }
}
