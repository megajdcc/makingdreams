<template>

	<listado-table :actions="actions" placeholderSearch="Buscar Permisos..." hideFooter >

		<template #btn-action>
			<b-button variant="dark" :to="{ name: 'create.permiso' }">
				<feather-icon size="18" icon="PlusSquareIcon" />
				Añadir
			</b-button>
		</template>

		<template #contenido="{eliminar,fetchData,tableColumns,isSortDirDesc,sortBy}">

				<b-table ref="refTable" :items="fetchData" responsive :fields="tableColumns" primary-key="id"
					:sort-by="sortBy" empty-text="No se encontró ningún Permiso" :sort-desc="isSortDirDesc"
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

							<b-button :to="{ name: 'edit.permiso', params: { id: item.id } }" variant="primary" title="Editar Permiso">
								<feather-icon icon="EditIcon" />
							</b-button>

							<b-button @click="eliminar(item.id)" variant="danger" title="Eliminar Permiso">
								<feather-icon icon="TrashIcon" />
							</b-button>

						</b-button-group>

					</template>

				</b-table>

		</template>

	</listado-table>

</template>


<script>

import usePermiso from './usePermiso'
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
import store from '@/store'

import {computed,onMounted} from 'vue'

export default {

	components: {
		BCard,
		BContainer,
		BRow,
		BCol,
		BTable,
		BButtonGroup,
		BButton,
		BInputGroup,
		BFormInput,
		BSpinner,
		ListadoTable:() => import('components/Listado.vue')


	},

	setup(props) {


		const actions = usePermiso();
		
		onMounted(() => setTimeout(() => actions.refetchData(), 400))

		return {
			refTable:actions.refTable,
			regresar,
			loading:computed(() => store.state.loading),
			actions
		}
	}
}

</script>