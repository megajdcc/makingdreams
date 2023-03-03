<?php

namespace App\Http\Controllers;

use App\Models\Etapa;
use App\Models\Tablero;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class EtapaController extends Controller
{
   
    public function fetchData(Request $request){


        $datos  = $request->all();

        $paginator = Etapa::where([
            ['monto','like',"%{$datos['q']}%",'or'],
            ['nombre', 'like', "%{$datos['q']}%", 'or'],
            ['descripcion', 'like', "%{$datos['q']}%", 'or'],
            ['remuneracion', 'like', "%{$datos['q']}%", 'or'],
        ])
        ->with(['etapa','tableros'])
        ->orderBy($datos['sortBy'] ?: 'id', $datos['isSortDirDesc'] ? 'desc' : 'asc')
        ->paginate($datos['perPage']?: 10000);
        
        
        return response()->json([
            'total' => $paginator->total(),
            'etapas' => $paginator->items()
        ]);


    }


    public function fetch(Etapa $etapa){

        $etapa->load(['etapa','tableros']);

        return response()->json($etapa);


    }


    public function getAll(){

        $etapas = Etapa::orderBy('monto')->get();
        $etapas->load(['etapa','tablero']);
        
        return response()->json($etapas);

    }

    private function validar(Request $request, Etapa $etapa = null) : array{

        return $request->validate([
            'monto' => 'required',
            'nombre' => ['required',$etapa ? Rule::unique('etapas','nombre')->ignore($etapa) : 'unique:etapas,nombre'],
            'remuneracion' => 'nullable',
            'descripcion' => 'nullable',
            'etapa_id' => 'nullable'
        ],[
            'nombre.unique' => 'El nombre de la etapa ya existe, inténte con otro'
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
            $etapa = Etapa::create($datos);

            DB::commit();
            $result = true;

            $etapa->refresh();
            $etapa->load(['etapa', 'tableros']);

        }catch(\Exception $e){
            DB::rollBack();
            $result = false;

            dd($e->getMessage());
        }

        return response()->json([
            'result' => $result,
            'etapa' => $result ? $etapa : null
        ]);
    }

   


    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Etapa  $etapa
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Etapa $etapa)
    {
        $datos = $this->validar($request,$etapa);

        try {
            DB::beginTransaction();
            $etapa->update($datos);
            DB::commit();
            $result = true;
            $etapa->refresh();
            $etapa->load(['etapa', 'tableros']);
        } catch (\Exception $e) {
            DB::rollBack();
            $result = false;
        }

        return response()->json([
            'result' => $result,
            'etapa' => $result ? $etapa : null
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Etapa  $etapa
     * @return \Illuminate\Http\Response
     */
    public function destroy(Etapa $etapa)
    {
        try {
            DB::beginTransaction();
                $etapa->delete();
            DB::commit();
            $result = true;
        } catch (\Throwable $th) {
            DB::rollBack();
            $result = false;
        }

        return response()->json(['result' => $result]);
    }
}
