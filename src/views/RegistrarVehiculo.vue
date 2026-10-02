<template>
  <div style="max-width: 720px;">
    <div class="flex-between mb-20">
      <div>
        <div class="page-title">Registrar vehículo</div>
      </div>
      <RouterLink to="/vehiculos" class="btn btn-ghost">
        <ArrowLeft :size="16" /> Volver
      </RouterLink>
    </div>

    <div class="alert alert-success" v-if="exito">
      <CheckCircle2 :size="16" />
      <span>Vehículo registrado. <RouterLink :to="`/vehiculos/${nuevoId}/mapeo`" class="text-blue">Configurar puestos</RouterLink></span>
    </div>

    <div class="card">
      <form @submit.prevent="guardar">
        <div class="form-grid mb-16">
          <div class="form-group">
            <label class="form-label">Tipo de vehículo *</label>
            <select v-model="form.tipo" class="form-select" :class="{ error: errors.tipo }">
              <option value="">Seleccionar</option>
              <option value="Bus">Bus</option>
              <option value="Buseta">Buseta</option>
              <option value="Microbús">Microbús</option>
            </select>
            <span class="form-error" v-if="errors.tipo">
              <AlertCircle :size="14" /> {{ errors.tipo }}
            </span>
          </div>

          <div class="form-group">
            <label class="form-label">Placa *</label>
            <input v-model="form.placa" class="form-input" :class="{ error: errors.placa }" placeholder="ABC123" />
            <span class="form-error" v-if="errors.placa">
              <AlertCircle :size="14" /> {{ errors.placa }}
            </span>
          </div>

          <div class="form-group">
            <label class="form-label">Número de serie *</label>
            <input v-model="form.numeroSerie" class="form-input" :class="{ error: errors.numeroSerie }" placeholder="SER-001" />
            <span class="form-error" v-if="errors.numeroSerie">
              <AlertCircle :size="14" /> {{ errors.numeroSerie }}
            </span>
          </div>

          <div class="form-group">
            <label class="form-label">Capacidad (puestos) *</label>
            <input v-model.number="form.capacidad" type="number" min="1" max="100" class="form-input" :class="{ error: errors.capacidad }" />
            <span class="form-error" v-if="errors.capacidad">
              <AlertCircle :size="14" /> {{ errors.capacidad }}
            </span>
          </div>

          <div class="form-group">
            <label class="form-label">Nombre del conductor *</label>
            <input v-model="form.conductor" class="form-input" :class="{ error: errors.conductor }" placeholder="Nombre completo" />
            <span class="form-error" v-if="errors.conductor">
              <AlertCircle :size="14" /> {{ errors.conductor }}
            </span>
          </div>

          <div class="form-group">
            <label class="form-label">Serie del chasis *</label>
            <input v-model="form.serieChasis" class="form-input" :class="{ error: errors.serieChasis }" placeholder="CHS-001" />
            <span class="form-error" v-if="errors.serieChasis">
              <AlertCircle :size="14" /> {{ errors.serieChasis }}
            </span>
          </div>

          <div class="form-group">
            <label class="form-label">Serie del motor *</label>
            <input v-model="form.serieMotor" class="form-input" :class="{ error: errors.serieMotor }" placeholder="MOT-001" />
            <span class="form-error" v-if="errors.serieMotor">
              <AlertCircle :size="14" /> {{ errors.serieMotor }}
            </span>
          </div>
        </div>

        <div class="flex gap-12">
          <button type="submit" class="btn btn-primary btn-lg">
            <Save :size="16" /> Guardar vehículo
          </button>
          <button type="button" class="btn btn-ghost" @click="limpiar">Limpiar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ArrowLeft, CheckCircle2, AlertCircle, Save } from '@lucide/vue'
import { useVehiculoStore } from '../stores/vehiculoStore.js'

const store = useVehiculoStore()

const form = reactive({
  tipo: '',
  placa: '',
  numeroSerie: '',
  capacidad: '',
  conductor: '',
  serieChasis: '',
  serieMotor: ''
})

const errors = reactive({})
const exito = ref(false)
const nuevoId = ref(null)

function validar() {
  Object.keys(errors).forEach(k => delete errors[k])

  if (!form.tipo) errors.tipo = 'El tipo es obligatorio.'
  if (!form.placa.trim()) errors.placa = 'La placa es obligatoria.'
  else if (store.placaExiste(form.placa.trim())) errors.placa = 'La placa ya está registrada.'
  if (!form.numeroSerie.trim()) errors.numeroSerie = 'El número de serie es obligatorio.'
  else if (store.serieExiste(form.numeroSerie.trim())) errors.numeroSerie = 'El número de serie ya está registrado.'
  if (!form.capacidad || form.capacidad <= 0) errors.capacidad = 'La capacidad debe ser mayor que cero.'
  if (!form.conductor.trim()) errors.conductor = 'El nombre del conductor es obligatorio.'
  if (!form.serieChasis.trim()) errors.serieChasis = 'La serie del chasis es obligatoria.'
  if (!form.serieMotor.trim()) errors.serieMotor = 'La serie del motor es obligatoria.'

  return Object.keys(errors).length === 0
}

function guardar() {
  if (!validar()) return
  exito.value = false

  const nuevo = store.registrarVehiculo({
    tipo: form.tipo,
    placa: form.placa.trim().toUpperCase(),
    numeroSerie: form.numeroSerie.trim(),
    capacidad: form.capacidad,
    conductor: form.conductor.trim(),
    serieChasis: form.serieChasis.trim(),
    serieMotor: form.serieMotor.trim()
  })

  nuevoId.value = nuevo.id
  exito.value = true
  limpiar()
}

function limpiar() {
  form.tipo = ''
  form.placa = ''
  form.numeroSerie = ''
  form.capacidad = ''
  form.conductor = ''
  form.serieChasis = ''
  form.serieMotor = ''
  Object.keys(errors).forEach(k => delete errors[k])
}
</script>
