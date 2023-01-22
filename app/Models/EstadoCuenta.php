<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class EstadoCuenta extends Model
{

    use HasFactory;
    
    protected $fillable = [
        'usuario_id',
        'saldo'
    ];

    public function usuario(){
        return $this->belongsTo(User::class,'usuario_id','id');
    }

    public function movimientos(){
        return $this->hasMany(Movimiento::class,'estado_cuenta_id','id');
    }

    public static function aperturar(User $usuario) : EstadoCuenta {

        return EstadoCuenta::create([
            'usuario_id' => $usuario->id,
            'saldo' => 0
        ]);
        
    }


    public function addMovimiento(array $datos ):Movimiento{
        
        $movimiento = Movimiento::create([...$datos,...['estado_cuenta_id' => $this->id]]);

        if($movimiento->tipo_movimiento === 1){
            $this->saldo += $movimiento->monto;

        }else{
            $this->saldo -= $movimiento->monto;
        }

        $this->save();


        return $movimiento;
    }

    
}
