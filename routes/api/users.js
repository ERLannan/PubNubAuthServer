const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const Gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

//load input validation
const validationRegisterInput = require('../../validation/register');
const validationLoginInput = require('../../validation/login');

//load PubNub Manager
const pnManager = require('../../pubnub/pubnub-manager');

//@route      GET api/Users/register
//@desc       Register user
//@access     Public
router.post('/register', (req, res) => {
  const { errors, isValid } = validationRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = 'Email already exists';
      return res.status(400).json({ errors });
    } else {
      const avatar = Gravatar.url(req.body.email, {
        s: '200', //size
        r: 'pg', //rating
        d: 'mm' //default image
      });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });

      //Hash the users password before saving it to the database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

//@route      GET api/Users/login
//@desc       Login user / Return JWT
//@access     Public
router.post('/login', (req, res) => {
  const { errors, isValid } = validationLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  //find user by email
  User.findOne({ email }).then(user => {
    if (!user) {
      errors.email = 'User not found';
      return res.status('404').json(errors);
    }

    //check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        //User matched - sign token
        const payload = {
          id: user.id,
          name: user.name,
          avatar: user.avatar
        };
        jwt.sign(payload, keys.secret, { expiresIn: 1440 }, (err, token) => {
          const bearerToken = 'Bearer ' + token;
          pnManager.authorizeToken(bearerToken);

          res.json({
            success: true,
            token: bearerToken
          });
        });
      } else {
        errors.password = 'Password is incorrect';
        return res.status('400').json(password);
      }
    });
  });
});

//@route      GET api/Users/current
//@desc       Return current user
//@access     Public
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    return res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);

module.exports = router;
