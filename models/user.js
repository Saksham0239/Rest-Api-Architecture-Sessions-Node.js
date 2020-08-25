var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const passportLocalMongoose=require('passport-local-mongoose');

var User = new Schema({

    admin:   {
        type: Boolean,
        default: false
    }
});

User.plugin(passportLocalMongoose);//username and password along with hashing and salting are automatically added to the user schema 
// //along with various helpful methods

module.exports = mongoose.model('User', User);