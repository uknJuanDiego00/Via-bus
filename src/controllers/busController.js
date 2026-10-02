const Bus = require('../models/bus');

// @desc    Registrar un nuevo bus
// @route   POST /api/buses
exports.createBus = async (req, res) => {
  try {
    const { company, plate, driverName, capacity, chassisSeries, engineSeries } = req.body;

    const existingBus = await Bus.findOne({ plate: plate.toUpperCase() });
    if (existingBus) {
      return res.status(400).json({ success: false, message: 'Ya existe un bus registrado con esa placa' });
    }

    const newBus = await Bus.create({
      company,
      plate: plate.toUpperCase(),
      driverName,
      capacity,
      chassisSeries,
      engineSeries
    });

    res.status(201).json({ success: true, data: newBus });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Obtener todos los buses
// @route   GET /api/buses
exports.getBuses = async (req, res) => {
  try {
    const buses = await Bus.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: buses.length, data: buses });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};