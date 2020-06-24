const fs = require('fs-extra');
const path = require('path');
const ctrl = {}
const { Cursos } = require('../models');

const MenuCourse = require('../helpers/menu_course');
const Counts = require('../helpers/counts');

ctrl.index = async (req, res) =>{
    const courses = await Cursos.find().limit(3).sort({created_at: -1});
    const menuCourse = await MenuCourse();

    let title = "Maxium - Bienvenidos";
    res.render('index', {title, courses, menuCourse});
}

ctrl.payment = async (req, res) => {
    const { id } = req.params;
    const course = await Cursos.findOne({image: {$regex: id}});;
    const menuCourse = await MenuCourse();

    let title = "Formulario de pago";
    res.render('payment', {title, course, menuCourse});
}

ctrl.capacitaciones = async (req, res, next) => {
    let tags = req.params.tag;
    let paginas = 12;
    let page = req.params.page || 1;

    let title = "Capacitaciones";
    const menuCourse = await MenuCourse();
    const counts = await Counts();

    switch (tags) {
        case 'online':
            let onl = "Online";
            tagsFunction(onl);
        break;
        case 'todos':
            Cursos
                .find({})//que busque todo los datos
                .skip((paginas * page) - paginas) //formula necesaria para que calcule los datos
                .limit(paginas) //cuantos datos quieres por pagina
                .exec((err, courses) => {//ejectuo la consulta
                    Cursos.count((err, count) =>{
                        if (err) return next(err);
                        res.render('capacitaciones', {
                            title,
                            counts,
                            courses,
                            menuCourse,
                            current: page,
                            pages: Math.ceil(count / paginas)
                        });
                    });
                }); 
        break;
        case 'presencial':
            let pres = "Presencial";
            tagsFunction(pres);
        break;
        default: 
            res.status(404).render('404');
            break;
    }

    async function tagsFunction(data) {
        await Cursos
        .find({"modo": data})//que busque todo los datos
        .skip((paginas * page) - paginas) //formula necesaria para que calcule los datos
        .limit(paginas) //cuantos datos quieres por pagina
        .exec((err, courses) => {//ejectuo la consulta
            Cursos.count((err, count) =>{
                if (err) return next(err);
                res.render('capacitaciones', {
                    title,
                    counts,
                    courses,
                    menuCourse,
                    current: page,
                    pages: Math.ceil(count / paginas)
                });
            });
        }); 
    }

}

ctrl.contacto = async (req, res) =>{

}

ctrl.removeCourse = async (req, res) =>{
    const image = await Cursos.findOne({image: {$regex: req.params.id}});
    if (image) {
        await fs.unlink(path.resolve('./src/public/uploads/' + image.image));
        await image.remove();

        
        req.flash('Success', 'Curso eliminado sastifactoriamente.')
        res.redirect('/dashboard/courses');
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