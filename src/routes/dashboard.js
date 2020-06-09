const { Router } = require('express');
const router = Router();
//const { User } = require('../models/index')

//helpers
const { isAuthenticated, isAdmin } = require('../helpers/auth');

router.get('/home', isAuthenticated, isAdmin, (req, res) =>{
    res.render('dashboard/index');
})

router.get('/courses', isAuthenticated, isAdmin, (req, res) =>{
    res.render('dashboard/cursos');
})

router.get('/news', isAuthenticated, isAdmin, (req, res) =>{
    res.render('dashboard/index');
})

router.get('/events', isAuthenticated, isAdmin, (req, res) =>{
    res.render('dashboard/index');
})

router.get('/users', isAuthenticated, isAdmin, (req, res) =>{
    res.render('dashboard/users');
})

module.exports = router;