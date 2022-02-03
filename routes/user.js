const express = require('express');
const router = express.Router();
const user_Controller = require('../controllers/userController')

router.post('/', user_Controller.userProfile);

module.exports = router;
