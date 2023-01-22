<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cuenta extends Model
{
    use HasFactory;

    public $fillable = [
        'model_id',
        'model_type',
        'entidad',
        'numero',
        'principal'
    ];


    public $casts = [
        'principal' => 'boolean'
    ];


    public function model(){
        return $this->morphTo();
    }

    
}
