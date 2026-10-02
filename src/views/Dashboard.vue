<template>
  <div>
    <!-- Stats -->
    <div class="stats-grid">
      <div class="stat-card">
        <Bus class="stat-icon-svg" :size="26" color="#3B82F6" />
        <div class="stat-value">{{ vehiculos.length }}</div>
        <div class="stat-label">Vehículos</div>
      </div>
      <div class="stat-card">
        <Users class="stat-icon-svg" :size="26" color="#22C55E" />
        <div class="stat-value">{{ clientes.length }}</div>
        <div class="stat-label">Clientes</div>
      </div>
      <div class="stat-card">
        <Map class="stat-icon-svg" :size="26" color="#F59E0B" />
        <div class="stat-value">{{ viajes.length }}</div>
        <div class="stat-label">Viajes</div>
      </div>
      <div class="stat-card">
        <Ticket class="stat-icon-svg" :size="26" color="#7C3AED" />
        <div class="stat-value">{{ ventas.length }}</div>
        <div class="stat-label">Ventas</div>
      </div>
      <div class="stat-card">
        <Activity class="stat-icon-svg" :size="26" color="#DC2626" />
        <div class="stat-value">{{ totalOcupados }}</div>
        <div class="stat-label">Puestos ocupados</div>
      </div>
      <div class="stat-card">
        <DollarSign class="stat-icon-svg" :size="26" color="#16A34A" />
        <div class="stat-value">{{ formatPrecio(totalIngresos) }}</div>
        <div class="stat-label">Ingresos</div>
      </div>
    </div>

    <div class="two-col" style="gap:20px; align-items:start;">
      <!-- Próximos viajes -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">Próximos viajes</span>
          <RouterLink to="/viajes" class="btn btn-outline btn-sm">Ver todos</RouterLink>
        </div>
        <div v-if="viajesProximos.length === 0" class="empty-state">
          <Map class="empty-state-icon-svg" :size="40" />
          <div class="empty-state-text">Sin viajes programados</div>
        </div>
        <div class="table-wrap" v-else>
          <table class="table">
            <thead>
              <tr>
                <th>Ruta</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Ocupación</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="viaje in viajesProximos" :key="viaje.id">
                <td><strong>{{ viaje.origen }} → {{ viaje.destino }}</strong></td>
                <td class="text-muted">{{ viaje.fecha }}</td>
                <td class="text-muted">{{ viaje.hora }}</td>
                <td>
                  <span class="badge badge-green">{{ getDisponibles(viaje) }} disp.</span>
                </td>
                <td><span :class="badgeEstado(viaje.estado)" class="badge">{{ viaje.estado }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Accesos rápidos -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">Accesos rápidos</span>
        </div>
        <div class="quick-actions">
          <RouterLink to="/vehiculos/registrar" class="quick-action-btn">
            <Bus class="qa-icon" :size="28" />
            Registrar vehículo
          </RouterLink>
          <RouterLink to="/clientes/registrar" class="quick-action-btn">
            <UserPlus class="qa-icon" :size="28" />
            Registrar cliente
          </RouterLink>
          <RouterLink to="/viajes/crear" class="quick-action-btn">
            <MapPin class="qa-icon" :size="28" />
            Crear viaje
          </RouterLink>
          <RouterLink to="/ventas/nueva" class="quick-action-btn">
            <Ticket class="qa-icon" :size="28" />
            Vender tiquete
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useVehiculoStore } from '../stores/vehiculoStore.js'
import { useClienteStore } from '../stores/clienteStore.js'
import { useViajeStore } from '../stores/viajeStore.js'
import { useVentaStore } from '../stores/ventaStore.js'
import { Bus, Users, Map, Ticket, Activity, DollarSign, UserPlus, MapPin } from '@lucide/vue'

const vehiculoStore = useVehiculoStore()
const clienteStore = useClienteStore()
const viajeStore = useViajeStore()
const ventaStore = useVentaStore()

const vehiculos = computed(() => vehiculoStore.vehiculos)
const clientes = computed(() => clienteStore.clientes)
const viajes = computed(() => viajeStore.viajes)
const ventas = computed(() => ventaStore.ventas)
const totalIngresos = computed(() => ventaStore.totalIngresos)
const totalOcupados = computed(() => ventas.value.length)

const viajesProximos = computed(() =>
  viajes.value.filter(v => v.estado !== 'Cancelado' && v.estado !== 'Finalizado').slice(0, 5)
)

function getDisponibles(viaje) {
  const v = vehiculoStore.obtenerVehiculo(viaje.vehiculoId)
  if (!v) return 0
  const ocupados = ventaStore.puestosOcupadosPorViaje(viaje.id).length
  return v.capacidad - ocupados
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

function formatPrecio(v) {
  return '$' + v.toLocaleString('es-CO')
}
</script>
