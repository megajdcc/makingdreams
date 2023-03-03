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
        Schema::create('pagos', function (Blueprint $table) {
            $table->id();
            $table->decimal('monto');
            $table->boolean('aprobado');
            $table->tinyInteger('status')->default(1);
            $table->text('concepto');
            $table->json('detalles')->nullable();
            $table->tinyInteger('metodo')->default(1);
            $table->string('comprobante')->nullable();

            $table->foreignId('usuario_id')
            ->constrained('users')->cascadeOnDelete()->cascadeOnUpdate();
            $table->string('model_type');
            $table->bigInteger('model_id');
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
        Schema::dropIfExists('pagos');
    }
};
