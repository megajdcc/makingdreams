<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Movimiento extends Model
{
    
    use HasFactory;

    protected $fillable = [
        'monto',
        'tipo_movimiento' , // 1 => ingreso 2 => egreso
        'balance',
        'concepto',
        'estado_cuenta_id',
    ];

    public function cuenta(){
        return $this->belongsTo(EstadoCuenta::class,'estado_cuenta_id','id');
    }


}
