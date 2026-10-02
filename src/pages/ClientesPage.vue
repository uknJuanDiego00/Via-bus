<template>
  <q-page class="q-pa-lg">
    <div class="q-mx-auto" style="max-width: 1100px;">
      <div class="row items-center justify-between q-mb-lg">
        <div>
          <div class="text-h5 text-weight-bold text-grey-9">Clientes</div>
          <div class="text-caption text-grey-6">{{ clientes.length }} clientes registrados</div>
        </div>
        <q-btn
          color="primary"
          icon="person_add"
          label="Registrar Cliente"
          to="/clientes/registrar"
          no-caps
          unelevated
        />
      </div>

      <!-- Buscador -->
      <q-card flat bordered class="q-mb-md shadow-1 rounded-borders">
        <q-card-section class="q-py-sm">
          <q-input
            outlined
            dense
            v-model="filtro"
            placeholder="Buscar por documento o nombre..."
            clearable
            style="max-width: 400px;"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </q-card-section>
      </q-card>

      <q-card flat bordered class="shadow-1 rounded-borders">
        <q-table
          flat
          :rows="clientesFiltrados"
          :columns="columns"
          row-key="id"
          :pagination="{ rowsPerPage: 10 }"
          no-data-label="No hay clientes que coincidan"
        >
          <template v-slot:body-cell-tipoDoc="props">
            <q-td :props="props">
              <q-badge color="grey-3" text-color="grey-9" class="text-weight-bold">
                {{ props.row.tipoDoc }}
              </q-badge>
            </q-td>
          </template>

          <template v-slot:body-cell-nombre="props">
            <q-td :props="props">
              <span class="text-weight-bold">{{ props.row.nombre }}</span>
            </q-td>
          </template>
        </q-table>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useClienteStore } from '../stores/clienteStore'

const store = useClienteStore()
const filtro = ref('')
const clientes = computed(() => store.clientes)

const clientesFiltrados = computed(() => {
  const q = filtro.value?.trim().toLowerCase()
  if (!q) return clientes.value
  return clientes.value.filter(c =>
    c.documento.toLowerCase().includes(q) ||
    c.nombre.toLowerCase().includes(q)
  )
})

const columns = [
  { name: 'tipoDoc', label: 'Tipo', field: 'tipoDoc', align: 'center' },
  { name: 'documento', label: 'Documento', field: 'documento', align: 'left', sortable: true },
  { name: 'nombre', label: 'Nombre Completo', field: 'nombre', align: 'left', sortable: true },
  { name: 'telefono', label: 'Teléfono', field: 'telefono', align: 'left' },
  { name: 'correo', label: 'Correo Electrónico', field: 'correo', align: 'left' },
  { name: 'direccion', label: 'Dirección', field: 'direccion', align: 'left' }
]
</script>
