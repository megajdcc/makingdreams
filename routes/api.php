<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\{AuthController};
use App\Http\Controllers\{UserController,NotificacionController,RolController,PermisoController, CiudadController, EstadoController, HomeController, SistemaController};
use App\Models\Pais;
use App\Models\Estado;
use App\Http\Controllers\PaisController;
use App\Http\Controllers\MovimientoController;

use App\Http\Middleware\ConvertirNull;

use App\Http\Controllers\LinkController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::middleware('auth:api')->get('/user', function (Request $request) {
//     return $request->user();
// });



// Route::middleware('auth:api')->group(function(){


    Route::group(['prefix' => 'auth'], function () {
        
        Route::post('login', [AuthController::class, 'login']);
        Route::post('register', [AuthController::class, 'register']);
        Route::post('recuperar/contrasena',[AuthController::class,'recuperarContrasena']);
        Route::post('reset-password',[AuthController::class,'resetPassword']);
        

        Route::group(['middleware' => 'auth:sanctum'], function () {
            Route::get('logout', [AuthController::class, 'logout']);
            Route::get('user', [AuthController::class, 'user']);
        });

    });
    
// });





Route::group(['middleware' => 'auth:sanctum'], function () {

    // Request de usuarios Form Perfil 

    Route::post('upload/avatar', [UserController::class, 'uploadAvatar'])->name('upload_avatar');
    Route::put('perfil/update/usuario/{usuario}',[UserController::class, 'updatePerfil']);
    Route::post('cambiar/contrasena/usuario/{usuario}',[UserController::class, 'changePassword']);
    Route::put('usuario/{usuario}/crear/codigo-referidor',[UserController::class,'crearCodigo']);
    Route::put('usuario/{usuario}/agregar/telefono',[UserController::class,'agregarTelefono']);
    Route::put('usuario/{usuario}/agregar/dato/bancario', [UserController::class, 'agregarDatoBancario']);

    Route::get('usuario/{usuario}/quitar/telefono/{telefono}', [UserController::class, 'quitarTelefono']);
    Route::get('usuario/{usuario}/quitar/dato-bancario/{cuenta}', [UserController::class, 'quitarDatoBancario']);



    /*****************************/
    /* NOTIFICACIONES
    /*****************************/

    Route::get('notificaciones/{usuario}',[NotificacionController::class,'NotificacionesSinLeer']);
    Route::get('notificaciones/markread/{notificacion}/usuario/{usuario}',[NotificacionController::class,'NotificacionLeida']);
    Route::delete('notificaciones/{notificacion}/usuario/{usuario}',[NotificacionController::class,'eliminar']);
    Route::get('notificaciones/marknoread/{notificacion}/usuario/{usuario}',[NotificacionController::class,'NotificacionNoLeida']);

    Route::get('notificaciones/todoleido/usuario/{usuario}',[NotificacionController::class,'todoLeido']);
    Route::post('notificaciones/seleccionados/leidos/usuario/{usuario}',[NotificacionController::class,'seleccionadasLeidas']);
    Route::post('notificaciones/seleccionados/eliminar/usuario/{usuario}', [NotificacionController::class, 'eliminarSeleccionados']);

    /*****************************/
    /* ROLES DE USUARIO
    /*****************************/ 
    Route::resource('roles', RolController::class);
    Route::get('roles/get/permisos', [PermisoController::class, 'getPermisos'])->name('getPermisos');
    Route::get('roles/listar/table', [RolController::class, 'listar']);
    Route::delete('roles/delete/{role}', [RolController::class, 'destroy']);
    Route::get('listar/roles', [RolController::class, 'roles']);
    Route::post('fetch/roles',[RolController::class,'fetchData']);
    Route::get('roles/{role}/get',[RolController::class,'getRol']);
    


    /*****************************/
    /* PERMISOS DE USUARIO
    /*****************************/ 
    Route::resource('permisos', PermisoController::class);
    Route::get('listar/permisos', [PermisoController::class, 'listarPermisos'])->name('listar_permisos');
    Route::post('/revocar/permiso/{permiso}/role/{role}', [RolController::class, 'revocarPermiso']);
    Route::post('/listar/permisos/role/{role}', [RolController::class, 'listarPermisosRole']);
    Route::get('cargar/permisos', [PermisoController::class, 'getPermissions']);
    Route::get('permisos/listar/table',[PermisoController::class, 'listarPermisos']);
    Route::post('fetch/permisos', [PermisoController::class, 'fetchData']);
    Route::get('permisos/{permiso}/get', [PermisoController::class, 'getPermiso']);



    /*****************************/
    /* USUARIOS
    /*****************************/
    Route::get('/usuarios/all', [UserController::class, 'getUsuarios']);
    Route::resource('usuarios', UserController::class)->middleware('format_telefono');
    Route::put('usuarios/{usuario}/add/firma',[UserController::class,'updateFirma']);
    
    Route::get('listar/usuarios', [UserController::class, 'listar'])->name('listar_usuarios');
    Route::get('usuarios/{usuario}/get',[UserController::class,'getUsuario']);

    Route::post('fetch/usuarios',[UserController::class,'getUsers']);
    Route::post('usuario/{usuario}/update/avatar',[UserController::class,'actualizarAvatarUsuario']);

    Route::post('usuario/perfil/referidos',[UserController::class,'misReferidos']);

    



    /**************************/
    /* Home
    /**************************/
    Route::get('home/get/data',[HomeController::class,'getData']);


    /**************************/
    /* Pais
    /**************************/


    Route::get('get/paises',[PaisController::class,'getPaises']);
    Route::post('fetch/paises',[PaisController::class,'fetchData']);
    Route::resource('pais',PaisController::class);
    Route::get('fetch/pais/{pais}',[PaisController::class,'fetchPais']);


    /**************************/
    /* Estado
    /**************************/


    Route::get('get/estados', [EstadoController::class, 'getEstados']);
    Route::post('fetch/estados', [EstadoController::class, 'fetchData']);
    Route::resource('estados', EstadoController::class);
    Route::get('fetch/estado/{estado}', [EstadoController::class, 'fetchEstado']);

    /**************************/
    /* Ciudad
    /**************************/


    Route::get('get/ciudades', [CiudadController::class, 'getCiudades']);
    Route::post('fetch/ciudades', [CiudadController::class, 'fetchData']);
    Route::resource('ciudads', CiudadController::class);
    Route::get('fetch/ciudad/{ciudad}', [CiudadController::class, 'fetchCiudad']);


    /**************************/
    /* Sistema
    /**************************/

    Route::resource('sistemas',SistemaController::class);



    /*****************************/
    /* cuenta y movimientos
    /*****************************/

    Route::post('/movimientos/fetch/data', [MovimientoController::class, 'fetchData']);



});

Route::put('usuario/{usuario}/establecer/contrasena', [UserController::class, 'EstablecerContrasena'])->name('establecercontrasena');

Route::get('get/paises', function () {
    $paises = Pais::get();
    return response()->json($paises);
});

Route::get('get/estados/{pais}', function (Pais $pais) {
    $estados = $pais->estados;
    return response()->json($estados);
});

Route::get('get/ciudades/{estado}', function (Estado $estado) {
    $ciudades = $estado->ciudades;
    return response()->json($ciudades);
});

Route::get('sistema/fetch/data', [SistemaController::class, 'fetch']);
Route::get('fetch/link/{link}',[LinkController::class,'verificar']);
