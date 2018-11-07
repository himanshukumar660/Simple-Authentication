var mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");
var bcrypt = require("bcrypt");
var SALT_WORK_FACTOR = 10;

const uri = "mongodb+srv://himanshu:Himanshu103@cluster0-drmqc.mongodb.net/test?retryWrites=true"
mongoose.connect(uri, function(err, client) {
   if(err) {
        console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
   }
   console.log('Connected...');
   const collection = client.db("test").collection("devices");
   client.close();
});

var db = mongoose.connection;

var Schema = mongoose.Schema;

var userSchema = new Schema({
	name: {
		type: String
	},
	username: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true,
	},
  email: {
		type: String,
		required: true,
		unique: true
	}
});

userSchema.plugin(uniqueValidator);

var User = module.exports = mongoose.model("User", userSchema);

module.exports.createUser = function(newUser, callback) {
    bcrypt.hash(newUser.password, SALT_WORK_FACTOR, function(err, hash) {
      if (err) return err;
      newUser.password = hash;
      newUser.save(callback);
    });
}

module.exports.getUserByUsername = function(username, callback){
	User.findOne({username:username}, callback);
}

module.exports.comparePassword = function(candidatePassowrd, hash, callback){
    bcrypt.compare(candidatePassowrd, hash, function(err, isMatch){
        if(err) return callback(err);
        callback(null, isMatch);
    });
}

module.exports.getUserById = function(id, callback) {
	User.findOne({_id : id}).exec(callback);
};
