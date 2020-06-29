const { Router } = require('express');
const router = Router();

//controllers
const dashboard = require('../controllers/dashboard');

//helpers
const { isAuthenticated, isAdmin } = require('../helpers/auth');

router.get('/home', isAuthenticated, isAdmin, dashboard.getStadis);

router.get('/courses',  isAuthenticated, isAdmin, dashboard.getCourses);
router.post('/course/add',  isAuthenticated, isAdmin, dashboard.addCourse);
router.get('/course/edit/:id', isAuthenticated, isAdmin, dashboard.getCourseForUpdate);
router.post('/course/edit/:id', isAuthenticated, isAdmin, dashboard.courseEdit);

router.get('/news', isAuthenticated, isAdmin, (req, res) =>{
    res.render('dashboard/index');
})

router.get('/events', isAuthenticated, isAdmin, (req, res) =>{
    res.render('dashboard/index');
})

router.get('/users', isAuthenticated, isAdmin, dashboard.getUsers);
router.post('/add/users', isAuthenticated, isAdmin, dashboard.addUsers);
router.get('/user_delete/:id', isAuthenticated, isAdmin, dashboard.deleteUser);
router.get('/user_edit/:id', isAuthenticated, isAdmin, dashboard.getUserForUpdate);
router.post('/user_edit/:id', isAuthenticated, isAdmin, dashboard.userEdit);

module.exports = router;