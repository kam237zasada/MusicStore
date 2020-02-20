const express = require('express');
const {Vinyl, validateVinyl} = require('../models/vinyl');
const {Genre} = require('../models/genre');
const {Condition} = require('../models/condition');


getVinyl = async (req, res) => {
    const vinyl = await Vinyl.findById(req.params.id);
    if(!vinyl) { return res.status(400).send("Vinyl with that id does not exists"); }

    res.send(vinyl);
};

getVinyls = async (req, res) => {
    const vinyls = await Vinyl.find().sort('author');

    res.send(vinyls);
}
addVinyl = async (req, res) => {
    const { error } = validateVinyl(req.body);
    if(error) { return res.status(400).send(error.details[0].message)};

    const genre = await Genre.findById(req.body.genreId);
    if(!genre) { return res.status(400).send("Genre does not exists"); }

    const condition = await Condition.findById(req.body.conditionId);
    if(!condition) { return res.status(400).send("Condition does not exists"); }



    const newVinyl = new Vinyl({
        genre: {
            name: genre.name,
            _id: genre._id
        },
        label: req.body.label,
        labelSerial: req.body.labelSerial,
        format: req.body.format,
        RPMs: req.body.RPMs,
        title: req.body.title,
        author: req.body.author,
        tracks: req.body.tracks,
        year: req.body.year,
        country: req.body.country,
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
        await newVinyl.save();
        res.send({
            message: "New vinyl created",
            newVinyl
        })

    } catch (error) { return res.status(400).send(error) };
};

updateVinyl = async (req, res) => {
    const vinyl = await Vinyl.findById(req.params.id);
    if(!vinyl) { return res.status(400).send("Vinyl with that id does not exists."); };

    const { error } = validateVinyl(req.body);
    if(error) { return res.status(400).send(error.details[0].message)};

    const genre = await Genre.findById(req.body.genreId);
    if(!genre) { return res.status(400).send("Genre does not exists"); }

    const condition = await Condition.findById(req.body.conditionId);
    if(!condition) { return res.status(400).send("Condition does not exists"); }

    vinyl.set({
        genre: {
            name: genre.name,
            _id: genre._id
        },
        label: req.body.label,
        labelSerial: req.body.labelSerial,
        format: req.body.format,
        RPMS: req.body.RPMs,
        title: req.body.title,
        author: req.body.author,
        tracks: req.body.tracks,
        year: req.body.year,
        country: req.body.country,
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
        await vinyl.save();
        res.send({
            vinyl,
            message: "Vinyl updated correctly."});
    } catch (error) { res.status(400).send(error); }
};

deleteVinyl = async (req, res) => {
    const vinyl = await Vinyl.findByIdAndDelete(req.params.id);
    if(!vinyl) { return res.status(400).send("Vinyl with that id does not exists."); };

    res.send({ message: `Vinyl with ID ${req.params.id} deleted succesfully.` });

}

module.exports = {getVinyl, getVinyls, addVinyl, updateVinyl, deleteVinyl};