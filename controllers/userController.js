const Users = require('../models/users')

exports.userProfile = async function (req, res, next){
  return res.status(200).json({message: `hello ${req.user.username}`})
};

exports.allUsers = async function(req, res, next){
  try{
    let users = await Users.find({}, {username: 1});
    return res.status(200).json({users})
  }
  catch(err){
    return res.status(400).json({message: 'No users'})
  }
};

exports.userProfile = async function(req, res, next){
  try{
    let user = await Users.find({_id: req.params.userid}, {username:1})
    return res.status(200).json({user})
  }
  catch(err){
    return res.status(400).json({message: 'No User with that Id'})
  }
}
