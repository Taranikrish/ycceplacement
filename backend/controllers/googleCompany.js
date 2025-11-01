const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Company = require('../models/company');
require('dotenv').config();

passport.use('google-company', new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.COMPANY_CALLBACK
  },
  async (accessToken, refreshToken, profile, done) => {
    let company = await Company.findOne({ googleId: profile.id });
    if (!company) {
      company = await Company.create({
        googleId: profile.id,
        name: profile.displayName,
        emailId: profile.emails[0].value
      });
    }
    return done(null, company);
  }
));
