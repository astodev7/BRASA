const { Router } = require('express');
const authController = require('../controllers/authController');
const { requireAuth } = require('../middlewares/auth.middleware');
const { loginLimiter } = require('../middlewares/rateLimiter');

const router = Router();

router.post('/auth/login', loginLimiter, authController.login);
router.post('/auth/logout', authController.logout);
router.get('/auth/me', requireAuth, authController.me);

module.exports = router;
