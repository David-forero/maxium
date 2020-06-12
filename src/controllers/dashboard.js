const { User } = require('../models/index');
const ctrl = {}

ctrl.getUsers = async (req, res) =>{
    const users = await User.find({ "role" : { "$in": ["mod", "helper"]} });
    res.render('dashboard/users', {users});
}

ctrl.addUsers = async (req, res) =>{
    const { name, lastname, email, password, passwordConfirm, role} = req.body;
    const newUser = new User({name, lastname, email, password, role});
    newUser.password = newUser.encryptPassword(password);

    await newUser.save();
    res.redirect('/dashboard/users');
}

ctrl.deleteUser = async (req, res) =>{
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.redirect('/dashboard/users')
}

ctrl.getUserForUpdate = async (req, res) =>{
    const { id } = req.params;
    const edit = await User.findById(id);
    res.render('dashboard/edit_user', {edit});
}

ctrl.userEdit = async (req, res) =>{
    const { id } = req.params;
    await User.update({_id:id}, req.body);
    res.redirect('/dashboard/users');
}

module.exports = ctrl;