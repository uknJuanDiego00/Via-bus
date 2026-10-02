<template>
  <q-page class="q-pa-lg">
    <div class="q-mx-auto" style="max-width: 780px;">
      <div class="row items-center justify-between q-mb-lg">
        <div>
          <div class="text-h5 text-weight-bold text-grey-9">Registrar Cliente</div>
          <div class="text-caption text-grey-6">Ingreso de un nuevo pasajero</div>
        </div>
        <q-btn flat color="grey-8" icon="arrow_back" label="Volver" to="/clientes" no-caps />
      </div>

      <!-- Mensaje de éxito -->
      <q-banner v-if="exito" class="bg-green-1 text-positive q-mb-md rounded-borders" rounded>
        <template v-slot:avatar>
          <q-icon name="check_circle" color="positive" />
        </template>
        Cliente registrado exitosamente en la base de datos.
      </q-banner>

      <q-card flat bordered class="shadow-1 rounded-borders">
        <q-card-section class="q-pa-lg">
          <q-form @submit.prevent="guardar" class="q-gutter-md">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-6">
                <q-select
                  outlined
                  dense
                  v-model="form.tipoDoc"
                  :options="opcionesDoc"
                  emit-value
                  map-options
                  label="Tipo de documento *"
                  :rules="[val => !!val || 'Seleccione el tipo de documento']"
                />
              </div>

              <div class="col-12 col-sm-6">
                <q-input
                  outlined
                  dense
                  v-model="form.documento"
                  label="Número de documento *"
                  placeholder="1020304050"
                  :rules="[
                    val => !!val?.trim() || 'El documento es obligatorio',
                    val => !store.documentoExiste(val) || 'Este documento ya está registrado'
                  ]"
                />
              </div>

              <div class="col-12">
                <q-input
                  outlined
                  dense
                  v-model="form.nombre"
                  label="Nombre completo *"
                  placeholder="Nombres y Apellidos"
                  :rules="[val => !!val?.trim() || 'El nombre es obligatorio']"
                />
              </div>

              <div class="col-12 col-sm-6">
                <q-input
                  outlined
                  dense
                  v-model="form.telefono"
                  label="Teléfono *"
                  placeholder="3101234567"
                  :rules="[val => !!val?.trim() || 'El teléfono es obligatorio']"
                />
              </div>

              <div class="col-12 col-sm-6">
                <q-input
                  outlined
                  dense
                  type="email"
                  v-model="form.correo"
                  label="Correo electrónico *"
                  placeholder="correo@ejemplo.com"
                  :rules="[val => !!val?.trim() || 'El correo es obligatorio']"
                />
              </div>

              <div class="col-12">
                <q-input
                  outlined
                  dense
                  v-model="form.direccion"
                  label="Dirección *"
                  placeholder="Dirección de residencia"
                  :rules="[val => !!val?.trim() || 'La dirección es obligatoria']"
                />
              </div>
            </div>

            <div class="row items-center q-gutter-md q-pt-md">
              <q-btn type="submit" color="primary" icon="save" label="Guardar Cliente" no-caps unelevated />
              <q-btn flat color="grey-7" label="Limpiar" @click="limpiar" no-caps />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useClienteStore } from '../stores/clienteStore'

const store = useClienteStore()

const opcionesDoc = [
  { label: 'CC – Cédula de Ciudadanía', value: 'CC' },
  { label: 'TI – Tarjeta de Identidad', value: 'TI' },
  { label: 'CE – Cédula de Extranjería', value: 'CE' },
  { label: 'PP – Pasaporte', value: 'PP' },
  { label: 'NIT – Número de Identificación Tributaria', value: 'NIT' }
]

const form = reactive({
  tipoDoc: '',
  documento: '',
  nombre: '',
  telefono: '',
  correo: '',
  direccion: ''
})

const exito = ref(false)

function guardar() {
  exito.value = false
  store.registrarCliente({
    tipoDoc: form.tipoDoc,
    documento: form.documento,
    nombre: form.nombre,
    telefono: form.telefono,
    correo: form.correo,
    direccion: form.direccion
  })

  exito.value = true
  limpiar()
}

function limpiar() {
  form.tipoDoc = ''
  form.documento = ''
  form.nombre = ''
  form.telefono = ''
  form.correo = ''
  form.direccion = ''
}
</script>
