<template>
  <div>
    <div class="action-bar">
      <div>
        <div class="page-title">Ventas</div>
        <div class="page-subtitle">{{ ventas.length }} realizadas</div>
      </div>
      <RouterLink to="/ventas/nueva" class="btn btn-primary">
        <Plus :size="16" /> Nueva venta
      </RouterLink>
    </div>

    <div v-if="ventas.length === 0" class="card">
      <div class="empty-state">
        <Ticket class="empty-state-icon-svg" :size="40" />
        <div class="empty-state-text">Sin ventas</div>
      </div>
    </div>

    <div v-else class="card">
      <div class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th>Tiquete</th>
              <th>Cliente</th>
              <th>Documento</th>
              <th>Viaje</th>
              <th>Ruta</th>
              <th>Fecha viaje</th>
              <th>Puesto</th>
              <th>Precio</th>
              <th>Fecha venta</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="venta in ventas" :key="venta.id">
              <td><span class="badge badge-blue font-mono">{{ venta.id }}</span></td>
              <td><strong>{{ getCliente(venta.clienteId)?.nombre || '—' }}</strong></td>
              <td class="font-mono text-muted">{{ getCliente(venta.clienteId)?.documento || '—' }}</td>
              <td class="text-muted">{{ getViaje(venta.viajeId)?.codigo || '—' }}</td>
              <td>{{ getViaje(venta.viajeId) ? `${getViaje(venta.viajeId).origen} → ${getViaje(venta.viajeId).destino}` : '—' }}</td>
              <td class="text-muted">{{ getViaje(venta.viajeId)?.fecha || '—' }}</td>
              <td><span class="badge badge-yellow">{{ venta.puestoId }}</span></td>
              <td><strong>${{ venta.precio.toLocaleString('es-CO') }}</strong></td>
              <td class="text-muted">{{ venta.fechaVenta }}</td>
              <td><span class="badge badge-green">{{ venta.estado }}</span></td>
              <td>
                <RouterLink :to="`/tickets/${venta.id}`" class="btn btn-outline btn-sm">
                  <FileText :size="14" /> Ver ticket
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
import { Plus, Ticket, FileText } from '@lucide/vue'
import { useVentaStore } from '../stores/ventaStore.js'
import { useClienteStore } from '../stores/clienteStore.js'
import { useViajeStore } from '../stores/viajeStore.js'

const ventaStore = useVentaStore()
const clienteStore = useClienteStore()
const viajeStore = useViajeStore()

const ventas = computed(() => ventaStore.ventas)

function getCliente(id) {
  return clienteStore.obtenerCliente(id)
}

function getViaje(id) {
  return viajeStore.obtenerViaje(id)
}
</script>
