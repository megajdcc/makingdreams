export default [
 
  // {
  //   header: 'Apps & Pages',
  // },

  {
    title: 'Home',
    icon: 'HomeIcon',
    children:[
      {
        title:'Tablero',
        icon:'PieChartIcon',
        route:'home',
        resource:'home',
        action:'read'
      },

      {
        title:'Movimientos de Cuentas',
        icon:'BookOpenIcon',
        route:'movimientos',
        resource:'movimientos',
        action:'read'
      }
      

    ]

  },



]
