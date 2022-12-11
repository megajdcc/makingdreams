<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Telefono extends Model
{
    use HasFactory;

    protected $fillable = [
        'numero',
        'principal',
        'whatsapp',
        'usuario_id'
    ];

    /**
     * UN telefono pertenece a un usuario
     */
    public function usuario(){
        return $this->belongsTo(User::class,'usuario_id','id');
    }


}
