const express = require('express');
const vinylController = require('../controllers/vinyls');
const router = express.Router();

router.get('/', vinylController.getVinyls);
router.get('/:id', vinylController.getVinyl);
router.post('/add', vinylController.addVinyl);
router.put('/:id', vinylController.updateVinyl);
router.delete('/:id', vinylController.deleteVinyl);

module.exports = router;