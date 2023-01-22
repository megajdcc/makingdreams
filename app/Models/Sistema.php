<?php

namespace App\Models;

use App\Trais\hasCuenta;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;


class Sistema extends Model
{
    use HasFactory,hasCuenta;

    protected readonly string $model_type;



    public function __construct()
    {
        $this->model_type = 'App\Models\Sistema';
    }

    protected $fillable = [
        'nombre',// making dreams
        'terminos',
        'monto_inicial',
        'logotipo_claro',
        'logotipo_oscuro',
    ];    
    
}
