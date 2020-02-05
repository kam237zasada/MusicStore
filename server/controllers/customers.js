const express = require('express');
const bcrypt = require('bcrypt');
const {Customer, validateCustomer, validateAddress} = require('../models/customer');


addCustomer = async (req, res) => {

        const { error } = validateCustomer(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        };

        let findEmail = await Customer.findOne({email: req.body.email});
        let findLogin = await Customer.findOne({login: req.body.login});

        if(findEmail) {
            return res.status(400).send('Email already registered.');
        }
        if(findLogin) {
            return res.status(400).send('Login already registered.');
        }

        if (req.body.password != req.body.confirmPassword) {
            return res.status(400).send('Passwords must be the same.');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const newCustomer = new Customer({
            login: req.body.login,
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });

        try {
            await newCustomer.save();
            res.send({
                message: "New Client Created",
                login: newCustomer.login,
                email: newCustomer.email,
                name: newCustomer.name,
                _id: newCustomer._id
            });
        
        } catch (error) { res.status(400).send(error);}
}

addAddress = async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if(!customer) return res.status(404).send("User does not exists!");

    const { error } = validateAddress(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        };

    customer.set({
        country: req.body.country,
        address: req.body.address,
        city: req.body.city,
        postalCode: req.body.postalCode
    });
    customer.save();
    res.send({customer,
    message: "Address added correctly"});
}

module.exports = {addCustomer, addAddress};