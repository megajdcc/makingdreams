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
        title:'Pagos - BackOffice',
        icon:'BookOpenIcon',
        route:'pagos.backoffice',
        resource:'pagos.backoffice',
        action:'read'
      }
      

    ]

  },



]
