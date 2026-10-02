const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  ticketCode: {
    type: String,
    required: true,
    unique: true
  },
  trip: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: [true, 'El viaje es obligatorio']
  },
  seatNumber: {
    type: Number,
    required: [true, 'El número de asiento es obligatorio']
  },
  customerName: {
    type: String,
    required: [true, 'El nombre del cliente es obligatorio'],
    trim: true
  },
  customerDoc: {
    type: String,
    required: [true, 'El documento del cliente es obligatorio'],
    trim: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['CONFIRMED', 'CANCELLED'],
    default: 'CONFIRMED'
  }
}, { timestamps: true });

// CLAVE DE ORO: ÍNDICE COMPUESTO ÚNICO EN MONGODB
// Esto evita a nivel de Base de Datos que un mismo asiento se venda dos veces para el mismo viaje.
bookingSchema.index({ trip: 1, seatNumber: 1 }, { unique: true });

module.exports = mongoose.model('Booking', bookingSchema);