const express = require('express');

const { getMe, login, register } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { loginSchema, registerSchema } = require('../validations/authSchemas');

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', protect, getMe);

module.exports = router;
