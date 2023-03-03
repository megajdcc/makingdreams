<?php

namespace App\Http\Controllers;

use App\Models\Puesto;
use App\Models\Tablero;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TableroController extends Controller
{
   
    public function getAll(){
        $tableros = Tablero::all();
        $tableros->load(['puestos','etapa']);

        return response()->json($tableros);

    }

    public function fetchData(Request $request){
        $datos = $request->all();

        $paginator = Puesto::whereNull('cierre')
        ->whereHas('tablero',function(Builder $q) use($datos){
            $q->where('etapa_id',$datos['etapa']);
        })
        ->whereHas('beneficiario',function(Builder $q) use($datos){
            $q->orWhere([
                ['nombre','like',"%{$datos['q']}%",'OR'],
                ['apellido', 'like', "%{$datos['q']}%", 'OR'],
                ['email', 'like', "%{$datos['q']}%", 'OR'],
                ['username', 'like', "%{$datos['q']}%", 'OR'],
            ]);
        })
        ->with(['tablero.etapa','beneficiario'])
        ->orderBy($datos['sortBy'] ?: 'id' , $datos['isSortDirDesc'] ? 'Desc' : 'asc')
        ->paginate($datos['perPage'] ?: 1000);

        
        $puestos = collect($paginator->items());

        $puestos->each(function($puesto){
            $puesto->beneficiario->avatar = $puesto->beneficiario->getAvatar();
        });
        
        return response()->json( [
            'total' => $paginator->total(),
            'puestos' => $puestos
        ]); 

    }   


    private function validar(Request $request) : array{
        return $request->validate([
            'beneficiario_id' => 'required',
            'etapa_id'        => 'required',
            'tablero_id'      => 'nullable'
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
        $datos  = $this->validar($request);
        try {
            DB::beginTransaction();
            $tablero = Tablero::create($datos);

            $tablero->load(['beneficiario','tablero','abonadores','etapa']);

            DB::commit();
            $result  =true;

        } catch (\Throwable $th) {
            DB::rollBack();
            $result = false;

        }

        return response()->json(['result' => $result, 'tablero' => $result ? $tablero : null]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Tablero  $tablero
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Tablero $tablero)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Tablero  $tablero
     * @return \Illuminate\Http\Response
     */
    public function destroy(Tablero $tablero)
    {
        //
    }


}
