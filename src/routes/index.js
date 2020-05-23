const { Router } = require('express');
const router = Router();
const passport = require('passport');

//controllers
const index = require('../controllers/index');

router.get('/', (req, res) => {
    let title = "Maxium - Bienvenidos";
    res.render('index', {title});
});

router.get('/capacitaciones', (req, res) => {
    let title = "Capacitaciones";
    res.render('capacitaciones', {title});
});

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

router.get('/payment', (req, res) => {
    let title = "Formulario de pago";
    res.render('payment', {title});
});

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

router.get('/logout', (req, res, next) =>{
    req.logout();
    res.redirect('/');
})

//404
// router.get('*', function (req, res) {
//     res.status(404).render('404');
// });

module.exports = router;