const express = require('express');
const customerController = require('../controllers/customers');
const router = express.Router();

router.get('/', customerController.getCustomers);
router.get('/:id', customerController.getCustomer);
router.post('/register', customerController.addCustomer);
router.post('/login', customerController.loginCustomer);
router.put('/:id/address', customerController.addAddress);
router.put('/:id', customerController.updateCustomer);
router.put('/:id/password', customerController.updatePassword);
router.delete('/:id', customerController.deleteCustomer);

module.exports = router;