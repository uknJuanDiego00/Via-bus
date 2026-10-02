<template>
  <div>
    <div class="action-bar">
      <div>
        <div class="page-title">Clientes</div>
        <div class="page-subtitle">{{ clientes.length }} registrados</div>
      </div>
      <RouterLink to="/clientes/registrar" class="btn btn-primary">
        <Plus :size="16" /> Registrar cliente
      </RouterLink>
    </div>

    <!-- Búsqueda -->
    <div class="card mb-20">
      <div class="flex gap-12">
        <input
          v-model="busqueda"
          class="form-input"
          placeholder="Buscar por documento o nombre..."
          style="max-width: 360px;"
          @input="buscar"
        />
        <button class="btn btn-outline" @click="limpiarBusqueda" v-if="busqueda">
          <X :size="14" /> Limpiar
        </button>
      </div>
    </div>

    <div v-if="clientesFiltrados.length === 0" class="card">
      <div class="empty-state">
        <Users class="empty-state-icon-svg" :size="40" />
        <div class="empty-state-text">Sin clientes registrados</div>
      </div>
    </div>

    <div v-else class="card">
      <div class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th>Tipo Doc.</th>
              <th>Documento</th>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>Correo</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in clientesFiltrados" :key="c.id">
              <td><span class="badge badge-gray">{{ c.tipoDoc }}</span></td>
              <td class="font-mono">{{ c.documento }}</td>
              <td><strong>{{ c.nombre }}</strong></td>
              <td class="text-muted">{{ c.telefono }}</td>
              <td class="text-muted">{{ c.correo }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Plus, Users, X } from '@lucide/vue'
import { useClienteStore } from '../stores/clienteStore.js'

const store = useClienteStore()
const busqueda = ref('')
const clientes = computed(() => store.clientes)

const clientesFiltrados = computed(() => {
  const q = busqueda.value.trim().toLowerCase()
  if (!q) return clientes.value
  return clientes.value.filter(c =>
    c.documento.toLowerCase().includes(q) ||
    c.nombre.toLowerCase().includes(q)
  )
})

function buscar() {}
function limpiarBusqueda() { busqueda.value = '' }
</script>
