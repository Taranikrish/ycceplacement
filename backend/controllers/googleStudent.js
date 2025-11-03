const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Student = require('../models/student'); // your Mongoose model
require('dotenv').config();

passport.use('google-student', new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.STUDENT_CALLBACK
},
async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails[0].value;
        const domain = email.split('@')[1];

        if (domain !== 'ycce.in') {
            console.log(` Unauthorized login attempt: ${email}`);
            return done(null, false, { message: 'Only college emails allowed' });
        }

        let user = await Student.findOne({ googleId: profile.id, emailId: email });
        if (!user) {
            user = new Student({
                googleId: profile.id,
                name: profile.displayName,
                emailId: profile.emails[0].value,
                rollNumber: email.split('@')[0], // Extract roll number from email
                picture: profile.photos[0].value
            });
            await user.save();
        }
        return done(null, user);

    } catch (err) {
        console.error('Google Student Auth Error:', err);
        return done(err, null);
    }
}));
