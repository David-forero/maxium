const { Router } = require('express');
const router = Router();

//controllers
const dashboard = require('../controllers/dashboard');

//helpers
const { isAuthenticated, isAdmin } = require('../helpers/auth');

router.get('/home', (req, res) =>{
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

router.get('/users', dashboard.getUsers);
router.post('/add/users', dashboard.addUsers);
router.get('/user_delete/:id', isAuthenticated, isAdmin, dashboard.deleteUser);
router.get('/user_edit/:id', isAuthenticated, isAdmin, dashboard.getUserForUpdate);
router.post('/user_edit/:id', dashboard.userEdit);

module.exports = router;