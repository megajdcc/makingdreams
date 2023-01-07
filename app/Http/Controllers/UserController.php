<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Notification;
use App\Notifications\WelcomeUsuario;
use Illuminate\Support\Facades\{Hash,Auth,File,Storage,Validator,DB};
use Illuminate\Validation\Rule;
use Carbon\Carbon;
use Exception;
use Datatables;
use App\Events\{UsuarioCreado};
use App\Models\Entrega;
use App\Models\EstadoCuenta;
use App\Models\Telefono;
use App\Models\DatoBancario;
use Illuminate\Support\Str;

class UserController extends Controller
{

    public function __construct()
    {
        $this->middleware("convertir_null")->only(['store']);
    }

    public function getUsuario(User $usuario){
        $usuario->cargar();

        return response()->json($usuario);

    }
    

    


    private function validar(Request $request,User $usuario = null){
        return $request->validate([
            'nombre'           => 'required',
            'apellido'         => 'nullable',
            'genero'         => 'nullable',
            'username' => ['nullable'],
            'email'            => ['required', $usuario ? Rule::unique('users', 'email')->ignore($usuario): 'unique:users,email'],
            'fecha_nacimiento' => 'nullable',
            'rol_id'           => 'required',
            'activo'           => 'nullable',
            'ciudad_id'        => 'nullable',
            'estado_id'        => 'nullable',
            'pais_id'          => 'nullable'
        ],[
            'nombre.required' => 'El nombre es importante',
            'email.unique'    => 'El email ya está siendo usado, el mismo debe ser único',
            'rol_id.required' => 'El rol es importante no lo olvides',
            'email.required'  => 'Este campo es obligatorio',
            'email.email'     => 'El email no es valido por favor verifique',
            'email.unique'    => 'El email debe ser único ya otro usuario lo esta usando.',
            'username.required' => 'el nombre del usuario es importante no lo olvides',
            'username.unique' => 'EL nombre de usuario ya está siendo usado, intente con otro ... '
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {

    
        $datos = $this->validar($request);

 
        try{
            DB::beginTransaction();
            $usuario = $this->crearUsuario($datos);
            $usuario->notify(new WelcomeUsuario($usuario));
            DB::commit();

            $usuario->aperturarCuenta();

            $usuario->rol;
            $usuario->rol->permisos;
            
            $usuario->ciudad;
            $usuario->estado;
            $usuario->pais;
            $usuario->cuenta?->movimientos;
            $usuario->datosBancarios;

            $usuario->avatar = $usuario->getAvatar();
            $result = true;

        }catch(Exception $e){
            
            dd($e->getMessage());

            DB::rollBack();
            $result = false;
        
        }

        return response()->json(['result' => $result,'usuario' => ($result) ? $usuario : null]);

    }

    /**
     * [crearUsuario description]
     * @param  Array  $datos [Los datos del nuevo usuario a crear ]
     * @return [App\User]        [El usuario creado]
     */
    public function crearUsuario(Array $datos) : User {

        
        $usuario = User::create([
            'nombre'   => $datos['nombre'],
            'apellido' => $datos['apellido'],
            'username' => Str::slug($datos['nombre'].'-'.$datos['apellido']),
            'email'    => $datos['email'],
            'genero'   => $datos['genero'],
            'activo'   => false,
            'password'  => Hash::make('20464273jd'),
            'fecha_nacimiento' => (isset($datos['fecha_nacimiento'])) ? $datos['fecha_nacimiento'] : null ,
            'rol_id' => $datos['rol_id'],
            'ciudad_id' => null,
            'estado_id' => null,
            'pais_id' => null,
            

        ]);

        $usuario->asignarPermisosPorRol();
        return $usuario;
    
    }

    public function validarDatos(Request $request) : array{

        $datos = $request->validate([
            'nombre'           => 'required',
            'apellido'         => 'nullable',
            'genero'         => 'nullable',
            'email'            => [Rule::unique('users','email')],
            'fecha_nacimiento' => 'nullable',
            'rol_id'           => 'nullable',
            'ciudad_id' => 'nullable',
            'estado_id' => 'nullable',
            'pais_id' => 'nullable'
        ],[
            'nombre.required' => 'El nombre es importante',
            'email.unique' => 'El email ya está siendo usado, el mismo debe ser único',
        ]);

          return $datos;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\User $usuario
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, User $usuario){

        $datos = $this->validar($request,$usuario);
        try{
            DB::beginTransaction();

            $usuario->removeRole();
            $usuario->update($datos);
            $usuario->asignarPermisosPorRol();
            
            DB::commit();

            $usuario->rol;
            $usuario->ciudad;
            $usuario->rol->permisos;
            $usuario->datosBancarios;
            $usuario->telefonos;
            $usuario->avatar = $usuario->getAvatar();
            $result = true;
        }catch(Exception $e){
            DB::rollBack();
            $result = false;
        }
       
       return response()->json(['result' => $result,'usuario' => $usuario]);

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, User $usuario){

        try{
            DB::beginTransaction();

                $usuario->delete();

            DB::commit();
            $result = true;
        }catch(Exception $e){
            DB::rollBack();
            $result = false;
        }
        
        return response()->json(['result' => $result]); 
    
    }

    public function perfil(Request $request){
        return view('admin.usuario.perfil');
    }

    public function getUsuarios(){
        $usuarios = User::get();
        foreach ($usuarios as $key => $usuario) {
            $usuario->rol;
            $usuario->ciudad;
            $usuario->rol->permisos;
            $usuario->avatar = $usuario->getAvatar();
            $usuario->datosBancarios;
            $usuario->telefonos;
        }
        return response()->json($usuarios);
    }

    public function EstablecerContrasena(Request $request,User $usuario){

        $datos = $request->validate([
            'password' => 'required|min:6',
            'password_confirmation' => 'same:password'
        ],[
            'password.required'     => 'La contraseña es importante no la olvides.',
            'password.min'          => 'La contraseña tiene que tener minimo 6 caracteres.',
            'password_confirmation.same' => 'Las contraseñas no son iguales verifica.'
        ]);

        try{
            DB::beginTransaction();
            $usuario->password = Hash::make($datos['password']);
            $usuario->is_password = true;
            $usuario->activo = true;
            $usuario->save();

            DB::commit();
            $result = true;
            $status = 'Se ha establecido la contraseña de forma éxitosa. ';
        }catch(Exception $e){
            DB::rollBack();
            $result = false;

            $status = 'No se pudo establecer la contraseña, vuelva a intentarlo mas tarde.';

        }
       

        return response()->json(['result' => $result,'status' => $status]);
    }

    /**
     *Usado para autenticar manualmente al usuario
     * 
     * @param [App\user $usuario]
     * @param [Illuminate\Http\Request $request]
     */
    private function autenticar(User $usuario, Request $request){

        $credenciales = ['email' => $usuario->email, 'password' => $request->get('contrasena')];

        if(Auth::attempt($credenciales)){

            if($usuario->roles->contains(function($val,$i){
                return ($val->name == 'Desarrollador' || $val->name == 'Administrador');  
            })){
                return  redirect()->route('home');
            }else{
                redirect('/home');   
            }
        }
    }

    public function updatePerfil(Request $request, User $usuario){

        $usuario->update($this->validar($request,$usuario));

        $usuario = $request->user();
        $usuario->tokens;
        $usuario->ciudad;
        $usuario->rol;
        $usuario->habilidades = $usuario->getHabilidades();
        $usuario->avatar = $usuario->getAvatar();
        $usuario->cuenta?->movimientos;
        $usuario->telefonos;
        $usuario->datosBancarios;
        $usuario->link;
        $usuario->codigo_referidor = $usuario->link ? $usuario->link->link : '';
        return response()->json(['result' => true, 'usuario' => $usuario]);
    }

    public function uploadAvatar(Request $request){

        $usuario = $request->user();

        $avatar = $request->file('filepond');

        if($usuario->imagen){
            Storage::disk('img-perfil')->delete($usuario->imagen);
        }

        try {

            $avatarName = sha1(Carbon::now() . $usuario->id) . '.' . $avatar->getClientOriginalExtension();
            $result = Storage::disk('img-perfil')->put($avatarName, File::get($avatar));
            $usuario->imagen = $avatarName;
            $usuario->save();

        } catch (\Exception $e) {
            dd($e->getMessage());
        }
        
        return response()->json(\url($usuario->getAvatar()));
    }

    public function actualizarAvatarUsuario(Request $request,User $usuario){


        $avatar = $request->file('filepond');

        if($usuario->imagen){
            Storage::disk('img-perfil')->delete($usuario->imagen);
        }

        $avatarName = sha1(Carbon::now() . $usuario->id) . '.' . $avatar->getClientOriginalExtension();
        Storage::disk('img-perfil')->put($avatarName, File::get($avatar));

        $usuario->imagen = $avatarName;
        $usuario->save();

        return response()->json($usuario->getAvatar());
    }

    public function changePassword(Request $request,User $usuario){

        $v = Validator::make($request->all(),[
            'passwordValueOld' => ['required',function($attribute,$value,$fail){


                if(!Hash::check($value,Auth::user()->password)){
                    // dd(Hash::make($value). ' - ' . Auth::user()->password);
                    $fail('Su contraseña no coincide con la actual');
                }
            }],
            'newPasswordValue'     => 'required|min:6',
            'RetypePassword' => 'required|same:newPasswordValue'
        ],[
            'passwordValueOld.required'     => 'Su contraseña es requeridad para poder actualizarla',
            'newPasswordValue.required' => 'Su nueva contraseña es obligatoria',
            'newPasswordValue.min'      => 'Su contraseña debe ser mayor a 6 caracteres',
            'RetypePassword.same' => 'La contraseñas no son iguales'
        ])->validate();

        

        $usuario->password = Hash::make($v['newPasswordValue']);


        $usuario->save();

       
        
        return response()->json(['result' => true]);
    }

    public function perfilDatos(){

        $usuario = Auth::user();

        $datos = [
                'nombre'           => $usuario->nombre,
                'apellido'         => $usuario->apellido,
                'email'            => $usuario->email,
                'rol'              => $usuario->rol,
                'avatar'           => asset('storage/img-perfil/'.$usuario->imagen),
                'fecha_nacimiento' => $usuario->fecha_nacimiento,
                'id'               => $usuario->id,
        ];
        return response()->json($datos);
    }

    public function refresh(){

        $usuario = User::find(Auth::id());
        $data = [
            'avatar' => $usuario->getAvatar(),
            'usuario' => $usuario,
        ];

        return response()->json($data);
    }

    public function getUsers(Request $request){ 

        $datos = $request->all();

        if(Auth::user()->rol->nombre == 'Desarrollador'){

            $paginator = User::where([
                ['nombre', 'LIKE', '%' . $datos['q'] . '%', 'OR'],
                ['email', 'LIKE', '%' . $datos['q'] . '%', 'OR'],
                ['apellido', 'LIKE', '%' . $datos['q'] . '%', 'OR'],
              
            ])
            ->whereHas('rol',function(Builder $q) use($datos){
                $q->where('id',$datos['role'] ?: '>',0);
            })

            ->with('rol')
            ->orderBy($datos['sortBy'] ?: 'id', ($datos['sortDesc']) ? 'desc' : 'asc')
            ->paginate($datos['perPage'] ?: 10000);

        }else{

            $paginator = User::where([
                ['nombre', 'LIKE', '%' . $datos['q'] . '%', 'OR'],
                ['email', 'LIKE', '%' . $datos['q'] . '%', 'OR'],
                ['apellido', 'LIKE', '%' . $datos['q'] . '%', 'OR'],
              
            ])
            ->whereHas('rol',function(Builder $q) use($datos){
                $q->where('id',$datos['role'] ?: '>',0)->where('nombre','!=','Desarrollador') ;
            })

            ->with('rol')
            ->orderBy($datos['sortBy'] ?: 'id', ($datos['sortDesc']) ? 'desc' : 'asc')
            ->paginate($datos['perPage'] ?: 10000);

        }

        $usuarios = $paginator->items();

        foreach($usuarios as $key => $usuario){
            $usuario->cargar();
        }

        return response()->json([
            'users' => $usuarios,
            'total' => $paginator->total()
        ]);

    }

    public function updateFirma(Request $request, User $usuario){


        $firma = $request->get('firma');

        try{
            DB::beginTransaction();

            $usuario->firma_digital = $firma;

            $usuario->save();

            $usuario->tokens;
            $usuario->rol;
            $usuario->habilidades = $usuario->getHabilidades();
            $usuario->avatar = $usuario->getAvatar();

            DB::commit();
            $result = true;

        }catch(\Exception $e){
            DB::rollBack();
            $result = false;
        }


       

        return response()->json(['result' => $result,'usuario' => $usuario]);
        
    }

     public function misReferidos(Request $request){

        $datos = $request->all();

        $paginator = User::whereHas('referidor',function(Builder $q) use($request) {
            $q->where('referidor_id',$request->user()->id);
        })
        ->orderBy($datos['sortBy'],'desc')
        ->paginate($datos['perPage'] ?: 10000);

        $usuarios = $paginator->items();

        foreach ($usuarios as $key => $usuario){

            $usuario->telefonos;

            if(empty($usuario->imagen)){
                $usuario->imagen =  asset('storage/img-perfil/default.jpg');
            }else{
                $usuario->imagen =  asset('storage/img-perfil/').$usuario->imagen;
            }

        }

        return response()->json([
            'usuarios' => $usuarios,
            'total' => $paginator->total(),
        ]);

        

    }

    public function crearCodigo(Request $request,User $usuario){

        $datos = $request->validate([
            'codigo_referidor' => 'required|unique:links,link'
        ],[
            'codigo_referidor.unique' => 'El Código ya está siendo usado, inténta con otro'
        ]);

        try{
            DB::beginTransaction();
                $usuario->crearCodigo($datos);

                $usuario->tokens;
                $usuario->rol;
                $usuario->habilidades = $usuario->getHabilidades();
                $usuario->avatar = $usuario->getAvatar();
                $usuario->link;
                $usuario->codigo_referidor = $usuario->link ? $usuario->link->link : '';

                $usuario->telefonos;
            DB::commit();
            $result = true;
        }catch(\Exception $e){
            DB::rollBack();
            $result = false;
        }


        return response()->json(['result' => $result, 'usuario' => $usuario]);


    }


    public function agregarTelefono(Request $request,User $usuario){

        $datos = $request->validate([
            'numero' => 'required|unique:telefonos,numero',
            'whatsapp' => 'required',
            'principal' => 'required'
        ],[
            'numero.unique' => 'El número de teléfono ya está siendo, intente con otro'
        ]);

        try{
            DB::beginTransaction();


            $usuario->agregarTelefono($datos);

            $usuario->tokens;
            $usuario->rol;
            $usuario->habilidades = $usuario->getHabilidades();
            $usuario->avatar = $usuario->getAvatar();
            $usuario->link;
            $usuario->codigo_referidor = $usuario->link ? $usuario->link->link : '';
            $usuario->datosBancarios;
            $usuario->telefonos;


            DB::commit();   
            $result = true;
        }catch(\Exception $e){
            DB::rollBack();
            $result = false;
        }

        return response()->json(['result' => $result, 'usuario' => $usuario]);


    }


    public function agregarDatoBancario(Request $request, User $usuario)
    {

        $datos = $request->validate([
            'numero' => 'required|unique:dato_bancarios,numero',
            'entidad' => 'required',
            'principal' => 'required'
        ], [
            'numero.unique' => 'El número de cuenta ya está siendo usado, intente con otro'
        ]);

        try {
            DB::beginTransaction();


            $usuario->agregarDatoBancario($datos);

            $usuario->tokens;
            $usuario->rol;
            $usuario->habilidades = $usuario->getHabilidades();
            $usuario->avatar = $usuario->getAvatar();
            $usuario->link;
            $usuario->codigo_referidor = $usuario->link ? $usuario->link->link : '';
            $usuario->datosBancarios;
            $usuario->telefonos;


            DB::commit();
            $result = true;
        } catch (\Exception $e) {
            DB::rollBack();
            $result = false;
        }

        return response()->json(['result' => $result, 'usuario' => $usuario]);
    }

    public function quitarTelefono(User $usuario,Telefono $telefono){

        try{
            DB::beginTransaction();
            
            $telefono->delete();

            $usuario->tokens;
            $usuario->rol;
            $usuario->habilidades = $usuario->getHabilidades();
            $usuario->avatar = $usuario->getAvatar();
            $usuario->link;
            $usuario->codigo_referidor = $usuario->link ? $usuario->link->link : '';
            $usuario->datosBancarios;

            $usuario->telefonos;
            DB::commit();
            $result = true;
        }catch(\Exception $e){
            DB::rollBack();
            $result = false;

      

        }

        return response()->json(['result' => $result,'usuario' => $usuario]);

    }

    public function quitarDatoBancario(User $usuario, DatoBancario $cuenta)
    {

        try {
            DB::beginTransaction();

            $cuenta->delete();

            $usuario->tokens;
            $usuario->rol;
            $usuario->habilidades = $usuario->getHabilidades();
            $usuario->avatar = $usuario->getAvatar();
            $usuario->link;
            $usuario->codigo_referidor = $usuario->link ? $usuario->link->link : '';
            $usuario->datosBancarios;
            $usuario->telefonos;
            DB::commit();
            $result = true;
        } catch (\Exception $e) {
            DB::rollBack();
            $result = false;
        }

        return response()->json(['result' => $result, 'usuario' => $usuario]);
    }






}
