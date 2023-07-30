const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const FileRoutes = require('./controllers/file_upload');
const StudentRoutes = require('./controllers/students');
const InstructorRoutes = require('./controllers/instructors');
const CoursesRoutes = require('./controllers/courses');
const LoginRoutes = require('./controllers/login');
const log = require('./utils/logger');
const config = require('./utils/config');

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

app.use('/api/students', StudentRoutes);
app.use('/api/instructors', InstructorRoutes);
app.use('/api/courses', CoursesRoutes);
app.use('/services/login', LoginRoutes);
app.use('/resources/files', FileRoutes);

module.exports = app;
