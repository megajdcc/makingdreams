<?php

namespace App\Trais;

use App\Models\Pago;
use Illuminate\Support\Facades\DB;

/**
 * 
 */
trait hasPago
{

  public function pagos(){
    return $this->morphMany(Pago::class, 'model');
  }

  public function agregarPago(array $datos) : bool{

    $result = false;

    try {
      DB::beginTransaction();

      $pago = Pago::create([
        ...[
          'model_id' => $this->id,
          'model_type' => $this->model_type
        ],
        ...$datos
      ]);

      DB::commit();
      $result = true;
    } catch (\Throwable $th) {
      DB::rollBack();
      $result = false;
    }
   

    return $result;
  }
}

?>