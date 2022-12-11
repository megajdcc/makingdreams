<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Link extends Model
{
    use HasFactory;

    public $fillable = [
        'link',
        'activo',
        'usuario_id',
    ];


    public $casts = [
        'ativo' => 'boolean'
    ];


    /**
     * UN Link pertenece a un usuario 
     */
    public function usuario(){
        return $this->belongsTo(User::class,'usuario_id','id');
    }


    public function referidos(){
        return $this->belongsToMany(User::class,'usuario_referidos', 'link_referencia','');
    }


}
