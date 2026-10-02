<template>
  <div>
    <!-- Leyenda -->
    <div class="seat-legend" style="margin-bottom: 16px;">
      <div class="legend-item"><div class="legend-dot available"></div> Disponible</div>
      <div class="legend-item"><div class="legend-dot occupied"></div> Ocupado</div>
      <div class="legend-item"><div class="legend-dot driver"></div> Conductor</div>
      <div class="legend-item" v-if="selectable"><div class="legend-dot selected"></div> Seleccionado</div>
      <div class="legend-item"><div class="legend-dot unavailable"></div> No disponible</div>
    </div>

    <!-- Cuerpo del bus -->
    <div class="seat-map-container">
      <div class="bus-body">
        <div class="bus-front">FRENTE DEL VEHÍCULO</div>

        <!-- Área del conductor -->
        <div class="driver-area">
          <div class="driver-seat">
            <User :size="18" />
            <span style="font-size: 9px; font-weight: 700; margin-top: 2px;">COND</span>
          </div>
          <div class="driver-info">
            <strong>{{ conductor || 'Conductor' }}</strong>
            Puesto del conductor
          </div>
        </div>

        <!-- Filas de asientos -->
        <div class="bus-aisle">
          <div
            v-for="fila in filas"
            :key="fila.index"
            class="seat-row"
          >
            <template v-for="lado in ['izq1', 'izq2', 'pasillo', 'der1', 'der2']" :key="lado">
              <div v-if="lado === 'pasillo'" class="aisle"></div>
              <div
                v-else-if="getSeat(fila, lado)"
                class="seat"
                :class="getSeatClass(getSeat(fila, lado))"
                :title="`Puesto ${getSeat(fila, lado).numero}`"
                @click="selectable ? seleccionarPuesto(getSeat(fila, lado)) : null"
              >
                {{ getSeat(fila, lado).numero }}
              </div>
              <div v-else class="seat unavailable" style="visibility:hidden;"></div>
            </template>
          </div>
        </div>

        <div class="bus-rear">PARTE POSTERIOR</div>
      </div>
    </div>

    <!-- Info del puesto seleccionado -->
    <div v-if="selectable && puestoSeleccionado" class="selected-info" style="margin-top: 14px; display: flex; align-items: center; gap: 8px;">
      <CheckCircle2 :size="16" color="#3B82F6" />
      <span>Puesto seleccionado: <strong>{{ puestoSeleccionado.numero }}</strong></span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { User, CheckCircle2 } from '@lucide/vue'

const props = defineProps({
  puestos: { type: Array, default: () => [] },
  puestosOcupados: { type: Array, default: () => [] },
  puestoSeleccionado: { type: Object, default: null },
  selectable: { type: Boolean, default: false },
  conductor: { type: String, default: '' }
})

const emit = defineEmits(['seleccionar'])

// Calcular filas (4 asientos por fila: 2 izq + 2 der)
const filas = computed(() => {
  const result = []
  const asientos = props.puestos.filter(p => !p.esConductor)
  const porFila = 4
  const numFilas = Math.ceil(asientos.length / porFila)

  for (let i = 0; i < numFilas; i++) {
    result.push({
      index: i,
      asientos: asientos.slice(i * porFila, i * porFila + porFila)
    })
  }
  return result
})

function getSeat(fila, lado) {
  const a = fila.asientos
  if (lado === 'izq1') return a[0] || null
  if (lado === 'izq2') return a[1] || null
  if (lado === 'der1') return a[2] || null
  if (lado === 'der2') return a[3] || null
  return null
}

function isOcupado(puesto) {
  return props.puestosOcupados.includes(puesto.numero) || props.puestosOcupados.includes(puesto.id)
}

function getSeatClass(puesto) {
  if (!puesto) return 'unavailable'
  if (puesto.esConductor) return 'driver'
  if (props.puestoSeleccionado && props.puestoSeleccionado.id === puesto.id) return 'selected'
  if (isOcupado(puesto)) return 'occupied'
  return 'available'
}

function seleccionarPuesto(puesto) {
  if (!props.selectable) return
  if (puesto.esConductor) return
  if (isOcupado(puesto)) return
  emit('seleccionar', puesto)
}
</script>
