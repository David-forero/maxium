const path = require('path');
const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const cursoSchema = new Schema({
    title: {type: String, require: true},
    consultant: {type: String, require: true},
    modo: {type: String, require: true},
    description: {type: String, require: true},
    place: {type: String, require: true},
    timeFrom: {type: String, require: true},
    timeUntil: {type: String, require: true},
    price: {type: Number, require: true},
    imageURL: {type: String, require: true},
    public_img_id: {type: String, require: true},
    participants_count: {type: Number, require: true, default: 0},
    day: {type: String, require: true},
    created_at: {type: Date, default: Date.now}
});

module.exports = mongoose.model('cursos', cursoSchema);    