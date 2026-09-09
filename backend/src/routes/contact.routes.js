const { Router } = require('express');
const contactController = require('../controllers/contactController');
const { publicFormLimiter } = require('../middlewares/rateLimiter');

const router = Router();

router.post('/contact', publicFormLimiter, contactController.sendMessage);

module.exports = router;
