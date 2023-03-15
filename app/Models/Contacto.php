<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contacto extends Model
{
    use HasFactory;


    protected $fillable = [
        'whatsapp',
        'correo',
        'telefono_1',
        'telefono_2',
        'otro',
        'usuario_id',
        'mensaje'
    ];


    public function usuario(){
        return $this->belongsTo(User::class,'usuario_id','id');
    }
}
