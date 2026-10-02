const express = require('express');
const router = express.Router();
const { createBus, getBuses } = require('../controllers/busController');

router.post('/', createBus);
router.get('/', getBuses);

module.exports = router;