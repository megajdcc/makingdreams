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
            'direccion_bitcoin' => 'nullable',
            'paypal' => 'nullable',
            'wompi' => 'nullable',
            'mercado_pago' => 'nullable',
        ]);


        try{
            DB::beginTransaction();
          

            $sistema->update($datos);
            
            DB::commit();

            $result = true;
        }catch(\Exception $e){

            DB::rollBack();
            $result = false;
            
            dd($e->getMessage());
        }


        return response()->json(['result' => $result,'sistema' => $sistema]);

    }

    public function updateLogo(Request $request, Sistema $sistema, String $modo){

        $archivo = $request->file('archivo');

        $logotipo_claro_name = null;
        $logotipo_oscuro_name = null;

        if($archivo && $modo == 'claro'){

            if($sistema->logotipo_claro) {
                Storage::disk('logotipos')->delete($sistema->logotipo_claro);
            }


            $logotipo_claro_name = \sha1($archivo->getClientOriginalName()) . '.' . $archivo->getClientOriginalExtension();

            Storage::disk('logotipos')->put($logotipo_claro_name, File::get($archivo));


        }

        if($archivo && $modo == 'oscuro'){
            if($sistema->logotipo_oscuro) {
                Storage::disk('logotipos')->delete($sistema->logotipo_oscuro);
            }
            $logotipo_oscuro_name = \sha1($archivo->getClientOriginalName()) . '.' . $archivo->getClientOriginalExtension();

            Storage::disk('logotipos')->put($logotipo_oscuro_name, File::get($archivo));

        }

        $result = $sistema->update([
            'logotipo_oscuro' => isset($logotipo_oscuro_name) ? $logotipo_oscuro_name : $sistema->logotipo_oscuro,
            'logotipo_clalro' =>  isset($logotipo_claro_name) ? $logotipo_claro_name : $sistema->logotipo_claro,
        ]);

        $sistema->refresh();


        return response()->json(compact('result','sistema'));


    }

 



}
