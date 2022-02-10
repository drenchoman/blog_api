const jwt = require('jsonwebtoken');
const passport = require('passport')
const { body, validationResult } = require('express-validator')
const bcrypt= require('bcryptjs');
const Users = require('../models/users')

exports.login = async function (req, res, next){
  try{
  passport.authenticate('local', {session: false}, (err, user, info) =>{
    if (err || !user){
      const error = new Error('User does not exist')
      return res.status(403).json({
        info
      })
    }
  req.login(user, {session: false}, (err) => {
    if (err){
      next(err);
    }
    // create token
    const body = {_id: user._id, username: user.username, admin: user.admin}
    const token = jwt.sign({user: body}, process.env.SECRET_KEY, {expiresIn: '1d'});

    return res.status(200).json({body, token});

  });
}) (req, res, next);
} catch (err){
  res.status(403).json({
    err
  })
}
};

exports.logout = (req, res, next) => {
  req.logout();
  
};

exports.register = [
body('username').trim().isLength({min:2})
  .custom( async(username) => {
    try {
      const usernameExists = await Users.findOne({username: username});
      if (usernameExists){
        throw new Error('Username already exists');
      }
    } catch (err){
      throw new Error(err);
    }
  }),
body('password').isLength({min:6}).withMessage('Password must be 6 characters long'),
body('confirmPassword')
  .custom( async( value, {req}) => {
    if (value !== req.body.password){
      throw new Error('Password confirmation does not match password');
    }
    return true
  }),

async(req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()){
    return res.status(403).json({
      username: req.body.username,
      errors: errors.array()
    });
  }
    bcrypt.hash(req.body.password, 12, (err, hashedPassword) => {
      const user= new Users({
        username:req.body.username,
        password: hashedPassword,
        admin: false,
        member: true
      })
      user.save( err => {
        if (err){
          return next(err)
        }
        res.status(200).json({
          message: 'User created successfully',
        })
      })
    })
    (req, res, next)
    }
]
