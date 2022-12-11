@component('mail::message')

# Hola **{{ trim($Nombre) }}**  
> Has recibido autorización para ingresar al Sistema de RDSC Transport

>Tus credenciales son:

>Usuario:**{{ $Email }}**  

@component('mail::button', ['url' => $Url, 'color' => 'success'])
	Por favor establezca su contraseña a continuación
@endcomponent  

# ¡Te damos la bienvenida al equipo de RDSC Transport! #
@endcomponent
