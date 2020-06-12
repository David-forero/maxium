const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const { User } = require('../models');

passport.serializeUser((user, done) => { //ayuda para navegar todas las vistas sin necesidad de loguearse a cada rato
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {//esto ayuda para comprobar si existe el usuario
    const user = await User.findById(id);
    done(null, user);
});

passport.use('local-signup', new LocalStrategy({ //aca le damos los datos del cliente que se va a loguear
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true //esto es necesario para obtener los demas datos 
}, async (req, email, password, done) => {
    const { name, lastname, phone, ci, address, city, zip, country, password2 } = req.body;
    const user = await User.findOne({email: email});
    const cedula = await User.findOne({ci: ci});
    var expresion = /\w+@+[a-z]+\.+[a-z]/;

    if (cedula) {
        return done(null, false, req.flash('Error', 'La CI está en uso.'));
    }
    if (user) {
        return done(null, false, req.flash('Error', 'El correo ya está en uso.'));
    }
    if (name === "" || lastname === "" || phone === "" || ci === "" || address === "" || city === "" || zip === "" || country === "") {
        return done(null, false, req.flash('Error', 'Por favor, no dejar los campos vacios.'));
    }
    if (!expresion.test(email)) {
        return done(null, false, req.flash('Error', 'Formato de correo incorrecto.'));
    }
    if (phone === !Number || ci === !Number) {
        return done(null, false, req.flash('Error', 'El teléfono y cedula deben ser numericos.'));
    }  
    if (password != password2) {
        return done(null, false, req.flash('Error', 'Las contraseñas no son iguales.'));
    } else{
        const newUser = new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);

        newUser.name = name;
        newUser.lastname = lastname;
        newUser.phone = phone;
        newUser.ci = ci;
        newUser.address = address;
        newUser.city = city;
        newUser.zip = zip;
        newUser.country = country;

        console.log(newUser);

        await newUser.save();
        done(null, newUser)
    }
}));

passport.use('local-signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) =>{
    const user = await User.findOne({email: email});
    if (!user) {
        return done(null, false, req.flash('Error', 'Usuario no encontrado.'));
    }if (!user.comparePassword(password)) { //comparamos la clave que inserto
        return done(null, false, req.flash('Error', 'Contraseña incorrecta.'));
    }else{
        done(null, user)
    }
}));