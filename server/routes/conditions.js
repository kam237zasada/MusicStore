const express = require('express');
const conditionController = require('../controllers/conditions');
const router = express.Router();

router.get('/', conditionController.getConditions);
router.post('/add', conditionController.addCondition);

module.exports = router;