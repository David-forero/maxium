const { Cursos } = require('../models');

async function courseAll() {
    return await Cursos.countDocuments();
}

async function courseOnline() {
    return await Cursos.find({'modo': 'Online'}).countDocuments();
}

async function coursePresencial() {
    return await Cursos.find({'modo': 'Presencial'}).countDocuments();
}

module.exports = async () =>{
    const result = await Promise.all([
        courseAll(),
        courseOnline(),
        coursePresencial()
    ]);

    return{
        courses: result[0],
        online: result[1],
        presencial: result[2]
    }
}