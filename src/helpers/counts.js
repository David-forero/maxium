const { Cursos, User } = require('../models');

async function courseAll() {
    return await Cursos.countDocuments();
}

async function courseOnline() {
    return await Cursos.find({'modo': 'Online'}).countDocuments();
}

async function coursePresencial() {
    return await Cursos.find({'modo': 'Presencial'}).countDocuments();
}

async function usersAll() {
    return await User.find().countDocuments();
}

async function venecosAll() {
    return await User.find({"country": "Venezuela"}).countDocuments();
}

async function panamaAll() {
    return await User.find({"country": "Panama"}).countDocuments();
}

module.exports = async () =>{
    const result = await Promise.all([
        courseAll(),
        courseOnline(),
        coursePresencial(),
        usersAll(),
        venecosAll(),
        panamaAll(),
    ]);

    return{
        courses: result[0],
        online: result[1],
        presencial: result[2],
        users: result[3],
        venezuela: result[4],
        panama: result[5]
    }
}