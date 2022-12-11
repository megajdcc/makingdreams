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
        Schema::create('links', function (Blueprint $table) {
            $table->id();
            $table->string('link')->unique();
            $table->boolean('activo')->default(false);
            $table->foreignId('usuario_id')->constrained('users')->cascadeOnDelete()->cascadeOnUpdate();
            $table->timestamps();
        });

        Schema::create('usuario_referidos',function(Blueprint $table){

            $table->foreignId('referidor_id')->constrained('users')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId('referido_id')->constrained('users')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId('link_referencia')->constrained('links')->cascadeOnDelete()->cascadeOnUpdate();
        

        });


    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('usuario_referidos');
        Schema::dropIfExists('links');
    }
};
