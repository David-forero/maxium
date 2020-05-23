const { Router } = require('express');
const router = Router();
const { isAuthenticated } = require('../helpers/auth');

router.get('/home', isAuthenticated, (req, res) =>{
    res.render('dashboard/index');
})


module.exports = router;