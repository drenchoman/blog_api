const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/users')
const passportJWT = require('passport-jwt');
const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;

// Local strategy for Login

passport.use(new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err){
        return done(err);}
      if (!user){
        return done(null, false, {
          message: 'Incorrect Username or Username does not exist'
        }); }
      bcrypt.compare(password, user.password, (err, res) => {
        if (res){
          return done(null, user)
        } else {
          return done(null, false, { message: 'Incorrect Password'});
        };
      })
    })
  })
);


// JWT Strategy to check jsonwebtoken

// passport.use(new JwtStrategy({
//   jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//   secretOrKey: process.env.SECRET_KEY
// },(jwtPayload, done) => {
//   console.log(jwtPayload.body.username)
//   User.findOne({ username: jwtPayload.body.username }, (err, user) =>{
//     if (err){
//       console.log('error')
//       return done(err, false);
//     }
//     if (user){
//       console.log('success')
//       return done(null, user)
//     } else {
//       return done(null, false);
//     }
//   })
//
// }
// ))

passport.use(
  new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_KEY
  },
  async (token, done) => {
    try {
      console.log(token)
      return done(null, token.user)
    } catch(error){
      return done(error)
      }
    }
  )
);
