const Joi = require('joi');
const mongoose = require('mongoose');

const conditionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 15
    },
    mark: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        maxlength: 500,
        required: true
    }
});

const Condition = mongoose.model('Condition', conditionSchema);

function validateCondition(condition) {
    const schema = {
        name: Joi.string().max(15).required(),
        mark: Joi.number().required(),
        description: Joi.string().max(500).required()
    };
    return Joi.validate(condition, schema)
}

exports.conditionSchema = conditionSchema;
exports.Condition = Condition;
exports.validateCondition = validateCondition;