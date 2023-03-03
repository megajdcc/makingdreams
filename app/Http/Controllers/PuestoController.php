<?php

namespace App\Http\Controllers;

use App\Jobs\verificarSiDeposito;
use App\Models\Puesto;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class PuestoController extends Controller
{
    

    private function validar(Request $request,Puesto $puesto = null) : Collection{
        return collect($request->validate([
            'tablero_id' => 'required',
            'usuario_id' => 'required',
            'ubicacion' => 'required',
        ]));
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

        try {
            DB::beginTransaction();
            $puesto = Puesto::create([
                ...$datos,
                ...[
                    'is_beneficiario' => $datos['ubicacion'] == 1 ? true : false
                ]
                ]);
            
            $puesto->load(['tablero.etapa','beneficiario']);

            DB::commit();
            $result = true;

            verificarSiDeposito::dispatch($puesto)->delay(now()->addHours(6));
        } catch (\Throwable $th) {
            DB::rollBack();
            $result = false;
        }

        return response()->json(['result' => $result, 'puesto' => $result ? $puesto : null]);
    }
    


 

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Puesto  $puesto
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Puesto $puesto)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Puesto  $puesto
     * @return \Illuminate\Http\Response
     */
    public function destroy(Puesto $puesto)
    {
        //
    }
}
