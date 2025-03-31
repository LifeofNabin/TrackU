const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: String,
    password: String,
    image: String // Store captured face as Base64
});

module.exports = mongoose.model('User', UserSchema);
