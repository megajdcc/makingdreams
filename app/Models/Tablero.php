<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Tablero extends Model
{
    use HasFactory;

    public $table = 'tableros';
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $fillable = [
        'etapa_id',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->id = str_pad($model->id, 6, '0', STR_PAD_LEFT);
        });
    }

    public function etapa(){
        return $this->belongsTo(Etapa::class,'etapa_id','id');
    }


    public function puestos(){
        return $this->hasMany(Puesto::class,'tablero_id','id');
    }

}
