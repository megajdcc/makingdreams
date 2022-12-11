<?php
namespace App\Trais;

use App\Models\Link;


trait HasLink 
{


   public function createLink() : Link{

      $link = Link::create([
         'link' => url("link/{$this->username}"),
         'activo' => false,
         'usuario_id' => $this->id
      ]);

      return $link;
   
   }

}


?>