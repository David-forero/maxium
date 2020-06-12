const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const cursoSchema = ({
    title: {type: String, require: true},
    constultant: {type: String, require: true},
    modo: {type: String, require: true},
    description: {type: String, require: true},
    place: {type: String, require: true},
    timeFrom: {type: String, require: true},
    timeUntil: {type: String, require: true},
    price: {type: String, require: true},
    image: {type: String, require: true}
})