const fs = require('fs-extra');
const path = require('path');
const ctrl = {}
const { Cursos } = require('../models');

ctrl.index = async (req, res) =>{
    const courses = await Cursos.find().limit(3).sort({created_at: -1});
    let title = "Maxium - Bienvenidos";
    res.render('index', {title, courses});
}

ctrl.payment = async (req, res) => {
    const { id } = req.params;
    const course = await Cursos.findOne({image: {$regex: id}});;

    let title = "Formulario de pago";
    res.render('payment', {title, course});
}

ctrl.contacto = async (req, res) =>{

}

ctrl.removeCourse = async (req, res) =>{
    const image = await Cursos.findOne({image: {$regex: req.params.id}});
    if (image) {
        await fs.unlink(path.resolve('./src/public/uploads/' + image.image));
        await image.remove();

        
        req.flash('Success', 'Curso eliminado sastifactoriamente.')
        res.redirect('/dashboard/courses')
    }
}

// -------------------------INSTAPAGO----------------------------------

// import instapago from 'instapago';

// const i = instapago('<LLAVE-PRIVADA>', '<LLAVE-PÚBLICA>');

// i.pay({
//   amount: 60000,
//   description: 'Probando el módulo Instapago',
//   cardholder: 'Nombre Apellido',
//   cardholderid: 12345678,
//   cardnumber: 4111111111111111,
//   cvc: 123,
//   expirationdate: '10/2018',
//   statusid: 2,
//   ip: '127.0.0.1'
// }).then(respuesta => {
//   console.log(respuesta.data);
// }).catch(error => console.error(error));

module.exports = ctrl;