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
    const data = req.body;
    const user = await User.findOne({email: email});
    const cedula = await User.findOne({ci: ci});
    var expresion = /\w+@+[a-z]+\.+[a-z]/;

    if (cedula) {
        return done(null, false, req.flash('Data', data), req.flash('Error', 'La cédula está en uso.'));
    }
    if (user) {
        return done(null, false, req.flash('Data', data), req.flash('Error', 'El correo ya está en uso.'));
    }
    if (name === "" || lastname === "" || phone === "" || ci === "" || address === "" || city === "" || zip === "" || country === "") {
        return done(null, false, req.flash('Data', data), req.flash('Error', 'Por favor, no dejar los campos vacios.'));
    }
    if (address.length > 100) {
        return done(null, false, req.flash('Data', data), req.flash('Error', 'No pasarse de 100 caracteres'));
    } 
    if (!expresion.test(email)) {
        return done(null, false, req.flash('Data', data), req.flash('Error', 'Formato de correo incorrecto.'));  
    }
    if (phone === !Number || ci === !Number) {
        return done(null, false, req.flash('Data', data), req.flash('Error', 'El teléfono y cedula deben ser numericos.'));
    } 
    if (password.length < 5) {
        return done(null, false, req.flash('Data', data), req.flash('Error', 'Contraseña debil.'));
    } 
    if (password != password2) {
        return done(null, false, req.flash('Data', data), req.flash('Error', 'Las contraseñas no son iguales.'));
    } else{
        if (ci.length < 4) {
            return done(null, false, req.flash('Data', data), req.flash('Error', 'Escriba bien su documento de identidad.'));
        }else{
            if (phone.length < 10) {
                return done(null, false, req.flash('Data', data), req.flash('Error', 'Escriba bien su numero de teléfono.'));
            }else{
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

                await newUser.save();
                done(null, newUser)
            }

        }
    }
}));

passport.use('local-signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) =>{
    const user = await User.findOne({email: email});
    if (!user) {
        return done(null, false, req.flash('Error', 'Usuario o Clave incorrecto.'));
    }if (!user.comparePassword(password)) { //comparamos la clave que inserto
        return done(null, false, req.flash('Error', 'Usuario o Clave incorrecto.'));
    }else{
        done(null, user)
    }
}));