<template>
  <div>
    <div class="flex-between mb-20">
      <RouterLink to="/vehiculos" class="btn btn-ghost">
        <ArrowLeft :size="16" /> Volver
      </RouterLink>
    </div>

    <div v-if="!vehiculo" class="card">
      <div class="empty-state">
        <Bus class="empty-state-icon-svg" :size="40" />
        <div class="empty-state-text">Vehículo no encontrado.</div>
      </div>
    </div>

    <template v-else>
      <!-- Info del vehículo -->
      <div class="card mb-20">
        <div class="card-header">
          <span class="card-title">{{ vehiculo.tipo }} — {{ vehiculo.placa }}</span>
          <span class="badge badge-blue">{{ vehiculo.capacidad }} puestos</span>
        </div>
        <div class="vehicle-info-row">
          <div class="info-pill"><span>Conductor:</span> <strong>{{ vehiculo.conductor }}</strong></div>
          <div class="info-pill"><span>Chasis:</span> <strong>{{ vehiculo.serieChasis }}</strong></div>
          <div class="info-pill"><span>Motor:</span> <strong>{{ vehiculo.serieMotor }}</strong></div>
        </div>

        <!-- Selector de puesto conductor -->
        <div class="form-group" style="max-width:300px;">
          <label class="form-label">Puesto del conductor</label>
          <select class="form-select" v-model="conductorPuestoId" @change="asignarConductor">
            <option value="">Sin asignar</option>
            <option v-for="p in vehiculo.puestos" :key="p.id" :value="p.id">
              Puesto {{ p.numero }}
            </option>
          </select>
          <span class="form-hint">El puesto seleccionado se marcará en azul y no podrá venderse.</span>
        </div>
      </div>

      <!-- Mapa de puestos -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">Mapa de puestos</span>
          <span class="text-muted">{{ vehiculo.puestos.filter(p => !p.esConductor).length }} asientos</span>
        </div>
        <SeatMap
          :puestos="vehiculo.puestos"
          :puestosOcupados="[]"
          :puestoSeleccionado="null"
          :selectable="false"
          :conductor="vehiculo.conductor"
        />
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft, Bus } from '@lucide/vue'
import { useVehiculoStore } from '../stores/vehiculoStore.js'
import SeatMap from '../components/SeatMap.vue'

const route = useRoute()
const store = useVehiculoStore()

const vehiculo = computed(() => store.obtenerVehiculo(route.params.id))
const conductorPuestoId = ref('')

onMounted(() => {
  if (vehiculo.value) {
    const p = vehiculo.value.puestos.find(p => p.esConductor)
    conductorPuestoId.value = p ? p.id : ''
  }
})

function asignarConductor() {
  store.actualizarPuestoConductor(route.params.id, conductorPuestoId.value)
}
</script>
