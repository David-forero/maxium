const mongoose = require('mongoose');
const { database } = require('./keys');

mongoose.connect(database.URL,{
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(db => console.log('Database is connect'))
    .catch(err => console.log(err));