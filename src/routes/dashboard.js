const { Router } = require('express');
const router = Router();
//const { User } = require('../models/index')

//helpers
const { isAuthenticated, isAdmin } = require('../helpers/auth');

router.get('/home', isAuthenticated, isAdmin, (req, res) =>{
    res.render('dashboard/index');
    console.log('algo pasa')
})

module.exports = router;