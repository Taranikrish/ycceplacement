require('dotenv').config();
const express = require('express');
const app = express();
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const connectDB  = require('./config/db');
const { requireAuth } = require('./middleware/auth');

require('./controllers/googleStudent');
require('./controllers/googleCompany');
require('./controllers/googleAdmin');
const logout = require('./routes/logout');
const searchStudent = require('./routes/admincontrollerroute/studentsea');
const searchCompany = require('./routes/companysea');
const companyVerification = require('./routes/admincontrollerroute/companyverification');
const adminProfile = require('./routes/admincontrollerroute/adminprofile');
const companyProfile = require('./routes/companycontrollerroute/companyprofile');
const jobRoutes = require('./routes/companycontrollerroute/jobroutes');
const studentProfile = require('./routes/studentroute/studentprofile');
const studentJobApplication = require('./routes/studentroute/jobapplication');

const port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB ();
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true
}));

app.use(session({
  secret: 'mysecret',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI || 'mongodb://localhost:27017/yccemplacement',
    collectionName: 'sessions'
  }),
  cookie: {
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// Serialize / Deserialize user
passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  try {
    // Try to find user in different models
    let user = await require('./models/admin').findById(id);
    if (!user) user = await require('./models/company').findById(id);
    if (!user) user = await require('./models/student').findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});


// Routes
app.use('/api/admin/students', searchStudent);
app.use('/api/admin/companies', searchCompany);
app.use('/api/admin/companies', companyVerification);
app.use('/api/admin', adminProfile);
app.use('/api/company', companyProfile);
app.use('/api/company', jobRoutes);
app.use('/api/student', studentProfile);
app.use('/api/student', studentJobApplication);

// Auth check endpoint
app.get('/api/auth/me', requireAuth, (req, res) => {
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.emailId,
    role: req.user.role
  });
});




// ========== STUDENT LOGIN ==========
app.get('/auth/google/student',
  passport.authenticate('google-student', { scope: ['profile', 'email'] })
);

app.get('/auth/google/student/callback',
  passport.authenticate('google-student', { failureRedirect: '/' }),
  (req, res) => {
    // Generate JWT token
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { _id: req.user._id, role: 'student' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    const userData = encodeURIComponent(JSON.stringify({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.emailId,
      role: 'student'
    }));
    res.redirect(`http://localhost:5173/Signin/student?token=${token}&user=${userData}`);
  }
);

// ========== COMPANY LOGIN ==========
app.get('/auth/google/company',
  passport.authenticate('google-company', { scope: ['profile', 'email'] })
);

app.get('/auth/google/company/callback',
  passport.authenticate('google-company', { failureRedirect: '/' }),
  (req, res) => {
    // Generate JWT token
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { _id: req.user._id, role: 'company' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    const userData = encodeURIComponent(JSON.stringify({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.emailId,
      role: 'company'
    }));
    res.redirect(`http://localhost:5173/Signin/company?token=${token}&user=${userData}`);
  }
);

// ========== ADMIN LOGIN ==========
app.get('/auth/google/admin',
  passport.authenticate('google-admin', { scope: ['profile', 'email'] })
);

app.get('/auth/google/admin/callback',
  passport.authenticate('google-admin', { failureRedirect: '/' }),
  (req, res) => {
    // Generate JWT token
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { _id: req.user._id, role: 'admin' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    const userData = encodeURIComponent(JSON.stringify({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.emailId,
      role: 'admin'
    }));
    res.redirect(`http://localhost:5173/Signin/admin?token=${token}&user=${userData}`);
  }
);


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
