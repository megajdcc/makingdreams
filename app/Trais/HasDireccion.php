<?php 
namespace App\Trais;
use App\Models\{Estado,Ciudad,Pais};

trait HasDireccion{

   public function ciudad(){
      return $this->belongsTo(Ciudad::class,'ciudad_id','id');
   }

   public function estado(){
      return $this->belongsTo(Estado::class,'estado_id','id');
   }

   public function pais(){
      return $this->belongsTo(Pais::class,'pais_id','id');
   }

}
