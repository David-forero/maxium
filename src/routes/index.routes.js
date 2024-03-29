const { Router } = require('express');
const router = Router();
const passport = require('passport');
const { Cursos, User } = require('../models/');

//helpers
const { isAuthenticated, isAdmin } = require('../helpers/auth');
const MenuCourse = require('../helpers/menu_course');

//controllers
const index = require('../controllers/index');

router.get('/', index.index);

router.get('/capacitaciones/:tag/:page', index.capacitaciones);

router.get('/clientes', async (req, res) => {
    let title = "Clientes";
    let menuCourse = await MenuCourse();
    res.render('clientes', {title, menuCourse});
});

router.get('/contacto', async (req, res) => {
    let title = "Formulario de contacto";
    let menuCourse = await MenuCourse();
    res.render('contacto', {title, menuCourse});
});

router.get('/cumplimiento', async (req, res) => {
    let title = "Cumplimiento";
    let menuCourse = await MenuCourse();
    res.render('cumplimiento', {title, menuCourse});
});

router.get('/nosotros', async (req, res) => {
    let title = "¿Quiénes somos?";
    let menuCourse = await MenuCourse();
    res.render('nosotros', {title, menuCourse});
});

router.get('/noticias', async (req, res) => {
    let title = "Noticias";
    let menuCourse = await MenuCourse();
    res.render('noticias', {title, menuCourse});
});

router.get('/payment/:id', isAuthenticated, index.payment);
router.post('/payment/:id', isAuthenticated, index.paymentInsta);

router.get('/productos', async (req, res) => {
    let title = "Productos";
    let menuCourse = await MenuCourse();
    res.render('productos', {title, menuCourse});
});

router.get('/signin', async (req, res) => {
    let title = "Maxium - Login";
    let menuCourse = await MenuCourse();
    res.render('auth/signin', {title, menuCourse});
});

router.get('/signup', async (req, res) => {
    let title = "Registro";
    let menuCourse = await MenuCourse();
    res.render('auth/signup', {title, menuCourse});
});

router.post('/signin', passport.authenticate('local-signin', {
    successRedirect: '/capacitaciones/todos/1',
    failureRedirect: '/signin',
    passReqToCallBack: true
}))

router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/capacitaciones/todos/1',
    failureRedirect: '/signup',
    passReqToCallback: true
}));

//=============================================================

router.get('/nc-login', async (req, res) => {
    const admin = await User.find({"role": "admin"});
    res.render('auth/admins', {admin});
});

router.post('/nc-login', passport.authenticate('local-signin', {
    successRedirect: '/dashboard/home',
    failureRedirect: '/nc-login',
    passReqToCallback: true
}))

router.post('/nc-newAdmin', async (req, res) =>{
    const { name, email, password } = req.body;
    if (name === "" || email === "" || password === "") {
        req.flash('Error', "No dejar campos vacios")
        res.redirect('/nc-login');
    }else{
        const newAdmin = new User();
        newAdmin.name = name;
        newAdmin.email = email;
        newAdmin.role = "admin"
        newAdmin.password = newAdmin.encryptPassword(password);
        
        await newAdmin.save();
        res.redirect('/nc-login');
    }
})

router.get('/logout', (req, res, next) =>{
    req.logout();
    res.redirect('/');
})

router.get('/course/delete/:id', isAuthenticated, isAdmin, index.removeCourse);

module.exports = router;