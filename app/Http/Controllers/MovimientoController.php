<?php

namespace App\Http\Controllers;

use App\Models\Movimiento;
use Illuminate\Http\Request;
use App\Models\EstadoCuenta;

use Illuminate\Database\Eloquent\Builder;

class MovimientoController extends Controller
{
    
    public function getMovimientos(EstadoCuenta $cuenta){

        $movimientos = $cuenta->movimientos;

        foreach($movimientos as $movimiento ){
            $movimiento->cuenta?->usuario;

        }
        
        return response()->json($movimientos);

    }


    public function fetchData(Request $request){

        $datos = $request->all();

        if(!$request->user()->cuenta){
            $request->user()->aperturarCuenta();
        }


        $pagination = Movimiento::whereHas('cuenta',function(Builder $q) use ($request) {
                                $q->where('usuario_id',$request->user()->id);
                            })
                            ->where([
                                ['monto','LIKE',"%{$datos['q']}%",'OR'],
                                ['balance', 'LIKE', "%{$datos['q']}%", 'OR'],
                                ['concepto','LIKE',"%{$datos['q']}%",'OR'],
                                ['created_at', 'LIKE', "%{$datos['q']}%", 'OR'],
                            ])
                            ->orderBy($datos['sortBy'],$datos['isSortDirDesc'] ? 'desc' : 'asc')
                            ->paginate($datos['perPage'] == 0  ? 10000 : $datos['perPage']);

                            $movimientos = $pagination->items();

                        foreach($movimientos as $movimiento){
                            
                            $movimiento->cuenta->usuario;
                            $movimiento->_cellVariants =  ['monto' => $movimiento->tipo_movimiento == 1 ? 'success' : 'danger' , "balance" => $movimiento->tipo_movimiento == 1 ? 'success' : 'danger' ];
                        }


                    return response()->json([
                        'total' => $pagination->total(),
                        'movimientos' => $movimientos
                    ]);

    }



    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Movimiento  $movimiento
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Movimiento $movimiento)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Movimiento  $movimiento
     * @return \Illuminate\Http\Response
     */
    public function destroy(Movimiento $movimiento)
    {
        //
    }
}
