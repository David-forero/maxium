const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Schema } = mongoose;

const UsersSchema = new Schema({
    name: {type: String, required: true},
    lastname: {type: String, required: true},
    phone: {type: Number, required: true},
    ci: {type: Number, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    address: {type: String, required: true},
    city: {type: String, required: true},
    zip: {type: String, required: true},
    country: {type: String, required: true},
});

UsersSchema.methods.encryptPassword = (password) =>{
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

UsersSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('Users', UsersSchema);