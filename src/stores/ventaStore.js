import { defineStore } from 'pinia'

export const useVentaStore = defineStore('venta', {
  state: () => ({
    ventas: [
      {
        id: 'TKT-001',
        viajeId: '1',
        clienteId: '1',
        puestoId: 5,
        precio: 85000,
        fechaVenta: '2026-10-01 10:30',
        estado: 'Pagado'
      },
      {
        id: 'TKT-002',
        viajeId: '1',
        clienteId: '2',
        puestoId: 12,
        precio: 85000,
        fechaVenta: '2026-10-01 14:15',
        estado: 'Pagado'
      },
      {
        id: 'TKT-003',
        viajeId: '2',
        clienteId: '3',
        puestoId: 5,
        precio: 75000,
        fechaVenta: '2026-10-02 09:00',
        estado: 'Pagado'
      }
    ]
  }),
  getters: {
    totalIngresos: (state) =>
      state.ventas
        .filter(v => v.estado === 'Pagado')
        .reduce((sum, v) => sum + v.precio, 0),
    puestosOcupadosPorViaje: (state) => (viajeId) => {
      return state.ventas
        .filter(v => String(v.viajeId) === String(viajeId) && v.estado !== 'Cancelado')
        .map(v => v.puestoId)
    },
    puestoOcupado: (state) => (viajeId, puestoId) => {
      return state.ventas.some(
        v => String(v.viajeId) === String(viajeId) &&
             Number(v.puestoId) === Number(puestoId) &&
             v.estado !== 'Cancelado'
      )
    }
  },
  actions: {
    crearVenta(datos) {
      if (this.puestoOcupado(datos.viajeId, datos.puestoId)) {
        throw new Error(`El puesto ${datos.puestoId} ya se encuentra ocupado para este viaje.`)
      }

      const num = String(this.ventas.length + 1).padStart(3, '0')
      const now = new Date()
      const fechaStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

      const nueva = {
        id: `TKT-${num}`,
        viajeId: String(datos.viajeId),
        clienteId: String(datos.clienteId),
        puestoId: Number(datos.puestoId),
        precio: Number(datos.precio),
        descripcion: datos.descripcion || '',
        fechaVenta: fechaStr,
        estado: 'Pagado'
      }

      this.ventas.push(nueva)
      return nueva
    },
    obtenerVenta(id) {
      return this.ventas.find(v => v.id === id) || null
    }
  },
  persist: true
})
