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
        Schema::create('tableros', function (Blueprint $table) {
            $table->string('id', 6)->primary();
            $table->foreignId('etapa_id')->constrained('etapas')
            ->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId('beneficiario_id')->constrained('users')
            ->cascadeOnDelete()->cascadeOnUpdate();
            $table->timestamp('cierre')->nullable();
            $table->decimal('recibido')->nullable();
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
        Schema::dropIfExists('tableros');
    }
};
