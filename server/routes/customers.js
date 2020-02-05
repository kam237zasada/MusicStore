const express = require('express');
const customerController = require('../controllers/customers');
const router = express.Router();

router.post('/register', customerController.addCustomer);
router.put('/:id', customerController.addAddress);

module.exports = router;