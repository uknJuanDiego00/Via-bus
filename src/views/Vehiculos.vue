<template>
  <div>
    <div class="action-bar">
      <div>
        <div class="page-title">Vehículos</div>
        <div class="page-subtitle">{{ vehiculos.length }} registrados</div>
      </div>
      <RouterLink to="/vehiculos/registrar" class="btn btn-primary">
        <Plus :size="16" /> Registrar vehículo
      </RouterLink>
    </div>

    <div v-if="vehiculos.length === 0" class="card">
      <div class="empty-state">
        <Bus class="empty-state-icon-svg" :size="40" />
        <div class="empty-state-text">Sin vehículos registrados</div>
      </div>
    </div>

    <div v-else class="card">
      <div class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Placa</th>
              <th>N° Serie</th>
              <th>Capacidad</th>
              <th>Conductor</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="v in vehiculos" :key="v.id">
              <td>
                <span class="badge badge-blue">{{ v.tipo }}</span>
              </td>
              <td><strong class="font-mono">{{ v.placa }}</strong></td>
              <td class="text-muted">{{ v.numeroSerie }}</td>
              <td>{{ v.capacidad }} puestos</td>
              <td>{{ v.conductor }}</td>
              <td>
                <RouterLink :to="`/vehiculos/${v.id}/mapeo`" class="btn btn-outline btn-sm">
                  <SlidersHorizontal :size="14" /> Configurar puestos
                </RouterLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Plus, Bus, SlidersHorizontal } from '@lucide/vue'
import { useVehiculoStore } from '../stores/vehiculoStore.js'

const store = useVehiculoStore()
const vehiculos = computed(() => store.vehiculos)
</script>
