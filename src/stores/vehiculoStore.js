import { defineStore } from 'pinia'

function generarPuestos(capacidad) {
  const lista = []
  for (let i = 1; i <= capacidad; i++) {
    lista.push({ id: i, numero: i, esConductor: false, disponible: true })
  }
  return lista
}

export const useVehiculoStore = defineStore('vehiculo', {
  state: () => ({
    vehiculos: [
      {
        id: '1',
        tipo: 'Bus',
        placa: 'TRD459',
        numeroSerie: 'BUS-001',
        capacidad: 40,
        conductor: 'Carlos Mario López',
        serieChasis: 'CHS-987654',
        serieMotor: 'MOT-123456',
        puestos: generarPuestos(40)
      },
      {
        id: '2',
        tipo: 'Buseta',
        placa: 'MNL782',
        numeroSerie: 'BST-002',
        capacidad: 20,
        conductor: 'Andrés Felipe Gómez',
        serieChasis: 'CHS-654321',
        serieMotor: 'MOT-789012',
        puestos: generarPuestos(20)
      },
      {
        id: '3',
        tipo: 'Microbús',
        placa: 'QWE123',
        numeroSerie: 'MIC-003',
        capacidad: 12,
        conductor: 'Jorge Iván Martínez',
        serieChasis: 'CHS-112233',
        serieMotor: 'MOT-445566',
        puestos: generarPuestos(12)
      }
    ]
  }),
  actions: {
    registrarVehiculo(datos) {
      const nuevo = {
        id: String(Date.now()),
        tipo: datos.tipo,
        placa: datos.placa.trim().toUpperCase(),
        numeroSerie: datos.numeroSerie.trim(),
        capacidad: Number(datos.capacidad),
        conductor: datos.conductor.trim(),
        serieChasis: datos.serieChasis.trim(),
        serieMotor: datos.serieMotor.trim(),
        puestos: generarPuestos(Number(datos.capacidad))
      }
      this.vehiculos.push(nuevo)
      return nuevo
    },
    placaExiste(placa, excluirId = null) {
      return this.vehiculos.some(
        v => v.placa.toUpperCase() === placa.trim().toUpperCase() && v.id !== excluirId
      )
    },
    serieExiste(serie, excluirId = null) {
      return this.vehiculos.some(
        v => v.numeroSerie.toLowerCase() === serie.trim().toLowerCase() && v.id !== excluirId
      )
    },
    obtenerVehiculo(id) {
      return this.vehiculos.find(v => String(v.id) === String(id)) || null
    },
    actualizarPuestoConductor(vehiculoId, puestoId) {
      const v = this.obtenerVehiculo(vehiculoId)
      if (!v) return
      v.puestos.forEach(p => {
        p.esConductor = p.id === puestoId
      })
    }
  },
  persist: true
})
