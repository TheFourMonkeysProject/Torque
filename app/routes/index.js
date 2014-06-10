var express = require('express');
var mongoose = require('mongoose');
var crypto = require('crypto');
var bcrypt = require('bcrypt')

var router = express.Router();


mongoose.connect('mongodb://107.170.99.156:27017/Torque-Data');//
var db = mongoose.connection;

var userSchema = new mongoose.Schema({
  username : String,
  password: String,
  firstName: String,
  lastName: String
});

// Compile a 'User' model using the userSchema as the structure.
// Mongoose also creates a MongoDB collection called 'User' for these documents.
var user = mongoose.model('user', userSchema);


/* GET home page. */
router.get('/', function(req, res) {
  res.render('home2.html');
});


/* GET home page. */
router.get('/login', function(req, res) {
  res.render('login');
});

/* GET home page. */
router.get('/myhome', function(req, res) {
  res.render('myhome');
});

/* GET home page. */
router.get('/intro-to-robotics', function(req, res) {
  res.render('intro-to-robotics');
});

/* GET home page. */
router.get('/intro-to-ev3', function(req, res) {
  res.render('intro-to-ev3');
});
/* GET home page. */
router.get('/intro-to-gears', function(req, res) {
  res.render('intro-to-gears');
});

/*
  Login to app or return to login page if pwd/user incorrect or not found. 
*/

router.post('/login', function(req, res){
  var select = {
    user : req.body.username,
    pass : crypto.createHash('sha256').update(req.body.password + conf.salt).digest('hex')
  };
   db.user.findOne(select, function(err, user) {
    if (!err && user) {
      // Found user register session
      req.session.user = user;
      res.redirect('/myhome');
    } else {
      // User not found lets go through login again
      res.redirect('/login');
    }
 
  });
});

module.exports = router;