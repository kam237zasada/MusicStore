const express = require('express');
const genreController = require('../controllers/genres');
const router = express.Router();

router.get('/', genreController.getGenres);
router.get('/:id', genreController.getGenre);
router.post('/add', genreController.addGenre);
router.put('/:id', genreController.updateGenre);
router.delete('/:id', genreController.deleteGenre);

module.exports = router;