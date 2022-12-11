<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ApplicationController;
use App\Models\{OrdenEntrega,Factura};
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\{Storage,File};


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


Route::get('/view/orden/{orden}/pdf',function(OrdenEntrega $orden){

   $data = [
      'cliente'               => $orden->cliente,
      'orden'                 => $orden,
      'contenedor'            => $orden->entrega->contenedor->contenedor->numero,
      'seal'                  => $orden->entrega->contenedor->seal,
      'llegada'               => $orden->entrega->contenedor->atraque->llegada,
      'hazmat'                => $orden->entrega->contenedor->hazmat,
      'booking'               => $orden->entrega->contenedor->booking,
      'destino'               => $orden->entrega->destino->destino,
      'cliente_destino'       => $orden->entrega?->cita?->nombre,
      'fecha_cita'            => $orden->entrega?->cita?->fecha,
      'hora_cita'             => $orden->entrega?->cita?->hora,
      'confirmacion'          => $orden->entrega?->cita?->confirmacion,
      'informacion_adicional' => $orden->entrega->informacion_adicional,
      'comentarios'           => $orden->comentarios,
      'compania' => $orden->entrega->compania->nombre,
      'logo' => "data:image/png;base64," . base64_encode(Storage::get('public/logo.png'))

   ];

    return PDF::loadView('pdfs.orden', $data)
      // ->setPaper('a4', 'landscape')
      ->stream('archivo.pdf');
});



Route::get('/view/facturas/{factura}/pdf',function(Factura $factura){

   $data = [
      'factura' => $factura,
      'orden' => $factura->orden,
      'vendido' => $factura->vendido,
      'compania' => $factura->compania,
      'cliente' => $factura->cliente,
      'logo' => "data:image/png;base64," . base64_encode(Storage::get('public/logo.png'))

   ];

    return PDF::loadView('pdfs.factura', $data)
      // ->setPaper('a4', 'landscape')
      ->stream('archivo.pdf');

      
});


Route::get('/usuario/{usuario}/establecer/contrasena', function (User $usuario) {

   if ($usuario->is_password) {
      return redirect('/login');
   } else {
      return view('application', ['usuario' => $usuario]);
   }


});


Route::get('/reset-password/{token}', function ($token) {
   return view('application',
      ['token' => $token]
   );
})->middleware('guest')->name('password.reset');
// Route::view('cotizacion/reserva/{reserva}','application');


Route::get('/{any}', [ApplicationController::class, 'index'])->where('any', '.*');


