export default [
   /*****************************************/
   /* USUARIO
   /*************************************** */

   {
      path:'/usuarios',
      name:'usuarios',
      component: () => import(
         /*  webpackChunkName: "group-usuario"  */ 
         /* webpackPreload:true  */ 'views/usuarios'),

      children:[
         {
            path:'',
            name:'listar.usuarios',
            component: () => import(/*  webpackChunkName: "group-usuario" */ 'views/usuarios/lists'),
          
            meta:{
               resource: 'usuarios',
               action: 'read',
               pageTitle:'Usuarios',
               breadcrumb:[
                  {
                     text:'listado',
                     active:true
                  }
               ]
            }
         },
         {
            path:'create',
            name:'create.usuario',
            component: () => import( /*  webpackChunkName: "group-usuario" */ 'views/usuarios/create'),
           

            meta: {
               pageTitle: 'Agregar usuario',
               navActiveLink: 'listar.usuarios',
               resource: 'usuarios',
               action: 'write',
               breadcrumb: [

                  {
                     text: 'Usuarios',
                     active: false,
                     to: { name: 'listar.usuarios' }
                  },

                  {
                     text: 'crear',
                     active: true
                  }
               ]
            }
            

         },
         {
            path: ':id/edit',
            props:true,
            name: 'edit.usuario',
            component: () => import( /*  webpackChunkName: "group-usuario" */ 'views/usuarios/edit'),
            

            meta: {
               pageTitle: 'Editar usuario',
               navActiveLink: 'listar.usuarios',
               resource: 'usuarios',
               action: 'update',
               breadcrumb: [

                  {
                     text: 'Usuarios',
                     active: false,
                     to: { name: 'listar.usuarios' }
                  },

                  {
                     text: 'editar',
                     active: true
                  }
               ]
            }


         }
      ]
   },


   /*****************************************/
   /* Sistema
   /*************************************** */
   
   {
      path:'/sistema',
      name:'sistema',
      component:() => import('views/configuraciones/sistema.vue'),
      meta:{
         resource:'sistema',
         pageTitle:'Sistema',
         action:"update",
         breadcrumb:[
            {text:'Home',to:{name:'home'},active:false},
            { text: 'Sistema',active:true },

         ]
      }
   },

   /*****************************************/
   /* Movimientos
   /*************************************** */

   {
      path:'/movimientos',
      component:() => import('views/cuentas/movimientos.vue'),
      name:'movimientos',
      meta:{
         resource: 'movimientos',
         pageTitle: 'Movimientos',
         action: "read",
         breadcrumb: [
            { text: 'Home', to: { name: 'home' }, active: false },
            { text: 'Cuenta', active: true },

         ]
      }
      
   },

   /*****************************************/
   /* ROL DE USUARIO
   /*************************************** */

   {
      path: '/roles',
      name: 'roles',
      component: () => import(  'views/roles'),
      exact:false,
      children: [
         {
            path: '',
            name: 'listar.roles',
            component: () => import('views/roles/lists'),
            meta: {
               pageTitle: 'Rol de usuarios',
               breadcrumb: [
                  {
                     text: 'Listado',
                     active: true,
                  },
               ],
               resource: 'roles',
               action: 'read'
            }
         },
         {
            path: 'create',
            name: 'create.role',
            component: () => import('views/roles/create'),
            meta: {
               pageTitle: 'Crear Rol',
               navActiveLink:'listar.roles',
               breadcrumb: [
                  {
                     text: 'Rol de usuarios',
                     active: false,
                     to: { name: 'listar.roles' }
                  },

                  {
                     text: 'Crear',
                     active: true,
                  },
               ],
               resource: 'roles',
               action: 'write'
            }
         },
         {
            path: ':id/edit',
            props:true,
            name: 'edit.role',
            component: () => import('views/roles/edit'),
            meta: {
               pageTitle: 'Editar Rol',
               navActiveLink: 'listar.roles',
               breadcrumb: [
                  {
                     text: 'Rol de usuarios',
                     active: false,
                     to: { name: 'listar.roles' }
                  },

                  {
                     text: 'Editar',
                     active: true,
                  },
               ],
               resource: 'roles',
               action: 'update'
            }
         },

      ]
   },


   /*****************************************/
   /* PERMISOS DE USUARIO
   /*************************************** */

   {
      path: '/permisos',
      name: 'permisos',

      component: () => import('views/permisos'),

      exact: false,
      children: [
         {
            path: '',
            name: 'listar.permisos',
            component: () => import('views/permisos/lists'),
            meta: {
               pageTitle: 'Permisos de usuario',
               breadcrumb: [
                  {
                     text: 'Listado',
                     active: true,
                  },
               ],
               resource: 'permisos',
               action: 'read'
            }
         },
         {
            path: 'create',
            name: 'create.permiso',
            component: () => import('views/permisos/create'),
            meta: {
               pageTitle: 'Crear Permiso',
               navActiveLink: 'listar.permisos',
               breadcrumb: [
                  {
                     text: 'Permisos de usuario',
                     active: false,
                     to: { name: 'listar.permisos' }
                  },

                  {
                     text: 'Crear',
                     active: true,
                  },
               ],
               resource: 'permisos',
               action: 'write'
            }
         },
         {
            path: ':id/edit',
            props: true,
            name: 'edit.permiso',
            component: () => import('views/permisos/edit'),
            meta: {
               pageTitle: 'Editar Permiso',
               navActiveLink: 'listar.permisos',
               breadcrumb: [
                  {
                     text: 'Permisos de usuario',
                     active: false,
                     to: { name: 'listar.permisos' }
                  },

                  {
                     text: 'Editar',
                     active: true,
                  },
               ],
               resource: 'permisos',
               action: 'update'
            }
         },

         

      ]
   },

   /*****************************************/
   /* Pais
   /*************************************** */

   {
      path:'/pais',
      component:() => import('views/pais/index.vue'),
      name:'pais',

      children:[
         {
            path:'',
            component:() => import('views/pais/list.vue'),
            name:'listar.paises',
            meta:{
               resource:'pais',
               action:'read',
               pageTitle:'Paises',

               breadcrumb:[
                  {
                     text:'Home',
                     to:{name:'home'},
                     active:false
                  },
                  {
                     text: 'Listado',
                     active: true
                  }
               ]
            }
         },
         {
            path:'create',
            component: () => import('views/pais/create.vue'),
            name:'create.pais',

            meta: {
               resource: 'pais',
               action: 'write',
               pageTitle: 'Registrar Pais',
               navActiveLink:'listar.paises',
               breadcrumb: [
                  {
                     text: 'Home',
                     to: { name: 'home' },
                     active: false
                  },

                  {
                     text: 'Paises',
                     to: { name: 'listar.paises' },
                     active: false
                  },
                  {
                     text: 'create',
                     active: true
                  }
               ]
            }

         },

         {
            path: ':id/edit',
            props:true,
            component: () => import('views/pais/edit.vue'),
            name: 'edit.pais',

            meta: {
               resource: 'pais',
               action: 'update',
               pageTitle: 'Actualizad Pais',
               navActiveLink: 'listar.paises',
               breadcrumb: [
                  {
                     text: 'Home',
                     to: { name: 'home' },
                     active: false
                  },

                  {
                     text: 'Paises',
                     to: { name: 'listar.paises' },
                     active: false
                  },
                  {
                     text: 'edit',
                     active: true
                  }
               ]
            }

         }

      ]
   },

   /*****************************************/
   /* Estado
   /*************************************** */

   {
      path: '/estado',
      component: () => import('views/estado/index.vue'),
      name: 'estado',

      children: [
         {
            path: '',
            component: () => import('views/estado/list.vue'),
            name: 'listar.estados',
            meta: {
               resource: 'estado',
               action: 'read',
               pageTitle: 'Estados',

               breadcrumb: [
                  {
                     text: 'Home',
                     to: { name: 'home' },
                     active: false
                  },
                  {
                     text: 'Listado',
                     active: true
                  }
               ]
            }
         },
         {
            path: 'create',
            component: () => import('views/estado/create.vue'),
            name: 'create.estado',

            meta: {
               resource: 'estado',
               action: 'write',
               pageTitle: 'Registrar Estado',
               navActiveLink: 'listar.estados',
               breadcrumb: [
                  {
                     text: 'Home',
                     to: { name: 'home' },
                     active: false
                  },

                  {
                     text: 'Estados',
                     to: { name: 'listar.estados' },
                     active: false
                  },
                  {
                     text: 'create',
                     active: true
                  }
               ]
            }

         },

         {
            path: ':id/edit',
            props: true,
            component: () => import('views/estado/edit.vue'),
            name: 'edit.estado',

            meta: {
               resource: 'estado',
               action: 'update',
               pageTitle: 'Actualizad Estado',
               navActiveLink: 'listar.estados',
               breadcrumb: [
                  {
                     text: 'Home',
                     to: { name: 'home' },
                     active: false
                  },

                  {
                     text: 'Estados',
                     to: { name: 'listar.estados' },
                     active: false
                  },
                  {
                     text: 'edit',
                     active: true
                  }
               ]
            }

         }

      ]
   },

   /*****************************************/
   /* Ciudad
   /*************************************** */

   {
      path: '/ciudad',
      component: () => import('views/estado/index.vue'),
      name: 'ciudad',

      children: [
         {
            path: '',
            component: () => import('views/ciudad/list.vue'),
            name: 'listar.ciudades',
            meta: {
               resource: 'ciudad',
               action: 'read',
               pageTitle: 'Ciudades',

               breadcrumb: [
                  {
                     text: 'Home',
                     to: { name: 'home' },
                     active: false
                  },
                  {
                     text: 'Listado',
                     active: true
                  }
               ]
            }
         },
         {
            path: 'create',
            component: () => import('views/ciudad/create.vue'),
            name: 'create.ciudad',

            meta: {
               resource: 'ciudad',
               action: 'write',
               pageTitle: 'Registrar Ciudad',
               navActiveLink: 'listar.ciudades',
               breadcrumb: [
                  {
                     text: 'Home',
                     to: { name: 'home' },
                     active: false
                  },

                  {
                     text: 'Ciudades',
                     to: { name: 'listar.ciudades' },
                     active: false
                  },
                  {
                     text: 'create',
                     active: true
                  }
               ]
            }

         },

         {
            path: ':id/edit',
            props: true,
            component: () => import('views/ciudad/edit.vue'),
            name: 'edit.ciudad',

            meta: {
               resource: 'ciudad',
               action: 'update',
               pageTitle: 'Actualizad Ciudad',
               navActiveLink: 'listar.ciudades',
               breadcrumb: [
                  {
                     text: 'Home',
                     to: { name: 'home' },
                     active: false
                  },

                  {
                     text: 'Ciudades',
                     to: { name: 'listar.ciudades' },
                     active: false
                  },
                  {
                     text: 'edit',
                     active: true
                  }
               ]
            }

         }

      ]
   },

   /*****************************************/
   /* Donacion de backoffice
   /*************************************** */
   {
      path:'/donacion-backoffice',
      component:() => import('views/pagos/donacion.vue'),
      name:'donacion.backoffice',
      meta:{
         resource:'donaciones',
         action:'read',
         pageTitle:'Realizar donación al programa',
         navActiveLink:'home',
         breadcrumb:[
            {
               text:'Home',
               to:{name:'home'}
            },
            {
               text:'Pagar donación',
               active:true
            }
         ]
      }
   },

   /*****************************************/
   /* Pagos 
   /*************************************** */
   {
      path:'/pagos',
      component:() => import('views/pagos/index.vue'),
      children:[
         {
            path:'',
            name:'pagos.list',
            component:() => import('views/pagos/lists.vue'),
            meta:{
               resource:'pagos admin',
               action:'read',
               pageTitle:'Pagos',
               breadcrumb:[
                  {text:'Home',to:{name:'home'}},
                  { text: 'Pagos', active:true },

               ]
            }
         }
      ]
   },

   /*****************************************/
   /* Etapas 
   /*************************************** */
   {
      path: '/etapas',
      component: () => import('views/etapas/index.vue'),
      children: [
         {
            path: '',
            name: 'etapa.list',
            component: () => import('views/etapas/list.vue'),
            meta: {
               resource: 'etapas',
               action: 'read',
               pageTitle: 'Etapas',
               breadcrumb: [
                  { text: 'Home', to: { name: 'home' } },
                  { text: 'Etapas', active: true },

               ]
            }
         },

          {
            path: 'create',
            name: 'etapa.create',
            component: () => import('views/etapas/create.vue'),
            meta: {
               resource: 'etapas',
               action: 'read',
               pageTitle: 'Crear Etapa',
               navActiveLink:'etapa.list',
               breadcrumb: [
                  { text: 'Home', to: { name: 'home' } },
                  { text: 'Etapas', active: false,to:{name:'etapa.list'} },
                  { text: 'Crear', active: true },


               ]
            }
         },

         {
            path: ':id/edit',
            name: 'etapa.edit',
            props:true,
            component: () => import('views/etapas/edit.vue'),
            meta: {
               resource: 'etapas',
               action: 'read',
               pageTitle: 'Editar Etapa',
               navActiveLink: 'etapa.list',
               breadcrumb: [
                  { text: 'Home', to: { name: 'home' } },
                  { text: 'Etapas', active: false, to: { name: 'etapa.list' } },
                  { text: 'Editar', active: true },


               ]
            }
         }


      ]
   },


   /*****************************************/
   /*Tableros
   /*************************************** */

   {
      path:'/tableros',
      component:() => import('views/tableros/index.vue'),

      children:[

         {
            path:'',
            component:() => import('views/tableros/list.vue'),
            name:'tableros',
            meta:{
               resource:'tableros',
               action:'read',
               pageTitle:'Tableros',

               breadcrumb:[
                  {text:'Home',to:"home",active:false},
                  { text: 'Tableros', active: true },
               ]
            }
         },

         {
            path: 'create',
            component: () => import('views/tableros/create.vue'),
            name: 'tablero.create',
            meta: {
               resource: 'tableros',
               action: 'write',
               pageTitle: 'Tableros',
               navActiveLink:'tableros',
               breadcrumb: [
                  { text: 'Home', to: "home", active: false },
                  { text: 'Tableros', active:false,to:{name:'tableros'} },
                  { text: 'Crear', active: true },

               ]
            }
         }
      ]
   },

   /*****************************************/
   /*Juntas
   /*************************************** */

   {
      path:'/juntas',
      component:() => import('views/juntas/list.vue'),
      name:'juntas',
      meta:{
         resource:'juntas',
         action:'read',
         pageTitle:'Juntas',
         breadcrumb:[
            {
               text:'Home',to:{name:'home'}, active:false,
            },
            {
               text: 'Juntas', active: true,
            }
         ]
      }
   },
   
   /*****************************************/
   /* PAGINA DE Mantenimiento
   /*************************************** */
   {
      path:'/mantenimiento',
      name:'show.mantenimiento',
      component:() => import('views/mantenimiento/index.vue'),
      meta:{
         layout:'full',
         resource: 'Auth',
         action: 'read',
       
      }
   },

   /*****************************************/
   /*Politicas y Terminos y Condiciones
   /*************************************** */
   {
      path: '/terminos-condiciones',
      name: 'public.terminos',
      component: () => import('views/paginas/terminos.vue'),
      meta: {
         layout: 'full',
         resource: 'Auth',
         action: 'read',
      }
   },


   /*****************************************/
   /* PAGINA DE REGISTRO POR LINK
   /*************************************** */

   {
      path: '/link/:link',
      props:true,
      name: 'user.register',
      component: () => import('@/views/pages/authentication/Register.vue'),
      meta: {
         layout: 'full',
         resource: 'Auth',
         action: 'read',
      }
   },



  

   
]
