const routes = [
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    children: [
      { path: '', redirect: '/dashboard' },
      { path: 'dashboard', name: 'dashboard', component: () => import('../pages/DashboardPage.vue') },
      { path: 'vehiculos', name: 'vehiculos', component: () => import('../pages/VehiculosPage.vue') },
      { path: 'vehiculos/registrar', name: 'registrar-vehiculo', component: () => import('../pages/RegistrarVehiculoPage.vue') },
      { path: 'vehiculos/:id/mapeo', name: 'mapeo-vehiculo', component: () => import('../pages/MapeoVehiculoPage.vue') },
      { path: 'clientes', name: 'clientes', component: () => import('../pages/ClientesPage.vue') },
      { path: 'clientes/registrar', name: 'registrar-cliente', component: () => import('../pages/RegistrarClientePage.vue') },
      { path: 'viajes', name: 'viajes', component: () => import('../pages/ViajesPage.vue') },
      { path: 'viajes/crear', name: 'crear-viaje', component: () => import('../pages/CrearViajePage.vue') },
      { path: 'ventas', name: 'ventas', component: () => import('../pages/VentasPage.vue') },
      { path: 'ventas/nueva', name: 'nueva-venta', component: () => import('../pages/NuevaVentaPage.vue') },
      { path: 'tickets/:id', name: 'ticket-detalle', component: () => import('../pages/TicketPage.vue') }
    ]
  },
  {
    path: '/:catchAll(.*)*',
    redirect: '/dashboard'
  }
]

export default routes
