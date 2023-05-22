// const User = require("../models/User");
const { Strategy, ExtractJwt } = require("passport-jwt");
const Admin = require('../models/User');
const Faculty = require('../models/Faculty');
const Student = require('../models/Student');

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "Route-Token",
};

module.exports = (passport) => {
    passport.use(
      new Strategy(options, async (payload, done) => {
        try {
          let user = null;  
          if (payload.role === 'admin') {
            user = await Admin.findById(payload.user_id);
          } else if (payload.role === 'faculty') {
            user = await Faculty.findById(payload.user_id);
          } else if (payload.role === 'student') {
            user = await Student.findById(payload.user_id);
          }
  
          if (user) {
            return done(null,[user,payload.role]);
          } else {
            return done(null, false);
          }
        } catch (err) {
          return done(null, false);
        }
      })
    );
  };
  