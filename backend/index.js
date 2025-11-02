require('dotenv').config();
const express = require('express');
const app = express();
const passport = require('passport');
const session = require('express-session');
const mongoose = require('mongoose');
const main = require('./config/db');

require('./controllers/googleStudent');
require('./controllers/googleCompany');
require('./controllers/googleAdmin');
const logout = require('./routes/logout');
const searchStudent = require('./routes/admincontrollerroute/studentsea');
const searchCompany = require('./routes/companysea');
const companyVerification = require('./routes/admincontrollerroute/companyverification');
const jobRoutes = require('./routes/companyaddjob/jobRoutes');


const port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

main();
// const cors = require('cors');
// app.use(cors());

app.use(session({
  secret: 'mysecret',
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

// Serialize / Deserialize user
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((user, done) => done(null, user));



// Routes
app.use('/api/students', searchStudent);
app.use('/api/companies', searchCompany);
app.use('/api/companies', companyVerification);
app.use('/api/jobs', jobRoutes);


// app.get('/', (req, res) => {
//   res.send(`
//     <h2>Login with Google</h2>
//     <a href="/auth/google/student">Login as Student</a><br/>
//     <a href="/auth/google/company">Login as Company</a><br/>
//     <a href="/auth/google/admin">Login as Admin</a>
//   `);
// });


// ========== STUDENT LOGIN ==========
app.get('/auth/google/student',
  passport.authenticate('google-student', { scope: ['profile', 'email'] })
);

app.get('/auth/google/student/callback',
  passport.authenticate('google-student', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/student/profile');
  }
);

app.get('/student/profile', (req, res) => {
  if (!req.isAuthenticated()) return res.redirect('/');
  res.send('<h1>Welcome Student!</h1><a href="/logout">Logout</a>');
});


// ========== COMPANY LOGIN ==========
app.get('/auth/google/company',
  passport.authenticate('google-company', { scope: ['profile', 'email'] })
);

app.get('/auth/google/company/callback',
  passport.authenticate('google-company', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/company/profile');
  }
);

app.get('/company/profile', (req, res) => {
  if (!req.isAuthenticated()) return res.redirect('/');
  res.send('<h1>Welcome Company!</h1><a href="/logout">Logout</a>');
});


// ========== ADMIN LOGIN ==========
app.get('/auth/google/admin',
  passport.authenticate('google-admin', { scope: ['profile', 'email'] })
);

app.get('/auth/google/admin/callback',
  passport.authenticate('google-admin', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/admin/profile');
  }
);

app.get('/admin/profile', (req, res) => {
  if (!req.isAuthenticated()) return res.redirect('/');
  res.send('<h1>Welcome Admin!</h1><a href="/logout">Logout</a>');
});


// ----------------------
// Logout Route
// ----------------------
app.use('/logout', logout);

// ----------------------
// Start Server
// ----------------------
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
