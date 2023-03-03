<template>

	<listado :actions="actions" placeholderSearch="Buscar Roles ..." hideFooter>
		
		<template #btn-action>
			<b-button variant="dark" :to="{ name: 'create.role' }">
				<feather-icon size="18" icon="PlusSquareIcon" />
				Añadir
			</b-button>
		</template>

		<template #contenido="{eliminar,fetchData,tableColumns,isSortDirDesc,sortBy}">

				<b-table ref="refTable" :items="fetchData" responsive :fields="tableColumns" primary-key="id"
					:sort-by="sortBy" empty-text="No se encontró ningún Rol" :sort-desc="isSortDirDesc"
					sticky-header="700px" :no-border-collapse="false" borderless outlined small :busy="loading" >


					<template #empty>
						<span class="text-nowrap text-center d-block">
							No se encontró níngún usuario...
						</span>
					</template>
				
					<template #table-busy>
						<div class="text-center my-2">
							<b-spinner class="align-middle" variant="primary"></b-spinner>
							<strong>Cargando...</strong>
						</div>
					</template>

					<!-- Column: Actions -->
					<template #cell(actions)="{ item }">

						<b-button-group size="sm">

							<b-button :to="{ name: 'edit.role', params: { id: item.id } }" variant="primary" title="Editar Rol">
								<feather-icon icon="EditIcon" />
							</b-button>

							<b-button @click="eliminar(item.id)" variant="danger" title="Eliminar Rol">
								<feather-icon icon="TrashIcon" />
							</b-button>

						</b-button-group>

					</template>

				</b-table>
		</template>
	</listado>

</template>


<script>

import useRolTable from './useRolTable'
import {
	BCard,
	BContainer,
	BRow,
	BCol,
	BTable,
	BButtonGroup,
	BButton,
	BInputGroup,
	BFormInput,
	BSpinner

} from 'bootstrap-vue'

import { regresar } from '@core/utils/utils'
import { computed,onMounted } from 'vue'

import store from '@/store'

	export default{

		components:{
			BCard,
			BContainer,
			BRow,
			BCol,
			BTable,
			BButtonGroup,
			BButton,
			PerPage:() => import('components/PerPage'),
			PaginateTable:() => import('components/PaginateTable'),
			BInputGroup,
			BFormInput,
			BSpinner,
			Listado:() => import('components/Listado.vue')

		},

		setup(props){


			const actions = useRolTable();
			
			onMounted(() => {
				setTimeout(() => {
					actions.refetchData()
				},400)
			})


			return {
				refTable:actions.refTable,
				regresar,
				loading:computed(() =>  store.state.loading),
				actions
			}
		}
	}

</script>