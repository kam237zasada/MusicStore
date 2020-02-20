const express = require('express');
const conditionController = require('../controllers/conditions');
const router = express.Router();

router.get('/', conditionController.getConditions);
router.get('/:id', conditionController.getCondition);
router.post('/add', conditionController.addCondition);
router.put('/:id', conditionController.updateCondition);
router.delete('/:id', conditionController.deleteCondition);

module.exports = router;