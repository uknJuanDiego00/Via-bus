<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-1">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar class="q-px-lg">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title class="row items-center q-gutter-sm">
          <q-icon name="directions_bus" size="28px" />
          <span class="text-weight-bold">VIABUS</span>
          <span class="text-caption text-blue-2 q-ml-sm gt-xs">Sistema de Gestión de Transporte</span>
        </q-toolbar-title>

        <div class="row items-center q-gutter-sm">
          <q-badge color="blue-9" text-color="white" class="q-py-xs q-px-sm">
            <q-icon name="today" size="14px" class="q-mr-xs" />
            {{ fechaActual }}
          </q-badge>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-white"
      :width="260"
    >
      <div class="q-pa-md bg-grey-2 border-bottom">
        <div class="row items-center q-gutter-sm">
          <q-avatar color="primary" text-color="white" icon="directions_bus" size="38px" />
          <div>
            <div class="text-weight-bold text-subtitle1">VIABUS</div>
            <div class="text-caption text-grey-7">Panel de Control</div>
          </div>
        </div>
      </div>

      <q-list padding class="text-grey-8">
        <q-item-label header class="text-uppercase text-caption text-weight-bold text-grey-7">
          Principal
        </q-item-label>

        <q-item clickable v-ripple to="/dashboard" active-class="text-primary bg-blue-1 text-weight-bold" class="rounded-borders q-mx-xs">
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section>Dashboard</q-item-section>
        </q-item>

        <q-separator class="q-my-sm" />
        <q-item-label header class="text-uppercase text-caption text-weight-bold text-grey-7">
          Gestión
        </q-item-label>

        <q-item clickable v-ripple to="/vehiculos" active-class="text-primary bg-blue-1 text-weight-bold" class="rounded-borders q-mx-xs">
          <q-item-section avatar>
            <q-icon name="directions_bus" />
          </q-item-section>
          <q-item-section>Vehículos</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/clientes" active-class="text-primary bg-blue-1 text-weight-bold" class="rounded-borders q-mx-xs">
          <q-item-section avatar>
            <q-icon name="people" />
          </q-item-section>
          <q-item-section>Clientes</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/viajes" active-class="text-primary bg-blue-1 text-weight-bold" class="rounded-borders q-mx-xs">
          <q-item-section avatar>
            <q-icon name="route" />
          </q-item-section>
          <q-item-section>Viajes</q-item-section>
        </q-item>

        <q-separator class="q-my-sm" />
        <q-item-label header class="text-uppercase text-caption text-weight-bold text-grey-7">
          Operación
        </q-item-label>

        <q-item clickable v-ripple to="/ventas" active-class="text-primary bg-blue-1 text-weight-bold" class="rounded-borders q-mx-xs">
          <q-item-section avatar>
            <q-icon name="receipt_long" />
          </q-item-section>
          <q-item-section>Ventas</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/ventas/nueva" active-class="text-primary bg-blue-1 text-weight-bold" class="rounded-borders q-mx-xs">
          <q-item-section avatar>
            <q-icon name="add_shopping_cart" />
          </q-item-section>
          <q-item-section>Nueva Venta</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container class="bg-grey-1">
      <div class="main-content-wrapper">
        <router-view />
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue'

const leftDrawerOpen = ref(false)

const fechaActual = computed(() => {
  const d = new Date()
  return d.toLocaleDateString('es-CO', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
})
</script>

<style scoped>
.border-bottom {
  border-bottom: 1px solid #e0e0e0;
}
.main-content-wrapper {
  max-width: 1240px;
  margin: 0 auto;
  width: 100%;
}
</style>
