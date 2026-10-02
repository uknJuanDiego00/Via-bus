<template>
  <q-page class="q-pa-lg">
    <div class="q-mx-auto" style="max-width: 1200px;">
      <div class="row items-center justify-between q-mb-lg">
        <div>
          <div class="text-h5 text-weight-bold text-grey-9">Dashboard General</div>
          <div class="text-caption text-grey-6">Resumen operativo del sistema VIABUS</div>
        </div>
        <q-btn color="primary" icon="add_shopping_cart" label="Nueva Venta" to="/ventas/nueva" no-caps unelevated />
      </div>

    <!-- Indicadores Estadísticos -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-6 col-md-4 col-lg-2">
        <q-card flat bordered class="q-pa-sm">
          <q-card-section class="row items-center justify-between no-wrap">
            <div>
              <div class="text-caption text-grey-6 text-uppercase text-weight-medium">Vehículos</div>
              <div class="text-h5 text-weight-bolder text-primary">{{ vehiculos.length }}</div>
            </div>
            <q-avatar color="blue-1" text-color="primary" icon="directions_bus" size="44px" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-4 col-lg-2">
        <q-card flat bordered class="q-pa-sm">
          <q-card-section class="row items-center justify-between no-wrap">
            <div>
              <div class="text-caption text-grey-6 text-uppercase text-weight-medium">Clientes</div>
              <div class="text-h5 text-weight-bolder text-positive">{{ clientes.length }}</div>
            </div>
            <q-avatar color="green-1" text-color="positive" icon="people" size="44px" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-4 col-lg-2">
        <q-card flat bordered class="q-pa-sm">
          <q-card-section class="row items-center justify-between no-wrap">
            <div>
              <div class="text-caption text-grey-6 text-uppercase text-weight-medium">Viajes</div>
              <div class="text-h5 text-weight-bolder text-warning">{{ viajes.length }}</div>
            </div>
            <q-avatar color="amber-1" text-color="warning" icon="route" size="44px" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-4 col-lg-2">
        <q-card flat bordered class="q-pa-sm">
          <q-card-section class="row items-center justify-between no-wrap">
            <div>
              <div class="text-caption text-grey-6 text-uppercase text-weight-medium">Ventas</div>
              <div class="text-h5 text-weight-bolder text-deep-purple">{{ ventas.length }}</div>
            </div>
            <q-avatar color="deep-purple-1" text-color="deep-purple" icon="receipt_long" size="44px" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-4 col-lg-2">
        <q-card flat bordered class="q-pa-sm">
          <q-card-section class="row items-center justify-between no-wrap">
            <div>
              <div class="text-caption text-grey-6 text-uppercase text-weight-medium">Ocupados</div>
              <div class="text-h5 text-weight-bolder text-negative">{{ ventas.length }}</div>
            </div>
            <q-avatar color="red-1" text-color="negative" icon="event_seat" size="44px" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-4 col-lg-2">
        <q-card flat bordered class="q-pa-sm">
          <q-card-section class="row items-center justify-between no-wrap">
            <div>
              <div class="text-caption text-grey-6 text-uppercase text-weight-medium">Ingresos</div>
              <div class="text-h6 text-weight-bolder text-positive">${{ formatPrecio(totalIngresos) }}</div>
            </div>
            <q-avatar color="green-1" text-color="positive" icon="payments" size="44px" />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Contenido en 2 columnas -->
    <div class="row q-col-gutter-lg">
      <!-- Próximos Viajes -->
      <div class="col-12 col-lg-8">
        <q-card flat bordered>
          <q-card-section class="row items-center justify-between q-pb-none">
            <div class="text-subtitle1 text-weight-bold text-grey-8">Próximos Viajes Programados</div>
            <q-btn flat dense color="primary" label="Ver todos" to="/viajes" no-caps />
          </q-card-section>

          <q-card-section>
            <q-table
              flat
              :rows="viajesProximos"
              :columns="columnsViajes"
              row-key="id"
              hide-pagination
              :rows-per-page-options="[5]"
              no-data-label="No hay viajes programados"
            >
              <template v-slot:body-cell-ruta="props">
                <q-td :props="props">
                  <span class="text-weight-bold">{{ props.row.origen }}</span>
                  <q-icon name="arrow_forward" size="14px" class="q-mx-xs text-grey-6" />
                  <span class="text-weight-bold">{{ props.row.destino }}</span>
                </q-td>
              </template>

              <template v-slot:body-cell-disponibilidad="props">
                <q-td :props="props">
                  <q-badge color="positive" class="q-py-xs q-px-sm">
                    {{ getDisponibles(props.row) }} disponibles
                  </q-badge>
                </q-td>
              </template>

              <template v-slot:body-cell-estado="props">
                <q-td :props="props">
                  <q-badge :color="colorEstado(props.row.estado)" class="q-py-xs q-px-sm">
                    {{ props.row.estado }}
                  </q-badge>
                </q-td>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>

      <!-- Accesos Rápidos -->
      <div class="col-12 col-lg-4">
        <q-card flat bordered>
          <q-card-section class="q-pb-sm">
            <div class="text-subtitle1 text-weight-bold text-grey-8">Accesos Rápidos</div>
            <div class="text-caption text-grey-6">Operaciones frecuentes del sistema</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-list separator>
              <q-item clickable v-ripple to="/ventas/nueva" class="rounded-borders q-my-xs">
                <q-item-section avatar>
                  <q-avatar color="primary" text-color="white" icon="add_shopping_cart" size="36px" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-medium">Venta de Tiquete</q-item-label>
                  <q-item-label caption>Paso a paso de reserva y cobro</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-icon name="chevron_right" />
                </q-item-section>
              </q-item>

              <q-item clickable v-ripple to="/vehiculos/registrar" class="rounded-borders q-my-xs">
                <q-item-section avatar>
                  <q-avatar color="blue-7" text-color="white" icon="directions_bus" size="36px" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-medium">Registrar Vehículo</q-item-label>
                  <q-item-label caption>Añadir bus, buseta o microbús</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-icon name="chevron_right" />
                </q-item-section>
              </q-item>

              <q-item clickable v-ripple to="/clientes/registrar" class="rounded-borders q-my-xs">
                <q-item-section avatar>
                  <q-avatar color="positive" text-color="white" icon="person_add" size="36px" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-medium">Registrar Cliente</q-item-label>
                  <q-item-label caption>Nuevo pasajero en el sistema</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-icon name="chevron_right" />
                </q-item-section>
              </q-item>

              <q-item clickable v-ripple to="/viajes/crear" class="rounded-borders q-my-xs">
                <q-item-section avatar>
                  <q-avatar color="warning" text-color="white" icon="route" size="36px" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-medium">Programar Viaje</q-item-label>
                  <q-item-label caption>Asignar fecha, hora y vehículo</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-icon name="chevron_right" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</q-page>
</template>

<script setup>
import { computed } from 'vue'
import { useVehiculoStore } from '../stores/vehiculoStore'
import { useClienteStore } from '../stores/clienteStore'
import { useViajeStore } from '../stores/viajeStore'
import { useVentaStore } from '../stores/ventaStore'

const vehiculoStore = useVehiculoStore()
const clienteStore = useClienteStore()
const viajeStore = useViajeStore()
const ventaStore = useVentaStore()

const vehiculos = computed(() => vehiculoStore.vehiculos)
const clientes = computed(() => clienteStore.clientes)
const viajes = computed(() => viajeStore.viajes)
const ventas = computed(() => ventaStore.ventas)
const totalIngresos = computed(() => ventaStore.totalIngresos)

const viajesProximos = computed(() =>
  viajes.value.filter(v => v.estado !== 'Cancelado' && v.estado !== 'Finalizado').slice(0, 5)
)

const columnsViajes = [
  { name: 'ruta', label: 'Ruta', field: 'origen', align: 'left' },
  { name: 'fecha', label: 'Fecha', field: 'fecha', align: 'left' },
  { name: 'hora', label: 'Hora', field: 'hora', align: 'left' },
  { name: 'disponibilidad', label: 'Disponibilidad', field: 'id', align: 'center' },
  { name: 'estado', label: 'Estado', field: 'estado', align: 'center' }
]

function getDisponibles(viaje) {
  const v = vehiculoStore.obtenerVehiculo(viaje.vehiculoId)
  if (!v) return 0
  const ocupados = ventaStore.puestosOcupadosPorViaje(viaje.id).length
  return v.capacidad - ocupados
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

function formatPrecio(val) {
  return val ? val.toLocaleString('es-CO') : '0'
}
</script>
