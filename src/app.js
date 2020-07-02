//Modules
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const engine = require('ejs-mate');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const moment = require('moment');
const multer = require('multer');

// Init
const app = express();
require('dotenv').config();
require('./database');
require('./config/passport');

// Settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');

// Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(multer({dest: path.join(__dirname, '/public/uploads/temp')}).single('image'));
app.use(session({
    secret: 'nightcode',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Global variables
app.use((req, res, next) =>{
    app.locals.error = req.flash('Error');
    app.locals.data = req.flash('Data');
    app.locals.success = req.flash('Success');
    app.locals.user = req.user;
    app.locals.moment = moment;
    next();
})

// Routes
app.use(require('./routes/index.routes'));
app.use('/dashboard', require('./routes/dashboard.routes'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// The 404 no found
app.get('*', function(req, res){
    res.status(404).render('404');
});

// Server Start
app.listen(app.get('port'), () =>{
    console.log('Server on port', app.get('port'));
})
