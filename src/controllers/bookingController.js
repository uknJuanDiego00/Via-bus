const Booking = require('../models/booking');
const Trip = require('../models/trip');

// @desc    Comprar/Reservar un tiquete de bus
// @route   POST /api/bookings
exports.createBooking = async (req, res) => {
  try {
    const { tripId, seatNumber, customerName, customerDoc } = req.body;

    // 1. Validar que el viaje exista
    const trip = await Trip.findById(tripId).populate('bus');
    if (!trip) {
      return res.status(404).json({ success: false, message: 'El viaje seleccionado no existe' });
    }

    // 2. Validar que el asiento esté dentro del rango permitido del bus
    if (seatNumber < 1 || seatNumber > trip.bus.capacity) {
      return res.status(400).json({
        success: false,
        message: `El número de asiento ${seatNumber} no es válido. Capacidad máxima: ${trip.bus.capacity}`
      });
    }

    // 3. Generar código único de tiquete (ej: VBE-849201)
    const ticketCode = 'VBE-' + Math.floor(100000 + Math.random() * 900000);

    // 4. Intentar crear la reserva (Si el asiento ya fue tomado, MongoDB rebotará por el ÍNDICE ÚNICO)
    const booking = await Booking.create({
      ticketCode,
      trip: tripId,
      seatNumber,
      customerName,
      customerDoc,
      totalAmount: trip.price
    });

    // Poblar datos del viaje para responder el tiquete completo
    const populatedBooking = await Booking.findById(booking._id).populate({
      path: 'trip',
      populate: { path: 'bus' }
    });

    res.status(201).json({
      success: true,
      message: '¡Tiquete emitido con éxito!',
      data: populatedBooking
    });

  } catch (error) {
    // CAPTURA TRANSACCIONAL ANTI-DUPLICADOS (Error 11000 de MongoDB)
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: `EL ASIENTO #${req.body.seatNumber} YA FUE VENDIDO PARA ESTE VIAJE. Por favor seleccione otro puesto.`
      });
    }

    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Consultar historial de tiquetes o buscar por documento
// @route   GET /api/bookings
exports.getBookings = async (req, res) => {
  try {
    const { doc } = req.query;
    let query = {};

    if (doc) {
      query.customerDoc = doc;
    }

    const bookings = await Booking.find(query)
      .populate({
        path: 'trip',
        populate: { path: 'bus' }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Consultar tiquete por código de serie (Ej: VBE-123456)
// @route   GET /api/bookings/ticket/:code
exports.getTicketByCode = async (req, res) => {
  try {
    const booking = await Booking.findOne({ ticketCode: req.params.code }).populate({
      path: 'trip',
      populate: { path: 'bus' }
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Tiquete no encontrado' });
    }

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};