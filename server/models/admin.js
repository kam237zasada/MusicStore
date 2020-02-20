const Joi = require('joi');
const mongoose = require('mongoose');


const adminSchema = new mongoose.Schema({
    login: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    email: {
        type: String, 
        required: true,
        minlength: 3,
        maxlength: 100
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 100
    },
    confirmPassword: {
        type: String,
        minlength: 8,
        maxlength: 100
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
})

const Admin = mongoose.model("Admin", adminSchema);

function validateAdmin(admin) {
    const schema = {
        login: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(3).max(100).email().required(),
        password: Joi.string().min(8).max(100).required(),
        confirmPassword: Joi.string().min(8).max(100).required()
    };
    return Joi.validate(admin, schema);
};

function validatePassword(admin) {
    const schema = {
        password: Joi.string().min(8).max(100).required(),
        confirmPassword: Joi.string().min(8).max(100).required(),
    };
    return Joi.validate(admin, schema);
};

function validateUpdate(admin) {
    const schema = {
        login: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(3).max(100).email().required(),
    };
    return Joi.validate(admin, schema);
};

exports.Admin = Admin;
exports.validateAdmin = validateAdmin;
exports.validatePassword = validatePassword;
exports.validateUpdate = validateUpdate;
