<template>
  <div>
    <div class="flex-between mb-20">
      <div class="page-title">Nueva Venta</div>
      <RouterLink to="/ventas" class="btn btn-ghost">
        <ArrowLeft :size="16" /> Volver
      </RouterLink>
    </div>

    <!-- Barra de pasos -->
    <div class="steps-bar mb-24">
      <div class="step" :class="{ active: paso === 1, done: paso > 1 }">
        <div class="step-circle">
          <Check v-if="paso > 1" :size="14" />
          <span v-else>1</span>
        </div>
        <div class="step-label">Viaje</div>
      </div>
      <div class="step" :class="{ active: paso === 2, done: paso > 2 }">
        <div class="step-circle">
          <Check v-if="paso > 2" :size="14" />
          <span v-else>2</span>
        </div>
        <div class="step-label">Cliente</div>
      </div>
      <div class="step" :class="{ active: paso === 3, done: paso > 3 }">
        <div class="step-circle">
          <Check v-if="paso > 3" :size="14" />
          <span v-else>3</span>
        </div>
        <div class="step-label">Puesto</div>
      </div>
      <div class="step" :class="{ active: paso === 4, done: paso > 4 }">
        <div class="step-circle">
          <Check v-if="paso > 4" :size="14" />
          <span v-else>4</span>
        </div>
        <div class="step-label">Confirmar</div>
      </div>
      <div class="step" :class="{ active: paso === 5 }">
        <div class="step-circle">5</div>
        <div class="step-label">Ticket</div>
      </div>
    </div>

    <!-- PASO 1: Seleccionar viaje -->
    <div v-if="paso === 1">
      <div class="section-title">Seleccionar viaje</div>
      <div v-if="viajesDisponibles.length === 0" class="card">
        <div class="empty-state">
          <Map class="empty-state-icon-svg" :size="40" />
          <div class="empty-state-text">Sin viajes disponibles</div>
        </div>
      </div>
      <div class="trips-grid">
        <div
          v-for="viaje in viajesDisponibles"
          :key="viaje.id"
          class="trip-card"
          :class="{ selected: viajeSeleccionado?.id === viaje.id }"
          @click="seleccionarViaje(viaje)"
        >
          <div class="trip-route">{{ viaje.origen }} → {{ viaje.destino }}</div>
          <div class="trip-meta">
            <span style="display:inline-flex; align-items:center; gap:4px;"><Calendar :size="13" /> {{ viaje.fecha }}</span>
            <span style="display:inline-flex; align-items:center; gap:4px;"><Clock :size="13" /> {{ viaje.hora }}</span>
            <span style="display:inline-flex; align-items:center; gap:4px;"><Bus :size="13" /> {{ getVehiculo(viaje.vehiculoId)?.placa }}</span>
          </div>
          <div class="flex-between mt-16" style="margin-top:12px;">
            <div>
              <span class="badge badge-green">{{ getDisponibles(viaje) }} disponibles</span>
              <span class="badge badge-red" style="margin-left:6px;">{{ getOcupados(viaje) }} ocupados</span>
            </div>
            <strong style="color: var(--accent-blue-light);">${{ viaje.precio.toLocaleString('es-CO') }}</strong>
          </div>
        </div>
      </div>
      <div class="flex gap-12 mt-16">
        <button class="btn btn-primary btn-lg" :disabled="!viajeSeleccionado" @click="paso = 2">
          Continuar <ArrowRight :size="16" />
        </button>
      </div>
    </div>

    <!-- PASO 2: Seleccionar cliente -->
    <div v-if="paso === 2">
      <div class="section-title">Seleccionar cliente</div>
      <div class="card mb-16">
        <div class="form-group mb-12">
          <label class="form-label">Buscar por documento</label>
          <div class="flex gap-12">
            <input v-model="docBusqueda" class="form-input" style="max-width: 300px;" placeholder="Número de documento" />
            <button class="btn btn-outline" @click="buscarCliente">
              <Search :size="14" /> Buscar
            </button>
          </div>
        </div>

        <div v-if="clienteBuscado !== undefined">
          <div v-if="clienteBuscado === null" class="alert alert-error">
            <AlertCircle :size="16" />
            <span>Cliente no encontrado.</span>
            <RouterLink to="/clientes/registrar" class="text-blue" style="margin-left:8px;">Registrar nuevo cliente</RouterLink>
          </div>
          <div v-else class="client-found-card">
            <div class="flex-between">
              <div>
                <div style="font-weight:600; font-size:15px;">{{ clienteBuscado.nombre }}</div>
                <div class="text-muted" style="margin-top:4px;">{{ clienteBuscado.tipoDoc }}: {{ clienteBuscado.documento }} · {{ clienteBuscado.telefono }}</div>
                <div class="text-muted">{{ clienteBuscado.correo }}</div>
              </div>
              <button class="btn btn-success" @click="seleccionarCliente(clienteBuscado)">
                <Check :size="14" /> Seleccionar
              </button>
            </div>
          </div>
        </div>

        <div class="divider"></div>

        <div class="form-group">
          <label class="form-label">O seleccionar de la lista</label>
          <select class="form-select" style="max-width:400px;" @change="e => seleccionarClienteById(e.target.value)">
            <option value="">Seleccionar cliente</option>
            <option v-for="c in clientes" :key="c.id" :value="c.id">
              {{ c.nombre }} – {{ c.documento }}
            </option>
          </select>
        </div>
      </div>

      <div v-if="clienteSeleccionado" class="alert alert-success mb-16">
        <CheckCircle2 :size="16" />
        <span>Cliente: <strong>{{ clienteSeleccionado.nombre }}</strong></span>
      </div>
      <span class="form-error mb-12" v-if="errorCliente">
        <AlertCircle :size="14" /> {{ errorCliente }}
      </span>

      <div class="flex gap-12">
        <button class="btn btn-ghost" @click="paso = 1">
          <ArrowLeft :size="16" /> Volver
        </button>
        <button class="btn btn-primary btn-lg" :disabled="!clienteSeleccionado" @click="irPaso3">
          Continuar <ArrowRight :size="16" />
        </button>
      </div>
    </div>

    <!-- PASO 3: Seleccionar puesto -->
    <div v-if="paso === 3">
      <div class="section-title">Seleccionar puesto</div>
      <div class="two-col" style="align-items: start;">
        <div class="card">
          <SeatMap
            :puestos="vehiculoDelViaje?.puestos || []"
            :puestosOcupados="puestosOcupados"
            :puestoSeleccionado="puestoSeleccionado"
            :selectable="true"
            :conductor="vehiculoDelViaje?.conductor"
            @seleccionar="onSeleccionarPuesto"
          />
        </div>
        <div>
          <div class="card mb-16">
            <div class="card-title mb-12">Viaje</div>
            <div class="summary-row"><span class="summary-key">Ruta</span><span class="summary-val">{{ viajeSeleccionado?.origen }} → {{ viajeSeleccionado?.destino }}</span></div>
            <div class="summary-row"><span class="summary-key">Fecha</span><span class="summary-val">{{ viajeSeleccionado?.fecha }}</span></div>
            <div class="summary-row"><span class="summary-key">Hora</span><span class="summary-val">{{ viajeSeleccionado?.hora }}</span></div>
            <div class="summary-row"><span class="summary-key">Vehículo</span><span class="summary-val">{{ vehiculoDelViaje?.placa }}</span></div>
            <div class="summary-row"><span class="summary-key">Cliente</span><span class="summary-val">{{ clienteSeleccionado?.nombre }}</span></div>
          </div>
          <div v-if="puestoSeleccionado">
            <div class="selected-info" style="display:flex; align-items:center; gap:8px;">
              <CheckCircle2 :size="16" color="#3B82F6" />
              <span>Puesto seleccionado: <strong>{{ puestoSeleccionado.numero }}</strong></span>
            </div>
            <div class="form-group mt-12" style="margin-top: 12px;">
              <label class="form-label">Descripción o nota (opcional)</label>
              <textarea v-model="descripcionOpcional" class="form-input" rows="2" placeholder="Observaciones sobre el puesto o la venta..."></textarea>
            </div>
          </div>
          <span class="form-error mt-8" v-if="errorPuesto" style="display:block; margin-top:8px;">
            <AlertCircle :size="14" /> {{ errorPuesto }}
          </span>
        </div>
      </div>

      <div class="flex gap-12 mt-16">
        <button class="btn btn-ghost" @click="paso = 2">
          <ArrowLeft :size="16" /> Volver
        </button>
        <button class="btn btn-primary btn-lg" :disabled="!puestoSeleccionado" @click="irPaso4">
          Continuar <ArrowRight :size="16" />
        </button>
      </div>
    </div>

    <!-- PASO 4: Confirmar venta -->
    <div v-if="paso === 4">
      <div class="section-title">Confirmar venta</div>

      <div class="summary-card" style="max-width:500px;">
        <div class="summary-title">Resumen de la venta</div>
        <div class="summary-route">{{ viajeSeleccionado?.origen }} → {{ viajeSeleccionado?.destino }}</div>
        <div class="summary-row"><span class="summary-key">Cliente</span><span class="summary-val">{{ clienteSeleccionado?.nombre }}</span></div>
        <div class="summary-row"><span class="summary-key">Documento</span><span class="summary-val">{{ clienteSeleccionado?.tipoDoc }}: {{ clienteSeleccionado?.documento }}</span></div>
        <div class="summary-row"><span class="summary-key">Fecha viaje</span><span class="summary-val">{{ viajeSeleccionado?.fecha }}</span></div>
        <div class="summary-row"><span class="summary-key">Hora</span><span class="summary-val">{{ viajeSeleccionado?.hora }}</span></div>
        <div class="summary-row"><span class="summary-key">Vehículo</span><span class="summary-val">{{ vehiculoDelViaje?.tipo }} {{ vehiculoDelViaje?.placa }}</span></div>
        <div class="summary-row"><span class="summary-key">Conductor</span><span class="summary-val">{{ vehiculoDelViaje?.conductor }}</span></div>
        <div class="summary-row"><span class="summary-key">Puesto</span><span class="summary-val"><span class="badge badge-yellow">{{ puestoSeleccionado?.numero }}</span></span></div>
        <div v-if="descripcionOpcional" class="summary-row"><span class="summary-key">Nota</span><span class="summary-val">{{ descripcionOpcional }}</span></div>
        <div class="summary-price">${{ viajeSeleccionado?.precio.toLocaleString('es-CO') }}</div>
      </div>

      <div class="alert alert-error mt-16" v-if="errorVenta">
        <AlertCircle :size="16" /> {{ errorVenta }}
      </div>

      <div class="flex gap-12 mt-16">
        <button class="btn btn-ghost" @click="paso = 3">
          <ArrowLeft :size="16" /> Volver
        </button>
        <button class="btn btn-success btn-lg" @click="confirmarVenta">
          <CheckCircle2 :size="16" /> Confirmar venta
        </button>
      </div>
    </div>

    <!-- PASO 5: Ticket generado -->
    <div v-if="paso === 5">
      <div class="alert alert-success mb-20">
        <CheckCircle2 :size="16" /> Venta realizada.
      </div>
      <div class="flex gap-12">
        <RouterLink :to="`/tickets/${ventaCreada?.id}`" class="btn btn-primary btn-lg">
          <FileText :size="16" /> Ver ticket
        </RouterLink>
        <RouterLink to="/ventas/nueva" class="btn btn-outline" @click="reiniciar">
          <Ticket :size="16" /> Nueva venta
        </RouterLink>
        <RouterLink to="/ventas" class="btn btn-ghost">Ver ventas</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  AlertCircle,
  Map,
  Calendar,
  Clock,
  Bus,
  Search,
  FileText,
  Ticket
} from '@lucide/vue'
import { useViajeStore } from '../stores/viajeStore.js'
import { useVehiculoStore } from '../stores/vehiculoStore.js'
import { useClienteStore } from '../stores/clienteStore.js'
import { useVentaStore } from '../stores/ventaStore.js'
import SeatMap from '../components/SeatMap.vue'

const viajeStore = useViajeStore()
const vehiculoStore = useVehiculoStore()
const clienteStore = useClienteStore()
const ventaStore = useVentaStore()

const paso = ref(1)
const viajeSeleccionado = ref(null)
const clienteSeleccionado = ref(null)
const puestoSeleccionado = ref(null)
const ventaCreada = ref(null)

const docBusqueda = ref('')
const clienteBuscado = ref(undefined)
const descripcionOpcional = ref('')
const errorCliente = ref('')
const errorPuesto = ref('')
const errorVenta = ref('')

const clientes = computed(() => clienteStore.clientes)
const viajesDisponibles = computed(() =>
  viajeStore.viajes.filter(v => v.estado !== 'Cancelado' && v.estado !== 'Finalizado' && v.estado !== 'Completo')
)

const vehiculoDelViaje = computed(() =>
  viajeSeleccionado.value ? vehiculoStore.obtenerVehiculo(viajeSeleccionado.value.vehiculoId) : null
)

const puestosOcupados = computed(() =>
  viajeSeleccionado.value ? ventaStore.puestosOcupadosPorViaje(viajeSeleccionado.value.id) : []
)

function getVehiculo(id) { return vehiculoStore.obtenerVehiculo(id) }
function getOcupados(viaje) { return ventaStore.puestosOcupadosPorViaje(viaje.id).length }
function getDisponibles(viaje) {
  const v = getVehiculo(viaje.vehiculoId)
  return v ? v.capacidad - getOcupados(viaje) : 0
}

function seleccionarViaje(viaje) {
  viajeSeleccionado.value = viaje
  puestoSeleccionado.value = null
}

function buscarCliente() {
  const doc = docBusqueda.value.trim()
  if (!doc) { clienteBuscado.value = undefined; return }
  clienteBuscado.value = clienteStore.buscarClientePorDocumento(doc) || null
}

function seleccionarCliente(c) {
  clienteSeleccionado.value = c
  clienteBuscado.value = undefined
  docBusqueda.value = ''
  errorCliente.value = ''
}

function seleccionarClienteById(id) {
  if (!id) return
  clienteSeleccionado.value = clienteStore.obtenerCliente(id)
  errorCliente.value = ''
}

function irPaso3() {
  if (!clienteSeleccionado.value) { errorCliente.value = 'Debe seleccionar un cliente.'; return }
  errorCliente.value = ''
  paso.value = 3
}

function onSeleccionarPuesto(puesto) {
  puestoSeleccionado.value = puesto
  errorPuesto.value = ''
}

function irPaso4() {
  if (!puestoSeleccionado.value) { errorPuesto.value = 'Seleccione un puesto.'; return }
  errorPuesto.value = ''
  paso.value = 4
}

function confirmarVenta() {
  errorVenta.value = ''
  try {
    const nueva = ventaStore.crearVenta({
      viajeId: viajeSeleccionado.value.id,
      clienteId: clienteSeleccionado.value.id,
      puestoId: puestoSeleccionado.value.numero,
      precio: viajeSeleccionado.value.precio,
      descripcion: descripcionOpcional.value
    })
    ventaCreada.value = nueva
    paso.value = 5
  } catch (e) {
    errorVenta.value = e.message
  }
}

function reiniciar() {
  paso.value = 1
  viajeSeleccionado.value = null
  clienteSeleccionado.value = null
  puestoSeleccionado.value = null
  ventaCreada.value = null
  docBusqueda.value = ''
  clienteBuscado.value = undefined
  descripcionOpcional.value = ''
  errorCliente.value = ''
  errorPuesto.value = ''
  errorVenta.value = ''
}
</script>
