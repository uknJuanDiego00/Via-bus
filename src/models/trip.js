const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  bus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus',
    required: [true, 'Debe asignar un bus al viaje']
  },
  origin: {
    type: String,
    required: [true, 'La ciudad de origen es obligatoria'],
    trim: true
  },
  destination: {
    type: String,
    required: [true, 'La ciudad de destino es obligatoria'],
    trim: true
  },
  departureDate: {
    type: String,
    required: [true, 'La fecha del viaje es obligatoria (YYYY-MM-DD)']
  },
  departureTime: {
    type: String,
    required: [true, 'La hora de salida es obligatoria (HH:MM)']
  },
  price: {
    type: Number,
    required: [true, 'El valor del tiquete es obligatorio']
  },
  imageUrl: {
    type: String,
    default: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80'
  },
  status: {
    type: String,
    enum: ['SCHEDULED', 'IN_TRANSIT', 'COMPLETED', 'CANCELLED'],
    default: 'SCHEDULED'
  }
}, { timestamps: true });

module.exports = mongoose.model('Trip', tripSchema);