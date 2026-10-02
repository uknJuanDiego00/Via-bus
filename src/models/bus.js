const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  company: {
    type: String,
    default: 'Via Bus Express',
    required: true
  },
  plate: {
    type: String,
    required: [true, 'La placa del bus es obligatoria'],
    unique: true,
    uppercase: true,
    trim: true
  },
  driverName: {
    type: String,
    required: [true, 'El nombre del conductor es obligatorio']
  },
  capacity: {
    type: Number,
    required: [true, 'La capacidad de asientos es obligatoria'],
    min: [4, 'La capacidad mínima debe ser de 4 asientos']
  },
  chassisSeries: { type: String, default: 'N/A' },
  engineSeries: { type: String, default: 'N/A' }
}, { timestamps: true });

module.exports = mongoose.model('Bus', busSchema);