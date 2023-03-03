<?php

use App\Models\Tablero;
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
        Schema::create('puestos', function (Blueprint $table){
            $table->id();
            $table->foreignIdFor(Tablero::class,'tablero_id')->constrained('tableros')
            ->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId('usuario_id')->constrained('users')
            ->cascadeOnDelete()->cascadeOnUpdate();
            $table->tinyInteger('ubicacion');
            $table->boolean('abonado')->default(false);
            $table->tinyInteger('status')->default(1);
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
        Schema::dropIfExists('puestos');
    }
};
