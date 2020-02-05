const express = require('express');
const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const app = express();
const conditions = require('./routes/conditions');
const customers = require('./routes/customers');



console.log("hey");


mongoose.connect('mongodb+srv://kam237zasada:kam237zasada@musicstore-3kwjv.mongodb.net/test')
    .then (() => console.log("Connected.."))
    .catch (err => console.error("Connection failed..."));



const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`))

app.use(express.json());
app.use('/conditions', conditions);
app.use('/customers', customers);
