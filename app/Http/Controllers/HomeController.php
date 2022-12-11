<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\{User};
use App\Models\{Entrega,Barco,Camion,Contenedor,Compania};
use Illuminate\Support\Facades\{DB};

use Illuminate\Database\Eloquent\Builder;


class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index(Request $request)
    {

        $usuario = $request->user();
        
        $usuario->rol = $usuario->rol;
 
        if($usuario->roles->first()){
            $usuario->roles->first()->permissions;
        } 
        
        $usuario->avatar = $usuario->getAvatar();


        return view('home', compact('usuario'));

    }


    public function getDataApp(Request $request){

        $usuario = $request->user();
        $usuario->rol = $usuario->rol;

        if($usuario->roles->first()){
            $usuario->roles->first()->permissions;
        } 
        
        $usuario->avatar = $usuario->getAvatar();

        return response()->json($usuario);
        
    }


 


    public function getData(){

        $total_solicitudes = DB::table('entregas','e')
                                ->selectRaw('count(*) as cantidad, month(e.created_at) as mes, year(e.created_at) as ano')
                                ->whereRaw('year(now()) = year(e.created_at)')
                                ->groupBy(['mes','ano'])
                                ->get();

        $total_procesadas = DB::table('entregas', 'e')
        ->selectRaw('count(*) as cantidad, month(e.created_at) as mes, year(e.created_at) as ano')
        ->whereRaw('year(now()) = year(e.created_at) && e.procesada = true')
        ->groupBy(['mes', 'ano'])
        ->get();

        $total_sin_procesar = DB::table('entregas', 'e')
        ->selectRaw('count(*) as cantidad, month(e.created_at) as mes, year(e.created_at) as ano')
        ->whereRaw('year(now()) = year(e.created_at) && e.procesada = false')
        ->groupBy(['mes', 'ano'])
        ->get();

        $solicitudes = collect([]);
        $procesadas = collect([]);
        $sin_procesar = collect([]);



        for ($i=1; $i <= 12 ; $i++) { 
            $solicitudes->push($total_solicitudes->where('mes',$i)->first()?->cantidad ?: 0);
            $procesadas->push($total_procesadas->where('mes', $i)->first()?->cantidad ?: 0);
            $sin_procesar->push($total_sin_procesar->where('mes', $i)->first()?->cantidad ?: 0);


        }

        $entregas_mensuales = [

            [
                'label'=>'Solicitadas',
                'backgroundColor' =>'#f87979',
                'data' => $solicitudes
            ],

            [
                'label' => 'Solicitadas entregadas',
                'backgroundColor' => '#4ab30d',
                'data' => $procesadas
            ],

            [
                'label' => 'Sin entregar',
                'backgroundColor' => '#dd8108',
                'data' => $sin_procesar
            ],
        ];

        $result = collect([
            'solicitudes_procesadas' => Entrega::where('procesada',true)->count(),
            'solicitudes_entregas' => Entrega::get()->count(),
            'solicitudes_sin_procesar' => Entrega::where('procesada', false)->count(),
            'barcos' => Barco::get()->count(),
            'camiones' => Camion::get()->count(),
            'contenedores' => Contenedor::get()->count(),
            'entregas_mensuales' => $entregas_mensuales,
            'clientes' => User::whereHas('rol',fn(Builder $q) => $q->where('nombre','Cliente'))->count(),
            'choferes' => User::whereHas('rol', fn (Builder $q) => $q->where('nombre', 'Chofer'))->count(),
            'companias' => Compania::get()->count()



        ]);

        return response()->json($result);
    }

     public function tableroUser(){

        $result = [];
        return response()->json($result);
    }

}
