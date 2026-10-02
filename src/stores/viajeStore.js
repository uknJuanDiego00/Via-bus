import { defineStore } from 'pinia'

export const useViajeStore = defineStore('viaje', {
  state: () => ({
    viajes: [
      {
        id: '1',
        codigo: 'VIA-001',
        origen: 'Bogotá',
        destino: 'Medellín',
        fecha: '2026-10-15',
        hora: '06:00',
        vehiculoId: '1',
        precio: 85000,
        estado: 'Disponible'
      },
      {
        id: '2',
        codigo: 'VIA-002',
        origen: 'Bogotá',
        destino: 'Cali',
        fecha: '2026-10-16',
        hora: '08:30',
        vehiculoId: '2',
        precio: 75000,
        estado: 'Disponible'
      },
      {
        id: '3',
        codigo: 'VIA-003',
        origen: 'Medellín',
        destino: 'Cartagena',
        fecha: '2026-10-18',
        hora: '14:00',
        vehiculoId: '3',
        precio: 120000,
        estado: 'Programado'
      }
    ]
  }),
  actions: {
    crearViaje(datos) {
      const contador = this.viajes.length + 1
      const nuevo = {
        id: String(Date.now()),
        codigo: `VIA-${String(contador).padStart(3, '0')}`,
        origen: datos.origen.trim(),
        destino: datos.destino.trim(),
        fecha: datos.fecha,
        hora: datos.hora,
        vehiculoId: String(datos.vehiculoId),
        precio: Number(datos.precio),
        estado: datos.estado || 'Programado'
      }
      this.viajes.push(nuevo)
      return nuevo
    },
    obtenerViaje(id) {
      return this.viajes.find(v => String(v.id) === String(id)) || null
    },
    actualizarEstado(id, estado) {
      const v = this.obtenerViaje(id)
      if (v) v.estado = estado
    }
  },
  persist: true
})
