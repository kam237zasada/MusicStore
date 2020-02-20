const bcrypt = require('bcrypt');
const {Admin, validateAdmin, validatePassword, validateUpdate} = require('../models/admin');


getAdmins = async (req, res) => {
    const admins = await Admin.find().select('-password').sort('dateCreated');
    res.send(admins);
};

getAdmin = async (req, res) => {
    const admin = await Admin.findById(req.params.id).select('-password');

    if (!admin) return res.status(404).send('Oops! There is no user.');
    res.send(admin);
};

addAdmin = async (req, res) => {

    const { error } = validateAdmin(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    };

    let findEmail = await Admin.findOne({email: req.body.email});
    let findLogin = await Admin.findOne({login: req.body.login});

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

    const newAdmin = new Admin({
        login: req.body.login,
        email: req.body.email,
        password: hashedPassword
    });

    try {
        await newAdmin.save();
        res.send({
            message: "New Admin Created",
            login: newAdmin.login,
            email: newAdmin.email,
            _id: newAdmin._id
        });
    
    } catch (error) { res.status(400).send(error);}
};

loginAdmin = async (req, res) => {
    const login = await Admin.findOne({login: req.body.login});
    const email = await Admin.findOne({email: req.body.email});

    if(!login && !email) { return res.status(400).send("Login or password is wrong")};
    let validateWithLogin, validateWithEmail;
    if (login) { validateWithLogin = await bcrypt.compare(req.body.password, login.password);}
    if (email) { validateWithEmail = await bcrypt.compare(req.body.password, email.password);}

    if(!validateWithLogin && !validateWithEmail) { return res.status(400).send("Login or password is wrong")};
    let admin;
    if(validateWithLogin) { admin = login}
    else { admin = email};
    res.send({
        message: `${admin.login} sign in succesfully.`,
        login: admin.login,
        name: admin.name,
        email: admin.email,
        _id: admin._id
    })
}

updatePassword = async (req, res) => {
    const admin = await Admin.findById(req.params.id);
    if(!admin) return res.status(404).send("Admin does not exists.");

    const password = await bcrypt.compare(req.body.currentPassword, admin.password);
    if(!password) return res.status(400).send("Password is not correct.");

    if(req.body.password != req.body.confirmPassword) return res.status(400).send("Passwords must be the same");

    let { error } = validatePassword({password: req.body.password, confirmPassword: req.body.confirmPassword});
        if (error) { 
            return res.status(400).send(error.details[0].message); };

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    admin.set({
        password: hashedPassword
    });

    try {
        await admin.save();
        res.send({
            message: "Password updated correctly"
        });
    } catch (error) { res.status(400).send(error); }

}

updateAdmin = async (req, res) => {
    const admin = await Admin.findById(req.params.id);
    if(!admin) return res.status(404).send("Admin does not exists");

    let { error } = validateUpdate({login: req.body.login, email: req.body.email});
        if (error) { 
            return res.status(400).send(error.details[0].message); };

    const login = await Admin.findOne({login: req.body.login});
    if(login && login._id != req.params.id) { return res.status(400).send("Login is used by another user.")};
    const email = await Admin.findOne({email: req.body.email});
    if(email && email._id != req.params.id) { return res.status(400).send("User with that email exists.")};


    admin.set({
        login: req.body.login,
        email: req.body.email
    });

    try {
        await admin.save();
        res.send({
            login: admin.login,
            email: admin.email,
            message: "Admin updated correctly."
        });
    } catch (error) { res.status(400).send({kkk:"kkk", error}); }
};

deleteAdmin = async (req, res) => {
    const admin = await Admin.findByIdAndDelete(req.params.id);

    res.send({
        message: `User with ID ${req.params.id} and login ${admin.login} deleted succesfully.`
    });
}


module.exports = {getAdmins, getAdmin, addAdmin, loginAdmin, updatePassword, updateAdmin, deleteAdmin};