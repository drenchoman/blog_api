const express = require('express');
const router = express.Router();
const auth_Controller = require('../controllers/authController')

router.post('/', auth_Controller.login);

router.post('/register', auth_Controller.register);

router.get('/', auth_Controller.allUsers);

module.exports = router;
