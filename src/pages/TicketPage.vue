<template>
  <q-page class="q-pa-lg">
    <div class="row items-center justify-between q-mb-lg no-print" style="max-width: 650px; margin-left: auto; margin-right: auto;">
      <q-btn flat color="grey-8" icon="arrow_back" label="Volver a Ventas" to="/ventas" no-caps />
      <div class="row q-gutter-sm">
        <q-btn color="primary" icon="print" label="Imprimir" @click="imprimir" no-caps unelevated />
        <q-btn outline color="primary" icon="add_shopping_cart" label="Nueva Venta" to="/ventas/nueva" no-caps />
      </div>
    </div>

    <div v-if="!venta" class="text-center q-pa-xl">
      <q-icon name="receipt_long" size="48px" color="grey-5" />
      <div class="text-h6 text-grey-6 q-mt-md">Tiquete no encontrado</div>
    </div>

    <div v-else style="max-width: 650px; margin: 0 auto;">
      <q-card flat bordered class="ticket-card">
        <!-- Encabezado del Tiquete -->
        <div class="bg-primary text-white q-pa-md text-center">
          <div class="row items-center justify-center q-gutter-xs">
            <q-icon name="directions_bus" size="24px" />
            <span class="text-h6 text-weight-bold">VIABUS</span>
          </div>
          <div class="text-caption text-blue-2">Tiquete de Transporte Intermunicipal</div>
          <div class="text-subtitle2 text-weight-bolder text-mono q-mt-xs">{{ venta.id }}</div>
        </div>

        <!-- Ruta -->
        <q-card-section class="bg-grey-1 text-center q-py-md">
          <div class="row items-center justify-center q-gutter-md">
            <div>
              <div class="text-h6 text-weight-bold text-grey-9">{{ viaje?.origen }}</div>
              <div class="text-caption text-grey-6">Origen</div>
            </div>
            <q-icon name="trending_flat" size="28px" color="primary" />
            <div>
              <div class="text-h6 text-weight-bold text-grey-9">{{ viaje?.destino }}</div>
              <div class="text-caption text-grey-6">Destino</div>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <!-- Detalles del Pasajero y Viaje -->
        <q-card-section class="q-pa-lg">
          <div class="row q-col-gutter-y-sm text-body2">
            <div class="col-6">
              <span class="text-grey-6 block text-caption">Pasajero:</span>
              <strong class="text-grey-9">{{ cliente?.nombre }}</strong>
            </div>

            <div class="col-6">
              <span class="text-grey-6 block text-caption">Documento:</span>
              <span class="text-mono">{{ cliente?.tipoDoc }}: {{ cliente?.documento }}</span>
            </div>

            <div class="col-6">
              <span class="text-grey-6 block text-caption">Fecha de salida:</span>
              <span>{{ viaje?.fecha }}</span>
            </div>

            <div class="col-6">
              <span class="text-grey-6 block text-caption">Hora de salida:</span>
              <span>{{ viaje?.hora }}</span>
            </div>

            <div class="col-6">
              <span class="text-grey-6 block text-caption">Vehículo:</span>
              <span>{{ vehiculo?.tipo }} {{ vehiculo?.placa }}</span>
            </div>

            <div class="col-6">
              <span class="text-grey-6 block text-caption">Conductor:</span>
              <span>{{ vehiculo?.conductor }}</span>
            </div>

            <div class="col-6">
              <span class="text-grey-6 block text-caption">Puesto Asignado:</span>
              <q-badge color="amber-3" text-color="black" class="text-weight-bolder text-subtitle2">
                #{{ venta.puestoId }}
              </q-badge>
            </div>

            <div class="col-6">
              <span class="text-grey-6 block text-caption">Fecha y hora de compra:</span>
              <span class="text-caption">{{ venta.fechaVenta }}</span>
            </div>

            <div v-if="venta.descripcion" class="col-12 q-mt-xs">
              <span class="text-grey-6 block text-caption">Observaciones / Descripción:</span>
              <span class="text-grey-9 text-body2 bg-grey-2 q-pa-xs rounded-borders block">{{ venta.descripcion }}</span>
            </div>
          </div>

          <q-separator class="q-my-md" />

          <!-- Precio y Estado -->
          <div class="row items-center justify-between">
            <div>
              <div class="text-caption text-grey-6">Total Abonado</div>
              <div class="text-h5 text-weight-bolder text-primary">
                ${{ venta.precio.toLocaleString('es-CO') }}
              </div>
            </div>
            <div>
              <q-chip color="positive" text-color="white" icon="check_circle">
                {{ venta.estado }}
              </q-chip>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useVentaStore } from '../stores/ventaStore'
import { useClienteStore } from '../stores/clienteStore'
import { useViajeStore } from '../stores/viajeStore'
import { useVehiculoStore } from '../stores/vehiculoStore'

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

<style scoped>
.ticket-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
}
@media print {
  .no-print {
    display: none !important;
  }
}
</style>
