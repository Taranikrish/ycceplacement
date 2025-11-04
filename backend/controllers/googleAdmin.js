const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Admin = require('../models/admin');
require('dotenv').config();

passport.use('google-admin', new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.ADMIN_CALLBACK
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let admin = await Admin.findOne({ googleId: profile.id });
      if (!admin) {
        admin = await Admin.create({
          googleId: profile.id,
          name: profile.displayName,
          emailId: profile.emails[0].value,
        });
      }
      return done(null, admin);
    } catch (err) {
      console.error('Google Admin Auth Error:', err);
      return done(err, null);
    }
  }
));
