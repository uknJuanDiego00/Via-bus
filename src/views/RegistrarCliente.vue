<template>
  <div style="max-width: 720px;">
    <div class="flex-between mb-20">
      <div class="page-title">Registrar cliente</div>
      <RouterLink to="/clientes" class="btn btn-ghost">
        <ArrowLeft :size="16" /> Volver
      </RouterLink>
    </div>

    <div class="alert alert-success" v-if="exito">
      <CheckCircle2 :size="16" />
      <span>Cliente registrado.</span>
    </div>

    <div class="card">
      <form @submit.prevent="guardar">
        <div class="form-grid mb-16">
          <div class="form-group">
            <label class="form-label">Tipo de documento *</label>
            <select v-model="form.tipoDoc" class="form-select" :class="{ error: errors.tipoDoc }">
              <option value="">Seleccionar</option>
              <option value="CC">CC – Cédula de ciudadanía</option>
              <option value="TI">TI – Tarjeta de identidad</option>
              <option value="CE">CE – Cédula de extranjería</option>
              <option value="PP">PP – Pasaporte</option>
              <option value="NIT">NIT</option>
            </select>
            <span class="form-error" v-if="errors.tipoDoc">
              <AlertCircle :size="14" /> {{ errors.tipoDoc }}
            </span>
          </div>

          <div class="form-group">
            <label class="form-label">Número de documento *</label>
            <input v-model="form.documento" class="form-input" :class="{ error: errors.documento }" placeholder="Ej: 12345678" />
            <span class="form-error" v-if="errors.documento">
              <AlertCircle :size="14" /> {{ errors.documento }}
            </span>
          </div>

          <div class="form-group full-width">
            <label class="form-label">Nombre completo *</label>
            <input v-model="form.nombre" class="form-input" :class="{ error: errors.nombre }" placeholder="Nombre y apellidos" />
            <span class="form-error" v-if="errors.nombre">
              <AlertCircle :size="14" /> {{ errors.nombre }}
            </span>
          </div>

          <div class="form-group">
            <label class="form-label">Teléfono *</label>
            <input v-model="form.telefono" class="form-input" :class="{ error: errors.telefono }" placeholder="Ej: 3001234567" />
            <span class="form-error" v-if="errors.telefono">
              <AlertCircle :size="14" /> {{ errors.telefono }}
            </span>
          </div>

          <div class="form-group">
            <label class="form-label">Correo electrónico *</label>
            <input v-model="form.correo" type="email" class="form-input" :class="{ error: errors.correo }" placeholder="correo@mail.com" />
            <span class="form-error" v-if="errors.correo">
              <AlertCircle :size="14" /> {{ errors.correo }}
            </span>
          </div>

          <div class="form-group full-width">
            <label class="form-label">Dirección *</label>
            <input v-model="form.direccion" class="form-input" :class="{ error: errors.direccion }" placeholder="Dirección de residencia" />
            <span class="form-error" v-if="errors.direccion">
              <AlertCircle :size="14" /> {{ errors.direccion }}
            </span>
          </div>
        </div>

        <div class="flex gap-12">
          <button type="submit" class="btn btn-primary btn-lg">
            <Save :size="16" /> Guardar cliente
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
import { useClienteStore } from '../stores/clienteStore.js'

const store = useClienteStore()

const form = reactive({
  tipoDoc: '',
  documento: '',
  nombre: '',
  telefono: '',
  correo: '',
  direccion: ''
})

const errors = reactive({})
const exito = ref(false)

function validar() {
  Object.keys(errors).forEach(k => delete errors[k])

  if (!form.tipoDoc) errors.tipoDoc = 'El tipo de documento es obligatorio.'
  if (!form.documento.trim()) errors.documento = 'El documento es obligatorio.'
  else if (store.documentoExiste(form.documento.trim())) errors.documento = 'Este documento ya está registrado.'
  if (!form.nombre.trim()) errors.nombre = 'El nombre es obligatorio.'
  if (!form.telefono.trim()) errors.telefono = 'El teléfono es obligatorio.'
  if (!form.correo.trim()) errors.correo = 'El correo es obligatorio.'
  if (!form.direccion.trim()) errors.direccion = 'La dirección es obligatoria.'

  return Object.keys(errors).length === 0
}

function guardar() {
  if (!validar()) return
  exito.value = false

  store.registrarCliente({
    tipoDoc: form.tipoDoc,
    documento: form.documento.trim(),
    nombre: form.nombre.trim(),
    telefono: form.telefono.trim(),
    correo: form.correo.trim(),
    direccion: form.direccion.trim()
  })

  exito.value = true
  limpiar()
}

function limpiar() {
  Object.assign(form, { tipoDoc: '', documento: '', nombre: '', telefono: '', correo: '', direccion: '' })
  Object.keys(errors).forEach(k => delete errors[k])
}
</script>
