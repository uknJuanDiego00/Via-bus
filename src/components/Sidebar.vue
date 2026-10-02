<template>
  <aside class="sidebar">
    <div class="sidebar-brand">
      <div class="brand-logo">
        <Bus :size="22" color="#3B82F6" />
      </div>
      <div>
        <div class="brand-name">VIABUS</div>
        <div class="brand-sub">Sistema de Transporte</div>
      </div>
    </div>
    <nav class="sidebar-nav">
      <RouterLink to="/dashboard" class="nav-link">
        <LayoutDashboard class="nav-icon" :size="16" /> Dashboard
      </RouterLink>

      <div class="nav-section-title">Gestión</div>

      <RouterLink to="/vehiculos" class="nav-link">
        <Bus class="nav-icon" :size="16" /> Vehículos
      </RouterLink>
      <RouterLink to="/clientes" class="nav-link">
        <Users class="nav-icon" :size="16" /> Clientes
      </RouterLink>
      <RouterLink to="/viajes" class="nav-link">
        <Map class="nav-icon" :size="16" /> Viajes
      </RouterLink>

      <div class="nav-section-title">Operación</div>

      <RouterLink to="/ventas" class="nav-link">
        <Ticket class="nav-icon" :size="16" /> Ventas
      </RouterLink>
      <RouterLink to="/ventas/nueva" class="nav-link">
        <PlusCircle class="nav-icon" :size="16" /> Nueva Venta
      </RouterLink>
    </nav>
  </aside>
</template>

<script setup>
import { LayoutDashboard, Bus, Users, Map, Ticket, PlusCircle } from '@lucide/vue'
</script>
