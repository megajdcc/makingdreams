<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tablero extends Model
{
    use HasFactory;

    protected $fillable = [
        'beneficiario_id',
        'cierre',
        'tablero_id',
    ];


    public function beneficiario(){
        return $this->belongsTo(User::class,'beneficiario_id','id');
    }
    

    public function tablero(){
        return $this->belongsTo(Tablero::class,'tablero_id','id');
    }


}
