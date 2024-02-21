const express = require('express');
const cors = require('cors');
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

app.use(middleware.requestLogger);
app.use(middleware.TokenExtractor);

app.use('/api/students', StudentRoutes);
app.use('/api/instructors', InstructorRoutes);
app.use('/api/courses', CoursesRoutes);
app.use('/services/login', LoginRoutes);
app.use('/resources/files', FileRoutes);

module.exports = app;
