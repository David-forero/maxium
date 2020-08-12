const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Schema } = mongoose;

const UsersSchema = new Schema({
    name: {type: String},
    lastname: {type: String},
    phone: {type: Number},
    ci: {type: Number, unique: true},
    email: {type: String, unique: true},
    password: {type: String},
    address: {type: String},
    city: {type: String},
    zip: {type: String},
    country: {type: String},
    role: {type: String, enum: ['admin', 'mod', 'helper', 'user'], default: 'user'},
    created_at: { type: Date, default: Date.now },
});

UsersSchema.methods.encryptPassword = (password) =>{
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

UsersSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('Users', UsersSchema);