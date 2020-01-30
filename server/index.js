const express = require('express');
const mongoose = require('mongoose');
const joi = require('joi');
const app = express();


console.log("hey");


mongoose.connect('mongodb+srv://kam237zasada:kam237zasada@musicstore-3kwjv.mongodb.net/test')
    .then (() => console.log("Connected.."))
    .catch (err => console.error("Connection failed..."));



const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`))