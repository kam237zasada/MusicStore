const express = require('express');
const {Condition, validateCondition} = require('../models/condition');



getConditions = async (req, res) => {
    const conditions = await Condition.find().sort('mark').select('-mark');
    res.send(conditions);
};

getCondition = async (req, res) => {
    const condition = await Condition.findById(req.params.id);

    if (!condition) return res.status(404).send('Oops! Condition does not exists');
    res.send(condition);
}

addCondition = async (req, res) => {
    const {error} = validateCondition(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    let findCondition = await Condition.findOne({name:req.body.name});

    if (findCondition) {
        return res.status(400).send('Condition with given name already exist.');
    }

    const newCondition = new Condition({
        name: req.body.name,
        mark: req.body.mark,
        description: req.body.description
    });

    try {
        await newCondition.save()
        res.send({
            message: 'New Condition created',
            name: newCondition.name,
            mark: newCondition.mark,
            description: newCondition.description,
            _id: newCondition._id
        });
    } catch (error) { res.status(400).send(error); }
};

updateCondition = async (req, res) => {
    const condition = Condition.findById(req.params.id);
    if(!condition) return res.status(404).send('Oops! Condition does not exists.');

    const { error } = validateCondition(req.body);
    if (error) { return res.status(400).send(error.details[0].message); };

    existCondition = await Condition.findOne({name: req.body.name});
    if (existCondition && existCondition._id != condition._id) { return res.status(400).send("Genre with that name already exists.")};
    existMark = await Condition.findOne({mark: req.body.mark});
    if (existMark && existMark._id != condition._id) { return res.status(400).send("Genre with that mark already exists.")};

    condition.set({
        name: req.body.name,
        mark: req.body.mark,
        description: req.body.description
    });

    try {
        await condition.save();
        res.send({
            condition,
            message: "Condition updated correctly"
        });
    } catch (error) { res.status(400).send(error); }
};

deleteCondition = async (req, res) => {
    const condition = Condition.findByIdandDelete(req.params.id);
    if(!condition) return res.status(404).send('Oops! Condition does not exists.');

    res.send({
        condition,
        message: "Condition deleted correctly."
    });

};

module.exports = {getConditions, getCondition, addCondition, updateCondition, deleteCondition};