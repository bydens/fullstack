const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const keys = require('../config/keys');
const errorHandler = require('../utils/errorHandler');

module.exports.login = async (req, resp) => {
  const candidate = await User.findOne({email: req.body.email});

  if (candidate) {
    const passwordResult = bcrypt.compareSync(req.body.password, candidate.password);
    if (passwordResult) {
      const token = jwt.sign({
        email: candidate.email,
        userId: candidate._id
      }, keys.jwt, {expiresIn: 60 * 60});
      resp.status(200).json({
        token: `Bearer ${token}`
      })
    } else {
      resp.status(401).json({
        message: 'Password is not correct! Please, try again!'
      })
    }
  } else {
    resp.status(404).json({
      message: 'User not found!'
    })
  }

  // resp.status(200).json({
  //   login: {
  //     email: req.body.email,
  //     password: req.body.password
  //   }
  //   // login: req.body
  // })
};

module.exports.register = async (req, resp) => {
  const candidate = await User.findOne({email: req.body.email});

  if (candidate) {
    resp.status(409).json({
      message: 'Email used '
    })
  } else {
    const salt = bcrypt.genSaltSync(10);
    const password = req.body.password;
    const user = new User({
      email: req.body.email,
      password: bcrypt.hashSync(password, salt)
    });

    try {
      user.save();
      resp.status(201).json(user);
    } catch(e) {
      errorHandler(resp, e);
    }
  }

  // const  user = new User({
  //   email: req.body.email,
  //   password: req.body.password
  // });
  //
  // user.save().then(() => console.log('User created'));

  // resp.status(200).json({
  //   register: 'Register from controller'
  // })
};