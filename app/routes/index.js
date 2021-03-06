var express = require('express');
var mongoose = require('mongoose');
var crypto = require('crypto');
var bcrypt = require('bcrypt')


var passport = require('passport');
var stormpath = require('stormpath');

var router = express.Router();


mongoose.connect('mongodb://107.170.99.156:27017/Torque-Data');//
var db = mongoose.connection;
var passport = require('passport');
var stormpath = require('stormpath');
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

  var email = 'mdl2066@yahoo.com';
  // Initialize our Stormpath client.
  var apiKey = new stormpath.ApiKey(
    process.env['STORMPATH_API_KEY_ID'],
    process.env['STORMPATH_API_KEY_SECRET']
  );
  var spClient = new stormpath.Client({ apiKey: apiKey });

  // Grab our app, then attempt to create this user's account.
  var app = spClient.getAccount(process.env['STORMPATH_APP_HREF'], function(err, app) {
    if (err) throw err;

    app.getAccount({
      email: username
    }, function (err, createdAccount) {
      if (err) {
        return res.render('register', {'title': 'Register', error: err.userMessage });
      } else {
        passport.authenticate('stormpath')(req, res, function () {
          return res.redirect('/myhome');
        });
      }
    });

  });
  res.render('home2.html');
});


/* GET home page. router.get('/login', function(req, res) {
  res.render('login');
});
*/
/* GET home page. */
router.get('/myhome', function(req, res) {
  if (!req.user || req.user.status !== 'ENABLED') {
    return res.redirect('/login');
  }

  res.render('myhome', {
    title: 'Home',
    user: req.user,
    }
  );
  //res.render('myhome');
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
*/
// Render the login page.
router.get('/login', function(req, res) {
  res.render('login', { title: 'Login', error: req.flash('error')[0] });
});


// Logout the user, then redirect to the home page.
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});


// Authenticate a user.
router.post(
  '/login',
  passport.authenticate(
    'stormpath',
    {
      successRedirect: '/myhome',
      failureRedirect: '/login',
      failureFlash: 'Invalid email or password.',
    }
  )
);



// Render the registration page.
router.get('/register', function(req, res) {
  res.render('register', { title: 'Register', error: req.flash('error')[0] });
});


// Register a new user to Stormpath.
router.post('/register', function(req, res) {

  var username = req.body.username;
  var password = req.body.password;
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;

  // Grab user fields.
  if (!username || !password) {
    return res.render('register', { title: 'Register', error: 'Email and password required.' });
  }

  // Initialize our Stormpath client.
  var apiKey = new stormpath.ApiKey(
    process.env['STORMPATH_API_KEY_ID'],
    process.env['STORMPATH_API_KEY_SECRET']
  );
  var spClient = new stormpath.Client({ apiKey: apiKey });

  // Grab our app, then attempt to create this user's account.
  var app = spClient.getApplication(process.env['STORMPATH_APP_HREF'], function(err, app) {
    if (err) throw err;

    app.createAccount({
      givenName: firstname,
      surname: lastname,
      username: username,
      email: username,
      password: password,
    }, function (err, createdAccount) {
      if (err) {
        return res.render('register', {'title': 'Register', error: err.userMessage });
      } else {
        passport.authenticate('stormpath')(req, res, function () {
          return res.redirect('/myhome');
        });
      }
    });

  });

});


module.exports = router;
