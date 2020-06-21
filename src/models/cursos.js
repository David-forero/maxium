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
    image: {type: String, require: true},
    participants_count: {type: Number, require: true, default: 0},
    day: {type: String, require: true},
    created_at: {type: Date, default: Date.now}
});

cursoSchema.virtual('uniqueId')
    .get(function() {
        return this.image.replace(path.extname(this.image), '');
    });

module.exports = mongoose.model('cursos', cursoSchema);    