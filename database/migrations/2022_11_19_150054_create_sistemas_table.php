<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sistemas', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->longText('terminos')->nullable();
            $table->decimal('monto_inicial')->default(3);
            $table->string('logotipo_claro')->nullable();
            $table->string('logotipo_oscuro')->nullable();

            // Metodos de pago 
            $table->string('direccion_bitcoin')->nullable();
            $table->json('paypal')->nullable();
            $table->json('wompi')->nullable();
            $table->json('mercado_pado')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sistemas');
    }
};
