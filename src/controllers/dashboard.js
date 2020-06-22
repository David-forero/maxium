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
    let title = "Dashboard - Inicio"
    const courses = await Cursos.find().limit(4).sort({created_at: -1});
    res.render('dashboard/index', {title, courses});
}

//=================== Courses

ctrl.getCourses = async (req, res) =>{
    let title = "Dashboard - Cursos"
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

ctrl.removeCourse = async (req, res) =>{
    if (confirm('¿Esta seguro de eliminar este curso?')) {
        const image = await Cursos.findOne({image: {$regex: req.params.id}});
        if (image) {
            await fs.unlink(path.resolve('./src/public/uploads/' + image.image));
            await image.remove();

            
            req.flah('Success', 'Curso eliminado sastifactoriamente.')
            res.redirect('/dashboard/courses')
        }
    }
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
    let title = "Dashboard - Permisos de Usuario"
    const users = await User.find({ "role" : { "$in": ["mod", "helper"]} });
    res.render('dashboard/users', {users, title});
}

ctrl.addUsers = async (req, res) =>{
    const { name, lastname, email, password, passwordConfirm, role} = req.body;
    const newUser = new User({name, lastname, email, password, role});
    newUser.password = newUser.encryptPassword(password);

    if (password != passwordConfirm) {
        req.flash('Error', 'Confirme bien su contraseña.')
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
    const { id } = req.params;
    const edit = await User.findById(id);
    res.render('dashboard/edits/edit_user', {edit});
}

ctrl.userEdit = async (req, res) =>{
    const { id } = req.params;
    await User.update({_id:id}, req.body);
    res.redirect('/dashboard/users');
}

module.exports = ctrl;