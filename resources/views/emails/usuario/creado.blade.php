@component('mail::message')

# Hola **{{ trim($Nombre) }}**  
> Has recibido autorización para ingresar al Sistema {{ env('APP_NAME') }}

>Tus credenciales son:

>Usuario:**{{ $Email }}**  

@component('mail::button', ['url' => $Url, 'color' => 'success'])
	Por favor establezca su contraseña a continuación
@endcomponent  

# ¡Te damos la bienvenida a la comunidad de {{ env('APP_NAME') }}! #
@endcomponent
