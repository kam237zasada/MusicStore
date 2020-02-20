const express = require('express');
const adminController = require('../controllers/admins');
const router = express.Router();

router.get('/', adminController.getAdmins);
router.get('/:id', adminController.getAdmin);
router.post('/register', adminController.addAdmin);
router.post('/login', adminController.loginAdmin);
router.put('/:id', adminController.updateAdmin);
router.put('/:id/password', adminController.updatePassword);
router.delete('/:id', adminController.deleteAdmin);

module.exports = router;