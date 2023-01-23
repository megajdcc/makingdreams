<?php

namespace App\Http\Controllers;

use App\Models\Pago;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class PagoController extends Controller
{
  

    public function __construct()
    {
        $this->middleware('convertir_null')->only(['store']);
    }

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
            'metodo' => 'required',
            'comprobante' => 'nullable'
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

        $datos = $this->validar($request);

        try{
            DB::beginTransaction();

            \settype($datos['metodo'],'integer');

            if($datos['metodo'] === 3){

                    $imagen = $request->file('comprobante');
                    $imagen_name = \sha1($imagen->getClientOriginalName()).'.'.$imagen->getClientOriginalExtension();

                    Storage::disk('comprobante_pago')->put($imagen_name,File::get($imagen));

                    $pago = Pago::create([
                        'monto' => $datos['monto'],
                        'aprobado' => false,
                        'status' => 1,
                        'usuario_id' => $datos['usuario_id'],
                        'concepto' => $datos['concepto'],
                        'metodo' => $datos['metodo'],
                        'comprobante' => $imagen_name
                    ]);

                $usuario = $pago->usuario;
            }else{

                
                $pago = Pago::create($this->validar($request));
                
                $usuario = $pago->usuario;


                if (!$usuario->backoffice) {
                    $usuario->backoffice = true;
                    $usuario->save();
                }

            }


          

            DB::commit();

            $result = true;

           

            // $cuenta = $usuario->cuenta;

            // $movimiento = $cuenta->addMovimiento([
            //     'monto' => $pago->monto,
            //     'tipo_movimiento' => 1,
            //     'concepto' => $pago->concepto,
            //     'balance' => $pago->monto + $cuenta->saldo 
            // ]);
            $usuario->cargar();
        }catch(\Exception $e){
            DB::rollBack();
            $result = false;

            dd($e->getMessage());
        }

        

        return response()->json(['result' => $result,'pago' => $result ? $pago : null,'usuario' => $result ? $usuario : null]);
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
        try{
            DB::beginTransaction();

            $pago->update($this->validar($request));

            $pago->usuario;
            $usuario = $pago->usuario;



            DB::commit();
            $result = true;
        }catch(\Exception $e){
            DB::rollBack();
            $result = false;
        }

        $usuario->cargar();

        return response()->json(['result' => $result, 'pago' => $result ? $pago : null, 'usuario' => $usuario]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Pago  $pago
     * @return \Illuminate\Http\Response
     */
    public function destroy(Pago $pago)
    {
        try{
            DB::beginTransaction();

            if($pago->metodo === 3){
                Storage::disk('comprobante_pago')->delete($pago->comprobante);
            }

            $pago->delete();

            DB::commit();
            $result = true;

        }catch(\Exception $e){
            DB::rollBack();
            $result = false;

        }

        return response()->json([
            'result' => $result
        ]);
    }

    public function aprobarPago(Pago $pago){

        try {
            DB::beginTransaction();
            $pago->aprobado = true;
            $pago->status = 2;
            $pago->save();

            $usuario = $pago->usuario;
            $usuario->backoffice = true;
            $usuario->save();

            // Enviar notification, Email al usuario

            DB::commit();
            $result = true;
            $pago->load('usuario');

        } catch (\Throwable $th) {
            DB::rollBack();
            $result = false;
        }

        return response()->json(['result' => $result,'pago' => $pago]);

    }
}
