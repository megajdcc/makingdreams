<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sistema extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre',// making dreams
        'terminos',
        'monto_inicial',
        'logotipo_claro',
        'logotipo_oscuro',
    ];


        
    
}
