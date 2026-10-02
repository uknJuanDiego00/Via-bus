<template>
  <q-page class="q-pa-lg">
    <div class="q-mx-auto" style="max-width: 1050px;">
      <div class="row items-center justify-between q-mb-lg">
        <q-btn flat color="grey-8" icon="arrow_back" label="Volver a Vehículos" to="/vehiculos" no-caps />
      </div>

      <div v-if="!vehiculo" class="text-center q-pa-xl">
        <q-icon name="directions_bus" size="48px" color="grey-5" />
        <div class="text-h6 text-grey-6 q-mt-md">Vehículo no encontrado</div>
      </div>

      <div v-else class="row q-col-gutter-lg">
        <!-- Ficha técnica -->
        <div class="col-12 col-md-5">
          <q-card flat bordered class="q-mb-md shadow-1 rounded-borders">
            <q-card-section>
              <div class="text-subtitle1 text-weight-bold text-grey-9 q-mb-xs">
                {{ vehiculo.tipo }} — {{ vehiculo.placa }}
              </div>
              <div class="text-caption text-grey-6">Detalles técnicos de la unidad</div>
            </q-card-section>

            <q-separator />

            <q-card-section class="q-gutter-y-sm">
              <div class="row justify-between">
                <span class="text-grey-6">Capacidad total:</span>
                <span class="text-weight-bold">{{ vehiculo.capacidad }} puestos</span>
              </div>
              <div class="row justify-between">
                <span class="text-grey-6">Conductor asignado:</span>
                <span class="text-weight-bold">{{ vehiculo.conductor }}</span>
              </div>
              <div class="row justify-between">
                <span class="text-grey-6">Serie del chasis:</span>
                <span class="text-weight-bold text-mono">{{ vehiculo.serieChasis }}</span>
              </div>
              <div class="row justify-between">
                <span class="text-grey-6">Serie del motor:</span>
                <span class="text-weight-bold text-mono">{{ vehiculo.serieMotor }}</span>
              </div>
            </q-card-section>

            <q-separator />

            <q-card-section>
              <div class="text-caption text-weight-bold q-mb-sm text-grey-8">
                Asignación del Puesto del Conductor
              </div>
              <q-select
                outlined
                dense
                v-model="conductorPuestoId"
                :options="opcionesPuestos"
                emit-value
                map-options
                label="Seleccionar puesto del conductor"
                @update:model-value="asignarConductor"
              />
              <div class="text-caption text-grey-6 q-mt-xs">
                El puesto asignado al conductor no podrá ser comercializado.
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Mapa interactivo -->
        <div class="col-12 col-md-7">
          <q-card flat bordered class="shadow-1 rounded-borders">
            <q-card-section class="row items-center justify-between">
              <div class="text-subtitle1 text-weight-bold text-grey-9">Disposición de Puestos</div>
              <q-badge color="primary">
                {{ vehiculo.puestos.filter(p => !p.esConductor).length }} comerciales
              </q-badge>
            </q-card-section>

            <q-separator />

            <q-card-section>
              <SeatMap
                :puestos="vehiculo.puestos"
                :puestosOcupados="[]"
                :puestoSeleccionado="null"
                :selectable="false"
                :conductor="vehiculo.conductor"
              />
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useVehiculoStore } from '../stores/vehiculoStore'
import SeatMap from '../components/SeatMap.vue'

const route = useRoute()
const store = useVehiculoStore()

const vehiculo = computed(() => store.obtenerVehiculo(route.params.id))
const conductorPuestoId = ref(null)

const opcionesPuestos = computed(() => {
  if (!vehiculo.value) return []
  return vehiculo.value.puestos.map(p => ({
    label: `Puesto #${p.numero}`,
    value: p.id
  }))
})

onMounted(() => {
  if (vehiculo.value) {
    const p = vehiculo.value.puestos.find(p => p.esConductor)
    conductorPuestoId.value = p ? p.id : null
  }
})

function asignarConductor() {
  store.actualizarPuestoConductor(route.params.id, conductorPuestoId.value)
}
</script>
