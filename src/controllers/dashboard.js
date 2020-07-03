const { User, Cursos } = require('../models/index');
const path = require('path');
const fs = require('fs-extra');
//const md5 = require('md5');

// Helpers
const Counts = require('../helpers/counts')
const { randomNumber } = require('../helpers/randomNumber.js');

const ctrl = {}

//=================== Home

ctrl.getStadis = async (req, res) =>{
    let title = "Dashboard - Inicio";
    const courses = await Cursos.find().limit(4).sort({created_at: -1});
    res.render('dashboard/index', {title, courses});
}

//=================== Courses

ctrl.getCourses = async (req, res) =>{
    let title = "Dashboard - Cursos";
    const courses = await Cursos.find().sort({created_at: -1});
    res.render('dashboard/cursos', {title, courses});
}

ctrl.addCourse = async (req, res) =>{

    const saveImage = async () =>{
        const imgUrl = randomNumber();
        const images = await Cursos.find({image: imgUrl});
        if (images.length > 0) {
            saveImage();
        } else {
            const ext = path.extname(req.file.originalname).toLowerCase();
            const imageTempPath = req.file.path;
            const targetPath = path.resolve(`src/public/uploads/${imgUrl}${ext}`);
            
            if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
                await fs.rename(imageTempPath, targetPath);
                const newCoruse = new Cursos({
                    title: req.body.title,
                    consultant: req.body.consultant,
                    modo: req.body.modo,
                    description: req.body.description,
                    day: req.body.day,
                    place: req.body.place,
                    timeFrom: req.body.timeFrom,
                    timeUntil: req.body.timeUntil,
                    price: req.body.price,
                    image: imgUrl + ext,
                    participants_count: req.body.participants_count
                });

                await newCoruse.save();
                req.flash('Success', 'Se agregó un curso nuevo');
                res.redirect('/dashboard/courses');
            } else {
                await fs.unlink(imageTempPath);
                res.status(500).json({'error': 'Only imgs are allowed'})
            }
        }
    }

    saveImage();
}

ctrl.getCourseForUpdate = async (req, res) =>{
    let title = "Modificar curso";
    const edit = await Cursos.findOne({image: {$regex: req.params.id}});
    res.render('dashboard/edits/edit_course', {edit, title});
}

ctrl.courseEdit = async (req, res) =>{
    const { id } = req.params;
    await Cursos.update({_id:id}, req.body);
    res.redirect('/dashboard/courses');
}

//=================== Users

ctrl.getUsers = async (req, res) =>{
    
    if (req.user.role === "admin" || req.user.role === "mod") {
        let title = "Dashboard - Permisos de Usuario";
        const users = await User.find({ "role": { "$in": ["mod", "helper"]} });
        res.render('dashboard/users', {users, title});
    } else {
        res.status(404).render('404');
    }
}

ctrl.addUsers = async (req, res) =>{
    const { name, lastname, email, password, passwordConfirm, role} = req.body;
    const newUser = new User({name, lastname, email, password, role});
    newUser.password = newUser.encryptPassword(password);
   
    if (password != passwordConfirm) {
        req.flash('Error', 'Confirme bien su contraseña.');
        res.redirect('/dashboard/users');
    } else {
        await newUser.save();
        res.redirect('/dashboard/users');
    }
}

ctrl.deleteUser = async (req, res) =>{
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.redirect('/dashboard/users')
}

ctrl.getUserForUpdate = async (req, res) =>{
    let title = "Dashboard - Editar Usuario";
    const { id } = req.params;
    const edit = await User.findById(id);
    res.render('dashboard/edits/edit_user', {edit, title});
}

ctrl.userEdit = async (req, res) =>{
    const { id } = req.params;
    await User.update({_id:id}, req.body);
    res.redirect('/dashboard/users');
}

//===================== Settings

ctrl.getSettings = async (req, res) =>{
    let title = "Dashboard - Configuraciones";
    res.render('dashboard/settings', {title})
}

ctrl.settingPassword = async (req, res) =>{
    const data = req.body;
    const {email, _id} = req.user;
    const user = await User.findOne({email: email});
    const { password_old, passwordNew, passwordNew2 } = req.body;
    if (password_old === "" || passwordNew === "" || passwordNew2 === "") {
        req.flash('Data', data);
        req.flash('Error', 'No deje campos vacios.');
        res.redirect('/dashboard/config');
    }
    if (!user.comparePassword(password_old)) {
        req.flash('Data', data);
        req.flash('Error', 'La contraseña vieja no es correcta.');
        res.redirect('/dashboard/config');
    }
    if(passwordNew.length > 6){
        req.flash('Data', data);
        req.flash('Error', 'la contraseña debe ser mas de 6 caracteres.');
        res.redirect('/dashboard/config');
    }
    if (passwordNew != passwordNew2) {
        req.flash('Data', data);
        req.flash('Error', 'Confirme bien su contraseña.');
        res.redirect('/dashboard/config');
    } else {
        const newPassword = await User.findById(_id);
        newPassword.password = newPassword.encryptPassword(passwordNew);
        let nuevaClave = {
            password: newPassword.password
        }

        req.flash('Success', 'has cambiando tu nueva contraseña correctamente.');
        await User.update({_id: _id}, nuevaClave);
        res.redirect('/dashboard/config');
    }
}

module.exports = ctrl;