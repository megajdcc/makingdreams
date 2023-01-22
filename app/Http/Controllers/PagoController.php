<?php

namespace App\Http\Controllers;

use App\Models\Pago;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PagoController extends Controller
{
  

    public function fetchData(Request $request){

        $datos = $request->all();


        $paginator = Pago::where([
            ['monto','LIKE',"%{$datos['q']}%",'OR'],
            ['aprobado', 'LIKE', "%{$datos['q']}%", 'OR'],
            ['status', 'LIKE', "%{$datos['q']}%", 'OR'],
            ['concepto', 'LIKE', "%{$datos['q']}%", 'OR'],
            ['detalles', 'LIKE', "%{$datos['q']}%", 'OR'],
        ])
        ->whereHas('usuario',function(Builder $q) use($datos) {
            $q->orWhere([
            ['nombre', 'LIKE', "%{$datos['q']}%", 'OR'],
            ['apellido', 'LIKE', "%{$datos['q']}%", 'OR'],
            ['email', 'LIKE', "%{$datos['q']}%", 'OR'],
            ['username', 'LIKE', "%{$datos['q']}%", 'OR'],
            ]);

        })
        ->with('usuario')

        ->orderBy($datos['sortBy'] ?: 'id', $datos['isSortDirDesc'] ? 'desc' : 'asc')
        ->paginate($datos['perPage']?: 10000);

        return response()->json([
            'total' => $paginator->total(),
            'pagos' => $paginator->items()
        ]);



    }

    private function validar(Request $request){
        return $request->validate([
            'monto' => 'required',
            'status' => 'nullable',
            'aprobado' => 'nullable',
            'usuario_id' => 'required',
            'detalles' => 'nullable',
            'concepto' => 'required',
            'metodo' => 'required'
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
        try{
            DB::beginTransaction();

            $pago = Pago::create($this->validar($request));

            $pago->usuario;
            $usuario = $pago->usuario;

            DB::commit();

            $result = true;

            if(!$usuario->backoffice){
                $usuario->backoffice = true;
                $usuario->save();
            }

            // $cuenta = $usuario->cuenta;

            // $movimiento = $cuenta->addMovimiento([
            //     'monto' => $pago->monto,
            //     'tipo_movimiento' => 1,
            //     'concepto' => $pago->concepto,
            //     'balance' => $pago->monto + $cuenta->saldo 
            // ]);

        }catch(\Exception $e){
            DB::rollBack();
            $result = false;
        }

        $usuario->cargar();

        return response()->json(['result' => $result,'pago' => $result ? $pago : null,'usuario' => $usuario]);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Pago  $pago
     * @return \Illuminate\Http\Response
     */
    public function show(Pago $pago)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Pago  $pago
     * @return \Illuminate\Http\Response
     */
    public function edit(Pago $pago)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Pago  $pago
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Pago $pago)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Pago  $pago
     * @return \Illuminate\Http\Response
     */
    public function destroy(Pago $pago)
    {
        //
    }
}
