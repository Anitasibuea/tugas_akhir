<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Artisan;

class CekKontrakMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next)
    {
        // Only runs once per day, not on every request
        $cacheKey = 'kontrak_checked_' . now()->toDateString();

        if (!Cache::has($cacheKey)) {
            Artisan::call('kontrak:cek-berakhir');
            Cache::put($cacheKey, true, now()->endOfDay()); // expires at midnight
        }

        return $next($request);
    }
}
