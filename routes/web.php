<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ApplicationController;
use App\Models\User;


use App\Models\Sistema;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/


Route::get('/usuario/{usuario}/establecer/contrasena', function (User $usuario) {

   $sistema = Sistema::get()->first();

   $app_name = $sistema->nombre;
   $app_logo = "/storage/logotipos/{$sistema->logotipo_oscuro}";

   if ($usuario->is_password) {
      return redirect('/login');
   } else {
      return view('application', compact('app_name','app_logo','sistema','usuario'));
   }


});


Route::get('/reset-password/{token}', function ($token) {
      $sistema = Sistema::get()->first();

      $app_name = $sistema->nombre;
      $app_logo = "/storage/logotipos/{$sistema->logotipo_oscuro}";

      
   return view('application',\compact('app_name', 'app_logo','token'));
})->middleware('guest')->name('password.reset');
// Route::view('cotizacion/reserva/{reserva}','application');


Route::get('/{any}', [ApplicationController::class, 'index'])->where('any', '.*');


