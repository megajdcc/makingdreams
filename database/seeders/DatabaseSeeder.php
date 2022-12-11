<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {

        $this->call([
            PaisSeed::class,
            EstadoSeed::class,
            CiudadSeed::class,
            UserSeeder::class,
            SistemaSeeder::class,
        ]);
    }
}
