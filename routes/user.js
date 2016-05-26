var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var _ = require('lodash/core');

mongoose.connect('mongodb://localhost:27017/myapp');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

var userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  emailAddress: String
});
var User = mongoose.model('User', userSchema);

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* GET users listing. */
router.get('/new', function(req, res, next) {

  var user = new User();

  res.render('edit', {
    title: '',
    user: user
  });
});

router.get('/edit/:emailAddress', function(req, res, next) {

  console.log('looking for ', req.params.emailAddress);

  User.findOne({
    emailAddress: req.params.emailAddress
  }, function(err, user) {
    if (err) {
      res.redirect(404, '/user/not-found')
    }

    console.log('user found', user.toJSON());

    res.render('edit', {
      title: '',
      user: user
    });
  });
});

var save = function(req, res, next) {

  console.log('user pre saving', req.body);

  User.findOne({
    emailAddress: req.params.emailAddress
  }, function(err, user) {
    if (err) {
      res.redirect(404, '/user/not-found')
    }

    if (user == null) {
      user = new User();
    }

    _.extend(user, {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      emailAddress: req.body.emailAddress,
    });

    console.log('user yet not saved', user.toJSON());

    user.save(function(err, user) {
      if (err) {
        return console.error(err);
      }

      console.log('user saved!', user.toJSON());

      res.redirect('/user/edit/' + user.emailAddress);
    });

  });
};

router.post('/save', save);
router.put('/save', save);

module.exports = router;