<template>
  <q-page class="q-pa-lg">
    <div class="q-mx-auto" style="max-width: 780px;">
      <div class="row items-center justify-between q-mb-lg">
        <div>
          <div class="text-h5 text-weight-bold text-grey-9">Crear Nuevo Viaje</div>
          <div class="text-caption text-grey-6">Programación de itinerario y asignación de vehículo</div>
        </div>
        <q-btn flat color="grey-8" icon="arrow_back" label="Volver" to="/viajes" no-caps />
      </div>

      <!-- Mensaje de éxito -->
      <q-banner v-if="exito" class="bg-green-1 text-positive q-mb-md rounded-borders" rounded>
        <template v-slot:avatar>
          <q-icon name="check_circle" color="positive" />
        </template>
        Viaje programado con éxito. Código asignado: <strong>{{ codigoCreado }}</strong>
      </q-banner>

      <q-card flat bordered class="shadow-1 rounded-borders">
        <q-card-section class="q-pa-lg">
          <q-form @submit.prevent="guardar" class="q-gutter-md">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-6">
                <q-input
                  outlined
                  dense
                  v-model="form.origen"
                  label="Ciudad de origen *"
                  placeholder="Ej: Bogotá"
                  :rules="[val => !!val?.trim() || 'El origen es obligatorio']"
                />
              </div>

              <div class="col-12 col-sm-6">
                <q-input
                  outlined
                  dense
                  v-model="form.destino"
                  label="Ciudad de destino *"
                  placeholder="Ej: Medellín"
                  :rules="[val => !!val?.trim() || 'El destino es obligatorio']"
                />
              </div>

              <div class="col-12 col-sm-6">
                <q-input
                  outlined
                  dense
                  type="date"
                  v-model="form.fecha"
                  label="Fecha de salida *"
                  stack-label
                  :rules="[val => !!val || 'La fecha es obligatoria']"
                />
              </div>

              <div class="col-12 col-sm-6">
                <q-input
                  outlined
                  dense
                  type="time"
                  v-model="form.hora"
                  label="Hora de salida *"
                  stack-label
                  :rules="[val => !!val || 'La hora es obligatoria']"
                />
              </div>

              <div class="col-12">
                <q-select
                  outlined
                  dense
                  v-model="form.vehiculoId"
                  :options="opcionesVehiculos"
                  emit-value
                  map-options
                  label="Vehículo asignado *"
                  :rules="[val => !!val || 'Debe asignar un vehículo']"
                  @update:model-value="onVehiculoChange"
                />
              </div>

              <!-- Ficha del vehículo seleccionado -->
              <div v-if="vehiculoSeleccionado" class="col-12">
                <div class="bg-blue-1 text-primary q-pa-sm rounded-borders row q-gutter-md items-center">
                  <div><span class="text-grey-7">Tipo:</span> <strong>{{ vehiculoSeleccionado.tipo }}</strong></div>
                  <div><span class="text-grey-7">Conductor:</span> <strong>{{ vehiculoSeleccionado.conductor }}</strong></div>
                  <div><span class="text-grey-7">Capacidad:</span> <strong>{{ vehiculoSeleccionado.capacidad }} puestos</strong></div>
                </div>
              </div>

              <div class="col-12 col-sm-6">
                <q-input
                  outlined
                  dense
                  type="number"
                  v-model.number="form.precio"
                  label="Precio del tiquete ($ COP) *"
                  prefix="$"
                  min="0"
                  :rules="[val => (Number(val) > 0) || 'El precio debe ser mayor a 0']"
                />
              </div>

              <div class="col-12 col-sm-6">
                <q-select
                  outlined
                  dense
                  v-model="form.estado"
                  :options="['Programado', 'Disponible']"
                  label="Estado inicial *"
                />
              </div>
            </div>

            <div class="row items-center q-gutter-md q-pt-md">
              <q-btn type="submit" color="primary" icon="save" label="Crear Viaje" no-caps unelevated />
              <q-btn flat color="grey-7" label="Limpiar" @click="limpiar" no-caps />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useViajeStore } from '../stores/viajeStore'
import { useVehiculoStore } from '../stores/vehiculoStore'

const viajeStore = useViajeStore()
const vehiculoStore = useVehiculoStore()

const vehiculos = computed(() => vehiculoStore.vehiculos)

const opcionesVehiculos = computed(() =>
  vehiculos.value.map(v => ({
    label: `${v.placa} – ${v.tipo} (${v.capacidad} puestos) | Conductor: ${v.conductor}`,
    value: v.id
  }))
)

const form = reactive({
  origen: '',
  destino: '',
  fecha: '',
  hora: '',
  vehiculoId: null,
  precio: '',
  estado: 'Programado'
})

const exito = ref(false)
const codigoCreado = ref('')
const vehiculoSeleccionado = ref(null)

function onVehiculoChange(val) {
  vehiculoSeleccionado.value = vehiculoStore.obtenerVehiculo(val)
}

function guardar() {
  exito.value = false
  const nuevo = viajeStore.crearViaje({
    origen: form.origen,
    destino: form.destino,
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
  form.origen = ''
  form.destino = ''
  form.fecha = ''
  form.hora = ''
  form.vehiculoId = null
  form.precio = ''
  form.estado = 'Programado'
  vehiculoSeleccionado.value = null
}
</script>
