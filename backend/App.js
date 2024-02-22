const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const csurf = require('csurf');
const bodyParser = require('body-parser');
const xss = require('xss-clean');
const helmet = require('helmet');
const session = require('express-session');
const mongoose = require('mongoose');
const FileRoutes = require('./controllers/file_upload.controller');
const StudentRoutes = require('./controllers/students.controller');
const InstructorRoutes = require('./controllers/instructors.controller');
const CoursesRoutes = require('./controllers/courses.controller');
const LoginRoutes = require('./controllers/login.controller');
const middleware = require('./utils/middlewares.utils');
const log = require('./utils/logger.utils');
const config = require('./utils/config.utils');

mongoose.set('strictQuery', false);

log.info(`connecting to ${config.MONGODB_URI}`);
mongoose.connect(config.MONGODB_URI)
  .then(() => {
    log.info('connected to mongodb');
  }).catch((error) => {
    log.error('error connecting to MongoDB:', error.message);
  });

const app = express();

app.use(cors());
app.use(express.json());

// app.use(express.static('build'));

app.use(xss());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'", 'cdnjs.cloudflare.com'],
    styleSrc: ["'self'", 'fonts.googleapis.com'],
    fontSrc: ["'self'", 'fonts.gstatic.com'],
    imgSrc: ["'self'", 'data:'],
    objectSrc: ["'none'"],
    upgradeInsecureRequests: [],
  },
}));

// Session middleware configuration
app.use(session({
  secret: config.SECRET,
  resave: false, // explicitly set resave option to false
  saveUninitialized: true, // explicitly set saveUninitialized option to true or false based on your use case
  cookie: {
    sameSite: 'lax', // or 'strict'
  },
}));

// CSRF middleware configuration
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser());
app.use(csurf({ cookie: true }));
app.use(middleware.limiter);

// CSRF token endpoint
app.get('/services/csrf', function (req, res) {
  res.status(200).json({ csrfToken: req.csrfToken() });
});

app.use(middleware.requestLogger);
app.use(middleware.TokenExtractor);

app.use('/api/students', StudentRoutes);
app.use('/api/instructors', InstructorRoutes);
app.use('/api/courses', CoursesRoutes);
app.use('/services/login', LoginRoutes);
app.use('/resources/files', FileRoutes);

// Custom CSRF error handler
app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    // Handle CSRF token errors here
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }
  next(err);
});

module.exports = app;
