const Joi = require('joi');
const mongoose = require('mongoose');


const adminSchema = new mongoose.Schema({
    login: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
        unique: true
    },
    email: {
        type: String, 
        required: true,
        minlength: 3,
        maxlength: 100,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 100
    },
    confirmPassword: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 100
    },
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

exports.Admin = Admin;
exports.validateAdmin = validateAdmin;
