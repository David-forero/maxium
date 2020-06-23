const { Router } = require('express');
const router = Router();
const passport = require('passport');

//helpers
const { isAuthenticated, isAdmin } = require('../helpers/auth');


//controllers
const index = require('../controllers/index');

router.get('/', index.index);

router.get('/capacitaciones/:tag/:page', index.capacitaciones);

router.get('/clientes', (req, res) => {
    let title = "Clientes";
    res.render('clientes', {title});
});

router.get('/contacto', (req, res) => {
    let title = "Formulario de contacto";
    res.render('contacto', {title});
});

router.get('/cumplimiento', (req, res) => {
    let title = "Cumplimiento";
    res.render('cumplimiento', {title});
});

router.get('/nosotros', (req, res) => {
    let title = "¿Quiénes somos?";
    res.render('nosotros', {title});
});

router.get('/noticias', (req, res) => {
    let title = "Noticias";
    res.render('noticias', {title});
});

router.get('/payment/:id', index.payment);

router.get('/productos', (req, res) => {
    let title = "Productos";
    res.render('productos', {title});
});

router.get('/signin', (req, res) => {
    let title = "Maxium - Login";
    res.render('auth/signin', {title});
});

router.get('/signup', (req, res) => {
    let title = "Registro";
    res.render('auth/signup', {title});
});

router.post('/signin', passport.authenticate('local-signin', {
    successRedirect: '/capacitaciones',
    failureRedirect: '/signin',
    passReqToCallBack: true
}))

router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/capacitaciones',
    failureRedirect: '/signup',
    passReqToCallback: true
}));

//=============================================================

router.get('/nc-login', (req, res) => {
    res.render('auth/admins');
});

router.post('/nc-login', passport.authenticate('local-signin', {
    successRedirect: '/dashboard/home',
    failureRedirect: '/nc-login',
    passReqToCallback: true
}))

router.get('/logout', (req, res, next) =>{
    req.logout();
    res.redirect('/');
})

router.get('/course/delete/:id', isAuthenticated, isAdmin, index.removeCourse);

module.exports = router;