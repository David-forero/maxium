const mongoose = require('mongoose');
const { Schema } = mongoose;

const adminSchema = new Schema({
    name: {type: String},
    password: {type: String},
    rol: {type: String}
});

module.exports = mongoose.model('Admins', adminSchema);