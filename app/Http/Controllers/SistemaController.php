<?php

namespace App\Http\Controllers;

use App\Models\Cuenta;
use App\Models\Sistema;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{DB,Storage,File};

class SistemaController extends Controller
{
    
    public function __construct()
    {
        $this->middleware('convertir_null')->only('update');
    }
    
    public function fetch(){

        $sistema = Sistema::get()->first(); 

        $sistema->load('cuentas');

        return response()->json($sistema);

    }
   
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Sistema  $sistema
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Sistema $sistema)
    {
        
        $datos = $request->validate([
            'id' => 'nullable',
            'nombre' => 'required',
            'terminos' => 'nullable',
            'monto_inicial' => 'required',
            'logotipo_claro' => 'required_without:id',
            'logotipo_oscuro' => 'required_without:id',
        ]);


        try{
            DB::beginTransaction();

            $logotipo_claro_name = null;
            $logotipo_oscuro_name = null;

            if($datos['logotipo_claro']){

                if($sistema->logotipo_claro) {
                    Storage::disk('logotipos')->delete($sistema->logotipo_claro);
                }

                $logotipo_claro = $request->file('logotipo_claro');

                $logotipo_claro_name = \sha1($logotipo_claro->getClientOriginalName()) . '.' . $logotipo_claro->getClientOriginalExtension();

                Storage::disk('logotipos')->put($logotipo_claro_name, File::get($logotipo_claro));


            }

            if($datos['logotipo_oscuro']){
                if($sistema->logotipo_oscuro) {
                    Storage::disk('logotipos')->delete($sistema->logotipo_oscuro);
                }

                $logotipo_oscuro = $request->file('logotipo_oscuro');

                $logotipo_oscuro_name = \sha1($logotipo_oscuro->getClientOriginalName()) . '.' . $logotipo_oscuro->getClientOriginalExtension();

                Storage::disk('logotipos')->put($logotipo_oscuro_name, File::get($logotipo_oscuro));

            }
          

            $sistema->update([...$datos,...[
                'logotipo_claro' => $logotipo_claro_name ?:  $sistema->logotipo_claro,
                'logotipo_oscuro' => $logotipo_oscuro_name ?: $sistema->logotipo_oscuro
            ]]);
            
            DB::commit();

            $result = true;
        }catch(\Exception $e){

            DB::rollBack();
            $result = false;
            
            dd($e->getMessage());
        }


        return response()->json(['result' => $result,'sistema' => $sistema]);

    }

    public function agregarCuenta(Request $request,Sistema $sistema){


        $datos = $request->validate([
            'entidad' => 'required',
            'numero' =>  'required'
        ]);

        try{
            DB::beginTransaction();

            $cuenta = $sistema->agregarCuenta($datos);

            DB::commit();
            $result = true;
        }catch(\Exception $e){
            DB::rollBack();
            $result = false;
        }

        $sistema->load('cuentas');

        return response()->json(['result' => $result, 'sistema' => $sistema,'cuenta' => $result ? $cuenta : null]);

    }

    public function quitarCuenta(Sistema $sistema, Cuenta $cuenta){
        try {
            DB::beginTransaction();

            $result = $sistema->quitarCuenta($cuenta);

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            $result = false;
        }

        $sistema->load('cuentas');

        return response()->json(['result' => $result, 'sistema' => $sistema]);
    }


}
