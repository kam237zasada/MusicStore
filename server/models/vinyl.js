const Joi = require('joi');
const mongoose = require('mongoose');
const {genreSchema} = require('./genre');
const {conditionSchema} = require('./condition');


const Vinyl = mongoose.model('Vinyl', new mongoose.Schema({
    genre: {
        type: genreSchema,
        required: true
    },
    label: {
        type: String,
        required: true
    },
    labelSerial: {
        type: String,
        reqired: true
    },
    format: {
        type: String,
        enum: ['12', '7']
    },
    RPMs: {
        type: String,
        enum: ['33', '45']
    },
    title: {
        type: String,
        required: true,
        maxlength: 255
    },
    author: {
        type: String,
        required: true,
        maxlength: 255
    },
    tracks: {
        type: Array,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        maxlength: 500
    },
    forSell: {
        type: Boolean,
        required: true,
        default: false
    },
    price: {
        type: Number,
        required: () => this.forSell,
    },
    amount: {
        type: Number,
        required: () => this.forSell,
    },
    forRent: {
        type: Boolean,
        required: true,
        default: false
    },
    dailyRentalFee: {
        type: Number,
        required: () => this.forRent,
    },
    condition: {
        type: conditionSchema,
        required: () => this.forRent,
    }

}));

function validateVinyls(vinyl) {
    const schema = {
        genreId: Joi.objectId().required(),
        label: Joi.string().required(),
        labelSerial: Joi.string().required(),
        format: Joi.string().required(),
        RPMs: Joi.string().required(),
        title: Joi.string().max(255).required(),
        author: Joi.string().max(255).required(),
        tracks: Joi.array().required(),
        year: Joi.number().integer().required(),
        description: Joi.string().max(500),
        forSell: Joi.boolean().required(),
        price: Joi.number(),
        amount: Joi.number(),
        forRent: Joi.boolean().required(),
        dailyRentalFee: Joi.number(),
        conditionId: Joi.objectId(),
    };
    return Joi.validate(vinyl, schema)
}

exports.Vinyl = Vinyl;
exports.validate = validateVinyls;