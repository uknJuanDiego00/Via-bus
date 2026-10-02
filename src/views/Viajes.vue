<template>
  <div>
    <div class="action-bar">
      <div>
        <div class="page-title">Viajes</div>
        <div class="page-subtitle">{{ viajes.length }} registrados</div>
      </div>
      <RouterLink to="/viajes/crear" class="btn btn-primary">
        <Plus :size="16" /> Crear viaje
      </RouterLink>
    </div>

    <div v-if="viajes.length === 0" class="card">
      <div class="empty-state">
        <Map class="empty-state-icon-svg" :size="40" />
        <div class="empty-state-text">Sin viajes programados</div>
      </div>
    </div>

    <div v-else class="card">
      <div class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Ruta</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Vehículo</th>
              <th>Conductor</th>
              <th>Cap.</th>
              <th>Ocup.</th>
              <th>Disp.</th>
              <th>Precio</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="viaje in viajes" :key="viaje.id">
              <td><span class="badge badge-blue font-mono">{{ viaje.codigo }}</span></td>
              <td><strong>{{ viaje.origen }} → {{ viaje.destino }}</strong></td>
              <td class="text-muted">{{ viaje.fecha }}</td>
              <td class="text-muted">{{ viaje.hora }}</td>
              <td>
                <span v-if="getVehiculo(viaje.vehiculoId)" class="font-mono">{{ getVehiculo(viaje.vehiculoId).placa }}</span>
                <span v-else class="text-muted">—</span>
              </td>
              <td class="text-muted">{{ getVehiculo(viaje.vehiculoId)?.conductor || '—' }}</td>
              <td>{{ getVehiculo(viaje.vehiculoId)?.capacidad || '—' }}</td>
              <td><span class="badge badge-red">{{ getOcupados(viaje) }}</span></td>
              <td><span class="badge badge-green">{{ getDisponibles(viaje) }}</span></td>
              <td><strong>${{ viaje.precio.toLocaleString('es-CO') }}</strong></td>
              <td><span :class="badgeEstado(viaje.estado)" class="badge">{{ viaje.estado }}</span></td>
              <td>
                <RouterLink to="/ventas/nueva" class="btn btn-primary btn-sm">
                  <Ticket :size="14" /> Vender
                </RouterLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Plus, Map, Ticket } from '@lucide/vue'
import { useViajeStore } from '../stores/viajeStore.js'
import { useVehiculoStore } from '../stores/vehiculoStore.js'
import { useVentaStore } from '../stores/ventaStore.js'

const viajeStore = useViajeStore()
const vehiculoStore = useVehiculoStore()
const ventaStore = useVentaStore()

const viajes = computed(() => viajeStore.viajes)

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

function badgeEstado(estado) {
  const map = {
    'Programado': 'badge-blue',
    'Disponible': 'badge-green',
    'Completo': 'badge-red',
    'Finalizado': 'badge-gray',
    'Cancelado': 'badge-yellow'
  }
  return map[estado] || 'badge-gray'
}
</script>
