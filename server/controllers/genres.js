const {Genre, validateGenre} = require('../models/genre');

getGenres = async (req, res) => {
    const genres = await Genre.find().sort('name')
    res.send(genres);
};

getGenre = async (req, res) => {
    const genre = await Genre.findById(req.params.id);

    if (!genre) return res.status(404).send('Oops! Genre does not exists');
    res.send(genre);
};

addGenre = async (req, res) => {

    const { error } = validateGenre(req.body);
    if(error) { return res.status(400).send(error.details[0].message)};

    const checkGenre = await Genre.findOne({name: req.body.name});
    if(checkGenre) { return res.status(400).send("Genre with that name already exists.")};
    

    const newGenre = new Genre({
        name: req.body.name
    });
    try { 
        await newGenre.save();
        res.send({
            message: "New Genre created",
            name: newGenre.name
        });
    } catch (error) { res.status(400).send(error); }

};

updateGenre = async (req, res) => {

    const genre = await Genre.findById(req.params.id);
    if(!genre) { return res.status(400).send("Genre does not exists.")};

    const { error } = validateGenre(req.body);
    if(error) { return res.status(400).send(error.details[0].message)};

    existGenre = await Genre.findOne({name: req.body.name});
    if (existGenre && existGenre._id != genre._id) { return res.status(400).send("Genre with that name already exists.")};

    genre.set({
        name: req.body.name
    });

    try {
        await genre.save();
        res.send({
            name: genre.name,
            message: "Genre updated"
        });
    } catch (error) { return res.status(400).send(error); }
};

deleteGenre = async (req, res) => {

    const genre = await Genre.findByIdAndDelete(req.params.id);
    if(!genre) { return res.status(400).send("Genre does not exists.")};

    res.send({ message: `Genre ${genre.name} deleted succesfully.` });

};

module.exports = {getGenres, getGenre, addGenre, updateGenre, deleteGenre};
