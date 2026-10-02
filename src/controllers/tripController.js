const Trip = require('../models/trip');
const Booking = require('../models/booking');

// @desc    Programar un nuevo viaje
// @route   POST /api/trips
exports.createTrip = async (req, res) => {
  try {
    const { bus, origin, destination, departureDate, departureTime, price, imageUrl } = req.body;

    if (origin.toLowerCase() === destination.toLowerCase()) {
      return res.status(400).json({ success: false, message: 'El origen y el destino no pueden ser la misma ciudad' });
    }

    const newTrip = await Trip.create({
      bus,
      origin,
      destination,
      departureDate,
      departureTime,
      price,
      imageUrl
    });

    res.status(201).json({ success: true, data: newTrip });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Listar viajes con filtros opcionales (origen, destino)
// @route   GET /api/trips
exports.getTrips = async (req, res) => {
  try {
    const { origin, destination } = req.query;
    let query = { status: 'SCHEDULED' };

    if (origin) query.origin = new RegExp(origin, 'i');
    if (destination) query.destination = new RegExp(destination, 'i');

    const trips = await Trip.find(query).populate('bus').sort({ departureDate: 1 });

    // Calcular cupos disponibles en tiempo real para cada viaje
    const tripsWithOccupancy = await Promise.all(
      trips.map(async (trip) => {
        const occupiedCount = await Booking.countDocuments({ trip: trip._id, status: 'CONFIRMED' });
        const freeSeats = trip.bus ? trip.bus.capacity - occupiedCount : 0;
        
        return {
          ...trip.toObject(),
          occupiedSeats: occupiedCount,
          freeSeats: Math.max(0, freeSeats)
        };
      })
    );

    res.status(200).json({ success: true, count: tripsWithOccupancy.length, data: tripsWithOccupancy });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Obtener detalle de un viaje con su mapa de asientos ocupados
// @route   GET /api/trips/:id
exports.getTripDetails = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id).populate('bus');
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Viaje no encontrado' });
    }

    // Obtener la lista de números de asientos reservados
    const bookings = await Booking.find({ trip: trip._id, status: 'CONFIRMED' }).select('seatNumber customerName');
    const occupiedSeatsList = bookings.map(b => b.seatNumber);

    res.status(200).json({
      success: true,
      data: {
        trip,
        occupiedSeats: occupiedSeatsList,
        freeSeatsCount: trip.bus.capacity - occupiedSeatsList.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};