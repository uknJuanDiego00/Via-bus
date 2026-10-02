<template>
  <q-page class="q-pa-lg">
    <div class="q-mx-auto" style="max-width: 1150px;">
      <div class="row items-center justify-between q-mb-lg">
        <div>
          <div class="text-h5 text-weight-bold text-grey-9">Ventas Realizadas</div>
          <div class="text-caption text-grey-6">{{ ventas.length }} tiquetes emitidos</div>
        </div>
        <q-btn
          color="primary"
          icon="add_shopping_cart"
          label="Nueva Venta"
          to="/ventas/nueva"
          no-caps
          unelevated
        />
      </div>

      <q-card flat bordered class="shadow-1 rounded-borders">
        <q-table
          flat
          :rows="ventas"
          :columns="columns"
          row-key="id"
          :pagination="{ rowsPerPage: 10 }"
          no-data-label="No hay ventas registradas"
        >
          <template v-slot:body-cell-id="props">
            <q-td :props="props">
              <q-badge color="blue-1" text-color="primary" class="text-weight-bold text-mono">
                {{ props.row.id }}
              </q-badge>
            </q-td>
          </template>

          <template v-slot:body-cell-cliente="props">
            <q-td :props="props">
              <span class="text-weight-bold">{{ getCliente(props.row.clienteId)?.nombre || '—' }}</span>
            </q-td>
          </template>

          <template v-slot:body-cell-documento="props">
            <q-td :props="props">
              <span class="text-mono">{{ getCliente(props.row.clienteId)?.documento || '—' }}</span>
            </q-td>
          </template>

          <template v-slot:body-cell-viaje="props">
            <q-td :props="props">
              <span class="text-mono text-grey-8">{{ getViaje(props.row.viajeId)?.codigo || '—' }}</span>
            </q-td>
          </template>

          <template v-slot:body-cell-ruta="props">
            <q-td :props="props">
              <span v-if="getViaje(props.row.viajeId)">
                {{ getViaje(props.row.viajeId).origen }} → {{ getViaje(props.row.viajeId).destino }}
              </span>
              <span v-else>—</span>
            </q-td>
          </template>

          <template v-slot:body-cell-puesto="props">
            <q-td :props="props">
              <q-badge color="amber-2" text-color="black" class="text-weight-bold">
                Puesto #{{ props.row.puestoId }}
              </q-badge>
            </q-td>
          </template>

          <template v-slot:body-cell-precio="props">
            <q-td :props="props">
              <span class="text-weight-bolder">${{ props.row.precio.toLocaleString('es-CO') }}</span>
            </q-td>
          </template>

          <template v-slot:body-cell-estado="props">
            <q-td :props="props">
              <q-badge color="positive">
                {{ props.row.estado }}
              </q-badge>
            </q-td>
          </template>

          <template v-slot:body-cell-acciones="props">
            <q-td :props="props">
              <q-btn
                outline
                color="primary"
                size="sm"
                icon="description"
                label="Ver Tiquete"
                :to="`/tickets/${props.row.id}`"
                no-caps
              />
            </q-td>
          </template>
        </q-table>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { computed } from 'vue'
import { useVentaStore } from '../stores/ventaStore'
import { useClienteStore } from '../stores/clienteStore'
import { useViajeStore } from '../stores/viajeStore'

const ventaStore = useVentaStore()
const clienteStore = useClienteStore()
const viajeStore = useViajeStore()

const ventas = computed(() => ventaStore.ventas)

const columns = [
  { name: 'id', label: 'Tiquete', field: 'id', align: 'left', sortable: true },
  { name: 'cliente', label: 'Pasajero', field: 'clienteId', align: 'left' },
  { name: 'documento', label: 'Documento', field: 'clienteId', align: 'left' },
  { name: 'viaje', label: 'Viaje', field: 'viajeId', align: 'left' },
  { name: 'ruta', label: 'Ruta', field: 'viajeId', align: 'left' },
  { name: 'puesto', label: 'Puesto', field: 'puestoId', align: 'center' },
  { name: 'precio', label: 'Valor', field: 'precio', align: 'right', sortable: true },
  { name: 'fechaVenta', label: 'Fecha Venta', field: 'fechaVenta', align: 'left' },
  { name: 'estado', label: 'Estado', field: 'estado', align: 'center' },
  { name: 'acciones', label: 'Acciones', align: 'center' }
]

function getCliente(id) {
  return clienteStore.obtenerCliente(id)
}

function getViaje(id) {
  return viajeStore.obtenerViaje(id)
}
</script>
