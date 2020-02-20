const express = require('express');
const cdController = require('../controllers/CDs');
const router = express.Router();

router.get('/', cdController.getCDs);
router.get('/:id', cdController.getCD);
router.post('/add', cdController.addCD);
router.put('/:id', cdController.updateCD);
router.delete('/:id', cdController.deleteCD);

module.exports = router;