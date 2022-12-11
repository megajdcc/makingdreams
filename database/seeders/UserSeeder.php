<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\{User};
use App\Models\Usuario\{Rol,Permiso};
use Illuminate\Support\Facades\Hash;
use App\Models\Pais;

class UserSeeder extends Seeder
{

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {


            $permisos = [
                'all',
                'home',
                'perfil',
                'roles',
                'permisos',
                "notificaciones",
                "usuarios",
            ];

            $actions = ['manage','read','write','delete','update'];

            $permisos_registrados = collect([]);

            
            foreach ($permisos as $key => $value) {
                $permisos_registrados->push(Permiso::create(['nombre' => $value]));        
            }

            
            $roles = ["Desarrollador",'Administrador',"Usuario"];

            foreach ($roles as $key => $value) {
                $rol = Rol::create(['nombre'=> $value]);

                if($rol->nombre == 'Desarrollador'){
                    foreach ($permisos_registrados as $k => $v) {
                     $rol->permisos()->attach($v->id, ['actions' => json_encode($actions)]);
                    }
                }
               
            }
            

    		$usuario = User::create([
				'nombre'   => 'Jhonatan Deivyth',
				'apellido' => 'Crespo Colmenarez',
                'username' => 'megajdcc',
				'email' => 'megajdcc2009@gmail.com',
				'password' => Hash::make('20464273jd'),
                'is_password' => true,
                'pais_id' => Pais::where('pais','Venezuela')->first()->id,
                'rol_id' => Rol::where('nombre','Desarrollador')->first()->id
    		]);

            $usuario->asignarPermisosPorRol();

            $textToken = ($usuario->createToken($usuario->nombre.'-'.$usuario->id))->plainTextToken;

            $usuario->token = $textToken;

            // $usuario->createLink();

            $usuario->save();
    }
}
