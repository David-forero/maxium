const mongoose = require('mongoose');
const { Schema } = mongoose;

const inscripcionSchema = new Schema({
    id_course: {type: String, required: true},
    title_course: {type: String, required: true},
    ci_user: {type: String, required: true},
    name_user: {type: String, required: true},
    lastname_user: {type: String, required: true},
    email: {type: String, required: true},
    id_voucher: {type: String, required: true}
})

module.exports = mongoose.model('inscripciones', inscripcionSchema);