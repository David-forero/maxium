const fs = require('fs-extra');
const path = require('path');
const instapago = require('instapago');
const ip = require('ip');

const ctrl = {}
const { Cursos } = require('../models');
const i = instapago(process.env.INSTA_PUBLIC_KEY, process.env.INSTA_PRIVATE_KEY);


//Helpers
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

ctrl.paymentInsta = async (req, res)=>{
    const { id } = req.params;
    const { cardName, cardNumber, month, year, cvv } = req.body;
    const course = await Cursos.findOne({image: {$regex: id}});
    //4111111111111111
    i.pay({
        amount: course.price,
        description: course.description,
        cardholder: cardName,
        cardholderid: req.user.ci,
        cardnumber: cardNumber,
        cvc: cvv,
        expirationdate: `${month}/${year}`,
        statusid: 2,
        address: req.user.address,
        zipcode: req.user.zip,
        ip: ip.address()
        }).then(respuesta => {
        console.log(respuesta.data.id);
        res.send(respuesta.data.voucher)
    }).catch(error => {
        res.send('ocurrio un error')
    });

    function voucher(data) {
        i.view({
            id: data
          }).then(respuesta => {
            console.log(respuesta.data);
          }).catch(error => console.error(error));
    }
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

module.exports = ctrl;