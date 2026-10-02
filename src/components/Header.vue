<template>
  <header class="header">
    <span class="header-title">{{ titulo }}</span>
    <div class="header-right">
      <span class="header-badge">{{ fecha }}</span>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const titulos = {
  '/dashboard': 'Dashboard',
  '/vehiculos': 'Vehículos',
  '/vehiculos/registrar': 'Registrar Vehículo',
  '/clientes': 'Clientes',
  '/clientes/registrar': 'Registrar Cliente',
  '/viajes': 'Viajes',
  '/viajes/crear': 'Crear Viaje',
  '/ventas': 'Ventas',
  '/ventas/nueva': 'Nueva Venta',
}

const titulo = computed(() => {
  if (route.path.includes('/vehiculos/') && route.path.includes('/mapeo')) return 'Configuración de Puestos'
  if (route.path.includes('/tickets/')) return 'Tiquete'
  return titulos[route.path] || 'VIABUS'
})

const fecha = computed(() => {
  const d = new Date()
  return d.toLocaleDateString('es-CO', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })
})
</script>
