require('dotenv').config();

const express = require('express');
const app = express();
const passport = require('passport');
const cors = require('cors');

const connectDB = require('./config/db');
const { requireAuth } = require('./middleware/auth');

// =======================
// DB CONNECT
// =======================
connectDB();

// =======================
// MIDDLEWARES
// =======================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true
  })
);

// =======================
// PASSPORT (Stateless)
// =======================
app.use(passport.initialize());
// Session logic removed for JWT-only architecture

// =======================
// GOOGLE STRATEGIES
// =======================
require('./controllers/googleStudent');
require('./controllers/googleCompany');
require('./controllers/googleAdmin');

// =======================
// ROOT ROUTE
// =======================
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend is running successfully 🚀'
  });
});

// =======================
// ROUTES
// =======================
const logout = require('./routes/logout');
const searchStudent = require('./routes/admincontrollerroute/studentsea');
const searchCompany = require('./routes/companysea');
const companyVerification = require('./routes/admincontrollerroute/companyverification');
const adminProfile = require('./routes/admincontrollerroute/adminprofile');
const companyProfile = require('./routes/companycontrollerroute/companyprofile');
const jobRoutes = require('./routes/companycontrollerroute/jobroutes');
const studentProfile = require('./routes/studentroute/studentprofile');
const studentJobApplication = require('./routes/studentroute/jobapplication');

app.use('/api/admin/students', searchStudent);
app.use('/api/admin/companies', searchCompany);
app.use('/api/admin/companies', companyVerification);
app.use('/api/admin', adminProfile);

app.use('/api/company', companyProfile);
app.use('/api/company', jobRoutes);

app.use('/api/student', studentProfile);
app.use('/api/student', studentJobApplication);

// =======================
// AUTH CHECK (JWT-powered)
// =======================
app.get('/api/auth/me', requireAuth, (req, res) => {
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.emailId || req.user.email,
    role: req.user.role
  });
});

// =======================
// STUDENT GOOGLE LOGIN
// =======================
app.get(
  '/auth/google/student',
  passport.authenticate('google-student', { scope: ['profile', 'email'], session: false })
);

app.get('/auth/google/student/callback', (req, res, next) => {
  passport.authenticate('google-student', { session: false }, (err, user, info) => {
    if (err) {
      return res.redirect(`${process.env.CLIENT_URL}/Signin/student?error=server_error`);
    }

    if (!user) {
      return res.redirect(
        `${process.env.CLIENT_URL}/Signin/student?error=only_ycce_email_allowed`
      );
    }

    // Sign Stateless JWT
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { 
        _id: user._id, 
        role: 'student',
        name: user.name,
        email: user.emailId 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const userData = encodeURIComponent(JSON.stringify({
      _id: user._id,
      name: user.name,
      email: user.emailId,
      role: 'student'
    }));

    res.redirect(
      `${process.env.CLIENT_URL}/Signin/student?token=${token}&user=${userData}`
    );
  })(req, res, next);
});

// =======================
// COMPANY GOOGLE LOGIN
// =======================
app.get(
  '/auth/google/company',
  passport.authenticate('google-company', { scope: ['profile', 'email'], session: false })
);

app.get('/auth/google/company/callback', (req, res, next) => {
  passport.authenticate('google-company', { session: false }, (err, user) => {
    if (err || !user) return res.redirect('/');

    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { 
        _id: user._id, 
        role: 'company',
        name: user.name,
        email: user.emailId 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const userData = encodeURIComponent(
      JSON.stringify({
        _id: user._id,
        name: user.name,
        email: user.emailId,
        role: 'company'
      })
    );

    res.redirect(
      `${process.env.CLIENT_URL}/Signin/company?token=${token}&user=${userData}`
    );
  })(req, res, next);
});

// =======================
// ADMIN GOOGLE LOGIN
// =======================
app.get(
  '/auth/google/admin',
  passport.authenticate('google-admin', { scope: ['profile', 'email'], session: false })
);

app.get('/auth/google/admin/callback', (req, res, next) => {
  passport.authenticate('google-admin', { session: false }, (err, user) => {
    if (err || !user) return res.redirect('/');

    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { 
        _id: user._id, 
        role: 'admin',
        name: user.name,
        email: user.emailId 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const userData = encodeURIComponent(
      JSON.stringify({
        _id: user._id,
        name: user.name,
        email: user.emailId,
        role: 'admin'
      })
    );

    res.redirect(
      `${process.env.CLIENT_URL}/Signin/admin?token=${token}&user=${userData}`
    );
  })(req, res, next);
});

// =======================
// LOGOUT (Handled on frontend by clearing localStorage)
// =======================
app.use('/logout', logout);

// =======================
// START SERVER
// =======================
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () =>
    console.log(`🚀 Server running on http://localhost:${PORT}`)
  );
}

module.exports = app;
