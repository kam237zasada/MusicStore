const express = require('express');
const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const app = express();
const conditions = require('./routes/conditions');
const customers = require('./routes/customers');
const admins = require('./routes/admins');
const genres = require('./routes/genres');
const cds = require('./routes/cds');
const vinyls = require('./routes/vinyls');

console.log("hey");

mongoose.connect('mongodb+srv://kam237zasada:kam237zasada@musicstore-3kwjv.mongodb.net/test')
    .then (() => console.log("Connected.."))
    .catch (err => console.error("Connection failed..."));


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`))

app.use(express.json());
app.use('/condition', conditions);
app.use('/customer', customers);
app.use('/admin', admins);
app.use('/genre', genres);
app.use('/cd', cds);
app.use('/vinyl', vinyls);