const router = require('express').Router();
const homeController = require('./controllers/homeController');
const userController = require('./controllers/userController');

router.use(homeController);
router.use(userController);

module.exports = router