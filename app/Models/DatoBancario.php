<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DatoBancario extends Model
{
    use HasFactory;

    protected $fillable = [
        'entidad',
        'numero',
        'principal',
        'usuario_id'
    ];

    protected $casts = [
        'principal' => 'boolean'
    ];

    public function usuario(){
        return $this->belongsTo(User::class,'usuario_id','id');
    }
}
