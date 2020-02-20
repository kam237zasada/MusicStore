const bcrypt = require('bcrypt');
const {Customer, validateCustomer, validateAddress, validateCustomerUpdate, validatePassword} = require('../models/customer');

getCustomers = async (req, res) => {
    const customers = await Customer.find().select('-password').sort('dateCreated');
    res.send(customers);
}

getCustomer = async (req, res) => {
    const customer = await (await Customer.findById(req.params.id)).select('-password');

    if (!customer) return res.status(404).send('Oops! Customer does not exists');
    res.send(customer);
}

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

loginCustomer = async (req, res) => {
    const login = await Customer.findOne({login: req.body.login});
    const email = await Customer.findOne({email: req.body.email});

    if(!login && !email) { return res.status(400).send("Login or password is wrong")};
    let validateWithLogin, validateWithEmail;
    if (login) { validateWithLogin = await bcrypt.compare(req.body.password, login.password);}
    if (email) { validateWithEmail = await bcrypt.compare(req.body.password, email.password);}

    if(!validateWithLogin && !validateWithEmail) { return res.status(400).send("Login or password is wrong")};
    let customer;
    if(validateWithLogin) { customer = login}
    else { customer = email};
    res.send({
        message: `${customer.login} sign in succesfully.`,
        login: customer.login,
        name: customer.name,
        email: customer.email,
        _id: customer._id
    })
}

addAddress = async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if(!customer) return res.status(404).send("User does not exists!");

    const { error } = validateAddress(req.body);
        if (error) { return res.status(400).send(error.details[0].message); };

    customer.set({
        country: req.body.country,
        address: req.body.address,
        city: req.body.city,
        postalCode: req.body.postalCode,
        telephone: req.body.telephone
    });
    try {
        await customer.save();
        res.send({
            login: customer.login,
            name: customer.name,
            email: customer.name,
            country: customer.country,
            address: customer.address,
            city: customer.city,
            postalCode: customer.postalCode,
            telephone: customer.telephone,
            message: "Address added correctly."});
    } catch (error) { res.status(400).send(error); }
};

updatePassword = async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if(!customer) { return res.status(404).send("User does not exists."); }

    const password = await bcrypt.compare(req.body.currentPassword, customer.password);
    if(!password) { return res.status(400).send("Password is not correct."); }

    if(req.body.password != req.body.confirmPassword) { return res.status(400).send("Passwords must be the same"); }

    let { error } = validatePassword({password: req.body.password, confirmPassword: req.body.confirmPassword});
        if (error) { 
            return res.status(400).send(error.details[0].message); };

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    customer.set({
        password: hashedPassword
    });

    try {
        await customer.save();
        res.send({ message: "Password updated correctly" });
    } catch (error) { res.status(400).send(error); }

}

updateCustomer = async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if(!customer) return res.status(404).send("User does not exists");

    const address = {
        address: req.body.address,
        city: req.body.city,
        country: req.body.country,
        postalCode: req.body.postalCode,
        telephone: req.body.telephone
    };

    const data = {
        name: req.body.name,
        email: req.body.email,
        login: req.body.login
    }

    let { error } = validateAddress(address);
        if (error) { 
            return res.status(400).send(error.details[0].message); };
    
    let { err } = validateCustomerUpdate(data);
        if (err) { return res.status(400).send(err.details[0].message); }


    const login = await Customer.findOne({login: req.body.login});
    if(login && login._id != req.params.id) { return res.status(400).send("Login is used by another client.")};
    const email = await Customer.findOne({email: req.body.email});
    if(email && email._id != req.params.id) { return res.status(400).send("Client with that email exists.")};


    customer.set({
        login: req.body.login,
        name: req.body.name,
        email: req.body.email,
        country: req.body.country,
        address: req.body.address,
        city: req.body.city,
        postalCode: req.body.postalCode,
        telephone: req.body.telephone
    });

    try {
        await customer.save();
        res.send({
            login: customer.login,
            name: customer.name,
            email: customer.email,
            country: customer.country,
            address: customer.address,
            city: customer.city,
            postalCode: customer.postalCode,
            telephone: customer.telephone,
            message: "User updated correctly."});
    } catch (error) { res.status(400).send(error); }
};

deleteCustomer = async (req, res) => {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if(!customer) { return res.status(400).send("Customer with that id does not exists."); };

    res.send({ message: `User with ID ${req.params.id} deleted succesfully.` });
}

module.exports = {getCustomers, getCustomer, addCustomer, loginCustomer, addAddress, updatePassword, updateCustomer, deleteCustomer};