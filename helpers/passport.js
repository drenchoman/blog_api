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
        console.log(err)
        return done(err);}
      if (!user){
        console.log(user)
        return done(null, false, {
          message: 'Incorrect Username'
        }); }
      bcrypt.compare(password, user.password, (err, res) => {
        if (res){
          console.log(user)
          return done(null, user)
        } else {
          console.log('wrong pass')
          return done(null, false, { message: 'Incorrect Password'});
        };
      })
    })
  })
);

// JWT Strategy to check jsonwebtoken

passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_KEY
},(jwtPayload, done) => {
  console.log(jwtPayload.user.username)
  User.findOne({ username: jwtPayload.user.username }, (err, user) =>{
    if (err){
      console.log('error')
      return done(err, false);
    }
    if (user){
      console.log('success')
      return done(null, user)
    } else {
      return done(null, false);
    }
  })

}
))
