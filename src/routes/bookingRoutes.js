const express = require('express');
const router = express.Router();
const { createBooking, getBookings, getTicketByCode } = require('../controllers/bookingController');

router.post('/', createBooking);
router.get('/', getBookings);
router.get('/ticket/:code', getTicketByCode);

module.exports = router;