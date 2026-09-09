const { Router } = require('express');
const { requireAuth, requireRole } = require('../middlewares/auth.middleware');

const adminMenuController = require('../controllers/adminMenuController');
const adminCategoryController = require('../controllers/adminCategoryController');
const adminReservationController = require('../controllers/adminReservationController');
const adminMessageController = require('../controllers/adminMessageController');
const adminDashboardController = require('../controllers/adminDashboardController');

const router = Router();

// Todas as rotas administrativas exigem sessao valida
router.use(requireAuth);
router.use(requireRole('admin', 'manager'));

router.get('/dashboard', adminDashboardController.overview);

router.get('/menu', adminMenuController.list);
router.post('/menu', adminMenuController.create);
router.put('/menu/:id', adminMenuController.update);
router.delete('/menu/:id', adminMenuController.remove);

router.get('/categories', adminCategoryController.list);
router.post('/categories', adminCategoryController.create);
router.put('/categories/:id', adminCategoryController.update);
router.delete('/categories/:id', adminCategoryController.remove);

router.get('/reservations', adminReservationController.list);
router.patch('/reservations/:id/status', adminReservationController.updateStatus);

router.get('/messages', adminMessageController.list);
router.patch('/messages/:id/status', adminMessageController.updateStatus);

module.exports = router;
