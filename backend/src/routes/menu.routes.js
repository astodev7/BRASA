const { Router } = require('express');
const menuController = require('../controllers/menuController');
const categoryController = require('../controllers/categoryController');

const router = Router();

router.get('/menu', menuController.listMenu);
router.get('/menu/categories', categoryController.listPublic);
router.get('/menu/:slug', menuController.getItem);

module.exports = router;
