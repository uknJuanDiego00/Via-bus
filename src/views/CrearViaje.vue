<template>
  <div style="max-width: 720px;">
    <div class="flex-between mb-20">
      <div class="page-title">Crear viaje</div>
      <RouterLink to="/viajes" class="btn btn-ghost">
        <ArrowLeft :size="16" /> Volver
      </RouterLink>
    </div>

    <div class="alert alert-success" v-if="exito">
      <CheckCircle2 :size="16" />
      <span>Viaje creado: <strong>{{ codigoCreado }}</strong></span>
    </div>

    <div class="card">
      <form @submit.prevent="guardar">
        <div class="form-grid mb-16">
          <div class="form-group">
            <label class="form-label">Origen *</label>
            <input v-model="form.origen" class="form-input" :class="{ error: errors.origen }" placeholder="Ciudad de origen" />
            <span class="form-error" v-if="errors.origen">
              <AlertCircle :size="14" /> {{ errors.origen }}
            </span>
          </div>

          <div class="form-group">
            <label class="form-label">Destino *</label>
            <input v-model="form.destino" class="form-input" :class="{ error: errors.destino }" placeholder="Ciudad de destino" />
            <span class="form-error" v-if="errors.destino">
              <AlertCircle :size="14" /> {{ errors.destino }}
            </span>
          </div>

          <div class="form-group">
            <label class="form-label">Fecha *</label>
            <input v-model="form.fecha" type="date" class="form-input" :class="{ error: errors.fecha }" />
            <span class="form-error" v-if="errors.fecha">
              <AlertCircle :size="14" /> {{ errors.fecha }}
            </span>
          </div>

          <div class="form-group">
            <label class="form-label">Hora *</label>
            <input v-model="form.hora" type="time" class="form-input" :class="{ error: errors.hora }" />
            <span class="form-error" v-if="errors.hora">
              <AlertCircle :size="14" /> {{ errors.hora }}
            </span>
          </div>

          <div class="form-group full-width">
            <label class="form-label">Vehículo *</label>
            <select v-model="form.vehiculoId" class="form-select" :class="{ error: errors.vehiculoId }" @change="onVehiculoChange">
              <option value="">Seleccionar vehículo</option>
              <option v-for="v in vehiculos" :key="v.id" :value="v.id">
                {{ v.placa }} – {{ v.tipo }} ({{ v.capacidad }} puestos)
              </option>
            </select>
            <span class="form-error" v-if="errors.vehiculoId">
              <AlertCircle :size="14" /> {{ errors.vehiculoId }}
            </span>
          </div>

          <!-- Info del vehículo seleccionado -->
          <div v-if="vehiculoSeleccionado" class="form-group full-width">
            <div class="vehicle-info-row">
              <div class="info-pill">Conductor: <strong>{{ vehiculoSeleccionado.conductor }}</strong></div>
              <div class="info-pill">Tipo: <strong>{{ vehiculoSeleccionado.tipo }}</strong></div>
              <div class="info-pill">Capacidad: <strong>{{ vehiculoSeleccionado.capacidad }}</strong></div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Precio *</label>
            <input v-model.number="form.precio" type="number" min="0" class="form-input" :class="{ error: errors.precio }" placeholder="Ej: 75000" />
            <span class="form-error" v-if="errors.precio">
              <AlertCircle :size="14" /> {{ errors.precio }}
            </span>
          </div>

          <div class="form-group">
            <label class="form-label">Estado *</label>
            <select v-model="form.estado" class="form-select">
              <option value="Programado">Programado</option>
              <option value="Disponible">Disponible</option>
            </select>
          </div>
        </div>

        <div class="flex gap-12">
          <button type="submit" class="btn btn-primary btn-lg">
            <Save :size="16" /> Crear viaje
          </button>
          <button type="button" class="btn btn-ghost" @click="limpiar">Limpiar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ArrowLeft, CheckCircle2, AlertCircle, Save } from '@lucide/vue'
import { useViajeStore } from '../stores/viajeStore.js'
import { useVehiculoStore } from '../stores/vehiculoStore.js'

const viajeStore = useViajeStore()
const vehiculoStore = useVehiculoStore()

const vehiculos = computed(() => vehiculoStore.vehiculos)

const form = reactive({
  origen: '',
  destino: '',
  fecha: '',
  hora: '',
  vehiculoId: '',
  precio: '',
  estado: 'Programado'
})

const errors = reactive({})
const exito = ref(false)
const codigoCreado = ref('')
const vehiculoSeleccionado = ref(null)

function onVehiculoChange() {
  vehiculoSeleccionado.value = vehiculoStore.obtenerVehiculo(form.vehiculoId)
}

function validar() {
  Object.keys(errors).forEach(k => delete errors[k])

  if (!form.origen.trim()) errors.origen = 'El origen es obligatorio.'
  if (!form.destino.trim()) errors.destino = 'El destino es obligatorio.'
  if (!form.fecha) errors.fecha = 'La fecha es obligatoria.'
  if (!form.hora) errors.hora = 'La hora es obligatoria.'
  if (!form.vehiculoId) errors.vehiculoId = 'Debe seleccionar un vehículo.'
  if (!form.precio || form.precio <= 0) errors.precio = 'El precio debe ser mayor que cero.'

  return Object.keys(errors).length === 0
}

function guardar() {
  if (!validar()) return
  exito.value = false

  const nuevo = viajeStore.crearViaje({
    origen: form.origen.trim(),
    destino: form.destino.trim(),
    fecha: form.fecha,
    hora: form.hora,
    vehiculoId: form.vehiculoId,
    precio: form.precio,
    estado: form.estado
  })

  codigoCreado.value = nuevo.codigo
  exito.value = true
  limpiar()
}

function limpiar() {
  Object.assign(form, { origen: '', destino: '', fecha: '', hora: '', vehiculoId: '', precio: '', estado: 'Programado' })
  vehiculoSeleccionado.value = null
  Object.keys(errors).forEach(k => delete errors[k])
}
</script>
