<template>
  <q-page class="q-pa-lg">
    <div class="q-mx-auto" style="max-width: 1150px;">
      <div class="row items-center justify-between q-mb-lg">
        <div>
          <div class="text-h5 text-weight-bold text-grey-9">Viajes Programados</div>
          <div class="text-caption text-grey-6">{{ viajes.length }} rutas y salidas activas</div>
        </div>
        <q-btn
          color="primary"
          icon="add"
          label="Crear Viaje"
          to="/viajes/crear"
          no-caps
          unelevated
        />
      </div>

      <q-card flat bordered class="shadow-1 rounded-borders">
        <q-table
          flat
          :rows="viajes"
          :columns="columns"
          row-key="id"
          :pagination="{ rowsPerPage: 10 }"
          no-data-label="No hay viajes registrados"
        >
          <template v-slot:body-cell-codigo="props">
            <q-td :props="props">
              <q-badge color="blue-1" text-color="primary" class="text-weight-bold text-mono">
                {{ props.row.codigo }}
              </q-badge>
            </q-td>
          </template>

          <template v-slot:body-cell-ruta="props">
            <q-td :props="props">
              <span class="text-weight-bold">{{ props.row.origen }}</span>
              <q-icon name="arrow_forward" size="14px" class="q-mx-xs text-grey-6" />
              <span class="text-weight-bold">{{ props.row.destino }}</span>
            </q-td>
          </template>

          <template v-slot:body-cell-vehiculo="props">
            <q-td :props="props">
              <span class="text-weight-medium">{{ getVehiculo(props.row.vehiculoId)?.placa || '—' }}</span>
              <span class="text-caption text-grey-6 q-ml-xs">({{ getVehiculo(props.row.vehiculoId)?.tipo }})</span>
            </q-td>
          </template>

          <template v-slot:body-cell-disponibilidad="props">
            <q-td :props="props">
              <q-badge color="positive" class="q-mr-xs">
                {{ getDisponibles(props.row) }} disp.
              </q-badge>
              <q-badge color="negative">
                {{ getOcupados(props.row) }} ocup.
              </q-badge>
            </q-td>
          </template>

          <template v-slot:body-cell-precio="props">
            <q-td :props="props">
              <span class="text-weight-bold">${{ props.row.precio.toLocaleString('es-CO') }}</span>
            </q-td>
          </template>

          <template v-slot:body-cell-estado="props">
            <q-td :props="props">
              <q-badge :color="colorEstado(props.row.estado)">
                {{ props.row.estado }}
              </q-badge>
            </q-td>
          </template>

          <template v-slot:body-cell-acciones="props">
            <q-td :props="props">
              <q-btn
                color="primary"
                size="sm"
                icon="add_shopping_cart"
                label="Vender"
                to="/ventas/nueva"
                no-caps
                unelevated
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
import { useViajeStore } from '../stores/viajeStore'
import { useVehiculoStore } from '../stores/vehiculoStore'
import { useVentaStore } from '../stores/ventaStore'

const viajeStore = useViajeStore()
const vehiculoStore = useVehiculoStore()
const ventaStore = useVentaStore()

const viajes = computed(() => viajeStore.viajes)

const columns = [
  { name: 'codigo', label: 'Código', field: 'codigo', align: 'left', sortable: true },
  { name: 'ruta', label: 'Ruta', field: 'origen', align: 'left' },
  { name: 'fecha', label: 'Fecha', field: 'fecha', align: 'left', sortable: true },
  { name: 'hora', label: 'Hora', field: 'hora', align: 'left' },
  { name: 'vehiculo', label: 'Vehículo', field: 'vehiculoId', align: 'left' },
  { name: 'disponibilidad', label: 'Puestos', field: 'id', align: 'center' },
  { name: 'precio', label: 'Tarifa', field: 'precio', align: 'right', sortable: true },
  { name: 'estado', label: 'Estado', field: 'estado', align: 'center' },
  { name: 'acciones', label: 'Acciones', align: 'center' }
]

function getVehiculo(id) {
  return vehiculoStore.obtenerVehiculo(id)
}

function getOcupados(viaje) {
  return ventaStore.puestosOcupadosPorViaje(viaje.id).length
}

function getDisponibles(viaje) {
  const v = getVehiculo(viaje.vehiculoId)
  if (!v) return 0
  return v.capacidad - getOcupados(viaje)
}

function colorEstado(estado) {
  const map = {
    'Programado': 'info',
    'Disponible': 'positive',
    'Completo': 'negative',
    'Finalizado': 'grey-6',
    'Cancelado': 'warning'
  }
  return map[estado] || 'grey'
}
</script>
