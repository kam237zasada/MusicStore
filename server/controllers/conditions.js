const {Condition, validateCondition} = require('../models/condition');



getConditions = async (req, res) => {
    const conditions = await Condition.find().sort('mark').select('-mark');
    res.send(conditions);
};

addCondition = async (req, res) => {
    const {error} = validateCondition(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    let findCondition = await Condition.findOne({name:req.body.name});

    if (findCondition) {
        return res.status(400).send('Condition with given name already exist.');
    }

    const newCondition = new Condition({
        name: req.body.name,
        mark: req.body.mark,
        description: req.body.description
    });

    try {
        await newCondition.save()
        res.send({
            message: 'New Condition created',
            name: newCondition.name,
            mark: newCondition.mark,
            description: newCondition.description,
            _id: newCondition._id
        });
    } catch (err) {
        res.status(400).send(err);
    }
};

module.exports = {getConditions, addCondition};