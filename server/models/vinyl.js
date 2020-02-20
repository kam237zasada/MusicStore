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
    country: {
        type: String,
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
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
}));

function validateVinyl(vinyl) {
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
        country: Joi.string().required(),
        description: Joi.string().max(500),
        forSell: Joi.boolean().required(),
        price: Joi.number().when('forSell', {
            is: true,
            then: Joi.number().required()
        })
        .when('forSell', {
            is: false,
            then: Joi.number().forbidden()
        }),
        amount: Joi.number().when('forSell', {
            is: true,
            then: Joi.number().required()
        })
        .when('forSell', {
            is: false,
            then: Joi.number().forbidden()
        }),
        forRent: Joi.boolean().required(),
        dailyRentalFee: Joi.number().when('forRent', {
            is: true,
            then: Joi.number().required()
        })
        .when('forRent', {
            is: false,
            then: Joi.number().forbidden()
        }),
        conditionId: Joi.string().when('forRent', {
            is: true,
            then: Joi.string().required()
        })
        .when('forRent', {
            is: false,
            then: Joi.string().forbidden()
        }),
    };
    return Joi.validate(vinyl, schema)
}

exports.Vinyl = Vinyl;
exports.validateVinyl = validateVinyl;