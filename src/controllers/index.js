const fs = require('fs-extra');
const path = require('path');
const instapago = require('instapago');
const ip = require('ip');

const ctrl = {}
const { Cursos, Inscripciones } = require('../models');
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
    const course = await Cursos.findOne({image: {$regex: id}});
    const userCi = req.user.ci;

    //const inscripcion es para recorrer todos los que estan inscritos
    const inscripciones = await Inscripciones.find({id_course: {$regex: id}});
    //const inscrito es para validar si el usuario ya se ha inscrito
    const inscrito = await Inscripciones.findOne({ci_user: userCi, id_course: id})
    const menuCourse = await MenuCourse();

    let title = "Formulario de pago";
    res.render('payment', {title, course, menuCourse, inscripciones, inscrito});
}

ctrl.paymentInsta = async (req, res)=>{
    const { id } = req.params;
    const data = req.body; //para devolver los datos
    const { cardName, cardNumber, month, year, cvv } = req.body;

    const course = await Cursos.findOne({image: {$regex: id}});
    const courses = await Cursos.find().limit(3); //para imprimir los cursos 
    const menuCourse = await MenuCourse();
    let title = "Pago exitoso";

    async function inscripcion(data) {
        course.participants_count = course.participants_count + 1;
        await course.save();
        //User data
        const newInscripcion = new Inscripciones({
            id_course: course.uniqueId,
            title_course: course.title,
            ci_user: req.user.ci,
            name_user: req.user.name,
            lastname_user: req.user.lastname,
            email: req.user.email,
            id_voucher: data
        });
        
        await newInscripcion.save();
    }

    //card test: 4111111111111111
    
    if (cardName === "" || cardNumber === "" || month === "" || year === "" || cvv === "") {
        req.flash('Data', data); 
        req.flash('Error', 'Por favor, no dejar los campos vacios.');
        res.redirect(`/payment/${id}`);
    }
    if (cardNumber === !Number || month === !Number || year === !Number || cvv === !Number) {
        req.flash('Data', data); 
        req.flash('Error', 'Compruebe que los campos sean numericos.');
        res.redirect(`/payment/${id}`);
    }
    if (cardNumber.length > 16 || cardNumber.length < 16){
        req.flash('Data', data); 
        req.flash('Error', 'Verifique bien su numero de tarjeta.');
        res.redirect(`/payment/${id}`);
    }
    if (cvv.length > 3 || cvv.length < 3){
        req.flash('Data', data); 
        req.flash('Error', 'Verifique bien el campo cvv.');
        res.redirect(`/payment/${id}`);
    } else {
        i.pay({
            amount: course.price,
            description: course.title,
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

            const voucher = respuesta.data;         
            res.render('compra_exi', {courses, menuCourse, title, voucher})
            inscripcion(respuesta.data.id); 

        }).catch(error => {
            req.flash('Data', data); 
            req.flash('Error', error);
            res.redirect(`/payment/${id}`);
        });
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
            
            await Inscripciones.find({id_course: image.uniqueId}).remove();
            await fs.unlink(path.resolve('./src/public/uploads/' + image.image));
            await image.remove();
            
            req.flash('Success', 'Curso eliminado sastifactoriamente.')
            res.redirect('/dashboard/courses');
        }
    
}

module.exports = ctrl;