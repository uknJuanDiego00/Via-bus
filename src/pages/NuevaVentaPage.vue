<template>
  <q-page class="q-pa-lg">
    <div class="q-mx-auto" style="max-width: 1080px;">
      <div class="row items-center justify-between q-mb-lg">
        <div>
          <div class="text-h5 text-weight-bold text-grey-9">Nueva Venta de Tiquete</div>
          <div class="text-caption text-grey-6">Proceso guiado de reserva y facturación</div>
        </div>
        <q-btn flat color="grey-8" icon="arrow_back" label="Volver a Ventas" to="/ventas" no-caps />
      </div>

      <!-- Quasar Stepper Centrado -->
      <q-stepper
        :model-value="paso"
        @update:model-value="cambiarPaso"
        ref="stepper"
        color="primary"
        animated
        flat
        bordered
        header-nav
        class="bg-white shadow-1 rounded-borders"
      >
        <!-- PASO 1: Viaje -->
        <q-step
          :name="1"
          title="Viaje"
          icon="route"
          :done="paso > 1"
        >
          <div class="text-subtitle1 text-weight-bold text-grey-8 q-mb-md">
            Seleccione el itinerario disponible
          </div>

          <div v-if="viajesDisponibles.length === 0" class="text-center q-pa-xl">
            <q-icon name="route" size="48px" color="grey-5" />
            <div class="text-grey-6 q-mt-sm">No hay viajes programados disponibles</div>
          </div>

          <div class="row q-col-gutter-md">
            <div
              v-for="viaje in viajesDisponibles"
              :key="viaje.id"
              class="col-12 col-md-6 col-lg-4"
            >
              <q-card
                flat
                bordered
                class="cursor-pointer transition-card"
                :class="{ 'selected-card': viajeSeleccionado?.id === viaje.id }"
                @click="seleccionarViaje(viaje)"
              >
                <q-card-section>
                  <div class="row items-center justify-between q-mb-xs">
                    <q-badge color="blue-1" text-color="primary" class="text-weight-bold">
                      {{ viaje.codigo }}
                    </q-badge>
                    <span class="text-h6 text-weight-bolder text-primary">
                      ${{ viaje.precio.toLocaleString('es-CO') }}
                    </span>
                  </div>

                  <div class="text-subtitle1 text-weight-bold text-grey-9 q-my-xs">
                    {{ viaje.origen }}
                    <q-icon name="arrow_forward" size="14px" class="q-mx-xs text-grey-6" />
                    {{ viaje.destino }}
                  </div>

                  <div class="row q-gutter-x-md text-caption text-grey-7 q-my-xs">
                    <span class="row items-center"><q-icon name="event" size="14px" class="q-mr-xs" />{{ viaje.fecha }}</span>
                    <span class="row items-center"><q-icon name="schedule" size="14px" class="q-mr-xs" />{{ viaje.hora }}</span>
                    <span class="row items-center"><q-icon name="directions_bus" size="14px" class="q-mr-xs" />{{ getVehiculo(viaje.vehiculoId)?.placa }}</span>
                  </div>

                  <div class="row q-gutter-x-xs q-mt-sm">
                    <q-badge color="positive">{{ getDisponibles(viaje) }} disponibles</q-badge>
                    <q-badge color="negative">{{ getOcupados(viaje) }} ocupados</q-badge>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <q-stepper-navigation class="q-mt-lg">
            <q-btn
              color="primary"
              label="Continuar a Cliente"
              icon-right="arrow_forward"
              :disabled="!viajeSeleccionado"
              @click="paso = 2"
              no-caps
              unelevated
            />
          </q-stepper-navigation>
        </q-step>

        <!-- PASO 2: Cliente -->
        <q-step
          :name="2"
          title="Cliente"
          icon="person"
          :done="paso > 2"
          :disable="!viajeSeleccionado"
        >
          <div class="text-subtitle1 text-weight-bold text-grey-8 q-mb-md">
            Identificación del pasajero
          </div>

          <div style="max-width: 650px;" class="q-mx-auto">
            <!-- Búsqueda por documento -->
            <div class="row q-col-gutter-sm items-center q-mb-md">
              <div class="col-8">
                <q-input
                  outlined
                  dense
                  v-model="docBusqueda"
                  placeholder="Número de documento"
                  label="Buscar por documento"
                  @keyup.enter="buscarCliente"
                />
              </div>
              <div class="col-4">
                <q-btn
                  outline
                  color="primary"
                  icon="search"
                  label="Buscar"
                  class="full-width"
                  @click="buscarCliente"
                  no-caps
                />
              </div>
            </div>

            <!-- Resultado de búsqueda -->
            <div v-if="clienteBuscado !== undefined" class="q-mb-md">
              <q-banner v-if="clienteBuscado === null" class="bg-red-1 text-negative rounded-borders" rounded>
                <template v-slot:avatar>
                  <q-icon name="error_outline" color="negative" />
                </template>
                Cliente no encontrado en el sistema.
                <q-btn flat dense color="primary" label="Registrar nuevo cliente" to="/clientes/registrar" no-caps class="q-ml-sm text-weight-bold" />
              </q-banner>

              <q-card v-else flat bordered class="bg-blue-1">
                <q-card-section class="row items-center justify-between">
                  <div>
                    <div class="text-subtitle2 text-weight-bold text-grey-9">{{ clienteBuscado.nombre }}</div>
                    <div class="text-caption text-grey-7">
                      {{ clienteBuscado.tipoDoc }}: {{ clienteBuscado.documento }} · Tel: {{ clienteBuscado.telefono }}
                    </div>
                    <div class="text-caption text-grey-7">{{ clienteBuscado.correo }}</div>
                  </div>
                  <q-btn color="positive" icon="check" label="Seleccionar" @click="seleccionarCliente(clienteBuscado)" size="sm" no-caps unelevated />
                </q-card-section>
              </q-card>
            </div>

            <div class="text-caption text-grey-6 q-my-sm text-center">— o seleccione directamente del listado —</div>

            <q-select
              outlined
              dense
              v-model="clienteIdSeleccionado"
              :options="opcionesClientes"
              emit-value
              map-options
              label="Seleccionar de la lista de clientes registrados"
              @update:model-value="onClienteSelectChange"
            />

            <!-- Confirmación visual de cliente seleccionado -->
            <div v-if="clienteSeleccionado" class="q-mt-md">
              <q-banner class="bg-green-1 text-positive rounded-borders" rounded>
                <template v-slot:avatar>
                  <q-icon name="check_circle" color="positive" />
                </template>
                Cliente seleccionado: <strong>{{ clienteSeleccionado.nombre }}</strong> ({{ clienteSeleccionado.tipoDoc }}: {{ clienteSeleccionado.documento }})
              </q-banner>
            </div>
          </div>

          <q-stepper-navigation class="q-mt-lg row q-gutter-sm justify-between">
            <q-btn flat color="grey-8" label="Atrás" @click="paso = 1" no-caps />
            <q-btn
              color="primary"
              label="Continuar a Puesto"
              icon-right="arrow_forward"
              :disabled="!clienteSeleccionado"
              @click="paso = 3"
              no-caps
              unelevated
            />
          </q-stepper-navigation>
        </q-step>

        <!-- PASO 3: Puesto -->
        <q-step
          :name="3"
          title="Puesto"
          icon="event_seat"
          :done="paso > 3"
          :disable="!viajeSeleccionado || !clienteSeleccionado"
        >
          <div class="text-subtitle1 text-weight-bold text-grey-8 q-mb-md">
            Selección de puesto en el vehículo
          </div>

          <div class="row q-col-gutter-lg items-start justify-center">
            <!-- Mapa interactivo -->
            <div class="col-12 col-md-6 text-center">
              <SeatMap
                :puestos="vehiculoDelViaje?.puestos || []"
                :puestosOcupados="puestosOcupados"
                :puestoSeleccionado="puestoSeleccionado"
                :selectable="true"
                :conductor="vehiculoDelViaje?.conductor"
                @seleccionar="onSeleccionarPuesto"
              />
            </div>

            <!-- Resumen y control de puesto -->
            <div class="col-12 col-md-6">
              <q-card flat bordered class="q-pa-sm shadow-1">
                <q-card-section>
                  <div class="text-subtitle2 text-weight-bold text-grey-8 q-mb-xs">Resumen del Viaje</div>
                  <q-separator class="q-my-sm" />
                  <div class="q-gutter-y-xs text-body2">
                    <div class="row justify-between"><span class="text-grey-6">Ruta:</span> <strong>{{ viajeSeleccionado?.origen }} → {{ viajeSeleccionado?.destino }}</strong></div>
                    <div class="row justify-between"><span class="text-grey-6">Fecha:</span> <strong>{{ viajeSeleccionado?.fecha }} ({{ viajeSeleccionado?.hora }})</strong></div>
                    <div class="row justify-between"><span class="text-grey-6">Vehículo:</span> <strong>{{ vehiculoDelViaje?.placa }} ({{ vehiculoDelViaje?.tipo }})</strong></div>
                    <div class="row justify-between"><span class="text-grey-6">Pasajero:</span> <strong>{{ clienteSeleccionado?.nombre }}</strong></div>
                    <div class="row justify-between"><span class="text-grey-6">Tarifa:</span> <strong class="text-primary">${{ viajeSeleccionado?.precio?.toLocaleString('es-CO') }}</strong></div>
                  </div>

                  <div v-if="puestoSeleccionado" class="q-mt-md">
                    <q-banner class="bg-amber-1 text-black rounded-borders" rounded>
                      <template v-slot:avatar>
                        <q-icon name="airline_seat_recline_normal" color="warning" />
                      </template>
                      <div class="row items-center justify-between">
                        <div>Puesto asignado: <strong>#{{ puestoSeleccionado.numero }}</strong></div>
                        <q-btn
                          flat
                          dense
                          size="sm"
                          color="negative"
                          icon="close"
                          label="Deseleccionar"
                          @click="puestoSeleccionado = null"
                          no-caps
                        />
                      </div>
                    </q-banner>

                    <div class="q-mt-md">
                      <q-input
                        v-model="descripcionOpcional"
                        outlined
                        dense
                        type="textarea"
                        rows="2"
                        label="Descripción o nota del puesto (opcional)"
                        placeholder="Observación o nota opcional para este puesto..."
                      />
                    </div>
                  </div>
                  <div v-else class="text-caption text-grey-6 text-center q-mt-md q-pa-sm bg-grey-2 rounded-borders">
                    Haga clic en un asiento disponible (verde) del mapa para seleccionarlo.
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <q-stepper-navigation class="q-mt-lg row q-gutter-sm justify-between">
            <q-btn flat color="grey-8" label="Atrás" @click="paso = 2" no-caps />
            <q-btn
              color="primary"
              label="Continuar a Confirmación"
              icon-right="arrow_forward"
              :disabled="!puestoSeleccionado"
              @click="paso = 4"
              no-caps
              unelevated
            />
          </q-stepper-navigation>
        </q-step>

        <!-- PASO 4: Confirmar -->
        <q-step
          :name="4"
          title="Confirmar"
          icon="check_circle"
          :done="paso > 4"
          :disable="!viajeSeleccionado || !clienteSeleccionado || !puestoSeleccionado"
        >
          <div class="text-subtitle1 text-weight-bold text-grey-8 q-mb-md text-center">
            Revisión final de la transacción
          </div>

          <div class="row justify-center">
            <q-card flat bordered style="max-width: 580px; width: 100%;" class="q-pa-md shadow-1">
              <q-card-section>
                <div class="row items-center justify-between q-mb-md">
                  <span class="text-subtitle1 text-weight-bold text-primary">Liquidación de Tiquete</span>
                  <q-badge color="positive">Listo para emitir</q-badge>
                </div>

                <q-separator class="q-mb-md" />

                <div class="q-gutter-y-sm text-body2">
                  <div class="row justify-between">
                    <span class="text-grey-6">Itinerario:</span>
                    <span class="text-weight-bold">{{ viajeSeleccionado?.origen }} → {{ viajeSeleccionado?.destino }}</span>
                  </div>
                  <div class="row justify-between">
                    <span class="text-grey-6">Fecha y hora:</span>
                    <span>{{ viajeSeleccionado?.fecha }} a las {{ viajeSeleccionado?.hora }}</span>
                  </div>
                  <div class="row justify-between">
                    <span class="text-grey-6">Pasajero:</span>
                    <span class="text-weight-bold">{{ clienteSeleccionado?.nombre }}</span>
                  </div>
                  <div class="row justify-between">
                    <span class="text-grey-6">Documento:</span>
                    <span>{{ clienteSeleccionado?.tipoDoc }}: {{ clienteSeleccionado?.documento }}</span>
                  </div>
                  <div class="row justify-between">
                    <span class="text-grey-6">Vehículo:</span>
                    <span>{{ vehiculoDelViaje?.tipo }} placa {{ vehiculoDelViaje?.placa }}</span>
                  </div>
                  <div class="row justify-between items-center">
                    <span class="text-grey-6">Puesto asignado:</span>
                    <div class="row items-center q-gutter-xs">
                      <q-badge color="amber-3" text-color="black" class="text-weight-bold">
                        Puesto #{{ puestoSeleccionado?.numero }}
                      </q-badge>
                      <q-btn flat dense size="xs" color="grey-7" label="(cambiar)" @click="paso = 3" no-caps />
                    </div>
                  </div>

                  <q-separator class="q-my-md" />

                  <div class="row justify-between items-center">
                    <span class="text-h6 text-grey-8">Total a Pagar:</span>
                    <span class="text-h5 text-weight-bolder text-primary">
                      ${{ viajeSeleccionado?.precio?.toLocaleString('es-CO') }}
                    </span>
                  </div>
                </div>

                <q-separator class="q-my-md" />
                <div class="q-mb-md">
                  <q-input
                    v-model="descripcionOpcional"
                    outlined
                    dense
                    type="textarea"
                    rows="2"
                    label="Descripción o nota (opcional)"
                  />
                </div>

                <div v-if="errorVenta" class="q-mt-md">
                  <q-banner class="bg-red-1 text-negative rounded-borders" rounded>
                    {{ errorVenta }}
                  </q-banner>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <q-stepper-navigation class="q-mt-lg row q-gutter-sm justify-between">
            <q-btn flat color="grey-8" label="Atrás" @click="paso = 3" no-caps />
            <q-btn
              color="positive"
              icon="payments"
              label="Confirmar y Emitir Tiquete"
              @click="confirmarVenta"
              no-caps
              unelevated
            />
          </q-stepper-navigation>
        </q-step>

        <!-- PASO 5: Tiquete Emitido -->
        <q-step
          :name="5"
          title="Tiquete"
          icon="receipt"
          :disable="!ventaCreada"
        >
          <div class="text-center q-pa-xl" style="max-width: 600px; margin: 0 auto;">
            <q-avatar color="green-1" text-color="positive" icon="verified" size="72px" />
            <div class="text-h5 text-weight-bold text-grey-9 q-mt-md">Venta Exitosa</div>
            <div class="text-caption text-grey-6 q-mb-lg">
              El tiquete ha sido emitido y registrado en el sistema con el código:
              <strong class="text-primary">{{ ventaCreada?.id }}</strong>
            </div>

            <div class="row q-gutter-md justify-center">
              <q-btn
                color="primary"
                icon="description"
                label="Ver e Imprimir Tiquete"
                :to="`/tickets/${ventaCreada?.id}`"
                no-caps
                unelevated
              />
              <q-btn
                outline
                color="primary"
                icon="add_shopping_cart"
                label="Realizar Otra Venta"
                @click="reiniciar"
                no-caps
              />
              <q-btn
                flat
                color="grey-8"
                label="Ir a Lista de Ventas"
                to="/ventas"
                no-caps
              />
            </div>
          </div>
        </q-step>
      </q-stepper>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useViajeStore } from '../stores/viajeStore'
import { useVehiculoStore } from '../stores/vehiculoStore'
import { useClienteStore } from '../stores/clienteStore'
import { useVentaStore } from '../stores/ventaStore'
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
const clienteIdSeleccionado = ref(null)
const descripcionOpcional = ref('')
const errorVenta = ref('')

function cambiarPaso(nuevoPaso) {
  if (nuevoPaso === 2 && !viajeSeleccionado.value) return
  if (nuevoPaso === 3 && (!viajeSeleccionado.value || !clienteSeleccionado.value)) return
  if (nuevoPaso === 4 && (!viajeSeleccionado.value || !clienteSeleccionado.value || !puestoSeleccionado.value)) return
  if (nuevoPaso === 5 && !ventaCreada.value) return
  paso.value = nuevoPaso
}

const clientes = computed(() => clienteStore.clientes)
const opcionesClientes = computed(() =>
  clientes.value.map(c => ({
    label: `${c.nombre} – ${c.tipoDoc}: ${c.documento}`,
    value: c.id
  }))
)

const viajesDisponibles = computed(() =>
  viajeStore.viajes.filter(v => v.estado !== 'Cancelado' && v.estado !== 'Finalizado' && v.estado !== 'Completo')
)

const vehiculoDelViaje = computed(() =>
  viajeSeleccionado.value ? vehiculoStore.obtenerVehiculo(viajeSeleccionado.value.vehiculoId) : null
)

const puestosOcupados = computed(() =>
  viajeSeleccionado.value ? ventaStore.puestosOcupadosPorViaje(viajeSeleccionado.value.id) : []
)

function getVehiculo(id) {
  return vehiculoStore.obtenerVehiculo(id)
}

function getOcupados(viaje) {
  return ventaStore.puestosOcupadosPorViaje(viaje.id).length
}

function getDisponibles(viaje) {
  const v = getVehiculo(viaje.vehiculoId)
  return v ? v.capacidad - getOcupados(viaje) : 0
}

function seleccionarViaje(viaje) {
  viajeSeleccionado.value = viaje
  puestoSeleccionado.value = null
}

function buscarCliente() {
  const doc = docBusqueda.value?.trim()
  if (!doc) {
    clienteBuscado.value = undefined
    return
  }
  clienteBuscado.value = clienteStore.buscarClientePorDocumento(doc) || null
}

function seleccionarCliente(c) {
  clienteSeleccionado.value = c
  clienteIdSeleccionado.value = c.id
  clienteBuscado.value = undefined
  docBusqueda.value = ''
}

function onClienteSelectChange(id) {
  if (!id) return
  clienteSeleccionado.value = clienteStore.obtenerCliente(id)
}

function onSeleccionarPuesto(puesto) {
  puestoSeleccionado.value = puesto
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
  clienteIdSeleccionado.value = null
  descripcionOpcional.value = ''
  errorVenta.value = ''
}
</script>

<style scoped>
.transition-card {
  transition: all 0.2s ease;
}
.selected-card {
  border: 2px solid #1976D2 !important;
  background-color: #E3F2FD !important;
}
</style>
