import { defineStore } from 'pinia'

export const useClienteStore = defineStore('cliente', {
  state: () => ({
    clientes: [
      {
        id: '1',
        tipoDoc: 'CC',
        documento: '1020304050',
        nombre: 'María Camila Restrepo',
        telefono: '3104567890',
        correo: 'camila.restrepo@email.com',
        direccion: 'Calle 45 # 12-34, Bogotá'
      },
      {
        id: '2',
        tipoDoc: 'CC',
        documento: '1030405060',
        nombre: 'Juan Pablo Salazar',
        telefono: '3157891234',
        correo: 'juan.salazar@email.com',
        direccion: 'Carrera 7 # 85-20, Bogotá'
      },
      {
        id: '3',
        tipoDoc: 'TI',
        documento: '1098765432',
        nombre: 'Valentina Morales',
        telefono: '3201234567',
        correo: 'valen.morales@email.com',
        direccion: 'Calle 100 # 15-40, Medellín'
      },
      {
        id: '4',
        tipoDoc: 'CE',
        documento: '45678912',
        nombre: 'David Robert Smith',
        telefono: '3009876543',
        correo: 'david.smith@email.com',
        direccion: 'Avenida El Dorado # 68-50, Bogotá'
      },
      {
        id: '5',
        tipoDoc: 'CC',
        documento: '79845612',
        nombre: 'Sandra Milena Castro',
        telefono: '3123456789',
        correo: 'sandra.castro@email.com',
        direccion: 'Carrera 15 # 45-67, Cali'
      }
    ]
  }),
  actions: {
    registrarCliente(datos) {
      const nuevo = {
        id: String(Date.now()),
        tipoDoc: datos.tipoDoc,
        documento: datos.documento.trim(),
        nombre: datos.nombre.trim(),
        telefono: datos.telefono.trim(),
        correo: datos.correo.trim(),
        direccion: datos.direccion.trim()
      }
      this.clientes.push(nuevo)
      return nuevo
    },
    documentoExiste(doc, excluirId = null) {
      return this.clientes.some(
        c => c.documento.toLowerCase() === doc.trim().toLowerCase() && c.id !== excluirId
      )
    },
    buscarClientePorDocumento(doc) {
      return this.clientes.find(
        c => c.documento.toLowerCase() === doc.trim().toLowerCase()
      ) || null
    },
    obtenerCliente(id) {
      return this.clientes.find(c => String(c.id) === String(id)) || null
    }
  },
  persist: true
})
