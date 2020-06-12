//modules
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const engine = require('ejs-mate');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const moment = require('moment');

//init
const app = express();
require('./database');
require('./config/passport');

//settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');

//middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(session({
    secret: 'nightcode',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) =>{
    app.locals.error = req.flash('Error');
    app.locals.user = req.user;
    app.locals.moment = moment;
    next();
})

//routes
app.use(require('./routes/index'));
app.use('/dashboard', require('./routes/dashboard'));

//static files
app.use(express.static(path.join(__dirname, 'public')));

//The 404 Route
app.get('*', function(req, res){
    res.send('what???', 404);
});

//server listening
app.listen(app.get('port'), () =>{
    console.log('Server on port', app.get('port'));
})
