<?php

namespace App\Http\Controllers;

use App\Models\Contacto;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ContactoController extends Controller
{
    
    public function fetchData(Request $request){

        $datos = $request->all();

        $paginator = Contacto::where([
            ['whatsapp','like',"%{$datos['q']}%",'OR'],
            ['correo', 'like', "%{$datos['q']}%", 'OR'],
            ['telefono_1', 'like', "%{$datos['q']}%", 'OR'],
            ['telefono_2', 'like', "%{$datos['q']}%", 'OR'],
            ['otro', 'like', "%{$datos['q']}%", 'OR'],
        ])->whereHas('usuario',function(Builder $q) use($datos){
            $q->where([
                    ['nombre', 'like', "%{$datos['q']}%", 'OR'],
                    ['apellido', 'like', "%{$datos['q']}%", 'OR'],
                    ['username', 'like', "%{$datos['q']}%", 'OR'],
            ]);
        })
        ->with('usuario')
        ->sortBy($datos['sortBy'] ?: 'id',$datos['isSortDirDesc'] ? 'desc' : 'asc')
        ->paginate($datos['perPage']?: 1000);

        return response()->json([
            'total' => $paginator->total(),
            'contactos' => $paginator->items()
        ]);


    }

    public function fetch(Contacto $contacto){

        $contacto->load(['usuario']);

        return response()->json($contacto);
    }

    public function fetchForUser(User $usuario)
    {
        $contacto = $usuario->contacto;

        $contacto->load(['usuario']);

        return response()->json($contacto);
    }



    private  function validar(Request $request, Contacto $contacto = null){
        return $request->validate([
            'whatsapp'   => 'nullable',
            'correo'     => 'nullable|email',
            'telefono_1' => 'nullable',
            'telefono_2' => 'nullable',
            'otro'       => 'nullable',
            'mensaje'    => 'nullable',
            'usuario_id' => 'required'
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
        try {
            DB::beginTransaction();
                $contacto = Contacto::create($datos);
                $contacto->load('usuario');
            DB::commit();
            $result = true;
        } catch (\Throwable $th) {
            DB::rollBack();
            $result = false;
        }

        return response()->json(['result' => $result,'contacto' => $result ? $contacto : null]);
    }


    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Contacto  $contacto
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Contacto $contacto)
    {
        $datos = $this->validar($request,$contacto);
        try {
            DB::beginTransaction();
            $contacto->update($datos);

            $contacto->load('usuario');
            DB::commit();
            $result = true;
        } catch (\Throwable $th) {
            DB::rollBack();
            $result = false;
        }

        return response()->json(['result' => $result, 'contacto' => $result ? $contacto : null]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Contacto  $contacto
     * @return \Illuminate\Http\Response
     */
    public function destroy(Contacto $contacto)
    {
        return response()->json(['result' => $contacto->delete()]);
    }


}
