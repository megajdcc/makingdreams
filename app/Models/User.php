<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Trais\{Has_roles,HasLink};

use App\Trais\HasDireccion;

use Illuminate\Database\Eloquent\BroadcastsEvents;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\Channel;
use App\Models\Usuario\{Rol,Permiso};
use App\Notifications\WelcomeUsuario;
use Attribute;
use Illuminate\Support\Str;

class User extends Authenticatable
{
    use HasApiTokens,HasFactory, Notifiable;
    use Has_roles;
    use HasLink;
    use HasDireccion;

    
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'nombre',
        'apellido',
        "username",
        'fecha_nacimiento',
        'genero' , // 1 => Masculino, 2 => femenino
        'activo', // activo o no valor booleano
        'imagen',
        'email',
        'password',
        'is_password',
        'rol_id',
        'token',
        'ciudad_id',
        'estado_id',
        'pais_id',
        'backoffice', // Boolean
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
        'token'
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'is_password' => 'boolean',
        'activo' => 'boolean',
        'backoffice' => 'boolean'
    ];


    protected $attributes = [
        'activo' => false
    ];


    public function getUrlAvatar(){

            if(is_null($this->imagen)){
                return asset('/storage/img-perfil/default.jpg');
            }else{
                return asset('/storage/img-perfil/'.$this->imagen);
            }
        
        // return app('url').'/storage/img-perfil/'.$this->imagen;
        
    }

   

    public function getAvatar(){
        
        if(empty($this->imagen)){
            $this->imagen = 'default.jpg';

            return asset('storage/img-perfil/'.$this->imagen);
        }else{
             return asset('storage/img-perfil/'.$this->imagen);
        }

    }

    public function getNombreCompleto(){
       return $this->nombre . ' '. $this->apellido;
    }


    public function rol(){
        return $this->belongsTo(Rol::class,'rol_id','id');
    }

    public function permisos(){
        return $this->belongsToMany('App\Models\Usuario\Permiso','usuario_permisos','usuario_id','permiso_id')->withPivot(['action']);
    }

    public function getTokenText(){
        return $this->token;
    }

    public static function getUsuarios($filter){

        // return User::orderBy($filter['sortBy'])
        //             ->take($filter['perPage'])

    }
    public function getFullName(){
        return $this->nombre . ' '. $this->apellido; 
    }

    /**
     * Un usuario solo puede tener un link para referir (Invitar)
     */
    public function link(){
        return $this->hasOne(Link::class,'usuario_id','id');
    }

    public function referidos()
    {
        return $this->belongsToMany(User::class, 'usuario_referidos', 'referidor_id', 'referido_id')->withPivot(['link_referencia']);

    }


    public function referidor()
    {
        return $this->belongsToMany(User::class, 'usuario_referidos', 'referido_id', 'referidor_id')->withPivot(['link_referencia']);
    }

    /**
     * Un usuario puede tener cero o cincos cuentas Bancarias asociadas...
     */
    public function datosBancarios(){
        return $this->hasMany(DatoBancario::class,'usuario_id','id');
    }

    /**
     * Un usuario puede tener 1  o 5 numeros de telefonos;
     */
    public function telefonos(){
        return $this->hasMany(Telefono::class,'usuario_id','id');
    }

    /**
     * Un usuario Puede tener solo una cuenta...
     */
    public function cuenta(){
        return $this->hasOne(EstadoCuenta::class,'usuario_id','id');
    }

    public function aperturarCuenta() : EstadoCuenta{
        return EstadoCuenta::aperturar($this);
    }

    public function crearCodigo(array $datos): Link{
        return Link::create([
            'link' => Str::slug($datos['codigo_referidor']),
            'activo' => false,
            'usuario_id' => $this->id
        ]);
    } 


    public function agregarTelefono(array $datos) : Telefono{

        return Telefono::create([
            ...$datos,
            ...['usuario_id' => $this->id]
        ]);

    }


    public function agregarDatoBancario(array $datos): DatoBancario
    {
        return DatoBancario::create([
            ...$datos,
            ...['usuario_id' => $this->id]
        ]);
    }

    public function pagos(){
        return $this->hasMany(Pago::class,'usuario_id','id');
    }

    public function tableros(){
        return $this->hasMany(Tablero::class,'beneficiario_id','id');
    }


    public function cargar() : User{
        $this->cuenta;
        $this->telefonos;
        $this->datosBancarios;
        $this->referidor;
        $this->link;
        $this->usuario = $this->getFullName();
        $this->permisos;
        $this->rol;
        $this->avatar = $this->getAvatar();
        $this->telefono = $this->telefonos->where('principal',true)->first()?->numero;
        $this->pagos;
        $this->tableros;
        return $this;
    }


 


}
