const { Cursos } = require('../models');

async function courseOnline() {
    return await Cursos.find({"modo":"Online"}).limit(5);
}

async function coursePresencial() {
    return await Cursos.find({"modo":"Presencial"}).limit(5);
}

module.exports = async () =>{
    const result = await Promise.all([
        courseOnline(),
        coursePresencial()
    ]);

    return{
        online_m: result[0],
        presencial_m: result[1]
    }
}