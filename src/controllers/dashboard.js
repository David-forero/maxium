const { User, Cursos } = require('../models/index');
const path = require('path');
const fs = require('fs-extra');
const cloudinary = require('cloudinary');

cloudinary.config({//loguearme para consumir la api
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

// Helpers
const Counts = require('../helpers/counts')
const { randomNumber } = require('../helpers/randomNumber.js');

const ctrl = {}

//=================== Home

ctrl.getStadis = async (req, res) =>{
    let title = "Dashboard - Inicio";
    const counts = await Counts();

    const courses = await Cursos.find().limit(4).sort({created_at: -1});
    res.render('dashboard/index', {title, courses, counts});
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
        const images = await Cursos.find({public_img_id: imgUrl});
        if (images.length > 0) {
            saveImage();
        } else {
            const ext = path.extname(req.file.originalname).toLowerCase();
            const imageTempPath = req.file.path;
            
            
            if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
                console.log(imageTempPath);
                const result = await cloudinary.v2.uploader.upload(imageTempPath);
                console.log(result);
                const newCourse = new Cursos({
                    title: req.body.title,
                    consultant: req.body.consultant,
                    modo: req.body.modo,
                    description: req.body.description,
                    day: req.body.day,
                    place: req.body.place,
                    timeFrom: req.body.timeFrom,
                    timeUntil: req.body.timeUntil,
                    price: req.body.price,
                    imageURL: result.url,
                    public_img_id: result.public_id,
                    participants_count: req.body.participants_count
                });

                await newCourse.save();
                await fs.unlink(imageTempPath) //elimino la img que tengo en local
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
    const edit = await Cursos.findOne({public_img_id: {$regex: req.params.id}});
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
    await User.updateOne({_id:id}, req.body);
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
    }else{
        if (!user.comparePassword(password_old)) {
            req.flash('Data', data);
            req.flash('Error', 'La contraseña vieja no es correcta.');
            res.redirect('/dashboard/config');
        }else{
            
        if(passwordNew.length < 6){
            req.flash('Data', data);
            req.flash('Error', 'la contraseña debe ser mas de 6 caracteres.');
            res.redirect('/dashboard/config');
        }else{
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
                await User.updateOne({_id: _id}, nuevaClave);
                res.redirect('/dashboard/config');
            }
        }
        
        }
    }
    
}

module.exports = ctrl;