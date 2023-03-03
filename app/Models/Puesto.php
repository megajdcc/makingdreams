<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Trais\hasPago;
class Puesto extends Model
{
    use HasFactory,hasPago;

    protected $fillable = [
        'tablero_id',
        'usuario_id',
        'ubicacion',
        'abonado',
        'cierre',
        'is_beneficiario',
        'status', // 1 => 
    ];


    public $casts = [
        'abonado' => 'boolean',
        'is_beneficiario' => 'boolean'

    ];

    public function beneficiario(){
        return $this->belongsTo(User::class,'usuario_id','id');
    }

    public function tablero(){
        return $this->belongsTo(Tablero::class,'tablero_id','id'); 
    }


}
