const express = require('express');
const router = express.Router();
const { login, verify } = require('../controllers/adminController');
const adminAuth = require('../middleware/adminAuth');

router.post('/login', login);
router.get('/verify', adminAuth, verify);

module.exports = router;