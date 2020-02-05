const Joi = require('joi');
const mongoose = require('mongoose');


const customerSchema = new mongoose.Schema({
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
        minlength: 8,
        maxlength: 100
    },
    name: {
        type: String,
        required: true,
        minlegth: 3,
        maxlength: 100
    },
    country: {
        type: String,
        enum: ["Austria", "Belgium", "Bulgaria", "Croatia", "Cyprus", "Czech Republic", "Denmark", "Estonia", "Finland", "France", "Germany", "Greece", "Hungary", "Ireland", "Italy", "Latvia", "Lithuania", "Luxembourg", "Malta", "Netherlands", "Poland", "Portugal", "Romania", "Slovakia", "Slovenia", "Spain", "Sweden", ""],
        default: ""
    },
    address: {
        type: String,
     
        maxlength: 100,
        default: ""
    },
    city: {
        type: String,
        maxlength: 100,
        default: ""
    },
    postalCode: {
        type: String,
        validate: {
            
            validator: (v) => { 
                if(this.country === "Austria" || this.country === "Belgium" || this.country === "Bulgaria" || this.country === "Cyprus" || this.country === "Denmark" || this.country === "Hungary" || this.country === "Netherlands" || this.country === "Slovenia") { return /\d{4}/.test(v)}
                else if (this.country ==="Croatia" || this.country === "Estonia" || this.country ==="Finland" || this.country === "France" ||this.country === "Germany" || this.country === "Italy" || this.country === "Lithuania" || this.country === "Spain") { return /\d{5}/.test(v) }
                else if (this.country === "Czech Republic" || this.country === "Greece" || this.country === "Slovakia" || this.country === "Sweden") { return /\d{3}\s\d{2}/.test(v) }
                else if (this.country === "Poland") { return /\d{2}-\d{3}/.test(v) }
                else if (this.country === "Portugal") { return /\d{4}-\d{3}/.test(v) }
                else if (this.country === "Romania") { return /\d{6}/.test(v) }
                else if (this.country === "Ireland") { return }
                else if (this.country === "Malta") { return /\w{3}/.test(v) }
                else if (this.country === "Luxembourg") { return /[L]-\d{4}/.test(v) }
                else if (this.country === "Latvia") { return /[L][V]-\d{4}/.test(v) }
                else if (this.country === "") { return "" }
                
            },
            message: props => `${props.value} is not a valid postal code for this country`
        },
        default: ""
    }
})

function postalCodePattern(country) {
    if (country === "Austria" || country === "Belgium" || country === "Bulgaria" || country === "Cyprus" || country === "Denmark" || country === "Hungary" || country === "Netherlands" || country === "Slovenia") { return /\d{4}/ }
    else if (country ==="Croatia" || country === "Estonia" || country ==="Finland" || country === "France" ||country === "Germany" || country === "Italy" || country === "Lithuania" || country === "Spain") { return /\d{5}/ }
    else if (country === "Czech Republic" || country === "Greece" || country === "Slovakia" || country === "Sweden") { return /\d{3}\s\d{2}/ }
    else if (country === "Poland") { return /\d{2}-\d{3}/ }
    else if (country === "Portugal") { return /\d{4}-\d{3}/ }
    else if (country === "Romania") { return /\d{6}/ }
    else if (country === "Ireland") { return }
    else if (country === "Malta") { return /\w{3}/ }
    else if (country === "Luxembourg") { return /[L]-\d{4}/ }
    else if (country === "Latvia") { return /[L][V]-\d{4}/ }
    else if (country === "") { return "" }
}

const Customer = mongoose.model("Customer", customerSchema);

function validateCustomer(customer) {
    const schema = {
        login: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(3).max(100).email().required(),
        password: Joi.string().min(8).max(100).required(),
        confirmPassword: Joi.string().min(8).max(100).required(),
        name: Joi.string().min(3).max(100).required()
    }
    return Joi.validate(customer, schema);
};

function validateAddress(customer) {
    const schema = {
        country: Joi.string().required(),
        address: Joi.string().required(),
        city: Joi.string().required(),
        postalCode: Joi.string().when('country', {
            is: 'Austria', is: 'Belgium', is: 'Bulgaria', is: 'Cyprus', is: 'Denmark', is: 'Hungary', is: 'Netherlands', is: 'Slovenia',
            then: Joi.string().regex(/\b\d{4}\b/).required()})
            .when('country', {
            is: 'Croatia', is: 'Estonia', is: 'Finland', is: 'France', is: 'Germany', is: 'Italy', is: 'Lithuania', is: 'Spain',
            then: Joi.string().regex(/\b\d{5}\b/).required()})
            .when('country', {
            is: 'Czech Republic', is: 'Greece', is: 'Slovakia', is: 'Sweden',
            then: Joi.string().regex(/\b\d{3}\s\d{2}\b/).required()})
            .when('country', {
            is: 'Poland',
            then: Joi.string().regex(/\b\d{2}-\d{3}\b/).required()})
            .when('country' , {
            is: 'Portugal',
            then: Joi.string().regex(/\b\d{4}-\d{3}\b/).required()})
            .when('country' , {
            is: 'Romania',
            then: Joi.string().regex(/\b\d{6}\b/).required()})
            .when('country' , {
            is: 'Ireland',
            then: Joi.string().regex(/\b\D{1}\d{2}-\.{4}\b/).required()})
            .when('country' , {
            is: 'Malta',
            then: Joi.string().regex(/\b\D{3}\b/).required()})
            .when('country' , {
            is: 'Luxembourg',
            then: Joi.string().regex(/\b[L]-\d{4}\b/).required()})
            .when('country' , {
            is: 'Latvia',
            then: Joi.string().regex(/\b[L][V]-\d{4}\b/).required()})
        }

        return Joi.validate(customer, schema);
}

exports.Customer = Customer;
exports.validateCustomer = validateCustomer;
exports.validateAddress = validateAddress;
