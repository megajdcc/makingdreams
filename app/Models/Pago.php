<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pago extends Model
{
    use HasFactory;

    protected $fillable =[
        'monto',
        'aprobado', // boolean 
        'status', // 1 => Sin aprobar, 2 => aprobado, 3 => rechazado, 4 => devuelto
        'usuario_id',
        'concepto',
        'detalles',
        'metodo', // 1 => paypal, 2 => wompi 3 => transferencia 
        'comprobante',
        'model_id',
        'model_type'
    ];

    
    protected $casts = [
        'aprobado' => 'boolean',
        'detalles' => 'array'
    ];

    public function model(){
        return $this->morphTo();
    }

    public function usuario(){
        return $this->belongsTo(User::class,'usuario_id','id');
    }

    public function puesto(){
        return $this->hasOne(Puesto::class,'pago_id','id');
    }


}
