<template>
  <q-page class="q-pa-lg">
    <div class="q-mx-auto" style="max-width: 780px;">
      <div class="row items-center justify-between q-mb-lg">
        <div>
          <div class="text-h5 text-weight-bold text-grey-9">Registrar Vehículo</div>
          <div class="text-caption text-grey-6">Ingreso de nueva unidad a la flota</div>
        </div>
        <q-btn flat color="grey-8" icon="arrow_back" label="Volver" to="/vehiculos" no-caps />
      </div>

      <!-- Mensaje de éxito -->
      <q-banner v-if="exito" class="bg-green-1 text-positive q-mb-md rounded-borders" rounded>
        <template v-slot:avatar>
          <q-icon name="check_circle" color="positive" />
        </template>
        <div>
          Vehículo registrado correctamente.
          <q-btn flat dense color="primary" label="Configurar puestos aquí" :to="`/vehiculos/${nuevoId}/mapeo`" no-caps class="q-ml-sm text-weight-bold" />
        </div>
      </q-banner>

      <q-card flat bordered class="shadow-1 rounded-borders">
        <q-card-section class="q-pa-lg">
          <q-form @submit.prevent="guardar" class="q-gutter-md">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-6">
                <q-select
                  outlined
                  dense
                  v-model="form.tipo"
                  :options="['Bus', 'Buseta', 'Microbús']"
                  label="Tipo de vehículo *"
                  :rules="[val => !!val || 'Seleccione el tipo de vehículo']"
                />
              </div>

              <div class="col-12 col-sm-6">
                <q-input
                  outlined
                  dense
                  v-model="form.placa"
                  label="Placa *"
                  placeholder="TRD459"
                  maxlength="7"
                  :rules="[
                    val => !!val?.trim() || 'La placa es obligatoria',
                    val => !store.placaExiste(val) || 'La placa ya está registrada'
                  ]"
                />
              </div>

              <div class="col-12 col-sm-6">
                <q-input
                  outlined
                  dense
                  v-model="form.numeroSerie"
                  label="Número de serie *"
                  placeholder="SER-001"
                  :rules="[
                    val => !!val?.trim() || 'El número de serie es obligatorio',
                    val => !store.serieExiste(val) || 'El número de serie ya existe'
                  ]"
                />
              </div>

              <div class="col-12 col-sm-6">
                <q-input
                  outlined
                  dense
                  type="number"
                  v-model.number="form.capacidad"
                  label="Capacidad (puestos) *"
                  min="1"
                  max="100"
                  :rules="[val => (Number(val) > 0) || 'Debe ser mayor a 0']"
                />
              </div>

              <div class="col-12">
                <q-input
                  outlined
                  dense
                  v-model="form.conductor"
                  label="Nombre del conductor *"
                  placeholder="Nombre completo"
                  :rules="[val => !!val?.trim() || 'El conductor es obligatorio']"
                />
              </div>

              <div class="col-12 col-sm-6">
                <q-input
                  outlined
                  dense
                  v-model="form.serieChasis"
                  label="Serie del chasis *"
                  placeholder="CHS-12345"
                  :rules="[val => !!val?.trim() || 'La serie del chasis es obligatoria']"
                />
              </div>

              <div class="col-12 col-sm-6">
                <q-input
                  outlined
                  dense
                  v-model="form.serieMotor"
                  label="Serie del motor *"
                  placeholder="MOT-12345"
                  :rules="[val => !!val?.trim() || 'La serie del motor es obligatoria']"
                />
              </div>
            </div>

            <div class="row items-center q-gutter-md q-pt-md">
              <q-btn type="submit" color="primary" icon="save" label="Guardar Vehículo" no-caps unelevated />
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
import { useVehiculoStore } from '../stores/vehiculoStore'

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

const exito = ref(false)
const nuevoId = ref(null)

function guardar() {
  exito.value = false
  const nuevo = store.registrarVehiculo({
    tipo: form.tipo,
    placa: form.placa,
    numeroSerie: form.numeroSerie,
    capacidad: form.capacidad,
    conductor: form.conductor,
    serieChasis: form.serieChasis,
    serieMotor: form.serieMotor
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
}
</script>
