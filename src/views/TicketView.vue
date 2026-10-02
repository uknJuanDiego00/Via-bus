<template>
  <div>
    <div v-if="!venta" class="card">
      <div class="empty-state">
        <FileText class="empty-state-icon-svg" :size="40" />
        <div class="empty-state-text">Tiquete no encontrado.</div>
      </div>
    </div>

    <template v-else>
      <div class="ticket-wrapper">
        <!-- Cabecera -->
        <div class="ticket-header">
          <div class="ticket-brand">VIABUS</div>
          <div class="ticket-type">Tiquete de Viaje</div>
          <div class="ticket-number">{{ venta.id }}</div>
        </div>

        <!-- Separador decorativo -->
        <div class="ticket-divider">
          <div class="ticket-divider-icon">
            <Bus :size="20" />
          </div>
        </div>

        <!-- Cuerpo -->
        <div class="ticket-body">
          <!-- Ruta -->
          <div class="ticket-route">
            <div>
              <div class="ticket-city">{{ viaje?.origen }}</div>
              <div class="ticket-city-label">Origen</div>
            </div>
            <div class="ticket-arrow">→</div>
            <div style="text-align:right;">
              <div class="ticket-city">{{ viaje?.destino }}</div>
              <div class="ticket-city-label">Destino</div>
            </div>
          </div>

          <!-- Detalles -->
          <div class="ticket-details">
            <div class="ticket-field">
              <div class="ticket-field-label">Pasajero</div>
              <div class="ticket-field-value">{{ cliente?.nombre }}</div>
            </div>
            <div class="ticket-field">
              <div class="ticket-field-label">Documento</div>
              <div class="ticket-field-value">{{ cliente?.tipoDoc }}: {{ cliente?.documento }}</div>
            </div>
            <div class="ticket-field">
              <div class="ticket-field-label">Fecha</div>
              <div class="ticket-field-value">{{ viaje?.fecha }}</div>
            </div>
            <div class="ticket-field">
              <div class="ticket-field-label">Hora</div>
              <div class="ticket-field-value">{{ viaje?.hora }}</div>
            </div>
            <div class="ticket-field">
              <div class="ticket-field-label">Vehículo</div>
              <div class="ticket-field-value">{{ vehiculo?.tipo }} {{ vehiculo?.placa }}</div>
            </div>
            <div class="ticket-field">
              <div class="ticket-field-label">Conductor</div>
              <div class="ticket-field-value">{{ vehiculo?.conductor }}</div>
            </div>
            <div class="ticket-field">
              <div class="ticket-field-label">Puesto</div>
              <div class="ticket-field-value"><span class="badge badge-yellow">{{ venta.puestoId }}</span></div>
            </div>
            <div class="ticket-field">
              <div class="ticket-field-label">Fecha de compra</div>
              <div class="ticket-field-value">{{ venta.fechaVenta }}</div>
            </div>
            <div v-if="venta.descripcion" class="ticket-field" style="grid-column: 1 / -1;">
              <div class="ticket-field-label">Descripción / Observaciones</div>
              <div class="ticket-field-value">{{ venta.descripcion }}</div>
            </div>
          </div>

          <!-- Precio -->
          <div class="ticket-price-row">
            <div>
              <div class="ticket-field-label">Total pagado</div>
              <div class="ticket-price">${{ venta.precio.toLocaleString('es-CO') }}</div>
            </div>
            <div class="ticket-status-badge">
              <CheckCircle2 :size="16" /> {{ venta.estado }}
            </div>
          </div>
        </div>

        <!-- Acciones -->
        <div class="ticket-actions">
          <button class="btn btn-outline" @click="imprimir">
            <Printer :size="16" /> Imprimir
          </button>
          <RouterLink to="/ventas" class="btn btn-ghost">
            <ArrowLeft :size="16" /> Ventas
          </RouterLink>
          <RouterLink to="/ventas/nueva" class="btn btn-primary">
            <Ticket :size="16" /> Nueva venta
          </RouterLink>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { FileText, Bus, CheckCircle2, Printer, ArrowLeft, Ticket } from '@lucide/vue'
import { useVentaStore } from '../stores/ventaStore.js'
import { useClienteStore } from '../stores/clienteStore.js'
import { useViajeStore } from '../stores/viajeStore.js'
import { useVehiculoStore } from '../stores/vehiculoStore.js'

const route = useRoute()
const ventaStore = useVentaStore()
const clienteStore = useClienteStore()
const viajeStore = useViajeStore()
const vehiculoStore = useVehiculoStore()

const venta = computed(() => ventaStore.obtenerVenta(route.params.id))
const cliente = computed(() => venta.value ? clienteStore.obtenerCliente(venta.value.clienteId) : null)
const viaje = computed(() => venta.value ? viajeStore.obtenerViaje(venta.value.viajeId) : null)
const vehiculo = computed(() => viaje.value ? vehiculoStore.obtenerVehiculo(viaje.value.vehiculoId) : null)

function imprimir() {
  window.print()
}
</script>
