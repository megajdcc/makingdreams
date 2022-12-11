export default{

	namespaced:true,


	state(){
		return{
			
		}

	},

	mutations:{
		
		setTablero(state,data){
			

		},

		updateTablero(state,data){
			
		}

	},


	actions:{

		cargarTablero({state,commit}){

			
			
			axios.get('cargar/tablero/user').then(respon => {

				// commit('setTablero',respon.data);
			
			}).catch(e => {
			
				console.log(e);
			
			}).then(() => {
			
			
			});


		}

	}








}