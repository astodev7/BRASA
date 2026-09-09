const { Router } = require('express');
const reservationController = require('../controllers/reservationController');
const { publicFormLimiter } = require('../middlewares/rateLimiter');

const router = Router();

router.post('/reservations', publicFormLimiter, reservationController.createReservation);

module.exports = router;
