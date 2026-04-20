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
    try {
      let company = await Company.findOne({ googleId: profile.id });
      if (!company) {
        company = await Company.create({
          googleId: profile.id,
          name: profile.displayName,
          emailId: profile.emails[0].value,
          phoneNumber: '', // Will be filled later
          location: '', // Will be filled later
          contactPerson: '' // Will be filled later
        });
      }
      return done(null, company);
    } catch (err) {
      console.error('Google Company Auth Error:', err);
      return done(err, null);
    }
  }
));
