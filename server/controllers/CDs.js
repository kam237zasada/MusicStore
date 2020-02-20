const express = require('express');
const {CD, validateCD} = require('../models/CD');
const {Genre} = require('../models/genre');
const {Condition} = require('../models/condition');


getCD = async (req, res) => {
    const cd = await CD.findById(req.params.id);
    if(!cd) { return res.status(400).send("CD with that id does not exists"); }

    res.send(cd);
};

getCDs = async (req, res) => {
    const cds = await CD.find().sort('author');

    res.send(cds);
}
addCD = async (req, res) => {
    const { error } = validateCD(req.body);
    if(error) { return res.status(400).send(error.details[0].message)};

    const genre = await Genre.findById(req.body.genreId);
    if(!genre) { return res.status(400).send("Genre does not exists"); }

    const condition = await Condition.findById(req.body.conditionId);
    if(!condition) { return res.status(400).send("Condition does not exists"); }



    const newCD = new CD({
        genre: {
            name: genre.name,
            _id: genre._id
        },
        title: req.body.title,
        author: req.body.author,
        tracks: req.body.tracks,
        year: req.body.year,
        description: req.body.description,
        forSell: req.body.forSell,
        price: req.body.price,
        amount: req.body.amount,
        forRent: req.body.forRent,
        dailyRentalFee: req.body.dailyRentalFee,
        condition: {
            name: condition.name,
            mark: condition.mark,
            description: condition.description,
            _id: condition._id}
    });
    try {
        await newCD.save();
        res.send({
            message: "New CD created",
            newCD
        })

    } catch (error) { return res.status(400).send(error) };
};

updateCD = async (req, res) => {
    const cd = await CD.findById(req.params.id);
    if(!cd) { return res.status(400).send("CD with that id does not exists."); };

    const { error } = validateCD(req.body);
    if(error) { return res.status(400).send(error.details[0].message)};

    const genre = await Genre.findById(req.body.genreId);
    if(!genre) { return res.status(400).send("Genre does not exists"); }

    const condition = await Condition.findById(req.body.conditionId);
    if(!condition) { return res.status(400).send("Condition does not exists"); }

    cd.set({
        genre: {
            name: genre.name,
            _id: genre._id
        },
        title: req.body.title,
        author: req.body.author,
        tracks: req.body.tracks,
        year: req.body.year,
        description: req.body.description,
        forSell: req.body.forSell,
        price: req.body.price,
        amount: req.body.amount,
        forRent: req.body.forRent,
        dailyRentalFee: req.body.dailyRentalFee,
        condition: {
            name: condition.name,
            mark: condition.mark,
            description: condition.description,
            _id: condition._id}
    });
    try {
        await cd.save();
        res.send({
            cd,
            message: "CD updated correctly."});
    } catch (error) { res.status(400).send(error); }
};

deleteCD = async (req, res) => {
    const cd = await CD.findByIdAndDelete(req.params.id);
    if(!cd) { return res.status(400).send("CD with that id does not exists."); };

    res.send({ message: `CD with ID ${req.params.id} deleted succesfully.` });

}

module.exports = {getCD, getCDs, addCD, updateCD, deleteCD};