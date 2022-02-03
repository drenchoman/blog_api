const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const bcrypt= require('bcryptjs');
const Users = require('../models/users')
const passport = require('passport')

exports.allUsers = async function(req, res, next){
  try{
    let users = await Users.find({});
    return res.status(200).json({users})
  }
  catch(err){
    return res.status(400).json({message: 'No users'})
  }
};

exports.login = async function (req, res, next){
  try{
  passport.authenticate('local', {session: false}, (err, user, info) =>{
    if (err || !user){
      return res.status(400).json({
        info,
        user
      })
    }
  req.login(user, {session: false}, (err) => {
    if (err){
      return res.json(err);
    }
    // create token

    const token = jwt.sign({user}, process.env.SECRET_KEY, {expiresIn: '60s'});
    return res.json({user, token});

  });
}) (req, res, next);

} catch(err){
  res.status(400).json({err})
}
};


exports.register = async function(req, res, next) {
try{
  let userExists = await Users.findOne({username: req.body.username});
  console.log(userExists)
  console.log(req.body)
  if(userExists !== null){
    return res.status(200).json({
      message: 'User exists'
    });
  }
  bcrypt.hash(req.body.password, 12, (err, hashedPassword) =>{
    const user = new Users({
      username: req.body.username,
      password: hashedPassword,
      admin: false,
      member: true
    })
    user.save(err => {
      if (err) {
        return res.status(400).json({
          err
        });
      }
      return res.status(200).json({
        message: 'User created successfully'
      });
    })
  })
} catch(err){
  res.status(400).json({err, username: req.body.username, password: req.body.password})
}
};
