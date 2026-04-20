require('dotenv').config();

const express = require('express');
const app = express();

const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');

const connectDB = require('./config/db');
const { requireAuth } = require('./middleware/auth');

// =======================
// ENV CHECK
// =======================
const isProduction = process.env.NODE_ENV === 'production';
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
// SESSION CONFIG (FIXED)
// =======================
app.use(
  session({
    name: 'portal.sid',
    secret: process.env.SESSION_SECRET || 'mysecret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: 'sessions'
    }),
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: isProduction ? 'none' : 'lax',
      secure: isProduction
    }
  })
);

// =======================
// PASSPORT
// =======================
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user._id));

passport.deserializeUser(async (id, done) => {
  try {
    let user = await require('./models/admin').findById(id);
    if (!user) user = await require('./models/company').findById(id);
    if (!user) user = await require('./models/student').findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

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
// AUTH CHECK
// =======================
app.get('/api/auth/me', requireAuth, (req, res) => {
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.emailId,
    role: req.user.role
  });
});

// =======================
// STUDENT GOOGLE LOGIN
// =======================
app.get(
  '/auth/google/student',
  passport.authenticate('google-student', { scope: ['profile', 'email'] })
);

app.get('/auth/google/student/callback', (req, res, next) => {
  passport.authenticate('google-student', (err, user, info) => {
    if (err) {
      return res.redirect(`${process.env.CLIENT_URL}/Signin/student?error=server_error`);
    }

    if (!user) {
      return res.redirect(
        `${process.env.CLIENT_URL}/Signin/student?error=only_ycce_email_allowed`
      );
    }

    if (!req.session) {
      console.error("Session initialization failed");
      return res.redirect(`${process.env.CLIENT_URL}/Signin/student?error=session_error`);
    }

    req.logIn(user, (err) => {
      if (err) {
        return res.redirect(`${process.env.CLIENT_URL}/Signin/student?error=login_failed`);
      }

      const jwt = require('jsonwebtoken');
      const token = jwt.sign(
        { _id: user._id, role: 'student' },
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
    });
  })(req, res, next);
});

// =======================
// COMPANY GOOGLE LOGIN
// =======================
app.get(
  '/auth/google/company',
  passport.authenticate('google-company', { scope: ['profile', 'email'] })
);

app.get(
  '/auth/google/company/callback',
  passport.authenticate('google-company', { failureRedirect: '/' }),
  (req, res) => {
    const jwt = require('jsonwebtoken');

    const token = jwt.sign(
      { _id: req.user._id, role: 'company' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const userData = encodeURIComponent(
      JSON.stringify({
        _id: req.user._id,
        name: req.user.name,
        email: req.user.emailId,
        role: 'company'
      })
    );

    res.redirect(
      `${process.env.CLIENT_URL}/Signin/company?token=${token}&user=${userData}`
    );
  }
);

// =======================
// ADMIN GOOGLE LOGIN
// =======================
app.get(
  '/auth/google/admin',
  passport.authenticate('google-admin', { scope: ['profile', 'email'] })
);

app.get(
  '/auth/google/admin/callback',
  passport.authenticate('google-admin', { failureRedirect: '/' }),
  (req, res) => {
    const jwt = require('jsonwebtoken');

    const token = jwt.sign(
      { _id: req.user._id, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const userData = encodeURIComponent(
      JSON.stringify({
        _id: req.user._id,
        name: req.user.name,
        email: req.user.emailId,
        role: 'admin'
      })
    );

    res.redirect(
      `${process.env.CLIENT_URL}/Signin/admin?token=${token}&user=${userData}`
    );
  }
);

// =======================
// LOGOUT
// =======================
app.use('/logout', logout);

// =======================
// START SERVER (LOCAL ONLY)
// =======================
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () =>
    console.log(`🚀 Server running on http://localhost:${PORT}`)
  );
}

// =======================
// EXPORT FOR VERCEL
// =======================
module.exports = app;









// require('dotenv').config();

// const express = require('express');
// const app = express();

// const passport = require('passport');
// const session = require('express-session');
// const MongoStore = require('connect-mongo');
// const cors = require('cors');

// const connectDB = require('./config/db');
// const { requireAuth } = require('./middleware/auth');

// // =======================
// // DB CONNECT (SAFE)
// // =======================
// connectDB();

// // =======================
// // MIDDLEWARES
// // =======================
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.use(cors({
//   origin: process.env.CLIENT_URL,
//   credentials: true
// }));

// // =======================
// // SESSION CONFIG
// // =======================
// app.use(session({
//   secret: process.env.SESSION_SECRET || 'mysecret',
//   resave: false,
//   saveUninitialized: false,
//   store: MongoStore.create({
//     mongoUrl: process.env.MONGO_URI,
//     collectionName: 'sessions'
//   }),
//   cookie: {
//     maxAge: 24 * 60 * 60 * 1000,
//     sameSite: 'none',
//     secure: true
//   }
// }));

// // =======================
// // PASSPORT
// // =======================
// app.use(passport.initialize());
// app.use(passport.session());

// passport.serializeUser((user, done) => done(null, user._id));

// passport.deserializeUser(async (id, done) => {
//   try {
//     let user = await require('./models/admin').findById(id);
//     if (!user) user = await require('./models/company').findById(id);
//     if (!user) user = await require('./models/student').findById(id);
//     done(null, user);
//   } catch (err) {
//     done(err, null);
//   }
// });

// // =======================
// // GOOGLE STRATEGIES
// // =======================
// require('./controllers/googleStudent');
// require('./controllers/googleCompany');
// require('./controllers/googleAdmin');

// // =======================
// // ROOT ROUTE (IMPORTANT)
// // =======================
// app.get('/', (req, res) => {
//   res.status(200).json({
//     success: true,
//     message: 'Backend is running successfully on Vercel 🚀'
//   });
// });

// // =======================
// // ROUTES
// // =======================
// const logout = require('./routes/logout');
// const searchStudent = require('./routes/admincontrollerroute/studentsea');
// const searchCompany = require('./routes/companysea');
// const companyVerification = require('./routes/admincontrollerroute/companyverification');
// const adminProfile = require('./routes/admincontrollerroute/adminprofile');
// const companyProfile = require('./routes/companycontrollerroute/companyprofile');
// const jobRoutes = require('./routes/companycontrollerroute/jobroutes');
// const studentProfile = require('./routes/studentroute/studentprofile');
// const studentJobApplication = require('./routes/studentroute/jobapplication');

// app.use('/api/admin/students', searchStudent);
// app.use('/api/admin/companies', searchCompany);
// app.use('/api/admin/companies', companyVerification);
// app.use('/api/admin', adminProfile);

// app.use('/api/company', companyProfile);
// app.use('/api/company', jobRoutes);

// app.use('/api/student', studentProfile);
// app.use('/api/student', studentJobApplication);

// // =======================
// // AUTH CHECK
// // =======================
// app.get('/api/auth/me', requireAuth, (req, res) => {
//   res.json({
//     _id: req.user._id,
//     name: req.user.name,
//     email: req.user.emailId,
//     role: req.user.role
//   });
// });

// // =======================
// // STUDENT LOGIN
// // =======================
// app.get('/auth/google/student',
//   passport.authenticate('google-student', { scope: ['profile', 'email'] })
// );

// app.get('/auth/google/student/callback',
//   passport.authenticate('google-student', { failureRedirect: '/' }),
//   (req, res) => {
//     const jwt = require('jsonwebtoken');

//     const token = jwt.sign(
//       { _id: req.user._id, role: 'student' },
//       process.env.JWT_SECRET,
//       { expiresIn: '24h' }
//     );

//     const userData = encodeURIComponent(JSON.stringify({
//       _id: req.user._id,
//       name: req.user.name,
//       email: req.user.emailId,
//       role: 'student'
//     }));

//     res.redirect(`${process.env.CLIENT_URL}/Signin/student?token=${token}&user=${userData}`);
//   }
// );

// // =======================
// // COMPANY LOGIN
// // =======================
// app.get('/auth/google/company',
//   passport.authenticate('google-company', { scope: ['profile', 'email'] })
// );

// app.get('/auth/google/company/callback',
//   passport.authenticate('google-company', { failureRedirect: '/' }),
//   (req, res) => {
//     const jwt = require('jsonwebtoken');

//     const token = jwt.sign(
//       { _id: req.user._id, role: 'company' },
//       process.env.JWT_SECRET,
//       { expiresIn: '24h' }
//     );

//     const userData = encodeURIComponent(JSON.stringify({
//       _id: req.user._id,
//       name: req.user.name,
//       email: req.user.emailId,
//       role: 'company'
//     }));

//     res.redirect(`${process.env.CLIENT_URL}/Signin/company?token=${token}&user=${userData}`);
//   }
// );

// // =======================
// // ADMIN LOGIN
// // =======================
// app.get('/auth/google/admin',
//   passport.authenticate('google-admin', { scope: ['profile', 'email'] })
// );

// app.get('/auth/google/admin/callback',
//   passport.authenticate('google-admin', { failureRedirect: '/' }),
//   (req, res) => {
//     const jwt = require('jsonwebtoken');

//     const token = jwt.sign(
//       { _id: req.user._id, role: 'admin' },
//       process.env.JWT_SECRET,
//       { expiresIn: '24h' }
//     );

//     const userData = encodeURIComponent(JSON.stringify({
//       _id: req.user._id,
//       name: req.user.name,
//       email: req.user.emailId,
//       role: 'admin'
//     }));

//     res.redirect(`${process.env.CLIENT_URL}/Signin/admin?token=${token}&user=${userData}`);
//   }
// );

// // =======================
// // LOGOUT
// // =======================
// app.use('/logout', logout);

// // =======================
// // EXPORT (NO LISTEN ❗)
// // =======================
// module.exports = app;
