<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class TrimStrings
{
    public function handle(Request $request, Closure $next)
    {
        // Minimal placeholder: do nothing for now
        return $next($request);
    }
}
