const express = require('express');
const router = express.Router();
const { register, login, updateStatus} = require('../controllers/authController');
const auth = require('../middleware/authMiddleware')

// @route   POST api/auth/register
// @desc    Register user
router.post('/register', register);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
router.post('/login', login);

router.post('/status', auth, updateStatus);

module.exports = router;
