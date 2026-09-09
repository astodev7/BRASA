const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/ApiResponse');
const menuItemModel = require('../models/menuItemModel');
const reservationService = require('../services/reservationService');
const contactService = require('../services/contactService');

const overview = asyncHandler(async (req, res) => {
  const [reservationCounts, newMessages, availableDishes, featuredDishes] = await Promise.all([
    reservationService.dashboardCounts(),
    contactService.countNew(),
    menuItemModel.countAvailable(),
    menuItemModel.countFeatured(),
  ]);

  return success(res, {
    reservations: reservationCounts,
    messages: { new: newMessages },
    menu: { available: availableDishes, featured: featuredDishes },
  });
});

module.exports = { overview };
