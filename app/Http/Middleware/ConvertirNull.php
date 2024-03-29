<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class ConvertirNull
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {   

        foreach ($request->all() as $key =>  $valor) {
            if($valor == "null") {
                $request->merge([$key => null]);
            }
        }

        return $next($request);
    }
}
