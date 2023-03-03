<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Etapa extends Model
{
    use HasFactory;

    protected $fillable = [
        'monto',
        'nombre',
        'remuneracion',
        'etapa_id',
        'descripcion'
    ];


    public function etapa(){
        return $this->belongsTo(Etapa::class,'etapa_id','id');
    }


    public function tablero(){
        return $this->hasOne(Tablero::class,'etapa_id','id');
    }
    
}
