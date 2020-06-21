const { Cursos } = require('../models');
const { Cursos } = require('../models');

async function courseCounter() {
    return await Cursos.countDocuments();
}

module.exports = async () =>{
    const result = await Promise.all([
        courseCounter()
    ]);

    return{
        courses: result[0]
    }
}