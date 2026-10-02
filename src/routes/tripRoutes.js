const express = require('express');
const router = express.Router();
const { createTrip, getTrips, getTripDetails } = require('../controllers/tripController');

router.post('/', createTrip);
router.get('/', getTrips);
router.get('/:id', getTripDetails);

module.exports = router;