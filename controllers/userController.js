

exports.userProfile = async function (req, res, next){
  return res.status(200).json({message: `hello ${req.user.username}`})
};
