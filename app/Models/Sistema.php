<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use App\Trais\hasPago;


class Sistema extends Model
{
    use HasFactory,hasPago;

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

        // Cuentas de Pago
        'direccion_bitcoin',
        'paypal',
        'wompi',
        'mercado_pago'
    ];    



    public $casts = [
        'paypal'       => 'array',
        'wompi'        => 'array',
        'mercado_pago' => 'array'
    ];
    
}
