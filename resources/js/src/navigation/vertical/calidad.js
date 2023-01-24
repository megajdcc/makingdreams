export default [
  
   {
      title: 'Usuarios del sistema',
      route: 'listar.usuarios',
      action: 'read',
      resource: 'usuarios',
      icon: 'UsersIcon',
   },

   {
      title:'Pagos',
      route:'pagos.list',
      action:'read',
      resource:'pagos admin',
      
   },


   {
      title: 'Ajustes',
      icon: 'SettingsIcon',
      children: [

         {
            title:'Sistema',
            route:'sistema',
            action:'read',
            resource:'sistema',
            icon:'SettingsIcon'
         },

         {
            title: 'Etapas',
            route: 'etapa.list',
            action: 'read',
            resource: 'etapas',
            icon: 'ListIcon'
         },


         {
            title: 'Roles',
            // exact:false,
            route: 'listar.roles',
            action: 'read',
            resource: 'roles'
         },
         {
            title: 'Permisos',
            route: 'listar.permisos',
            action: 'read',
            resource: 'permisos'
         },

         {
            title: 'Paises',
            route: 'listar.paises',
            action: 'read',
            resource: 'pais'
         },
         {
            title: 'Estados',
            route: 'listar.estados',
            action: 'read',
            resource: 'estado'
         },
         {
            title: 'Municipios',
            route: 'listar.ciudades',
            action: 'read',
            resource: 'estado'
         }


      ]
   },

   {
      header: 'Mi Cuenta',
      icon: 'MinusIcon'
   },
   {
      title: 'Perfil',
      route: 'perfil',
      icon: 'UserIcon',
      action: 'read',
      resource: 'perfil',
   }

]

