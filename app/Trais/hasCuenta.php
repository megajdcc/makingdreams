<?php 
namespace App\Trais;
use App\Models\Cuenta;



/**
 * 
 */
trait hasCuenta
{

  public function cuentas(){

    return $this->morphMany(Cuenta::class,'model');
  }



  public function agregarCuenta(array $datos):Cuenta{

    return Cuenta::create([
      ...$datos,
      ...['model_type' => $this->model_type,'model_id' => $this->id]
    ]);


  }

  public function quitarCuenta(Cuenta $cuenta) :bool | null{
    return $cuenta->delete();
  }


   

}
